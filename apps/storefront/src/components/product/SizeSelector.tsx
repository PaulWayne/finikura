import { CheckCircle2, Flame, Ruler } from "lucide-react";
import type { ProductVariant } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onSelect: (variantId: string) => void;
  onOpenSizeGuide: () => void;
  whatsappUrl?: string | null;
  productTitle: string;
  productUrl: string;
}

/** Age/size buttons, the size guide link and the stock hint. */
export function SizeSelector({ variants, selectedVariant, onSelect, onOpenSizeGuide, whatsappUrl, productTitle, productUrl }: SizeSelectorProps) {
  // Shown only when a shop number is set in Strapi (FK-32).
  const questionLink = whatsappLink(
    whatsappUrl,
    messages.whatsapp.sizeQuestion(productTitle, selectedVariant?.title ?? null, productUrl)
  );

  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs text-brand-text font-medium">
          {messages.product.childSize} :{" "}
          <span className="font-semibold text-brand-text">
            {selectedVariant ? selectedVariant.title : `(${messages.product.chooseSizePrompt})`}
          </span>
        </label>
        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="inline-flex min-h-11 items-center gap-1.5 text-xs text-brand-text hover:underline underline-offset-4 transition-colors cursor-pointer group"
        >
          <Ruler className="w-4 h-4 text-brand-primary transition-transform group-hover:rotate-12" />
          <span className="underline underline-offset-4 decoration-brand-surface">{messages.product.sizeGuideBtn}</span>
        </button>
      </div>

      <div aria-label={messages.product.sizeGroupAria} className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="radiogroup">
        {variants.map((v) =>
          v.inStock ? (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selectedVariant?.id === v.id}
              onClick={() => onSelect(v.id)}
              className={`relative h-11 rounded-lg flex items-center justify-center uppercase text-xs font-medium tracking-wider transition-all border cursor-pointer active:scale-95 ${
                selectedVariant?.id === v.id
                  ? "bg-brand-primary text-brand-white border-brand-primary shadow-sm"
                  : "bg-brand-bg text-brand-text border-brand-surface hover:bg-brand-surface/40"
              }`}
            >
              {v.title}
            </button>
          ) : (
            <button
              key={v.id}
              type="button"
              disabled
              role="radio"
              aria-checked="false"
              title={messages.product.sizeSoldOutTitle(v.title)}
              className="relative h-11 rounded-lg flex flex-col items-center justify-center uppercase text-[11px] font-medium tracking-wider bg-brand-surface/40 text-brand-text cursor-not-allowed border border-brand-surface select-none overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                <span className="w-[140%] h-[1px] bg-brand-primary/50 rotate-[-30deg]" />
              </span>
              <span className="line-through">{v.title}</span>
              <span className="text-[9px] uppercase font-semibold tracking-wider text-brand-text leading-none mt-0.5">
                {messages.product.soldOut}
              </span>
            </button>
          )
        )}
      </div>

      <div className="mt-2.5">
        {selectedVariant && selectedVariant.inStock && selectedVariant.inventoryQuantity <= 2 ? (
          <p className="text-xs text-brand-text font-medium flex items-center gap-1.5 animate-pulse">
            <Flame className="w-4 h-4 text-brand-text" />
            <span>{messages.product.lowStockFeedback(selectedVariant.inventoryQuantity, selectedVariant.title)}</span>
          </p>
        ) : (
          <p className="text-xs text-brand-text flex items-center gap-1.5 font-light">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
            <span>{messages.product.sizeAdviceNote}</span>
          </p>
        )}
      </div>

      {questionLink && (
        <a
          href={questionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 self-start text-xs text-brand-text underline underline-offset-4 decoration-brand-surface hover:decoration-brand-text transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4 text-brand-primary" />
          <span>{messages.product.sizeQuestionCta}</span>
        </a>
      )}
    </div>
  );
}
