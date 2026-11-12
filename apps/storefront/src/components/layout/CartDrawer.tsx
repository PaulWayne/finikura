"use client";
import { useEffect, useState } from "react";
import {
  CART_EVENTS,
  triggerCloseCart,
  triggerCartUpdated,
} from "@/lib/cart-events";
import { messages } from "@/messages/fr";
import { Cart } from "@/lib/commerce/types";
import {
  updateQuantityAction,
  removeItemAction,
} from "@/app/actions/cart";
import { X, Bike, CreditCard, Check } from "lucide-react";
import { CartItemRow } from "./CartItemRow";
import { CartDrawerEmpty, CartDrawerFooter } from "./CartDrawerFooter";

interface CartDrawerProps {
  initialCart: Cart;
}

export function CartDrawer({ initialCart }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>(initialCart);

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }
    function handleClose() {
      setIsOpen(false);
      document.body.style.overflow = "";
    }
    function handleCartUpdate(e: Event) {
      const customEvent = e as CustomEvent<Cart>;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      }
    }

    window.addEventListener(CART_EVENTS.OPEN_CART, handleOpen);
    window.addEventListener(CART_EVENTS.CLOSE_CART, handleClose);
    window.addEventListener(CART_EVENTS.CART_UPDATED, handleCartUpdate);

    return () => {
      window.removeEventListener(CART_EVENTS.OPEN_CART, handleOpen);
      window.removeEventListener(CART_EVENTS.CLOSE_CART, handleClose);
      window.removeEventListener(CART_EVENTS.CART_UPDATED, handleCartUpdate);
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    triggerCloseCart();
  };

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    setLoadingItemId(itemId);
    const res = await updateQuantityAction(itemId, newQty);
    setLoadingItemId(null);
    if (res.success && res.cart) {
      setCart(res.cart);
      triggerCartUpdated(res.cart);
    }
  };

  const handleRemove = async (itemId: string) => {
    setLoadingItemId(itemId);
    const res = await removeItemAction(itemId);
    setLoadingItemId(null);
    if (res.success && res.cart) {
      setCart(res.cart);
      triggerCartUpdated(res.cart);
    }
  };

  const totalItemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-brand-text/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Cart Drawer Panel:
          - Desktop (>= 768px): right sliding panel (approx 420px wide)
          - Mobile (< 768px): bottom sheet rounded-t-3xl sliding up (max 92vh)
      */}
      <aside
        id="cart-drawer"
        aria-label={messages.cart.title}
        className={`fixed z-50 bg-brand-bg shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-brand-surface 
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 max-h-[92vh] rounded-t-3xl border-t md:rounded-t-none md:border-t-0
          /* Desktop: right slide-over */
          md:top-0 md:bottom-0 md:right-0 md:left-auto md:w-[420px] md:max-h-full md:border-l
          ${
            isOpen
              ? "translate-y-0 md:translate-x-0"
              : "translate-y-full md:translate-y-0 md:translate-x-full"
          }
        `}
      >
        {/* Mobile drag handle indicator */}
        <div className="flex md:hidden justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-brand-surface" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-brand-surface flex items-center justify-between bg-brand-bg">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-brand-announcement" />
            <h2 className="font-serif text-xl font-semibold text-brand-text tracking-tight">
              {messages.cart.title}
            </h2>
            <span className="text-xs bg-brand-surface text-brand-text font-medium px-2.5 py-0.5 rounded-full">
              {messages.cart.articlesCount(totalItemCount)}
            </span>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={messages.cart.closeAria}
            className="p-1.5 sm:p-2 text-brand-text hover:underline underline-offset-4 rounded-lg hover:bg-brand-surface/40 transition min-h-11 min-w-11 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Reassurance banner: Added product confirmation */}
        <div className="bg-brand-surface/60 px-5 sm:px-6 py-3 border-b border-brand-surface/70 flex items-center space-x-3">
          <div className="w-5 h-5 rounded-full bg-brand-text text-brand-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
          <p className="text-xs text-brand-text leading-relaxed">
            <span className="hidden sm:inline">
              {messages.cart.addedNotification}
            </span>
            <span className="inline sm:hidden">
              {messages.cart.addedNotificationMobile}
            </span>
          </p>
        </div>

        {/* Drawer Content / Items list */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 space-y-4">
          {cart.items.length === 0 ? (
            <CartDrawerEmpty onClose={close} />
          ) : (
            cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                isLoading={loadingItemId === item.id}
                onQuantityChange={handleUpdateQty}
                onRemove={handleRemove}
              />
            ))
          )}

          {/* Delivery reassuring notes (when cart has items) */}
          {cart.items.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-brand-text bg-brand-surface/40 p-3 rounded-xl border border-brand-surface">
                <Bike className="w-4 h-4 text-brand-announcement shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">
                    {messages.cart.deliveryAssurance}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-brand-text px-1">
                <CreditCard className="w-4 h-4 text-brand-text shrink-0" />
                <span className="font-light">
                  {messages.cart.paymentAssurance}
                </span>
              </div>
            </div>
          )}
        </div>

        {cart.items.length > 0 && <CartDrawerFooter cart={cart} onClose={close} />}
      </aside>
    </>
  );
}
