import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { TestimonialsBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

/**
 * Words of real customers (FK-34), typed in Strapi. No stars: there is no rating behind them.
 * On a phone the quotes slide sideways, the next one showing its edge; on a wide screen they
 * sit side by side. Without any testimonial the section is not rendered.
 */
export function TestimonialsBlock({ block }: { block: TestimonialsBlockData }) {
  if (block.items.length === 0) return null;

  return (
    <section className="-mx-4 md:mx-0 bg-brand-surface/50 md:rounded-md py-10 md:py-14" data-purpose="testimonials-block">
      <h2 className="font-serif text-[26px] md:text-4xl text-brand-text leading-tight px-4 md:px-12 mb-6 md:mb-10">
        {block.title}
      </h2>

      <ul className="flex md:grid md:grid-cols-3 gap-4 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-pl-4 no-scrollbar px-4 md:px-12">
        {block.items.map((item) => (
          <li
            key={`${item.author}-${item.quote.slice(0, 24)}`}
            className="snap-start shrink-0 w-[82%] md:w-auto flex flex-col border-t-2 border-brand-terracotta pt-5"
          >
            <figure className="flex flex-col flex-1">
              <blockquote className="font-serif text-xl md:text-[22px] leading-snug text-brand-text flex-1">
                {/* Non-breaking spaces: a guillemet never ends up alone on a line. */}
                {`«\u00a0${item.quote}\u00a0»`}
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-5">
                {item.photoUrl && (
                  <span className="relative block w-11 h-11 rounded-full overflow-hidden bg-brand-surface shrink-0">
                    <SafeImage
                      src={item.photoUrl}
                      alt=""
                      fallbackSrc={IMAGE_FALLBACKS.product}
                      sizes="44px"
                      className="w-full h-full object-cover"
                    />
                  </span>
                )}
                <span className="text-sm text-brand-text leading-snug">
                  <span className="font-medium block">{item.author}</span>
                  {item.occasion}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
