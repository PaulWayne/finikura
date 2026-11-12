import React from "react";
import { FaqBlockData } from "@/lib/content/types";

// Native <details>: accessible and works without JavaScript.
export function FaqBlock({ block }: { block: FaqBlockData }) {
  if (block.items.length === 0) return null;
  return (
    <section className="max-w-[720px] mx-auto px-5" data-purpose="faq-block">
      {block.title && <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-6">{block.title}</h2>}
      <div className="divide-y divide-brand-text/15 border-y border-brand-text/15">
        {block.items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="min-h-11 flex items-center justify-between gap-4 cursor-pointer list-none text-base font-medium text-brand-text focus-visible:outline-2 focus-visible:outline-brand-primary">
              {item.question}
              <span aria-hidden className="text-brand-text transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="pt-3 text-base leading-relaxed text-brand-text">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
