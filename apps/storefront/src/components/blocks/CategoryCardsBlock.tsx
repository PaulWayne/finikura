import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryCardsBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface CategoryCardsBlockProps {
  block: CategoryCardsBlockData;
}

/** Two portraits side by side, even on a phone: the choice between girls and boys shows at a glance. */
export function CategoryCardsBlock({ block }: CategoryCardsBlockProps) {
  return (
    <section>
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[26px] md:text-4xl text-brand-text leading-tight">{block.title}</h2>
        {block.subtitle && <p className="text-sm md:text-base text-brand-text mt-1">{block.subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-8">
        {block.cards.map((card) => {
          const fallback = card.categoryHandle === "garcons" ? IMAGE_FALLBACKS.garcons : IMAGE_FALLBACKS.filles;
          return (
            // The whole card is one link: the photo and the words open the category.
            <Link key={card.categoryHandle} href={`/categorie/${card.categoryHandle}`} className="group block">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[460px] rounded-md overflow-hidden bg-brand-surface">
                <SafeImage
                  src={card.imageUrl || fallback}
                  alt={card.imageAlt}
                  fallbackSrc={fallback}
                  sizes="(min-width: 768px) 50vw, 50vw"
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-text mt-3 group-hover:underline underline-offset-4">
                {card.title}
              </h3>
              <p className="text-sm text-brand-text">{card.ageRange}</p>
              <span className="min-h-11 inline-flex items-center text-sm text-brand-text underline underline-offset-4">
                {card.ctaText}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
