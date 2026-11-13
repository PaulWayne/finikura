"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import type { SizeGuide } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";
import { addToCartAction } from "@/app/actions/cart";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/lib/cart-events";
import { SizeGuideModal } from "./SizeGuideModal";
import { SizeSelector } from "./SizeSelector";
import { StickyAddToCartBar } from "./StickyAddToCartBar";

interface ProductBuySectionProps {
  product: Product;
  sizeGuide?: SizeGuide | null;
  whatsappUrl?: string | null;
  productUrl: string;
}

/** Interactive part of the product column: size choice, add to cart, size guide and mobile bar. */
export function ProductBuySection({ product, sizeGuide, whatsappUrl, productUrl }: ProductBuySectionProps) {
  const initialVariant = product.variants.find((v) => v.inStock) || product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialVariant?.id ?? null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isSoldOut = selectedVariant ? !selectedVariant.inStock : false;
  const ctaLabel = selectedVariantId
    ? messages.product.addToCartWithPrice(formatPrice(product.price))
    : messages.product.chooseSizeCta;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return triggerToast(messages.product.selectSizeFirst);
    if (isSoldOut) return triggerToast(messages.product.sizeSoldOutToast);

    setIsAdding(true);
    const res = await addToCartAction(selectedVariantId, 1);
    setIsAdding(false);

    if (res.success && res.cart) {
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
      <SizeSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariantId}
        onOpenSizeGuide={() => setIsSizeModalOpen(true)}
        whatsappUrl={whatsappUrl}
        productTitle={product.title}
        productUrl={productUrl}
      />

      <div className="mb-6 flex flex-col gap-2">
        <button
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
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        sizeGuide={sizeGuide}
        activeSizeTitle={selectedVariant?.title}
        productTitle={product.title}
        whatsappUrl={whatsappUrl}
        productUrl={productUrl}
      />

      <StickyAddToCartBar
        label={ctaLabel}
        isAddedSuccess={isAddedSuccess}
        disabled={isAdding || isSoldOut}
        onAdd={handleAddToCart}
      />
    </>
  );
}
