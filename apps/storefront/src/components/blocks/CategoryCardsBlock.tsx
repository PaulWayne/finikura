import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryCardsBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";
import type { OccasionShortcut } from "@/lib/occasion-shortcuts";
import { messages } from "@/messages/fr";

interface CategoryCardsBlockProps {
  block: CategoryCardsBlockData;
  /** Round shortcuts to a category already filtered by occasion, pictured by an outfit. */
  occasionShortcuts?: OccasionShortcut[];
}

/**
 * Two large photos set edge to edge open the girls and boys categories; a row of round
 * shortcuts below opens them already filtered by occasion.
 */
export function CategoryCardsBlock({ block, occasionShortcuts = [] }: CategoryCardsBlockProps) {
  const titles = new Map(block.cards.map((card) => [card.categoryHandle, card.title]));

  return (
    <section>
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[26px] md:text-4xl text-brand-text leading-tight">{block.title}</h2>
        {block.subtitle && <p className="text-sm md:text-base text-brand-text mt-1">{block.subtitle}</p>}
      </div>

      {/* Phone: the two photos touch and run past the page gutter. */}
      <div className="grid grid-cols-2 gap-1 -mx-4 md:mx-0">
        {block.cards.map((card) => {
          const fallback = card.categoryHandle === "garcons" ? IMAGE_FALLBACKS.garcons : IMAGE_FALLBACKS.filles;
          return (
            <Link key={card.categoryHandle} href={`/categorie/${card.categoryHandle}`} className="group block">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[560px] overflow-hidden bg-brand-surface">
                <SafeImage
                  src={card.imageUrl || fallback}
                  alt={card.imageAlt}
                  fallbackSrc={fallback}
                  sizes="50vw"
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-4 md:px-0 pt-3">
                <h3 className="font-serif text-2xl md:text-3xl text-brand-text group-hover:underline underline-offset-4">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-text">{card.ageRange}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {occasionShortcuts.length > 0 && (
        <nav aria-label={messages.home.occasionsNavAria} className="mt-7 md:mt-10 -mx-4 md:mx-0 overflow-x-auto no-scrollbar">
          <ul className="flex gap-4 md:gap-8 px-4 md:px-0 md:justify-center min-w-max">
            {occasionShortcuts.map((shortcut) => (
              <li key={`${shortcut.categoryHandle}-${shortcut.occasion}`}>
                <Link
                  href={`/categorie/${shortcut.categoryHandle}?occasion=${shortcut.occasion}`}
                  className="group flex flex-col items-center w-[84px] md:w-28 text-center"
                >
                  <span className="relative block w-[76px] h-[76px] md:w-24 md:h-24 rounded-full overflow-hidden bg-brand-surface">
                    <SafeImage
                      src={shortcut.imageUrl}
                      alt=""
                      fallbackSrc={IMAGE_FALLBACKS.product}
                      sizes="96px"
                      className="w-full h-full object-cover object-top"
                    />
                  </span>
                  <span className="mt-2 text-sm font-medium text-brand-text leading-tight group-hover:underline underline-offset-4">
                    {shortcut.occasionLabel}
                  </span>
                  <span className="text-xs text-brand-text">{titles.get(shortcut.categoryHandle)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
