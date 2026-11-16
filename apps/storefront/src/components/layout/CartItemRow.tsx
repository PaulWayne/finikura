import { Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/commerce/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/format";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

interface CartItemRowProps {
  item: CartItem;
  isLoading: boolean;
  /** Refusal from the shop for this line, for example not enough stock. */
  error?: string | null;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

/** One line of the cart drawer, with the quantity picker and the remove button. */
export function CartItemRow({ item, isLoading, error, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex space-x-3.5 sm:space-x-4 pb-4 border-b border-brand-surface last:border-b-0">
      {/* Photo on plain beige background */}
      <div className="w-20 sm:w-24 h-[100px] sm:h-[120px] bg-brand-surface rounded-md overflow-hidden shrink-0 relative">
        <SafeImage
          src={item.thumbnail || IMAGE_FALLBACKS.product}
          alt={item.productTitle}
          fallbackSrc={IMAGE_FALLBACKS.product}
          sizes="96px"
          className="object-cover object-top"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-medium block text-brand-text">
                {messages.cart.categoryLabel(item.categoryHandle === "filles")}
              </span>
              <h4 className="font-serif text-base text-brand-text leading-snug mt-0.5 line-clamp-2">
                {item.productTitle}
              </h4>
            </div>
            <button
              type="button"
              aria-label={messages.cart.removeAria}
              title={messages.cart.removeAria}
              onClick={() => onRemove(item.id)}
              disabled={isLoading}
              className="touch-area text-brand-text p-1 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-brand-text">{messages.cart.sizeSelected}</span>
            <span className="text-xs font-semibold text-brand-text bg-brand-surface px-2.5 py-0.5 rounded-md">
              {item.variantTitle}
            </span>
          </div>
        </div>

        {/* Quantity and price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-brand-primary/40 rounded-lg bg-brand-white/70">
            <button
              type="button"
              aria-label={messages.cart.decreaseAria}
              disabled={item.quantity <= 1 || isLoading}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center text-base text-brand-text font-medium cursor-pointer disabled:opacity-50"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm font-semibold text-brand-text" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={messages.cart.increaseAria}
              disabled={isLoading}
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center text-base text-brand-text font-medium cursor-pointer disabled:opacity-50"
            >
              +
            </button>
          </div>
          <span className="text-base font-medium text-brand-text whitespace-nowrap">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs font-medium text-brand-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
