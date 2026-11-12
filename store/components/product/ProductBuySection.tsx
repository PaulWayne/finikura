"use client";
import React, { useState } from "react";
import { Product, ProductVariant } from "@/src/lib/commerce/types";
import { SizeGuide } from "@/src/lib/content/types";
import { formatPrice } from "@/src/lib/format";
import { messages } from "@/src/messages/fr";
import { addToCartAction } from "@/app/actions/cart";
import {
  triggerCartUpdated,
  triggerOpenCart,
  triggerToast,
} from "@/src/lib/cart-events";
import { SizeGuideModal } from "./SizeGuideModal";
import {
  Ruler,
  ShoppingBag,
  CheckCircle2,
  Flame,
  CreditCard,
  Bike,
  RefreshCw,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface ProductBuySectionProps {
  product: Product;
  sizeGuide?: SizeGuide | null;
  whatsappUrl?: string;
}

export function ProductBuySection({
  product,
  sizeGuide,
  whatsappUrl = "https://wa.me/22370000000",
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
        <span className="text-xs uppercase tracking-[0.2em] text-[#CA7154] font-medium mb-1.5 block">
          {product.categoryHandle === "filles"
            ? "Collection Filles · Bamako"
            : "Collection Garçons · Bamako"}
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-tight uppercase tracking-[0.08em] text-[#5E5245] mb-2">
          {product.title}
        </h1>

        {/* Price exact in FCFA */}
        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-2xl font-semibold text-[#5E5245] tracking-tight">
            {formatPrice(product.price)}
          </p>
          <span className="text-xs text-[#5E5245]/70 font-light">
            {messages.product.taxIncluded}
          </span>
        </div>

        {/* Thin cream separator */}
        <div className="w-full h-px bg-[#EADCCC] mb-5" />

        {/* Size Selection Block */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-[#5E5245] font-medium">
              {messages.product.childSize} :{" "}
              <span className="font-semibold text-[#8A7058]">
                {selectedVariant
                  ? selectedVariant.title
                  : `(${messages.product.chooseSizePrompt})`}
              </span>
            </label>

            {/* Size Guide Trigger */}
            <button
              type="button"
              onClick={() => setIsSizeModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#5E5245]/80 hover:text-[#CA7154] transition-colors cursor-pointer group"
            >
              <Ruler className="w-4 h-4 text-[#8A7058] transition-transform group-hover:rotate-12" />
              <span className="underline underline-offset-4 decoration-[#EADCCC]">
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
                    aria-checked="false"
                    title={`Taille ${v.title} actuellement épuisée`}
                    className="relative h-11 rounded-lg flex flex-col items-center justify-center uppercase text-[11px] font-medium tracking-wider bg-[#EADCCC]/40 text-[#5E5245]/40 cursor-not-allowed border border-[#EADCCC] select-none overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <span className="w-[140%] h-[1px] bg-[#8A7058]/50 rotate-[-30deg]" />
                    </span>
                    <span className="line-through">{v.title}</span>
                    <span className="text-[9px] uppercase font-semibold tracking-wider text-[#CA7154] leading-none mt-0.5">
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
                      ? "bg-[#8A7058] text-white border-[#8A7058] shadow-sm"
                      : "bg-[#FDF7F2] text-[#5E5245] border-[#EADCCC] hover:bg-[#EADCCC]/40"
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
              <p className="text-xs text-[#CA7154] font-medium flex items-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4 text-[#CA7154]" />
                <span>
                  {messages.product.lowStockFeedback(
                    selectedVariant.inventoryQuantity,
                    selectedVariant.title
                  )}
                </span>
              </p>
            ) : (
              <p className="text-xs text-[#5E5245]/70 flex items-center gap-1.5 font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9EA593]" />
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
            className={`min-touch-btn w-full py-3.5 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 ${
              isAddedSuccess
                ? "bg-[#9EA593] text-white"
                : "bg-[#8A7058] hover:bg-[#725a43] text-white"
            }`}
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className="bg-[#EADCCC]/40 border border-[#EADCCC] rounded-xl p-4 flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF7F2] border border-[#EADCCC] flex items-center justify-center text-[#8A7058] shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#5E5245]">
                {messages.product.reassurancePayments}
              </span>
              <span className="text-[11px] text-[#5E5245]/75 font-light">
                {messages.product.reassurancePaymentsDesc}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-[#EADCCC]/80" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF7F2] border border-[#EADCCC] flex items-center justify-center text-[#8A7058] shrink-0">
              <Bike className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#5E5245]">
                {messages.product.reassuranceDelivery}
              </span>
              <span className="text-[11px] text-[#5E5245]/75 font-light">
                {messages.product.reassuranceDeliveryDesc}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-[#EADCCC]/80" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF7F2] border border-[#EADCCC] flex items-center justify-center text-[#8A7058] shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#5E5245]">
                {messages.product.reassuranceExchange}
              </span>
              <span className="text-[11px] text-[#5E5245]/75 font-light">
                {messages.product.reassuranceExchangeDesc}
              </span>
            </div>
          </div>
        </div>

        {/* Editorial Narrative */}
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#5E5245]/70 font-semibold mb-2">
            {messages.product.spiritTitle}
          </h2>
          <p className="text-sm text-[#5E5245] leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col rounded-xl overflow-hidden bg-[#EADCCC]/30 border border-[#EADCCC] divide-y divide-[#EADCCC]">
          {/* Accordion 1: Matière & Confection */}
          <details className="group p-4 open:bg-[#EADCCC]/50 transition-colors" open>
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-[#5E5245]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8A7058]" />
                {messages.product.materialAccordion}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8A7058] transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="pt-3 pr-2 text-xs text-[#5E5245]/85 leading-relaxed space-y-1.5 font-light">
              <p>
                • <strong>{product.material}</strong>, respirant, hypoallergénique
                et naturellement frais sous la chaleur de Bamako.
              </p>
              <p>• Plastron brodé au fil de coton teinté artisanalement.</p>
              <p>• Finitions soignées au dos pour un enfilage tout en douceur.</p>
              <p>• Coupe ample permettant une totale liberté de mouvement.</p>
            </div>
          </details>

          {/* Accordion 2: Conseils d'entretien */}
          <details className="group p-4 open:bg-[#EADCCC]/50 transition-colors">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-[#5E5245]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8A7058]" />
                {messages.product.careAccordion}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8A7058] transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="pt-3 pr-2 text-xs text-[#5E5245]/85 leading-relaxed space-y-1.5 font-light">
              <p>• {product.careInstructions}</p>
              <p>
                • Lessive douce sans agents blanchissants pour préserver
                l&apos;éclat des teintes naturelles.
              </p>
              <p>• Séchage naturel à l&apos;air libre et à l&apos;ombre.</p>
              <p>
                • Repassage sur l&apos;envers encore légèrement humide, ou laisser
                froisser naturellement pour un chic décontracté.
              </p>
            </div>
          </details>

          {/* Accordion 3: Atelier Fini Kura */}
          <details className="group p-4 open:bg-[#EADCCC]/50 transition-colors">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-[#5E5245]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8A7058]" />
                {messages.product.atelierAccordion}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8A7058] transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="pt-3 pr-2 text-xs text-[#5E5245]/85 leading-relaxed space-y-1 font-light">
              <p>
                Chaque pièce Fini Kura est taillée et assemblée en série très
                limitée dans notre atelier partenaire de Badalabougou, Bamako,
                par des maîtres artisans passionnés.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        sizeGuide={sizeGuide}
        activeSizeTitle={selectedVariant?.title}
        whatsappUrl={whatsappUrl}
        initialGender={product.categoryHandle === "garcons" ? "garcons" : "filles"}
      />

      {/* Sticky Bottom Bar on Mobile (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDF7F2]/95 backdrop-blur-md px-4 pt-3 pb-safe border-t border-[#EADCCC] shadow-[0_-4px_20px_rgba(94,82,69,0.08)]">
        <div className="max-w-[420px] mx-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isSoldOut}
            className={`min-touch-btn w-full py-3 px-6 rounded-lg uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              isAddedSuccess
                ? "bg-[#9EA593] text-white"
                : "bg-[#8A7058] text-white hover:bg-[#725a43]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {selectedVariantId
                ? messages.product.addToCartWithPrice(formatPrice(product.price))
                : messages.product.chooseSizeCta}
            </span>
          </button>

          {/* 3 mini reassuring badges */}
          <div className="grid grid-cols-3 gap-1 pt-1 pb-1 text-center text-[#5E5245]/80">
            <span className="text-[10px] leading-tight">Paiement réception</span>
            <span className="text-[10px] leading-tight">Livraison Bamako</span>
            <span className="text-[10px] leading-tight">Échange possible</span>
          </div>
        </div>
      </div>
    </>
  );
}
