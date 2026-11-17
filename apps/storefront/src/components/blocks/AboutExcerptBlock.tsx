import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { AboutExcerptBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface AboutExcerptBlockProps {
  block: AboutExcerptBlockData;
}

export function AboutExcerptBlock({ block }: AboutExcerptBlockProps) {
  const aboutSrc = block.imageUrl || IMAGE_FALLBACKS.about;

  return (
    <section
      data-purpose="about-excerpt-block"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10 lg:gap-14 items-center">
        {/* Left: Atelier photo (7 cols desktop) */}
        <div className="md:col-span-7 -mx-4 md:mx-0 h-[300px] sm:h-[360px] md:h-[480px] md:rounded-md relative overflow-hidden bg-brand-surface">
          <SafeImage
            src={aboutSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.about}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right: Content & CTA (5 cols desktop) */}
        <div className="md:col-span-5 pt-6 md:pt-0 flex flex-col justify-center items-start">
          <span className="text-sm text-brand-text mb-2 block">
            {block.eyebrow}
          </span>
          <h2 className="font-serif text-[22px] md:text-3xl text-brand-text leading-snug mb-4">
            {block.title}
          </h2>
          <p className="text-base text-brand-text leading-relaxed mb-6">
            {block.content}
          </p>
          <a
            href={block.ctaLink}
            className="min-h-11 min-w-11 inline-flex items-center justify-center px-6 py-3 rounded-[4px] border border-brand-primary bg-transparent text-brand-text font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-primary hover:text-brand-white transition"
          >
            {block.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
