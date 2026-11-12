"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { addToCartAction } from "@/app/actions/cart";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/lib/cart-events";
import { IMAGE_FALLBACKS, handleImgError } from "@/lib/images";

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
      className="group bg-brand-surface/40 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-brand-surface shadow-[0_2px_12px_rgba(94,82,69,0.04)] flex flex-col transition hover:shadow-md hover:-translate-y-0.5"
      data-purpose="product-card"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square rounded-lg md:rounded-xl overflow-hidden bg-brand-bg mb-2.5">
        <Link href={`/produit/${product.handle}`} className="block w-full h-full">
          <img
            src={product.thumbnail || IMAGE_FALLBACKS.product}
            alt={product.title}
            onError={handleImgError(IMAGE_FALLBACKS.product)}
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badge Tag */}
        <span
          className="absolute top-2 left-2 md:top-3 md:left-3 inline-flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 bg-brand-bg text-brand-text text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase rounded-sm shadow-xs select-none"
        >
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${isTerracotta ? "bg-brand-terracotta" : "bg-brand-blue"}`}
          />
          {badgeLabel}
        </span>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/produit/${product.handle}`} className="block py-[13px] -my-[13px]">
            <h3 className="font-serif text-sm md:text-base text-brand-text font-normal leading-snug line-clamp-1 group-hover:underline underline-offset-4 transition-colors">
              {product.title}
            </h3>
          </Link>
          {product.subtitle && (
            <p className="text-[11px] md:text-xs text-brand-text font-light mt-0.5 line-clamp-1">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Size selector toggle / buttons */}
        {showSizePicker && (
          <div className="mt-2 pt-2 border-t border-brand-surface flex flex-wrap gap-1">
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
                    ? "bg-brand-primary text-brand-white border-brand-primary"
                    : variant.inStock
                    ? "border-brand-text/30 text-brand-white bg-brand-bg"
                    : "border-brand-text/15 text-brand-white line-through cursor-not-allowed bg-transparent"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        )}

        {/* Price and Add button */}
        <div className="mt-2.5 pt-2 border-t border-brand-surface/80 flex items-center justify-between">
          <span className="font-medium text-xs md:text-sm text-brand-text">
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
                className="touch-area h-8 px-2.5 rounded-[4px] border border-brand-primary/50 text-[10px] text-brand-text hover:bg-brand-primary hover:text-brand-white transition uppercase tracking-wider flex items-center justify-center cursor-pointer"
              >
                <span>{selectedVariant?.title || "Taille"}</span>
              </button>
            ) : null}

            <button
              type="button"
              aria-label={`Ajouter ${product.title} au panier`}
              onClick={handleQuickAdd}
              disabled={isAdding || isSelectedSoldOut}
              className="touch-area w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand-primary text-brand-white flex items-center justify-center hover:bg-brand-text transition-colors disabled:opacity-50 min-h-11 min-w-11 cursor-pointer shadow-xs"
            >
              {isAdding ? (
                <span className="w-3 h-3 border-2 border-brand-white border-t-transparent rounded-full animate-spin" />
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
