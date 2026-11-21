"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import type { SizeGuide } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";
import { addToCartAction } from "@/app/actions/cart";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/lib/cart-events";
import { SizeGuideModal } from "./SizeGuideModal";
import { SizeSelector } from "./SizeSelector";
import { StickyAddToCartBar } from "./StickyAddToCartBar";
import { ageKey } from "@/lib/size-advice";
import type { SizeGuideRow } from "@/lib/content/types";

interface ProductBuySectionProps {
  product: Product;
  sizeGuide?: SizeGuide | null;
  whatsappUrl?: string | null;
  productUrl: string;
}

/** Interactive part of the product column: size choice, add to cart, size guide and mobile bar. */
export function ProductBuySection({ product, sizeGuide, whatsappUrl, productUrl }: ProductBuySectionProps) {
  // No size is chosen for the customer: a wrong size ordered in a hurry ends in an exchange.
  // An outfit sold in one size only has nothing to choose.
  const onlyVariant = product.variants.length === 1 ? product.variants[0] : undefined;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(onlyVariant?.id ?? null);
  const sizesRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const variantForRow = (row: SizeGuideRow) => product.variants.find((v) => ageKey(v.title) === ageKey(row.age));
  // The fixed bar only shows once the main button is off screen: never two buttons at once.
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const [isMainButtonVisible, setIsMainButtonVisible] = useState(true);
  useEffect(() => {
    const button = mainButtonRef.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsMainButtonVisible(entry.isIntersecting));
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isSoldOut = selectedVariant ? !selectedVariant.inStock : false;
  // Each age can have its own price in Medusa: show the selected one (the lowest before a choice).
  const price = selectedVariant?.price ?? product.price;
  const ctaLabel = selectedVariantId
    ? messages.product.addToCartWithPrice(formatPrice(price))
    : messages.product.chooseSizeCta;

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      // « Choisir une taille » brings the sizes back on screen and puts the keyboard on them.
      sizesRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      sizesRef.current?.querySelector<HTMLElement>('[role="radio"]:not([aria-disabled="true"])')?.focus({ preventScroll: true });
      return triggerToast(messages.product.selectSizeFirst);
    }
    if (isSoldOut) return triggerToast(messages.product.sizeSoldOutToast);

    setIsAdding(true);
    const res = await addToCartAction(selectedVariantId, 1);
    setIsAdding(false);

    if (res.success && res.cart) {
      trackEvent(ANALYTICS_EVENTS.addToCart, { produit: product.handle });
      triggerCartUpdated(res.cart);
      setIsAddedSuccess(true);
      triggerToast(messages.product.addedFeedback(product.title, selectedVariant?.title || ""));
      triggerOpenCart();
      setTimeout(() => setIsAddedSuccess(false), 2500);
    } else if (res.error) {
      triggerToast(res.error);
    }
  };

  return (
    <>
      <div className="flex items-baseline gap-3 mb-3 md:mb-4">
        <p className="text-2xl font-semibold text-brand-text tracking-tight" aria-live="polite">{formatPrice(price)}</p>
      </div>
      <div className="w-full h-px bg-brand-surface mb-3 md:mb-5" />
      <div ref={sizesRef}>
      <SizeSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariantId}
        onOpenSizeGuide={() => {
          trackEvent(ANALYTICS_EVENTS.sizeGuideOpen, { produit: product.handle });
          setIsSizeModalOpen(true);
        }}
        whatsappUrl={whatsappUrl}
        productTitle={product.title}
        productUrl={productUrl}
      />
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <button
          ref={mainButtonRef}
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isSoldOut}
          className={`min-h-11 min-w-11 w-full py-3.5 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 ${
            isAddedSuccess ? "bg-brand-text text-brand-white" : "bg-brand-primary hover:bg-brand-text text-brand-white"
          }`}
        >
          {isAdding ? (
            <span className="w-4 h-4 border-2 border-brand-white border-t-transparent rounded-full animate-spin" />
          ) : isAddedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{messages.product.addedCta}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{ctaLabel}</span>
            </>
          )}
        </button>
      </div>

      <SizeGuideModal
        onChooseSize={(row) => {
          const variant = variantForRow(row);
          if (variant) setSelectedVariantId(variant.id);
          setIsSizeModalOpen(false);
        }}
        isSizeAvailable={(row) => Boolean(variantForRow(row)?.inStock)}
        modelReference={product.wornCaptions?.find((c) => Boolean(c)) ?? null}
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        sizeGuide={sizeGuide}
        activeSizeTitle={selectedVariant?.title}
        productTitle={product.title}
        whatsappUrl={whatsappUrl}
        productUrl={productUrl}
      />

      <StickyAddToCartBar
        visible={!isMainButtonVisible}
        label={ctaLabel}
        isAddedSuccess={isAddedSuccess}
        disabled={isAdding || isSoldOut}
        onAdd={handleAddToCart}
      />
    </>
  );
}
