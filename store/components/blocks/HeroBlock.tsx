import React from "react";
import { HeroBlockData } from "@/src/lib/content/types";
import { IMAGE_FALLBACKS, handleImgError } from "@/src/lib/images";

interface HeroBlockProps {
  block: HeroBlockData;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const heroSrc = block.imageUrl || IMAGE_FALLBACKS.hero;

  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-[#EADCCC] border border-[#EADCCC] shadow-xs">
      {/* Desktop 12-column layout */}
      <div className="hidden md:grid grid-cols-12 items-center min-h-[500px]">
        <div className="col-span-7 h-[500px] relative overflow-hidden bg-[#EADCCC]">
          <img
            src={heroSrc}
            alt={block.imageAlt}
            onError={handleImgError(IMAGE_FALLBACKS.hero)}
            className="w-full h-full object-cover object-[center_20%]"
          />
        </div>
        <div className="col-span-5 p-10 lg:p-14 z-10 flex flex-col justify-center items-start">
          <span className="text-xs uppercase tracking-[0.15em] text-[#CA7154] font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CA7154]" />
            {block.eyebrow}
          </span>
          <h1 className="font-serif text-3xl lg:text-[42px] uppercase font-normal text-[#5E5245] leading-tight tracking-[0.08em] mb-6">
            {block.title}
          </h1>
          <p className="text-base text-[#5E5245] mb-8 leading-relaxed font-light">
            {block.subtitle}
          </p>
          <a
            href={block.ctaLink}
            className="min-touch-btn inline-flex items-center justify-center px-8 py-3.5 rounded-[4px] bg-[#8A7058] text-white font-medium text-xs tracking-[0.15em] uppercase hover:bg-[#725a43] transition shadow-xs"
          >
            {block.ctaText}
          </a>
        </div>
      </div>

      {/* Mobile stacked layout */}
      <div className="block md:hidden bg-[#FDF7F2]">
        <div className="relative w-full aspect-[4/3] bg-[#EADCCC] overflow-hidden">
          <img
            src={heroSrc}
            alt={block.imageAlt}
            onError={handleImgError(IMAGE_FALLBACKS.hero)}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="p-6 bg-[#FDF7F2] flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8A7058] font-semibold mb-2 flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CA7154]" />
            {block.eyebrow}
          </span>
          <h1 className="font-serif text-[24px] uppercase font-normal leading-snug text-[#5E5245] mb-4 tracking-[0.08em]">
            {block.title}
          </h1>
          <p className="text-sm text-[#5E5245] mb-6 font-light leading-relaxed">
            {block.subtitle}
          </p>
          <a
            href={block.ctaLink}
            className="min-touch-btn w-full inline-flex items-center justify-center px-6 py-3 rounded-[4px] bg-[#8A7058] text-white font-medium text-xs tracking-[0.15em] uppercase hover:bg-[#725a43] transition shadow-xs"
          >
            {block.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
