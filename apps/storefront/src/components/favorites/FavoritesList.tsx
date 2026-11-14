"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FAVORITES_EVENT, loadFavorites, removeFavorite } from "@/lib/favorites";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { messages } from "@/messages/fr";

/**
 * Favourites saved on this phone (FK-37). The catalogue comes from Medusa:
 * a saved handle that Medusa no longer sells is simply not shown.
 */
export function FavoritesList({ products }: { products: Product[] }) {
  const [handles, setHandles] = useState<string[] | null>(null);

  useEffect(() => {
    const sync = () => setHandles(loadFavorites());
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, []);

  if (handles === null) {
    return <p className="py-10 text-center text-sm text-brand-text">{messages.favorites.loading}</p>;
  }

  const bySaveOrder = handles
    .map((handle) => products.find((p) => p.handle === handle))
    .filter((p): p is Product => Boolean(p));

  if (bySaveOrder.length === 0) {
    return (
      <div className="py-12 px-6 text-center rounded-2xl bg-brand-surface/30 border border-brand-surface space-y-4">
        <p className="text-base text-brand-text">{messages.favorites.empty}</p>
        <Link
          href="/categorie/filles"
          className="min-h-11 inline-flex items-center justify-center px-5 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          {messages.favorites.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
      {bySaveOrder.map((product) => (
        <div key={product.id} className="flex flex-col gap-1">
          <ProductCard product={product} />
          <button
            type="button"
            onClick={() => {
              removeFavorite(product.handle);
              trackEvent(ANALYTICS_EVENTS.favorite, { action: "retrait" });
            }}
            className="min-h-11 text-xs text-brand-text underline underline-offset-4 cursor-pointer"
          >
            {messages.favorites.remove}
          </button>
        </div>
      ))}
    </div>
  );
}
