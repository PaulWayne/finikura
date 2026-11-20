import { LeafMark } from "@/components/ui/leaf-mark";
import React from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { SafeImage } from "@/components/ui/SafeImage";
import { HeroBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface HeroBlockProps {
  block: HeroBlockData;
}

/** Editorial cover: the photo fills the first screen edge to edge, the words sit on it. */
export function HeroBlock({ block }: HeroBlockProps) {
  const heroSrc = block.imageUrl || IMAGE_FALLBACKS.hero;
  const secondary = Boolean(block.secondaryCtaText && block.secondaryCtaLink);
  const buttonBase =
    "min-h-12 flex-1 sm:flex-none inline-flex items-center justify-center px-2 sm:px-7 py-3.5 rounded-[4px] font-medium text-[11px] sm:text-xs tracking-[0.06em] sm:tracking-[0.15em] uppercase whitespace-nowrap transition duration-200 active:scale-[0.98]";

  return (
    <section className="relative w-screen ml-[calc(50%-50vw)] -mt-2 md:-mt-8 h-[clamp(540px,72svh,600px)] md:h-[clamp(480px,62vh,600px)] overflow-hidden bg-brand-surface">
      <SafeImage
        src={heroSrc}
        alt={block.imageAlt}
        fallbackSrc={IMAGE_FALLBACKS.hero}
        sizes="100vw"
        preload
        className="fk-settle absolute inset-0 w-full h-full object-cover object-[54%_center] md:object-[center_30%]"
      />
      {/* Warm brown veil from the bottom, never black: the white words stay above AA. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-text/90 via-brand-text/35 to-transparent xl:bg-gradient-to-r xl:from-brand-text/80 xl:via-brand-text/30"
      />

      <div className="relative h-full max-w-[1200px] mx-auto px-5 xl:px-6 pb-6 xl:pb-0 flex flex-col justify-end xl:justify-center">
        <div className="fk-rise-late max-w-[560px] xl:max-w-[400px] text-brand-white">
          {block.eyebrow && (
            <p className="hidden xl:inline-flex items-center gap-2 text-[11px] xl:text-xs font-medium uppercase tracking-[0.2em] mb-4 xl:mb-6">
              <LeafMark className="text-brand-white/90" />
              {block.eyebrow}
            </p>
          )}
          <h1 className="font-serif italic text-[34px] leading-[1.08] sm:text-5xl xl:text-[52px] xl:leading-[1.04] mb-3 xl:mb-6">
            {block.title}
          </h1>
          <p className="text-[15px] xl:text-base leading-snug xl:leading-relaxed mb-5 xl:mb-8 max-w-[38ch] text-brand-white/95">
            {block.subtitle}
          </p>
          <div className="flex gap-2.5 sm:gap-3">
            <a
              href={block.ctaLink}
              // Umami reads these attributes itself (FK-39): which hero, and which of its buttons.
              data-umami-event={ANALYTICS_EVENTS.heroClick}
              data-umami-event-hero={block.name || block.title}
              data-umami-event-link={block.ctaLink}
              className={`${buttonBase} bg-brand-white text-brand-text hover:bg-brand-bg`}
            >
              {block.ctaText}
            </a>
            {secondary && (
              <a
                href={block.secondaryCtaLink}
                data-umami-event={ANALYTICS_EVENTS.heroClick}
                data-umami-event-hero={block.name || block.title}
                data-umami-event-link={block.secondaryCtaLink}
                className={`${buttonBase} border border-brand-white/80 text-brand-white hover:bg-brand-white hover:text-brand-text`}
              >
                {block.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
