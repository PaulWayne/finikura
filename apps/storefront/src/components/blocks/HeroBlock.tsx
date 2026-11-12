import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { HeroBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface HeroBlockProps {
  block: HeroBlockData;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const heroSrc = block.imageUrl || IMAGE_FALLBACKS.hero;

  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-brand-surface border border-brand-surface shadow-xs">
      {/* Desktop 12-column layout */}
      <div className="hidden md:grid grid-cols-12 items-center min-h-[500px]">
        <div className="col-span-7 h-[500px] relative overflow-hidden bg-brand-surface">
          <SafeImage
            src={heroSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.hero}
            className="w-full h-full object-cover object-[center_20%]"
          />
        </div>
        <div className="col-span-5 p-10 lg:p-14 z-10 flex flex-col justify-center items-start">
          <span className="text-xs uppercase tracking-[0.15em] text-brand-terracotta font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta" />
            {block.eyebrow}
          </span>
          <h1 className="font-serif text-3xl lg:text-[42px] uppercase font-normal text-brand-text leading-tight tracking-[0.08em] mb-6">
            {block.title}
          </h1>
          <p className="text-base text-brand-text mb-8 leading-relaxed font-light">
            {block.subtitle}
          </p>
          <a
            href={block.ctaLink}
            className="min-touch-btn inline-flex items-center justify-center px-8 py-3.5 rounded-[4px] bg-brand-primary text-brand-white font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-text transition shadow-xs"
          >
            {block.ctaText}
          </a>
        </div>
      </div>

      {/* Mobile stacked layout */}
      <div className="block md:hidden bg-brand-bg">
        <div className="relative w-full aspect-[4/3] bg-brand-surface overflow-hidden">
          <SafeImage
            src={heroSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.hero}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="p-6 bg-brand-bg flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold mb-2 flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta" />
            {block.eyebrow}
          </span>
          <h1 className="font-serif text-[24px] uppercase font-normal leading-snug text-brand-text mb-4 tracking-[0.08em]">
            {block.title}
          </h1>
          <p className="text-sm text-brand-text mb-6 font-light leading-relaxed">
            {block.subtitle}
          </p>
          <a
            href={block.ctaLink}
            className="min-touch-btn w-full inline-flex items-center justify-center px-6 py-3 rounded-[4px] bg-brand-primary text-brand-white font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-text transition shadow-xs"
          >
            {block.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
