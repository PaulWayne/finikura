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
        <h2 className="font-serif text-[22px] md:text-3xl text-brand-text leading-snug">{block.title}</h2>
        {block.eyebrow && <p className="text-sm md:text-base text-brand-text mt-1">{block.eyebrow}</p>}
      </div>

      {/* Grid: 2 columns on mobile (390px), 4 columns on desktop (1440px) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCategoryBadge={true}
          />
        ))}
      </div>
    </section>
  );
}
