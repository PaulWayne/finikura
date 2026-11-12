import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFallback } from "@/components/layout/PageFallback";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductBuySection } from "@/components/product/ProductBuySection";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";

interface ProductPageProps {
  params: Promise<{ handle: string }> | { handle: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const product = await commerceService.getProductByHandle(resolvedParams.handle);

  if (!product) {
    return {
      title: messages.meta.productNotFoundTitle,
      description: messages.meta.defaultDescription,
    };
  }

  return {
    title: `${product.title} | Fini Kura Bamako`,
    description: product.description,
    openGraph: {
      title: `${product.title} — Fini Kura`,
      description: product.description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

async function ProductContent({ params }: ProductPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams.handle;

  const product = await commerceService.getProductByHandle(handle);

  // Unknown handle: the not-found page of the charter, with noindex.
  // Streaming has started, so the status stays 200 (Next 16 Cache Components);
  // a real 404 would need a proxy check, see FK-13 in BACKLOG.md.
  if (!product) notFound();

  // Fetch size guide and sibling products for recommendations
  const [sizeGuide, allCategoryProducts, settings] = await Promise.all([
    contentService.getSizeGuide(product.categoryHandle),
    commerceService.getProducts({ categoryHandle: product.categoryHandle }),
    contentService.getGlobalSettings(),
  ]);

  const categoryName =
    product.categoryHandle === "filles"
      ? messages.header.navGirls
      : messages.header.navBoys;

  const categoryPath = `/categorie/${product.categoryHandle}`;

  // Filter recommendations (sibling products)
  const recommendations = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="py-4 md:py-8 space-y-8" data-purpose="product-page">
      {/* Breadcrumbs */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center space-x-2 text-xs text-[#5E5245]/70 truncate"
      >
        <Link href="/" className="hover:text-[#CA7154] transition-colors shrink-0">
          {messages.catalog.homeBreadcrumb}
        </Link>
        <span className="shrink-0">/</span>
        <a
          href={categoryPath}
          className="hover:text-[#CA7154] transition-colors shrink-0"
        >
          {categoryName}
        </a>
        <span className="shrink-0">/</span>
        <span className="text-[#5E5245] font-medium truncate">
          {product.title}
        </span>
      </nav>

      {/* Two-Column Product Layout: 7 cols Gallery, 5 cols Buy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productTitle={product.title}
          />
        </div>

        {/* Right Column: Buy Section */}
        <div className="lg:col-span-5">
          <ProductBuySection
            product={product}
            sizeGuide={sizeGuide}
            whatsappUrl={settings.whatsappUrl}
          />
        </div>
      </div>

      {/* Recommendations */}
      <ProductRecommendations
        products={recommendations}
        categoryHandle={product.categoryHandle}
      />
    </div>
  );
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<PageFallback />}>
      <ProductContent {...props} />
    </Suspense>
  );
}
