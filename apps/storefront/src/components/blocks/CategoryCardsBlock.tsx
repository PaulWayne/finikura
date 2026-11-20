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
 * The main door to the catalogue: one tall photo panel per category, the words and the button
 * on the photo. A row of round shortcuts below opens the categories already filtered by occasion.
 */
export function CategoryCardsBlock({ block, occasionShortcuts = [] }: CategoryCardsBlockProps) {
  const titles = new Map(block.cards.map((card) => [card.categoryHandle, card.title]));

  return (
    <section>
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[30px] md:text-5xl text-brand-text leading-tight">{block.title}</h2>
        {block.subtitle && <p className="text-sm md:text-base text-brand-text mt-1">{block.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {block.cards.map((card) => {
          const fallback = card.categoryHandle === "garcons" ? IMAGE_FALLBACKS.garcons : IMAGE_FALLBACKS.filles;
          return (
            <Link
              key={card.categoryHandle}
              href={`/categorie/${card.categoryHandle}`}
              className="fk-zoom group relative block aspect-[4/5] md:aspect-[5/6] rounded-md overflow-hidden bg-brand-surface text-brand-white"
            >
              <SafeImage
                src={card.imageUrl || fallback}
                alt={card.imageAlt}
                fallbackSrc={fallback}
                sizes="(min-width: 1200px) 590px, (min-width: 768px) 50vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
              />
              {/* Warm brown veil under the words, never black. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--brand-text)_86%,transparent)_0%,color-mix(in_srgb,var(--brand-text)_55%,transparent)_28%,transparent_52%)]"
              />
              <span className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8 flex flex-col items-start">
                <span className="text-[11px] md:text-xs uppercase tracking-[0.18em] font-medium">
                  {card.title} · {card.ageRange}
                </span>
                <span className="font-serif text-[26px] md:text-4xl leading-[1.12] mt-1.5 md:mt-2 text-balance">
                  {card.tagline || card.title}
                </span>
                <span className="mt-4 md:mt-5 min-h-12 inline-flex items-center justify-center px-7 rounded-[4px] bg-brand-white text-brand-text group-hover:bg-brand-bg font-medium text-xs tracking-[0.15em] uppercase transition group-active:scale-[0.98]">
                  {card.ctaText}
                </span>
              </span>
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
                      // Twice the circle: sharp on a phone screen.
                      sizes="192px"
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
