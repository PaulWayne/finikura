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
 * One soft card per category, photo beside the words, opens the girls and boys categories;
 * a row of round shortcuts below opens them already filtered by occasion.
 */
export function CategoryCardsBlock({ block, occasionShortcuts = [] }: CategoryCardsBlockProps) {
  const titles = new Map(block.cards.map((card) => [card.categoryHandle, card.title]));

  return (
    <section>
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[26px] md:text-4xl text-brand-text leading-tight">{block.title}</h2>
        {block.subtitle && <p className="text-sm md:text-base text-brand-text mt-1">{block.subtitle}</p>}
      </div>

      {/* One soft card per category: the photo on one side, the words and the link on the other. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {block.cards.map((card) => {
          const fallback = card.categoryHandle === "garcons" ? IMAGE_FALLBACKS.garcons : IMAGE_FALLBACKS.filles;
          return (
            <Link
              key={card.categoryHandle}
              href={`/categorie/${card.categoryHandle}`}
              className="group flex items-stretch gap-4 md:gap-6 rounded-2xl md:rounded-3xl bg-brand-white border border-brand-surface p-2.5 md:p-4 shadow-[0_1px_3px_rgba(94,82,69,0.06)]"
            >
              <div className="relative w-[42%] shrink-0 aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-brand-surface">
                <SafeImage
                  src={card.imageUrl || fallback}
                  alt={card.imageAlt}
                  fallbackSrc={fallback}
                  sizes="(min-width: 768px) 240px, 42vw"
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0 py-1 md:py-3 pr-1">
                <p className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-brand-primary font-medium">
                  {card.title} · {card.ageRange}
                </p>
                <h3 className="font-serif text-[22px] md:text-[32px] leading-[1.15] text-brand-text mt-2 md:mt-3">
                  {card.tagline || card.title}
                </h3>
                <span className="mt-3 md:mt-6 min-h-11 inline-flex items-center text-sm md:text-base text-brand-text underline underline-offset-4 group-hover:decoration-2">
                  {card.ctaText}
                </span>
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
