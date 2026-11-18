import React from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { SafeImage } from "@/components/ui/SafeImage";
import { HeroBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface HeroBlockProps {
  block: HeroBlockData;
}

/** The portrait leads: edge to edge on a phone, beside the words on a wide screen. No frame. */
export function HeroBlock({ block }: HeroBlockProps) {
  const heroSrc = block.imageUrl || IMAGE_FALLBACKS.hero;
  const secondary = Boolean(block.secondaryCtaText && block.secondaryCtaLink);
  const buttonBase =
    "min-h-12 w-full xl:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-[4px] font-medium text-xs tracking-[0.15em] uppercase whitespace-nowrap transition";

  return (
    <section className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14 md:items-center">
      <div className="relative -mx-4 md:mx-0 md:col-span-7 aspect-[4/5] md:aspect-auto md:h-[600px] md:rounded-md overflow-hidden bg-brand-surface">
        <SafeImage
          src={heroSrc}
          alt={block.imageAlt}
          fallbackSrc={IMAGE_FALLBACKS.hero}
          sizes="(min-width: 1200px) 670px, (min-width: 768px) 58vw, 100vw"
          preload
          className="w-full h-full object-cover object-[center_20%]"
        />
      </div>

      <div className="fk-rise pt-6 md:pt-0 md:col-span-5 flex flex-col items-start">
        {block.eyebrow && (
          <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface text-brand-text text-sm font-medium mb-3 md:mb-4">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-terracotta" />
            {block.eyebrow}
          </p>
        )}
        <h1 className="font-serif text-[32px] leading-[1.15] md:text-4xl lg:text-[44px] xl:text-[52px] lg:leading-[1.12] text-brand-text mb-4 md:mb-6">
          {block.title}
        </h1>
        <p className="text-base md:text-lg text-brand-text leading-relaxed mb-6 md:mb-8 max-w-[34ch]">
          {block.subtitle}
        </p>
        <div className="w-full flex flex-col xl:flex-row gap-3">
          <a
            href={block.ctaLink}
            // Umami reads these attributes itself (FK-39): which hero, and which of its buttons.
            data-umami-event={ANALYTICS_EVENTS.heroClick}
            data-umami-event-hero={block.name || block.title}
            data-umami-event-link={block.ctaLink}
            className={`${buttonBase} bg-brand-primary text-brand-white hover:bg-brand-text`}
          >
            {block.ctaText}
          </a>
          {secondary && (
            <a
              href={block.secondaryCtaLink}
              data-umami-event={ANALYTICS_EVENTS.heroClick}
              data-umami-event-hero={block.name || block.title}
              data-umami-event-link={block.secondaryCtaLink}
              className={`${buttonBase} border border-brand-primary text-brand-text hover:bg-brand-primary hover:text-brand-white`}
            >
              {block.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
