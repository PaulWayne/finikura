import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";
import { ArrowRight } from "lucide-react";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface ProductRecommendationsProps {
  products: Product[];
  categoryHandle: string;
}

export function ProductRecommendations({
  products,
  categoryHandle,
}: ProductRecommendationsProps) {
  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 3);

  return (
    <section aria-label="Recommandations" className="mt-16 md:mt-24 pt-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-brand-text font-medium block mb-1">
            {messages.product.recommendationsEyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-text uppercase font-normal tracking-[0.08em]">
            {messages.product.recommendationsTitle}
          </h2>
        </div>
        <Link
          href={`/categorie/${categoryHandle}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-brand-text hover:underline underline-offset-4 transition-colors group"
        >
          <span>{messages.product.discoverWardrobe}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3 Coordinated pieces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayProducts.map((p, idx) => {
          const badgeText =
            idx === 0 ? "NOUVEAUTÉ" : idx === 1 ? "BEST-SELLER" : "MIXTE";
          const badgeColor =
            idx === 0
              ? "text-brand-text"
              : idx === 1
              ? "text-brand-text"
              : "text-brand-text";

          return (
            <article
              key={p.id}
              className="flex flex-col bg-brand-surface/40 border border-brand-surface rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative aspect-square w-full bg-brand-surface overflow-hidden">
                <Link href={`/produit/${p.handle}`} className="block w-full h-full">
                  <SafeImage
                    src={p.thumbnail || IMAGE_FALLBACKS.product}
                    alt={p.title}
                    fallbackSrc={IMAGE_FALLBACKS.product}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded bg-brand-bg/90 font-medium text-[10px] tracking-[0.15em] uppercase backdrop-blur-xs ${badgeColor}`}
                >
                  {badgeText}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[11px] text-brand-text mb-0.5">
                    {p.categoryHandle === "filles"
                      ? "Fille · 3 à 14 ans"
                      : "Garçon · 3 à 14 ans"}
                  </p>
                  <Link href={`/produit/${p.handle}`} className="block py-[10px] -my-[10px]">
                    <h3 className="font-serif text-base text-brand-text font-normal group-hover:underline underline-offset-4 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-surface/60">
                  <span className="text-xs md:text-sm font-semibold text-brand-text">
                    {formatPrice(p.price)}
                  </span>
                  <Link
                    href={`/produit/${p.handle}`}
                    aria-label={`Voir ${p.title}`}
                    className="touch-area w-8 h-8 rounded-full bg-brand-bg border border-brand-surface flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-brand-white transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
