import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryCardsBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

// Same values as the catalogue filter: the customer lands on the outfits of her occasion.
const OCCASION_LINKS = [
  { label: messages.catalog.occasions.ceremony, value: "ceremonie" },
  { label: messages.catalog.occasions.party, value: "fete" },
  { label: messages.catalog.occasions.everyday, value: "tous-les-jours" },
];

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
            <div key={card.categoryHandle}>
              {/* The photo and the name open the whole category; the occasions below open it already filtered. */}
              <Link href={`/categorie/${card.categoryHandle}`} className="group block">
                <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[460px] rounded-md overflow-hidden bg-brand-surface">
                  <SafeImage
                    src={card.imageUrl || fallback}
                    alt={card.imageAlt}
                    fallbackSrc={fallback}
                    sizes="50vw"
                    className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-brand-text mt-3 group-hover:underline underline-offset-4">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-text">{card.ageRange}</p>
              </Link>
              <ul className="mt-1 flex flex-col md:flex-row md:gap-5">
                {OCCASION_LINKS.map((occasion) => (
                  <li key={occasion.value}>
                    <Link
                      href={`/categorie/${card.categoryHandle}?occasion=${occasion.value}`}
                      aria-label={messages.home.occasionLinkAria(card.title, occasion.label)}
                      className="min-h-11 inline-flex items-center text-sm text-brand-text underline underline-offset-4"
                    >
                      {occasion.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
