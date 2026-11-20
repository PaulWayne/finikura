import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";

/** Totals and the two exits of the cart drawer. */
export function CartDrawerFooter({ cart, onClose }: { cart: Cart; onClose: () => void }) {
  return (
    <div className="p-5 sm:p-6 bg-brand-bg border-t border-brand-surface space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-serif text-base sm:text-lg font-semibold text-brand-text">
            {messages.cart.totalEstimated}
          </span>
          <span className="font-serif text-lg sm:text-xl font-bold text-brand-text">{formatPrice(cart.total)}</span>
        </div>
      </div>

      <Link
        href="/commande"
        onClick={onClose}
        className="w-full h-12 bg-brand-primary hover:bg-brand-text active:scale-[0.99] text-brand-white rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>{messages.cart.checkoutButton}</span>
        <ArrowRight className="w-4 h-4 text-brand-white" />
      </Link>

      <div className="text-center pt-0.5">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 inline-flex items-center text-xs text-brand-text underline underline-offset-4 tracking-wide font-normal cursor-pointer"
        >
          {messages.cart.continueShopping}
        </button>
      </div>
    </div>
  );
}

/** Empty cart message with a way back to the shop. */
export function CartDrawerEmpty({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-14 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-brand-text mb-4">
        <ShoppingBag className="w-8 h-8 stroke-[1.3]" />
      </div>
      <h3 className="font-serif text-lg text-brand-text font-semibold tracking-tight mb-1">
        {messages.cart.emptyTitle}
      </h3>
      <p className="text-xs text-brand-text max-w-xs mb-6 font-light">
        {messages.cart.emptyDescription}
      </p>
      <Link
        href="/"
        onClick={onClose}
        className="min-h-11 min-w-11 inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em] hover:bg-brand-text transition shadow-xs cursor-pointer"
      >
        {messages.cart.startShopping}
      </Link>
    </div>
  );
}
