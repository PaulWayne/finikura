"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
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
 * A fan of portraits: the customer in front is large, her neighbours stand back on each side,
 * turned a little. Her words are read below. The arrows, or a touch on a neighbour, bring another
 * one forward; nothing moves on its own. No stars: there is no rating behind these words.
 */
export function TestimonialsShowcase({ title, items }: { title: string; items: ShownTestimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;
  const active = items[activeIndex] ?? items[0];
  const go = (step: number) => setActiveIndex((index) => (index + step + count) % count);
  // Place of a card around the one in front: -1 on its left, 0 in front, 1 on its right.
  const placeOf = (index: number) => {
    const half = Math.floor(count / 2);
    return ((index - activeIndex + count + half) % count) - half;
  };

  return (
    <section className="-mx-4 md:mx-0 overflow-hidden text-center" data-purpose="testimonials-block">
      <h2 className="font-serif text-[30px] md:text-5xl text-brand-text leading-tight px-4 mb-5 md:mb-8">{title}</h2>

      <ul className="relative mx-auto h-[272px] md:h-[420px] [perspective:1200px]">
        {items.map((item, index) => {
          const place = placeOf(index);
          const isFront = place === 0;
          return (
            <li
              key={`${item.author}-${index}`}
              // Shifted by a share of its own width, so the neighbours show on any screen.
              style={{
                transform: `translateX(calc(-50% + ${place * 74}%)) scale(${isFront ? 1 : 0.8}) rotateY(${place * -14}deg)`,
                zIndex: isFront ? 2 : 1,
              }}
              className="absolute top-0 left-1/2 w-[204px] md:w-[315px] h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
            >
              <button
                type="button"
                // The neighbours are buttons that bring themselves forward; the front one has nothing to do.
                tabIndex={isFront ? -1 : 0}
                aria-hidden={isFront}
                aria-label={messages.home.testimonialShow(item.author)}
                onClick={() => setActiveIndex(index)}
                className={`relative block w-full h-full rounded-xl overflow-hidden bg-brand-surface text-left ${
                  isFront ? "cursor-default shadow-lg" : "cursor-pointer"
                }`}
              >
                {item.photoUrl && (
                  <SafeImage
                    src={item.photoUrl}
                    alt=""
                    fallbackSrc={IMAGE_FALLBACKS.product}
                    sizes="(min-width: 768px) 315px, 204px"
                    className="w-full h-full object-cover object-top"
                  />
                )}
                <span className="absolute inset-x-2 bottom-2 rounded-lg bg-brand-bg px-3 py-2">
                  <span className="block text-sm font-medium text-brand-text leading-tight">{item.author}</span>
                  {item.occasion && <span className="block text-xs text-brand-text leading-tight mt-0.5">{item.occasion}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {count > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            aria-label={messages.home.testimonialPrevious}
            onClick={() => go(-1)}
            className="w-11 h-11 rounded-full border border-brand-text/40 text-brand-text flex items-center justify-center cursor-pointer hover:border-brand-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={messages.home.testimonialNext}
            onClick={() => go(1)}
            className="w-14 h-11 rounded-full bg-brand-primary text-brand-white flex items-center justify-center cursor-pointer hover:bg-brand-text transition-colors"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      <figure aria-live="polite" className="px-4 mt-4 md:mt-6">
        <blockquote className="font-serif text-xl md:text-3xl leading-snug text-brand-text max-w-[32ch] mx-auto">
          {/* Non-breaking spaces: a guillemet never ends up alone on a line. */}
          {`« ${active.quote} »`}
        </blockquote>
        <figcaption className="sr-only">{active.author}</figcaption>
        {active.product && (
          <Link
            href={`/produit/${active.product.handle}`}
            className="mt-2 min-h-11 inline-flex items-center gap-2 text-sm text-brand-text underline underline-offset-4"
          >
            {messages.home.testimonialSeeOutfit(active.product.title)}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
        )}
      </figure>
    </section>
  );
}
