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
        {block.eyebrow && <p className="text-sm text-brand-text mb-2 md:mb-3">{block.eyebrow}</p>}
        <h1 className="font-serif text-[26px] leading-[1.2] md:text-4xl lg:text-[44px] lg:leading-[1.15] text-brand-text mb-4 md:mb-6">
          {block.title}
        </h1>
        <p className="text-base md:text-lg text-brand-text leading-relaxed mb-6 md:mb-8 max-w-[34ch]">
          {block.subtitle}
        </p>
        <a
          href={block.ctaLink}
          // Umami reads these attributes itself (FK-39): which hero was clicked.
          data-umami-event={ANALYTICS_EVENTS.heroClick}
          data-umami-event-hero={block.name || block.title}
          className="min-h-12 w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-[4px] bg-brand-primary text-brand-white font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-text transition"
        >
          {block.ctaText}
        </a>
      </div>
    </section>
  );
}
