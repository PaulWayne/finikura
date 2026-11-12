import type { CartItem } from "@/lib/commerce/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/format";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

/** One cart line in the checkout summary: compact in the mobile accordion, larger in the desktop card. */
export function OrderSummaryItem({ item, variant }: { item: CartItem; variant: "compact" | "card" }) {
  const lineTotal = formatPrice(item.price * item.quantity);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-white shadow-xs">
        <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-brand-surface">
          <SafeImage
            src={item.thumbnail || IMAGE_FALLBACKS.product}
            alt={item.productTitle}
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-brand-text truncate">{item.productTitle}</p>
          <p className="text-[11px] text-brand-text">
            {messages.checkout.itemSizeQuantity(item.variantTitle, item.quantity)}
          </p>
          <span className="text-xs font-semibold text-brand-text mt-0.5">{lineTotal}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3.5 bg-brand-white p-3 rounded-lg shadow-xs">
      <div className="relative w-16 h-16 rounded bg-brand-surface overflow-hidden shrink-0">
        <SafeImage
          src={item.thumbnail || IMAGE_FALLBACKS.product}
          alt={item.productTitle}
          fallbackSrc={IMAGE_FALLBACKS.product}
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-brand-text truncate">{item.productTitle}</h3>
        <p className="text-xs text-brand-text mt-0.5">
          {messages.checkout.itemSizeLabel} <span className="font-medium text-brand-text">{item.variantTitle}</span>
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-brand-text">{messages.checkout.itemQuantity(item.quantity)}</span>
          <span className="text-xs font-semibold text-brand-text">{lineTotal}</span>
        </div>
      </div>
    </div>
  );
}
