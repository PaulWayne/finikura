import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryCardsBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface CategoryCardsBlockProps {
  block: CategoryCardsBlockData;
}

export function CategoryCardsBlock({ block }: CategoryCardsBlockProps) {
  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-brand-terracotta font-medium block mb-1">
            {block.eyebrow}
          </span>
          <h2 className="font-serif text-[24px] md:text-[26px] uppercase font-normal text-brand-text tracking-[0.08em]">
            {block.title}
          </h2>
        </div>
        <span className="text-xs uppercase tracking-[0.15em] text-brand-text/70 font-medium hidden sm:inline-block">
          {block.subtitle}
        </span>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {block.cards.map((card) => {
          const fallback =
            card.categoryHandle === "garcons"
              ? IMAGE_FALLBACKS.garcons
              : IMAGE_FALLBACKS.filles;
          return (
            <div
              key={card.categoryHandle}
              className="group relative block rounded-2xl overflow-hidden shadow-xs bg-brand-surface border border-brand-surface"
            >
              {/* Card image container */}
              <div className="relative w-full aspect-[4/3] md:h-[380px] overflow-hidden">
                <SafeImage
                  src={card.imageUrl || fallback}
                  alt={card.imageAlt}
                  fallbackSrc={fallback}
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105"
                />
              <div className="absolute inset-0 bg-brand-text/20 group-hover:bg-brand-text/30 transition duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-brand-bg/95 backdrop-blur-xs px-6 py-3.5 rounded-xl border border-brand-surface shadow-xs">
                  <h3 className="font-serif text-3xl md:text-4xl uppercase font-normal text-brand-text tracking-[0.08em]">
                    {card.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.15em] font-medium text-brand-primary mt-1 block">
                    {card.ageRange}
                  </span>
                </div>
                <Link
                  href={`/categorie/${card.categoryHandle}`}
                  className="min-touch-btn inline-flex items-center justify-center px-6 py-2.5 mt-4 rounded-[4px] border border-brand-primary bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-white font-medium text-xs tracking-[0.15em] uppercase transition shadow-xs"
                >
                  {card.ctaText}
                </Link>
              </div>
            </div>

            {/* Mobile bottom caption strip matching mockup */}
            <div className="md:hidden p-3.5 bg-brand-surface flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-brand-text font-medium">
                {card.tagline || card.title}
              </span>
              <Link
                href={`/categorie/${card.categoryHandle}`}
                className="min-touch-btn inline-flex items-center justify-center px-4 py-2 rounded-[4px] border border-brand-primary text-brand-primary font-medium text-xs uppercase tracking-[0.15em] hover:bg-brand-primary hover:text-brand-white transition"
              >
                {card.ctaText}
              </Link>
            </div>
          </div>
        );
      })}
      </div>
    </section>
  );
}
