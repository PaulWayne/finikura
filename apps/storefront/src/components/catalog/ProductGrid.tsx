"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { loadMoreProductsAction } from "@/app/actions/catalog";
import type { CategoryHandle, Product } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";

interface ProductGridProps {
  categoryHandle: CategoryHandle;
  age?: string;
  occasion?: string;
  initialProducts: Product[];
  total: number;
  /** Link of the « Voir plus » button without JavaScript: the same page with more products. */
  moreHref: string;
}

/**
 * FK-43: the first products come from the server; the next ones are loaded a little before
 * the customer reaches the end of the list. The URL keeps the count (« voir »), so the
 * back button from a product page returns to the same place in the list.
 */
export function ProductGrid({ categoryHandle, age, occasion, initialProducts, total, moreHref }: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [announce, setAnnounce] = useState("");
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const hasMore = products.length < total;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setFailed(false);
    startTransition(async () => {
      try {
        const next = await loadMoreProductsAction({ categoryHandle, age, occasion, offset: products.length });
        // The customer changed filter or page meanwhile: this answer is no longer wanted.
        if (!mountedRef.current) return;
        const known = new Set(products.map((p) => p.id));
        const added = next.filter((p) => !known.has(p.id));
        const all = [...products, ...added];
        setProducts(all);
        setAnnounce(messages.catalog.loadedMore(added.length));
        const url = new URL(window.location.href);
        url.searchParams.set("voir", String(all.length));
        window.history.replaceState(window.history.state, "", url);
      } catch {
        setFailed(true);
      } finally {
        loadingRef.current = false;
      }
    });
  }, [age, categoryHandle, hasMore, occasion, products]);

  // Recreated after each batch (isPending back to false): a new observer reports at once
  // whether the end of the list is still near, so the loading goes on if needed.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || failed || isPending || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [failed, hasMore, isPending, loadMore]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={`${product.id}-${age ?? ""}`}
            product={product}
            showCategoryBadge={false}
            preferredAge={age}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {hasMore && (
        <div ref={sentinelRef} className="flex flex-col items-center gap-2">
          {failed && <p className="text-sm text-brand-text">{messages.catalog.loadMoreError}</p>}
          <Link
            href={moreHref}
            scroll={false}
            aria-disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              loadMore();
            }}
            className="min-h-11 min-w-11 inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] border border-brand-primary bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-white font-medium text-xs tracking-[0.15em] uppercase transition"
          >
            {isPending ? messages.catalog.loadingMore : messages.catalog.loadMore}
          </Link>
        </div>
      )}
    </div>
  );
}
