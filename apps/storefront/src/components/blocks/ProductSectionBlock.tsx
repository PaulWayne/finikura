import React from "react";
import { ProductSectionBlockData } from "@/lib/content/types";
import { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/catalog/ProductCard";

interface ProductSectionBlockProps {
  block: ProductSectionBlockData;
  products?: Product[];
}

export function ProductSectionBlock({
  block,
  products = [],
}: ProductSectionBlockProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section data-purpose="product-section">
      {/* Section Header */}
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[30px] md:text-5xl text-brand-text leading-tight">{block.title}</h2>
        {block.eyebrow && <p className="text-sm md:text-base text-brand-text mt-1">{block.eyebrow}</p>}
      </div>

      {/* A swipeable rail on a phone (the next card peeks), 4 columns on desktop. */}
      <div className="-mx-4 px-4 md:mx-0 md:px-0 flex lg:grid lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 no-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-[72%] sm:w-[44%] lg:w-auto">
            <ProductCard product={product} showCategoryBadge={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
