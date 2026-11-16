import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";

interface ProductRecommendationsProps {
  products: Product[];
  categoryHandle: string;
}

/** Other outfits of the same category, with the same card as the catalogue. */
export function ProductRecommendations({ products, categoryHandle }: ProductRecommendationsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section aria-label={messages.product.recommendationsTitle} className="pt-8 md:pt-12 border-t border-brand-surface">
      <div className="flex flex-wrap items-end justify-between gap-x-3 mb-4 md:mb-8">
        <h2 className="font-serif normal-case tracking-normal text-2xl md:text-3xl text-brand-text">
          {messages.product.recommendationsTitle}
        </h2>
        <Link
          href={`/categorie/${categoryHandle}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-brand-text underline underline-offset-4 shrink-0"
        >
          <span>{messages.product.discoverWardrobe}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
