import { LeafMark } from "@/components/ui/leaf-mark";
import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { AboutExcerptBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

interface AboutExcerptBlockProps {
  block: AboutExcerptBlockData;
  /** "sage" turns the band pale sage: the one brand band of the page. */
  tone?: "surface" | "sage";
}

/**
 * A story band. On a phone the photo stands square above the words; from a tablet up the words sit
 * on the left and the photo fills the right, tall, so the clothes read whole.
 */
export function AboutExcerptBlock({ block, tone = "surface" }: AboutExcerptBlockProps) {
  const aboutSrc = block.imageUrl || IMAGE_FALLBACKS.about;

  return (
    <section data-purpose="about-excerpt-block" className={`relative w-screen ml-[calc(50%-50vw)] ${tone === "sage" ? "bg-brand-sage-soft" : "bg-brand-surface"}`}>
      <div className="md:max-w-[1200px] md:mx-auto md:px-6 md:py-16 md:grid md:grid-cols-12 md:gap-12 md:items-center">
        <div className="fk-zoom relative aspect-square md:aspect-auto md:h-[clamp(460px,68vh,620px)] md:col-span-7 md:order-2 overflow-hidden md:rounded-md">
          <SafeImage
            src={aboutSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.about}
            sizes="(min-width: 768px) 700px, 100vw"
            className="absolute inset-0 w-full h-full object-cover object-[70%_12%] md:object-[60%_20%]"
          />
        </div>

        <div className="px-5 pt-8 pb-10 md:p-0 md:col-span-5 md:order-1 text-brand-text">
          {block.eyebrow && (
            <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium uppercase tracking-[0.2em] mb-4">
              <LeafMark className="text-brand-primary" />
              {block.eyebrow}
            </p>
          )}
          <h2 className="font-serif italic text-[32px] leading-[1.1] md:text-5xl md:leading-[1.06] mb-5">{block.title}</h2>
          <p className="text-base md:text-lg leading-relaxed max-w-[44ch] mb-7">{block.content}</p>
          <a
            href={block.ctaLink}
            className="min-h-12 w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-[4px] bg-brand-primary text-brand-white hover:bg-brand-text font-medium text-xs tracking-[0.15em] uppercase active:scale-[0.98] transition"
          >
            {block.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
