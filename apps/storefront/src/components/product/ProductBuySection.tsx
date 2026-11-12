"use client";
import React, { useState } from "react";
import { Product, ProductVariant } from "@/lib/commerce/types";
import { SizeGuide } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";
import { addToCartAction } from "@/app/actions/cart";
import {
  triggerCartUpdated,
  triggerOpenCart,
  triggerToast,
} from "@/lib/cart-events";
import { SizeGuideModal } from "./SizeGuideModal";
import {
  Ruler,
  ShoppingBag,
  CheckCircle2,
  Flame,
  CreditCard,
  Bike,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface ProductBuySectionProps {
  product: Product;
  sizeGuide?: SizeGuide | null;
  whatsappUrl?: string | null;
}

export function ProductBuySection({
  product,
  sizeGuide,
  whatsappUrl,
}: ProductBuySectionProps) {
  // Find initial in-stock variant
  const initialVariant =
    product.variants.find((v) => v.inStock) || product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    initialVariant ? initialVariant.id : null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const selectedVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  const isSoldOut = selectedVariant ? !selectedVariant.inStock : false;

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      triggerToast("Veuillez sélectionner une taille d'abord.");
      return;
    }

    if (isSoldOut) {
      triggerToast("Cette taille est actuellement épuisée.");
      return;
    }

    setIsAdding(true);
    const res = await addToCartAction(selectedVariantId, 1);
    setIsAdding(false);

    if (res.success && res.cart) {
      triggerCartUpdated(res.cart);
      setIsAddedSuccess(true);
      triggerToast(
        messages.product.addedFeedback(
          product.title,
          selectedVariant?.title || ""
        )
      );
      triggerOpenCart();

      setTimeout(() => {
        setIsAddedSuccess(false);
      }, 2500);
    } else if (res.error) {
      triggerToast(res.error);
    }
  };

  return (
    <>
      <section
        aria-label={`Acheter ${product.title}`}
        className="flex flex-col pt-1 w-full"
      >
        {/* Eyebrow & Title */}
        <span className="text-xs uppercase tracking-[0.2em] text-brand-text font-medium mb-1.5 block">
          {product.categoryHandle === "filles"
            ? "Collection Filles · Bamako"
            : "Collection Garçons · Bamako"}
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-tight uppercase tracking-[0.08em] text-brand-text mb-2">
          {product.title}
        </h1>

        {/* Price exact in FCFA */}
        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-2xl font-semibold text-brand-text tracking-tight">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Thin cream separator */}
        <div className="w-full h-px bg-brand-surface mb-5" />

        {/* Size Selection Block */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-brand-text font-medium">
              {messages.product.childSize} :{" "}
              <span className="font-semibold text-brand-text">
                {selectedVariant
                  ? selectedVariant.title
                  : `(${messages.product.chooseSizePrompt})`}
              </span>
            </label>

            {/* Size Guide Trigger */}
            <button
              type="button"
              onClick={() => setIsSizeModalOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 text-xs text-brand-text hover:underline underline-offset-4 transition-colors cursor-pointer group"
            >
              <Ruler className="w-4 h-4 text-brand-primary transition-transform group-hover:rotate-12" />
              <span className="underline underline-offset-4 decoration-brand-surface">
                {messages.product.sizeGuideBtn}
              </span>
            </button>
          </div>

          {/* Size Buttons Grid */}
          <div
            aria-label="Sélection de la taille"
            className="grid grid-cols-3 sm:grid-cols-6 gap-2"
            role="radiogroup"
          >
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              const isAvailable = v.inStock;

              if (!isAvailable) {
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled
                    role="radio"
                    aria-checked="false"
                    title={`Taille ${v.title} actuellement épuisée`}
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
                );
              }

              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`relative h-11 rounded-lg flex items-center justify-center uppercase text-xs font-medium tracking-wider transition-all border cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-brand-primary text-brand-white border-brand-primary shadow-sm"
                      : "bg-brand-bg text-brand-text border-brand-surface hover:bg-brand-surface/40"
                  }`}
                >
                  {v.title}
                </button>
              );
            })}
          </div>

          {/* Stock feedback */}
          <div className="mt-2.5">
            {selectedVariant && selectedVariant.inventoryQuantity <= 2 && selectedVariant.inStock ? (
              <p className="text-xs text-brand-text font-medium flex items-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4 text-brand-terracotta" />
                <span>
                  {messages.product.lowStockFeedback(
                    selectedVariant.inventoryQuantity,
                    selectedVariant.title
                  )}
                </span>
              </p>
            ) : (
              <p className="text-xs text-brand-text flex items-center gap-1.5 font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-announcement" />
                <span>{messages.product.sizeAdviceNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isSoldOut}
            className={`min-h-11 min-w-11 w-full py-3.5 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 ${
              isAddedSuccess
                ? "bg-brand-text text-brand-white"
                : "bg-brand-primary hover:bg-brand-text text-brand-white"
            }`}
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-brand-white border-t-transparent rounded-full animate-spin" />
            ) : isAddedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Ajouté ! ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedVariantId
                    ? messages.product.addToCartWithPrice(
                        formatPrice(product.price)
                      )
                    : messages.product.chooseSizeCta}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Reassurance 3-Point Card */}
        <div className="bg-brand-surface/40 border border-brand-surface rounded-xl p-4 flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-surface flex items-center justify-center text-brand-primary shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-brand-text">
                {messages.product.reassurancePayments}
              </span>
              <span className="text-[11px] text-brand-text font-light">
                {messages.product.reassurancePaymentsDesc}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-brand-surface/80" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-surface flex items-center justify-center text-brand-primary shrink-0">
              <Bike className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-brand-text">
                {messages.product.reassuranceDelivery}
              </span>
              <span className="text-[11px] text-brand-text font-light">
                {messages.product.reassuranceDeliveryDesc}
              </span>
            </div>
          </div>

        </div>

        {/* Editorial Narrative */}
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-brand-text font-semibold mb-2">
            {messages.product.spiritTitle}
          </h2>
          <p className="text-sm text-brand-text leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Accordions: only the fields filled in Medusa */}
        {(product.material || product.careInstructions) && (
        <div className="flex flex-col rounded-xl overflow-hidden bg-brand-surface/30 border border-brand-surface divide-y divide-brand-surface">
          {product.material && (
          <details className="group p-4 open:bg-brand-surface/50 transition-colors" open>
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-brand-text">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                {messages.product.materialAccordion}
              </span>
              <ChevronDown className="w-4 h-4 text-brand-primary transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="pt-3 pr-2 text-xs text-brand-text leading-relaxed font-light">
              {product.material}
            </p>
          </details>
          )}

          {product.careInstructions && (
          <details className="group p-4 open:bg-brand-surface/50 transition-colors">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-brand-text">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                {messages.product.careAccordion}
              </span>
              <ChevronDown className="w-4 h-4 text-brand-primary transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="pt-3 pr-2 text-xs text-brand-text leading-relaxed font-light">
              {product.careInstructions}
            </p>
          </details>
          )}
        </div>
        )}
      </section>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        sizeGuide={sizeGuide}
        activeSizeTitle={selectedVariant?.title}
        productTitle={product.title}
        whatsappUrl={whatsappUrl}
      />

      {/* Sticky Bottom Bar on Mobile (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md px-4 pt-3 pb-safe border-t border-brand-surface shadow-[0_-4px_20px_rgba(94,82,69,0.08)]">
        <div className="max-w-[420px] mx-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isSoldOut}
            className={`min-h-11 min-w-11 w-full py-3 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              isAddedSuccess
                ? "bg-brand-text text-brand-white"
                : "bg-brand-primary text-brand-white hover:bg-brand-text"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {selectedVariantId
                ? messages.product.addToCartWithPrice(formatPrice(product.price))
                : messages.product.chooseSizeCta}
            </span>
          </button>

          {/* Mini reassuring badges */}
          <div className="grid grid-cols-2 gap-1 pt-1 pb-1 text-center text-brand-text">
            <span className="text-[10px] leading-tight">{messages.product.miniBadgePayment}</span>
            <span className="text-[10px] leading-tight">{messages.product.miniBadgeDelivery}</span>
          </div>
        </div>
      </div>
    </>
  );
}
