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
      className="my-10 md:my-16 rounded-2xl overflow-hidden bg-[#EADCCC]/50 border border-[#EADCCC] shadow-xs"
      data-purpose="about-excerpt-block"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-center">
        {/* Left: Atelier photo (7 cols desktop) */}
        <div className="md:col-span-7 h-[280px] sm:h-[360px] md:h-[460px] relative overflow-hidden bg-[#EADCCC]">
          <SafeImage
            src={aboutSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.about}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right: Content & CTA (5 cols desktop) */}
        <div className="md:col-span-5 p-6 sm:p-8 md:p-12 flex flex-col justify-center items-start">
          <span className="text-xs uppercase tracking-[0.2em] text-[#CA7154] font-medium mb-3 block">
            {block.eyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl uppercase font-normal text-[#5E5245] leading-snug tracking-[0.08em] mb-5">
            {block.title}
          </h2>
          <p className="text-sm md:text-base text-[#5E5245] leading-relaxed font-light mb-8">
            {block.content}
          </p>
          <a
            href={block.ctaLink}
            className="min-touch-btn inline-flex items-center justify-center px-6 py-3 rounded-[4px] border border-[#8A7058] bg-transparent text-[#5E5245] font-medium text-xs tracking-[0.15em] uppercase hover:bg-[#8A7058] hover:text-white transition shadow-xs"
          >
            {block.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
