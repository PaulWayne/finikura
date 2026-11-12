import React from "react";
import { ValuesBlockData } from "@/lib/content/types";

export function ValuesBlock({ block }: { block: ValuesBlockData }) {
  if (block.items.length === 0) return null;
  return (
    <section className="bg-brand-surface py-12 md:py-16" data-purpose="values-block">
      <div className="max-w-[1100px] mx-auto px-5">
        {block.title && (
          <h2 className="font-serif text-2xl md:text-3xl text-brand-text text-center mb-10">{block.title}</h2>
        )}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {block.items.map((item) => (
            <li key={item.title} className="text-center">
              <h3 className="font-serif text-xl text-brand-text mb-2">{item.title}</h3>
              <p className="text-base leading-relaxed text-brand-text">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
