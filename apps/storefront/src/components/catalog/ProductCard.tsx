"use client";
import Link from "next/link";
import { Heart, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { addToCartAction } from "@/app/actions/cart";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { triggerCartUpdated, triggerOpenCart, triggerToast } from "@/lib/cart-events";
import { FAVORITES_EVENT, loadFavorites, toggleFavorite } from "@/lib/favorites";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

interface ProductCardProps {
  product: Product;
  showCategoryBadge?: boolean;
  /** Age chosen in the catalogue filter (« 9-10 ans »): the button adds that size at once when in stock. */
  preferredAge?: string;
  /** First row of a grid, on screen when the page opens: the photo is loaded at once. */
  eager?: boolean;
}

/**
 * A soft rounded card: the photo on top with its labels, then a small line, the name and the
 * price. One button on the photo: it adds the size of the age filter, or opens the sizes so
 * that a size is never added by default.
 */
export function ProductCard({ product, showCategoryBadge = false, preferredAge, eager = false }: ProductCardProps) {
  const preferredVariant = preferredAge
    ? product.variants.find((v) => v.inStock && v.title === preferredAge)
    : undefined;
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const isSoldOut = product.variants.every((v) => !v.inStock);
  // Medusa says what is new: the outfit belongs to the « nouveautes » collection.
  const isNew = product.collections.includes(NEW_COLLECTION_HANDLE);
  const [isFavorite, setIsFavorite] = useState(false);
  // Read after mount: the saved list only exists on the phone.
  useEffect(() => {
    const sync = () => setIsFavorite(loadFavorites().includes(product.handle));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, [product.handle]);

  const toggleHeart = () => {
    const added = toggleFavorite(product.handle);
    if (added === null) return triggerToast(messages.favorites.unavailable);
    setIsFavorite(added);
    trackEvent(ANALYTICS_EVENTS.favorite, { action: added ? "ajout" : "retrait" });
    triggerToast(added ? messages.favorites.added : messages.favorites.removed);
  };
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
    <article
      className="group flex flex-col transition duration-300 md:hover:-translate-y-0.5 md:hover:shadow-[0_8px_24px_rgba(63,55,47,0.10)] rounded-xl md:rounded-2xl bg-brand-white border border-brand-surface overflow-hidden shadow-[0_1px_3px_rgba(63,55,47,0.06)]"
      data-purpose="product-card"
    >
      <div className="fk-zoom relative w-full aspect-[4/5] overflow-hidden bg-brand-surface">
        <Link href={href} className="relative block w-full h-full" tabIndex={-1} aria-hidden="true">
          <SafeImage
            src={product.thumbnail || IMAGE_FALLBACKS.product}
            alt=""
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <span className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col items-start gap-1 select-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-white text-brand-text text-[11px] md:text-xs rounded-full">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${isTerracotta ? "bg-brand-text" : "bg-brand-primary"}`}
            />
            {badgeLabel}
          </span>
          {isNew && (
            <span className="px-2.5 py-0.5 bg-brand-surface text-brand-text text-[11px] md:text-xs rounded-full">{text.newBadge}</span>
          )}
        </span>

        <button
          type="button"
          aria-label={isFavorite ? text.removeFavoriteAria(product.title) : text.addFavoriteAria(product.title)}
          aria-pressed={isFavorite}
          onClick={toggleHeart}
          className="absolute top-0 right-0 md:top-1 md:right-1 w-11 h-11 flex items-center justify-center cursor-pointer active:scale-90 transition"
        >
          <span className="w-8 h-8 rounded-full bg-brand-white flex items-center justify-center">
            <Heart
              aria-hidden="true"
              className={`w-4 h-4 ${isFavorite ? "fill-brand-text text-brand-text" : "text-brand-text"}`}
            />
          </span>
        </button>

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
            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-11 h-11 rounded-full bg-brand-white text-brand-text flex items-center justify-center shadow-sm hover:bg-brand-primary hover:text-brand-white transition-colors disabled:opacity-60 cursor-pointer"
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
        <div className="px-2.5 md:px-4 pt-2.5">
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

      <Link href={href} className="block px-2.5 pt-2.5 pb-3 md:px-4 md:pt-3.5 md:pb-4">
        {product.subtitle && (
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-brand-primary font-medium line-clamp-1">
            {product.subtitle}
          </p>
        )}
        <h3 className="font-serif normal-case tracking-normal text-[15px] md:text-xl text-brand-text leading-snug line-clamp-2 mt-0.5 group-hover:underline underline-offset-4">
          {product.title}
        </h3>
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

// Handle of the Medusa collection shown as « Nouveautés » on the home page.
const NEW_COLLECTION_HANDLE = "nouveautes";

/** « 13-14 ans » → « 13-14 »: three sizes fit on a row of a phone card, the label above says « ans ». */
const ageLabel = (title: string) => title.replace(/\s*ans?\s*$/i, "");
