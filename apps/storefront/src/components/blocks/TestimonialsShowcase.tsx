"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
 * One customer at a time, large: her photo, and her words set across its edge. The first names
 * are the buttons that change the testimonial; nothing moves on its own. No stars: there is no
 * rating behind these words.
 */
export function TestimonialsShowcase({ title, items }: { title: string; items: ShownTestimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // The words only move when the customer changes the testimonial, never when the page loads.
  const [hasChanged, setHasChanged] = useState(false);
  const active = items[activeIndex] ?? items[0];
  const firstName = (author: string) => author.split(",")[0].trim();

  return (
    <section className="md:grid md:grid-cols-12 md:items-center" data-purpose="testimonials-block">
      <div className="relative -mx-4 md:mx-0 md:col-span-6 aspect-[4/5] md:aspect-auto md:h-[580px] md:rounded-md overflow-hidden bg-brand-surface">
        {active.photoUrl && (
          <SafeImage
            key={active.photoUrl}
            src={active.photoUrl}
            alt=""
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover object-top"
          />
        )}
      </div>

      {/* The words overlap the photo: from below on a phone, from the side on a wide screen. */}
      <div className="relative -mt-16 md:mt-0 md:col-span-6 md:-ml-16">
        <div className="bg-brand-text text-brand-bg rounded-md px-5 py-6 md:px-10 md:py-10">
          <h2 className="text-sm text-brand-bg mb-3 md:mb-5">{title}</h2>
          <figure key={activeIndex} aria-live="polite" className={hasChanged ? "fk-rise" : undefined}>
            <blockquote className="font-serif text-[26px] leading-[1.2] md:text-[40px] md:leading-[1.15]">
              {/* Non-breaking spaces: a guillemet never ends up alone on a line. */}
              {`«\u00a0${active.quote}\u00a0»`}
            </blockquote>
            <figcaption className="mt-5 md:mt-7 text-base leading-snug">
              <span className="font-medium block">{active.author}</span>
              {active.occasion}
            </figcaption>
            {active.product && (
              <Link
                href={`/produit/${active.product.handle}`}
                className="mt-4 min-h-11 inline-flex items-center gap-2 text-sm text-brand-bg underline underline-offset-4"
              >
                {messages.home.testimonialSeeOutfit(active.product.title)}
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            )}
          </figure>
        </div>

        {items.length > 1 && (
          <div role="group" aria-label={messages.home.testimonialsChoose} className="flex flex-wrap gap-2 mt-4 md:pl-16">
            {items.map((item, index) => (
              <button
                key={`${item.author}-${index}`}
                type="button"
                aria-pressed={index === activeIndex}
                onClick={() => {
                  setActiveIndex(index);
                  setHasChanged(true);
                }}
                className={`min-h-11 px-5 rounded-full border text-sm cursor-pointer transition-colors ${
                  index === activeIndex
                    ? "bg-brand-primary border-brand-primary text-brand-white"
                    : "border-brand-text/40 text-brand-text hover:border-brand-primary"
                }`}
              >
                {firstName(item.author)}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
