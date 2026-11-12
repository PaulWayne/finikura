import React from "react";
import { Product } from "@/src/lib/commerce/types";
import { formatPrice } from "@/src/lib/format";
import { messages } from "@/src/messages/fr";
import { ArrowRight } from "lucide-react";
import { IMAGE_FALLBACKS, handleImgError } from "@/src/lib/images";

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
          <span className="text-xs uppercase tracking-[0.2em] text-[#CA7154] font-medium block mb-1">
            {messages.product.recommendationsEyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#5E5245] uppercase font-normal tracking-[0.08em]">
            {messages.product.recommendationsTitle}
          </h2>
        </div>
        <a
          href={`/categorie/${categoryHandle}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[#8A7058] hover:text-[#5E5245] transition-colors group"
        >
          <span>{messages.product.discoverWardrobe}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* 3 Coordinated pieces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayProducts.map((p, idx) => {
          const badgeText =
            idx === 0 ? "NOUVEAUTÉ" : idx === 1 ? "BEST-SELLER" : "MIXTE";
          const badgeColor =
            idx === 0
              ? "text-[#97AFC4]"
              : idx === 1
              ? "text-[#CA7154]"
              : "text-[#5E5245]";

          return (
            <article
              key={p.id}
              className="flex flex-col bg-[#EADCCC]/40 border border-[#EADCCC] rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative aspect-square w-full bg-[#EADCCC] overflow-hidden">
                <a href={`/produit/${p.handle}`} className="block w-full h-full">
                  <img
                    src={p.thumbnail || IMAGE_FALLBACKS.product}
                    alt={p.title}
                    onError={handleImgError(IMAGE_FALLBACKS.product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </a>
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FDF7F2]/90 font-medium text-[10px] tracking-[0.15em] uppercase backdrop-blur-xs ${badgeColor}`}
                >
                  {badgeText}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[11px] text-[#5E5245]/70 mb-0.5">
                    {p.categoryHandle === "filles"
                      ? "Fille · 3 à 14 ans"
                      : "Garçon · 3 à 14 ans"}
                  </p>
                  <a href={`/produit/${p.handle}`}>
                    <h3 className="font-serif text-base text-[#5E5245] font-normal group-hover:text-[#8A7058] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </a>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EADCCC]/60">
                  <span className="text-xs md:text-sm font-semibold text-[#5E5245]">
                    {formatPrice(p.price)}
                  </span>
                  <a
                    href={`/produit/${p.handle}`}
                    aria-label={`Voir ${p.title}`}
                    className="w-8 h-8 rounded-full bg-[#FDF7F2] border border-[#EADCCC] flex items-center justify-center text-[#8A7058] hover:bg-[#8A7058] hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
