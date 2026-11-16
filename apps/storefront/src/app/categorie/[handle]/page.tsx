import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFallback } from "@/components/layout/PageFallback";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { FilterChips } from "@/components/catalog/FilterChips";
import { ReassuranceBlock } from "@/components/blocks/ReassuranceBlock";
import { CategoryHandle } from "@/lib/commerce/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { ageOptions, CATALOG_PAGE_SIZE, shownCount } from "@/lib/catalog-filters";
import { ProductGrid } from "@/components/catalog/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ handle: string }> | { handle: string };
  searchParams?: Promise<{ age?: string; occasion?: string; voir?: string }> | { age?: string; occasion?: string; voir?: string };
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
  const voir = resolvedSearchParams.voir;

  const [category, allProducts, products, settings, banner] = await Promise.all([
    commerceService.getCategoryByHandle(handle),
    // Unfiltered list (cached): the age filters stay the same whatever is selected.
    commerceService.getProducts({ categoryHandle: handle }),
    commerceService.getProducts({
      categoryHandle: handle,
      age: age || undefined,
      occasion: occasion || undefined,
    }),
    contentService.getGlobalSettings(),
    contentService.getCategoryBanner(handle),
  ]);

  // Unknown handle: the not-found page of the charter, with noindex.
  // Streaming has started, so the status stays 200 (Next 16 Cache Components);
  // a real 404 would need a proxy check, see FK-13 in BACKLOG.md.
  if (!category) notFound();

  // FK-43: the first products only; the grid loads the next ones while scrolling.
  const shown = shownCount(voir, products.length);
  const moreParams = new URLSearchParams();
  if (age) moreParams.set("age", age);
  if (occasion) moreParams.set("occasion", occasion);
  moreParams.set("voir", String(shown + CATALOG_PAGE_SIZE));

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

      {/* Category header: compact Strapi banner (FK-40), products stay above the fold on mobile */}
      {banner ? (
        <div className="flex items-center gap-3.5 md:gap-6">
          {banner.imageUrl && (
            <div className="relative w-20 h-24 md:w-28 md:h-36 shrink-0 rounded-md overflow-hidden bg-brand-surface">
              <SafeImage
                src={banner.imageUrl}
                alt={banner.imageAlt}
                fallbackSrc={IMAGE_FALLBACKS.product}
                sizes="(min-width: 768px) 112px, 80px"
                preload
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 space-y-1">
            <h1 className="font-serif text-[28px] md:text-5xl normal-case font-normal text-brand-text tracking-normal leading-tight">
              {category.name}
            </h1>
            <p className="text-sm md:text-base text-brand-text leading-snug">{banner.text}</p>
          </div>
        </div>
      ) : (
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-serif text-[28px] md:text-5xl normal-case font-normal text-brand-text tracking-normal leading-tight">
          {category.name}
        </h1>
        <p className="text-sm md:text-base text-brand-text font-light leading-relaxed">
          {category.description}
        </p>
      </div>
      )}

      {/* Filter Chips (Ages & Occasions) */}
      <FilterChips
        categoryHandle={handle}
        ages={ageOptions(allProducts)}
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
            {messages.catalog.resetFilters}
          </Link>
        </div>
      ) : (
        <ProductGrid
          key={`${age ?? ""}-${occasion ?? ""}`}
          categoryHandle={handle}
          age={age}
          occasion={occasion}
          initialProducts={products.slice(0, shown)}
          total={products.length}
          moreHref={`/categorie/${handle}?${moreParams.toString()}`}
        />
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
