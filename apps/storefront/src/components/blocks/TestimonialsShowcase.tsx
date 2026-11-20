import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { messages } from "@/messages/fr";

export interface ShownTestimonial {
  quote: string;
  author: string;
  occasion?: string;
  photoUrl: string;
  product: { handle: string; title: string } | null;
}

/**
 * The customers' words, flat and all readable at once: one card each, her photo, her words, her
 * name and the outfit worn. On a phone the cards slide under the finger, like the outfits.
 * No stars: there is no rating behind these words.
 */
export function TestimonialsShowcase({ title, items }: { title: string; items: ShownTestimonial[] }) {
  return (
    <section data-purpose="testimonials-block">
      <h2 className="font-serif text-[30px] md:text-5xl text-brand-text leading-tight mb-5 md:mb-8">{title}</h2>

      <ul className="-mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar">
        {items.map((item, index) => (
          <li
            key={`${item.author}-${index}`}
            className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto flex flex-col rounded-md overflow-hidden bg-brand-white border border-border"
          >
            {item.photoUrl && (
              <div className="relative aspect-[4/5] bg-brand-surface">
                <SafeImage
                  src={item.photoUrl}
                  alt=""
                  fallbackSrc={IMAGE_FALLBACKS.product}
                  sizes="(min-width: 1200px) 390px, (min-width: 768px) 33vw, 78vw"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            )}
            <figure className="flex flex-1 flex-col p-4 md:p-6">
              <blockquote className="font-serif text-lg md:text-xl leading-snug text-brand-text">
                {/* Non-breaking spaces: a guillemet never ends up alone on a line. */}
                {`« ${item.quote} »`}
              </blockquote>
              <figcaption className="mt-auto pt-4 text-sm text-brand-text">
                <span className="block font-medium">{item.author}</span>
                {item.occasion && <span className="block text-brand-muted">{item.occasion}</span>}
              </figcaption>
              {item.product && (
                <Link
                  href={`/produit/${item.product.handle}`}
                  className="mt-1 min-h-11 inline-flex items-center gap-2 text-sm text-brand-primary underline underline-offset-4"
                >
                  {messages.home.testimonialSeeOutfit(item.product.title)}
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
