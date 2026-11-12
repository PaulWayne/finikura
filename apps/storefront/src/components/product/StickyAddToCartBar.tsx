import { ShoppingBag } from "lucide-react";
import { messages } from "@/messages/fr";

interface StickyAddToCartBarProps {
  label: string;
  isAddedSuccess: boolean;
  disabled: boolean;
  onAdd: () => void;
}

/** Add-to-cart bar fixed at the bottom of the screen on mobile (< 768px). */
export function StickyAddToCartBar({ label, isAddedSuccess, disabled, onAdd }: StickyAddToCartBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md px-4 pt-3 pb-safe border-t border-brand-surface shadow-[0_-4px_20px_rgba(94,82,69,0.08)]">
      <div className="max-w-[420px] mx-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className={`min-h-11 min-w-11 w-full py-3 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
            isAddedSuccess ? "bg-brand-text text-brand-white" : "bg-brand-primary text-brand-white hover:bg-brand-text"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{label}</span>
        </button>
        <div className="grid grid-cols-2 gap-1 pt-1 pb-1 text-center text-brand-text">
          <span className="text-[10px] leading-tight">{messages.product.miniBadgePayment}</span>
          <span className="text-[10px] leading-tight">{messages.product.miniBadgeDelivery}</span>
        </div>
      </div>
    </div>
  );
}
