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
    <section className="py-6 md:py-10" data-purpose="product-section">
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-brand-text font-medium block mb-2">
          {block.eyebrow}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl uppercase font-normal text-brand-text tracking-[0.1em]">
          {block.title}
        </h2>
        <div className="w-12 h-0.5 bg-brand-terracotta mt-3" />
      </div>

      {/* Grid: 2 columns on mobile (390px), 4 columns on desktop (1440px) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-6">
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
