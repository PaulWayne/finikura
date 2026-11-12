"use client";
import React, { useState } from "react";
import { Product } from "@/src/lib/commerce/types";
import { formatPrice } from "@/src/lib/format";
import { addToCartAction } from "@/app/actions/cart";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/src/lib/cart-events";
import { IMAGE_FALLBACKS, handleImgError } from "@/src/lib/images";

interface ProductCardProps {
  product: Product;
  showCategoryBadge?: boolean;
}

export function ProductCard({
  product,
  showCategoryBadge = false,
}: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants.find((v) => v.inStock)?.id || product.variants[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isSelectedSoldOut = selectedVariant ? !selectedVariant.inStock : false;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariantId) {
      setShowSizePicker(true);
      return;
    }

    if (isSelectedSoldOut) {
      triggerToast("Cette taille est épuisée.");
      return;
    }

    setIsAdding(true);
    const res = await addToCartAction(selectedVariantId, 1);
    setIsAdding(false);

    if (res.success && res.cart) {
      triggerCartUpdated(res.cart);
      triggerToast(`${product.title} ajouté au panier`);
      triggerOpenCart();
      setShowSizePicker(false);
    } else if (res.error) {
      triggerToast(res.error);
    }
  };

  // Badge tag configuration
  const badgeLabel = showCategoryBadge
    ? product.categoryHandle === "filles"
      ? "FILLES"
      : "GARÇONS"
    : product.occasionTag === "ceremonie"
    ? "CÉRÉMONIE"
    : product.occasionTag === "fete"
    ? "FÊTE"
    : "TOUS LES JOURS";

  const isTerracotta = showCategoryBadge
    ? product.categoryHandle === "filles"
    : product.occasionTag === "ceremonie" || product.occasionTag === "fete";

  return (
    <article
      className="group bg-[#EADCCC]/40 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-[#EADCCC] shadow-[0_2px_12px_rgba(94,82,69,0.04)] flex flex-col transition hover:shadow-md hover:-translate-y-0.5"
      data-purpose="product-card"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square rounded-lg md:rounded-xl overflow-hidden bg-[#FDF7F2] mb-2.5">
        <a href={`/produit/${product.handle}`} className="block w-full h-full">
          <img
            src={product.thumbnail || IMAGE_FALLBACKS.product}
            alt={product.title}
            onError={handleImgError(IMAGE_FALLBACKS.product)}
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        </a>

        {/* Badge Tag */}
        <span
          className={`absolute top-2 left-2 md:top-3 md:left-3 px-2 md:px-2.5 py-0.5 md:py-1 text-white text-[9px] md:text-xs font-medium tracking-[0.15em] uppercase rounded-sm shadow-xs select-none ${
            isTerracotta ? "bg-[#CA7154]" : "bg-[#97AFC4]"
          }`}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <a href={`/produit/${product.handle}`}>
            <h3 className="font-serif text-sm md:text-base text-[#5E5245] font-normal leading-snug line-clamp-1 group-hover:text-[#8A7058] transition-colors">
              {product.title}
            </h3>
          </a>
          {product.subtitle && (
            <p className="text-[11px] md:text-xs text-[#5E5245]/70 font-light mt-0.5 line-clamp-1">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Size selector toggle / buttons */}
        {showSizePicker && (
          <div className="mt-2 pt-2 border-t border-[#EADCCC] flex flex-wrap gap-1">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.inStock}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantId(variant.id);
                }}
                className={`text-[10px] px-2 py-0.5 rounded-[3px] border transition ${
                  selectedVariantId === variant.id
                    ? "bg-[#8A7058] text-white border-[#8A7058]"
                    : variant.inStock
                    ? "border-[#5E5245]/30 text-[#5E5245] bg-[#FDF7F2]"
                    : "border-[#5E5245]/15 text-[#5E5245]/30 line-through cursor-not-allowed bg-transparent"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        )}

        {/* Price and Add button */}
        <div className="mt-2.5 pt-2 border-t border-[#EADCCC]/80 flex items-center justify-between">
          <span className="font-medium text-xs md:text-sm text-[#5E5245]">
            {formatPrice(product.price)}
          </span>

          <div className="flex items-center space-x-1.5">
            {!showSizePicker ? (
              <button
                type="button"
                aria-label={`Choisir la taille pour ${product.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowSizePicker(true);
                }}
                className="h-8 px-2.5 rounded-[4px] border border-[#8A7058]/50 text-[10px] text-[#5E5245] hover:bg-[#8A7058] hover:text-white transition uppercase tracking-wider flex items-center justify-center cursor-pointer"
              >
                <span>{selectedVariant?.title || "Taille"}</span>
              </button>
            ) : null}

            <button
              type="button"
              aria-label={`Ajouter ${product.title} au panier`}
              onClick={handleQuickAdd}
              disabled={isAdding || isSelectedSoldOut}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#8A7058] text-white flex items-center justify-center hover:bg-[#725a43] transition-colors disabled:opacity-50 min-touch-btn cursor-pointer shadow-xs"
            >
              {isAdding ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-sm leading-none font-light mb-0.5">+</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
