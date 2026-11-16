"use client";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { addToCartAction } from "@/app/actions/cart";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/lib/cart-events";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

interface ProductCardProps {
  product: Product;
  showCategoryBadge?: boolean;
  /** Age chosen in the catalogue filter (« 9-10 ans »): the button adds that size at once when in stock. */
  preferredAge?: string;
}

/**
 * The photo leads: no frame around the card. One button on the photo: it adds the size of
 * the age filter, or opens the sizes so that a size is never added by default.
 */
export function ProductCard({ product, showCategoryBadge = false, preferredAge }: ProductCardProps) {
  const preferredVariant = preferredAge
    ? product.variants.find((v) => v.inStock && v.title === preferredAge)
    : undefined;
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const isSoldOut = product.variants.every((v) => !v.inStock);
  const text = messages.catalog.card;
  // Each age can have its own price in Medusa: without a chosen age, the lowest one is announced as such.
  const hasSeveralPrices = new Set(product.variants.map((v) => v.price)).size > 1;

  const add = async (variantId: string, size: string) => {
    setAddingId(variantId);
    const res = await addToCartAction(variantId, 1);
    setAddingId(null);

    if (res.success && res.cart) {
      trackEvent(ANALYTICS_EVENTS.addToCart, { produit: product.handle });
      triggerCartUpdated(res.cart);
      triggerToast(messages.product.addedFeedback(product.title, size));
      triggerOpenCart();
      setShowSizePicker(false);
    } else if (res.error) {
      triggerToast(res.error);
    }
  };

  const badgeLabel = showCategoryBadge
    ? product.categoryHandle === "filles"
      ? text.girls
      : text.boys
    : product.occasionTag === "ceremonie"
    ? messages.catalog.occasions.ceremony
    : product.occasionTag === "fete"
    ? messages.catalog.occasions.party
    : messages.catalog.occasions.everyday;

  const isTerracotta = showCategoryBadge
    ? product.categoryHandle === "filles"
    : product.occasionTag === "ceremonie" || product.occasionTag === "fete";

  const href = `/produit/${product.handle}`;

  return (
    <article className="group flex flex-col" data-purpose="product-card">
      <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-brand-surface">
        <Link href={href} className="relative block w-full h-full" tabIndex={-1} aria-hidden="true">
          <SafeImage
            src={product.thumbnail || IMAGE_FALLBACKS.product}
            alt=""
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-bg text-brand-text text-[11px] md:text-xs rounded-sm select-none">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${isTerracotta ? "bg-brand-terracotta" : "bg-brand-blue"}`}
          />
          {badgeLabel}
        </span>

        {!isSoldOut && (
          <button
            type="button"
            aria-label={
              preferredVariant
                ? text.addSizeAria(product.title, preferredVariant.title)
                : showSizePicker
                ? text.closeSizesAria
                : text.chooseSizeAria(product.title)
            }
            aria-expanded={preferredVariant ? undefined : showSizePicker}
            disabled={addingId !== null}
            onClick={() =>
              preferredVariant ? add(preferredVariant.id, preferredVariant.title) : setShowSizePicker((open) => !open)
            }
            className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-brand-bg text-brand-text flex items-center justify-center shadow-sm hover:bg-brand-primary hover:text-brand-white transition-colors disabled:opacity-60 cursor-pointer"
          >
            {addingId && preferredVariant ? (
              <span className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            ) : showSizePicker ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Plus className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {showSizePicker && (
        <div className="mt-2">
          <p className="text-xs text-brand-text mb-1.5">{text.chooseSize}</p>
          <div className="grid grid-cols-3 gap-1">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.inStock || addingId !== null}
                aria-label={text.addSizeAria(product.title, variant.title)}
                onClick={() => add(variant.id, variant.title)}
                className={`min-h-11 text-xs px-1 rounded-sm border transition ${
                  variant.inStock
                    ? "border-brand-text/50 text-brand-text bg-brand-white hover:bg-brand-primary hover:text-brand-white hover:border-brand-primary cursor-pointer"
                    : "border-dashed border-brand-text/40 text-brand-text line-through cursor-not-allowed bg-transparent"
                }`}
              >
                {addingId === variant.id ? (
                  <span className="inline-block w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  ageLabel(variant.title)
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Link href={href} className="block pt-2.5">
        <h3 className="font-serif normal-case tracking-normal text-[15px] md:text-lg text-brand-text leading-snug line-clamp-2 group-hover:underline underline-offset-4">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-xs md:text-sm text-brand-text mt-0.5 line-clamp-1">{product.subtitle}</p>
        )}
        <p className="text-sm md:text-base font-medium text-brand-text mt-1 whitespace-nowrap">
          {isSoldOut
            ? messages.product.soldOut
            : preferredVariant
            ? formatPrice(preferredVariant.price)
            : hasSeveralPrices
            ? text.fromPrice(formatPrice(product.price))
            : formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}

/** « 13-14 ans » → « 13-14 »: three sizes fit on a row of a phone card, the label above says « ans ». */
const ageLabel = (title: string) => title.replace(/\s*ans?\s*$/i, "");
