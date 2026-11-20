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
 * on the left, on the page's own left line, and the photo fills the right of the band, edge to edge
 * and full height.
 */
export function AboutExcerptBlock({ block, tone = "surface" }: AboutExcerptBlockProps) {
  const aboutSrc = block.imageUrl || IMAGE_FALLBACKS.about;

  return (
    <section data-purpose="about-excerpt-block" className={`relative w-screen ml-[calc(50%-50vw)] ${tone === "sage" ? "bg-brand-sage-soft" : "bg-brand-surface"}`}>
      <div className="md:grid md:grid-cols-12 md:items-stretch">
        <div className="relative aspect-square md:aspect-auto md:min-h-[clamp(460px,68vh,620px)] md:col-span-7 md:order-2 overflow-hidden">
          <SafeImage
            src={aboutSrc}
            alt={block.imageAlt}
            fallbackSrc={IMAGE_FALLBACKS.about}
            // Wide photos are cropped to a square or a tall frame: the file must be wider than the frame.
            sizes="(min-width: 768px) 1100px, 180vw"
            className="absolute inset-0 w-full h-full object-cover object-[70%_12%] md:object-[60%_30%]"
          />
        </div>

        {/* Left padding follows the 1200px page container, so the words start on the same line as the rest. */}
        <div className="px-5 pt-8 pb-10 md:py-16 md:pr-12 md:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] md:col-span-5 md:order-1 md:self-center text-brand-text">
          {block.eyebrow && (
            <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium uppercase tracking-[0.2em] mb-4">
              <LeafMark className="text-brand-primary" />
              {block.eyebrow}
            </p>
          )}
          <h2 className="font-serif italic text-[32px] leading-[1.1] md:text-5xl md:leading-[1.06] xl:text-[56px] text-balance mb-5">{block.title}</h2>
          <p className="text-base md:text-lg leading-relaxed max-w-[44ch] mb-7">{block.content}</p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {[
              { text: block.ctaText, link: block.ctaLink },
              { text: block.secondaryCtaText, link: block.secondaryCtaLink },
            ]
              .filter((cta) => cta.text && cta.link)
              .map((cta) => (
                <a
                  key={cta.link}
                  href={cta.link}
                  className="min-h-12 flex-1 min-w-max sm:flex-none inline-flex items-center justify-center px-7 py-3.5 rounded-[4px] bg-brand-primary text-brand-white hover:bg-brand-text font-medium text-xs tracking-[0.15em] uppercase whitespace-nowrap active:scale-[0.98] transition"
                >
                  {cta.text}
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
