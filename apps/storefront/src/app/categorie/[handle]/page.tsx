import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFallback } from "@/components/layout/PageFallback";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { FilterChips } from "@/components/catalog/FilterChips";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ReassuranceBlock } from "@/components/blocks/ReassuranceBlock";
import { CategoryHandle } from "@/lib/commerce/types";

interface CategoryPageProps {
  params: Promise<{ handle: string }> | { handle: string };
  searchParams?: Promise<{ age?: string; occasion?: string }> | { age?: string; occasion?: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const category = await commerceService.getCategoryByHandle(resolvedParams.handle);

  if (!category) {
    return {
      title: messages.meta.categoryNotFoundTitle,
      description: messages.meta.defaultDescription,
    };
  }

  return {
    title: `${category.name} | Fini Kura`,
    description: category.description,
    openGraph: {
      title: `${category.name} — Fini Kura Bamako`,
      description: category.description,
    },
  };
}

async function CategoryContent({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = (await Promise.resolve(searchParams)) || {};

  const handle = resolvedParams.handle as CategoryHandle;
  const age = resolvedSearchParams.age;
  const occasion = resolvedSearchParams.occasion;

  const [category, products, settings] = await Promise.all([
    commerceService.getCategoryByHandle(handle),
    commerceService.getProducts({
      categoryHandle: handle,
      age: age || undefined,
      occasion: occasion || undefined,
    }),
    contentService.getGlobalSettings(),
  ]);

  // Unknown handle: the not-found page of the charter, with noindex.
  // Streaming has started, so the status stays 200 (Next 16 Cache Components);
  // a real 404 would need a proxy check, see FK-13 in BACKLOG.md.
  if (!category) notFound();

  return (
    <div className="pt-3 pb-4 md:py-8 space-y-4 md:space-y-8" data-purpose="catalog-page">
      {/* Breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center space-x-2 text-xs text-brand-text"
      >
        <Link href="/" className="hover:underline underline-offset-4 transition-colors">
          {messages.catalog.homeBreadcrumb}
        </Link>
        <span>/</span>
        <span className="text-brand-text font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-serif text-3xl md:text-[40px] uppercase font-normal text-brand-text tracking-[0.08em] leading-tight">
          {category.name}
        </h1>
        <p className="text-sm md:text-base text-brand-text font-light leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Filter Chips (Ages & Occasions) */}
      <FilterChips
        categoryHandle={handle}
        selectedAge={age}
        selectedOccasion={occasion}
      />

      {/* Product Count Indicator */}
      <div className="text-center pb-2">
        <span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.2em] text-brand-text">
          {messages.catalog.creationsCount(products.length)}
        </span>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-brand-surface/30 border border-brand-surface p-8">
          <p className="text-base text-brand-text font-serif mb-3">
            {messages.catalog.noProductsFound}
          </p>
          <Link
            href={`/categorie/${handle}`}
            className="min-h-11 min-w-11 inline-flex items-center justify-center px-5 py-2 rounded-[4px] border border-brand-primary text-brand-text text-xs font-medium uppercase tracking-[0.15em] hover:bg-brand-primary hover:text-brand-white transition"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showCategoryBadge={false}
            />
          ))}
        </div>
      )}

      {/* Reassurance Strip */}
      <div className="pt-8 md:pt-14">
        <ReassuranceBlock items={settings.reassuranceItems} />
      </div>
    </div>
  );
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense fallback={<PageFallback />}>
      <CategoryContent {...props} />
    </Suspense>
  );
}
