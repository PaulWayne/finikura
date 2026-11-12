"use client";
import React, { useEffect, useState } from "react";
import {
  CART_EVENTS,
  triggerCloseCart,
  triggerCartUpdated,
} from "@/src/lib/cart-events";
import { formatPrice } from "@/src/lib/format";
import { messages } from "@/src/messages/fr";
import { Cart } from "@/src/lib/commerce/types";
import {
  getCartAction,
  updateQuantityAction,
  removeItemAction,
} from "@/app/actions/cart";
import {
  X,
  Trash2,
  Bike,
  CreditCard,
  ArrowRight,
  Check,
  ShoppingBag,
} from "lucide-react";
import { IMAGE_FALLBACKS, handleImgError } from "@/src/lib/images";

interface CartDrawerProps {
  initialCart?: Cart;
}

export function CartDrawer({ initialCart }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>(
    initialCart || {
      id: "cart_init",
      items: [
        {
          id: "item_init_1",
          productId: "prod_filles_01",
          productHandle: "robe-terracotta-brodee",
          productTitle: "Robe Terracotta Brodée",
          variantId: "var_f01_56",
          variantTitle: "6 ans",
          price: 12500,
          quantity: 1,
          thumbnail:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDJh73UnFB4eBhcIx_CWz1k4i7DFcwld9egJrXnH9b8jqNS0u5o-KzoEwaVZIXflWIAk5cg41FSnnO6OFqiMXKRqQyTOlb2hKSyKlhIDSBWgEkK5qqKLOo_FIuPbCt7mE0UgyG66Q_hZTq-_Wor1i-NY6bZyQxxZisarmbU-wbOUElAkRSCEsh5SCHJEDrDU17E5JjV7_MwqL7xVmCKtd-Hiv3mYEGdSEJSwW7nwXY",
          categoryHandle: "filles",
        },
        {
          id: "item_init_2",
          productId: "prod_garcons_02",
          productHandle: "chemise-mandarin-sauge",
          productTitle: "Chemise Mandarin Sauge",
          variantId: "var_g02_78",
          variantTitle: "8 ans",
          price: 8500,
          quantity: 1,
          thumbnail:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAps3y2vE6ZTVxZPacbzqYSs5xonv4Rw-tsV-zQ6FbgXNfXI38WPIFE0eDZVWHcUsMDAMNCscNsKOLI3hJ60ZJ_JXEZgmKnFSFfs961GRt_f18tdMyfqEW7Hlfy7sYS-TZASAbg7izu-8u_oKAuY1vxVgQB_ZOY5-94tUcKmO-UNiJqjPAn_PGQeydX5DcIfkzep9hXjo29LALR7xfpH717r4b3VGtlJh0D9vXntqY",
          categoryHandle: "garcons",
        },
      ],
      subtotal: 21000,
      total: 21000,
      currency: "XOF",
    }
  );

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch from server
    getCartAction().then((c) => {
      if (c && c.items.length > 0) {
        setCart(c);
      }
    });

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
        className={`fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
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
        className={`fixed z-50 bg-[#FDF7F2] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-[#EADCCC] 
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
          <div className="w-10 h-1 rounded-full bg-[#EADCCC]" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EADCCC] flex items-center justify-between bg-[#FDF7F2]">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#9EA593]" />
            <h2 className="font-serif text-xl font-semibold text-[#5E5245] tracking-tight">
              {messages.cart.title}
            </h2>
            <span className="text-xs bg-[#EADCCC] text-[#5E5245] font-medium px-2.5 py-0.5 rounded-full">
              {messages.cart.articlesCount(totalItemCount)}
            </span>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Fermer le panier"
            className="p-1.5 sm:p-2 text-[#5E5245] hover:text-[#CA7154] rounded-lg hover:bg-[#EADCCC]/40 transition min-touch-btn flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Reassurance banner: Added product confirmation */}
        <div className="bg-[#EADCCC]/60 px-5 sm:px-6 py-3 border-b border-[#EADCCC]/70 flex items-center space-x-3">
          <div className="w-5 h-5 rounded-full bg-[#9EA593] text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
          <p className="text-xs text-[#5E5245] leading-relaxed">
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
            <div className="py-14 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#EADCCC] flex items-center justify-center text-[#5E5245] mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.3]" />
              </div>
              <h3 className="font-serif text-lg text-[#5E5245] font-semibold tracking-tight mb-1">
                {messages.cart.emptyTitle}
              </h3>
              <p className="text-xs text-[#5E5245]/70 max-w-xs mb-6 font-light">
                {messages.cart.emptyDescription}
              </p>
              <button
                type="button"
                onClick={close}
                className="min-touch-btn inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] bg-[#8A7058] text-white text-xs font-medium uppercase tracking-[0.15em] hover:bg-[#725a43] transition shadow-xs cursor-pointer"
              >
                {messages.cart.startShopping}
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const isGirls = item.categoryHandle === "filles";
              return (
                <div
                  key={item.id}
                  className="bg-[#EADCCC]/30 rounded-2xl p-3.5 sm:p-4 border border-[#EADCCC] flex space-x-3.5 sm:space-x-4 transition hover:bg-[#EADCCC]/40"
                >
                  {/* Photo on plain beige background */}
                  <div className="w-20 sm:w-24 h-24 sm:h-28 bg-[#EADCCC] rounded-xl overflow-hidden shrink-0 relative border border-[#EADCCC]">
                    <img
                      src={item.thumbnail}
                      alt={item.productTitle}
                      onError={handleImgError(IMAGE_FALLBACKS.product)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-medium block ${
                              isGirls ? "text-[#CA7154]" : "text-[#9EA593]"
                            }`}
                          >
                            {isGirls ? "FILLES 3-14 ANS" : "GARÇONS 3-14 ANS"}
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-semibold text-[#5E5245] leading-snug mt-0.5 truncate">
                            {item.productTitle}
                          </h4>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          aria-label={messages.cart.removeAria}
                          onClick={() => handleRemove(item.id)}
                          disabled={loadingItemId === item.id}
                          className="text-[#5E5245]/60 hover:text-[#CA7154] p-1 transition-colors cursor-pointer shrink-0"
                          title="Retirer l'article"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>

                      {/* Size indication */}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-[#5E5245]">
                          {messages.cart.sizeSelected}
                        </span>
                        <span className="text-xs font-semibold text-[#5E5245] bg-[#EADCCC] px-2.5 py-0.5 rounded-md">
                          {item.variantTitle}
                        </span>
                      </div>
                    </div>

                    {/* Bottom row: Quantity and Price */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#EADCCC]">
                      {/* Quantity picker */}
                      <div className="flex items-center border border-[#8A7058]/40 rounded-lg bg-white/70 px-2 py-0.5 sm:py-1 space-x-2.5 sm:space-x-3">
                        <button
                          type="button"
                          disabled={item.quantity <= 1 || loadingItemId === item.id}
                          onClick={() =>
                            handleUpdateQty(item.id, item.quantity - 1)
                          }
                          className="text-xs text-[#5E5245] hover:opacity-60 font-medium px-1 cursor-pointer disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-[#5E5245]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={loadingItemId === item.id}
                          onClick={() =>
                            handleUpdateQty(item.id, item.quantity + 1)
                          }
                          className="text-xs text-[#5E5245] hover:opacity-60 font-medium px-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Price */}
                      <span className="font-serif text-sm sm:text-base font-semibold text-[#5E5245]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Atelier & Delivery reassuring notes (when cart has items) */}
          {cart.items.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-[#5E5245] bg-[#EADCCC]/40 p-3 rounded-xl border border-[#EADCCC]">
                <Bike className="w-4 h-4 text-[#9EA593] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">
                    {messages.cart.deliveryAssurance}
                  </span>
                  <p className="text-[11px] text-[#5E5245]/80 mt-0.5 font-light">
                    {messages.cart.deliveryAssuranceSub}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#5E5245] px-1">
                <CreditCard className="w-4 h-4 text-[#5E5245] shrink-0" />
                <span className="font-light">
                  {messages.cart.paymentAssurance}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Financial breakdown & Actions */}
        {cart.items.length > 0 && (
          <div className="p-5 sm:p-6 bg-[#FDF7F2] border-t border-[#EADCCC] space-y-4">
            {/* Subtotal and Total in exact FCFA */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-[#5E5245]">
                <span>{messages.cart.subtotal}</span>
                <span className="font-medium">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-[#5E5245]">
                <span>{messages.cart.deliveryLabel}</span>
                <span className="text-[#CA7154] font-medium">
                  {messages.cart.deliveryStatus}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-[#EADCCC]">
                <span className="font-serif text-base sm:text-lg font-semibold text-[#5E5245]">
                  {messages.cart.totalEstimated}
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-[#5E5245]">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            {/* Solid Taupe Button: Commander (height 48px, min 44px) */}
            <a
              href="/commande"
              onClick={close}
              className="w-full h-12 bg-[#8A7058] hover:bg-[#78614b] active:scale-[0.99] text-white rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{messages.cart.checkoutButton}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>

            {/* Text Link: Continuer mes achats */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={close}
                className="text-xs text-[#5E5245] hover:text-[#CA7154] transition-colors underline underline-offset-4 tracking-wide font-normal cursor-pointer"
              >
                {messages.cart.continueShopping}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
