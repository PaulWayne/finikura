import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFallback } from "@/components/layout/PageFallback";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductBuySection } from "@/components/product/ProductBuySection";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ShareWithRelativeButton } from "@/components/product/ShareWithRelativeButton";
import { absoluteUrl } from "@/lib/site";
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
      description: `${formatPrice(product.price)} · ${product.description}`,
      url: `/produit/${product.handle}`,
      type: "website",
      siteName: "Fini Kura",
      locale: "fr_ML",
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

  const productUrl = absoluteUrl(`/produit/${product.handle}`);
  const categoryPath = `/categorie/${product.categoryHandle}`;

  // Filter recommendations (sibling products)
  const recommendations = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-2 pb-4 md:py-8 space-y-3 md:space-y-8" data-purpose="product-page">
      {/* Breadcrumbs */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center space-x-2 text-xs text-brand-text truncate"
      >
        <Link href="/" className="hover:underline underline-offset-4 transition-colors shrink-0">
          {messages.catalog.homeBreadcrumb}
        </Link>
        <span className="shrink-0">/</span>
        <a
          href={categoryPath}
          className="hover:underline underline-offset-4 transition-colors shrink-0"
        >
          {categoryName}
        </a>
        <span className="shrink-0">/</span>
        <span className="text-brand-text font-medium truncate">
          {product.title}
        </span>
      </nav>

      {/* Two-Column Product Layout: 7 cols Gallery, 5 cols Buy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            productHandle={product.handle}
            images={product.images}
            productTitle={product.title}
            wornCaptions={product.wornCaptions}
          />
        </div>

        {/* Right Column: Buy Section */}
        <div className="lg:col-span-5">
          <section aria-label={messages.product.buySectionAria(product.title)} className="flex flex-col pt-1 w-full">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-text font-medium mb-1.5 hidden md:block">
              {messages.product.collectionEyebrow(product.categoryHandle === "filles")}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-tight uppercase tracking-[0.08em] text-brand-text mb-2">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3 mb-3 md:mb-4">
              <p className="text-2xl font-semibold text-brand-text tracking-tight">{formatPrice(product.price)}</p>
            </div>
            <div className="w-full h-px bg-brand-surface mb-3 md:mb-5" />
            <ProductBuySection product={product} sizeGuide={sizeGuide} whatsappUrl={settings.whatsappUrl} productUrl={productUrl} />
            <ShareWithRelativeButton
              text={messages.whatsapp.shareProduct(product.title, formatPrice(product.price), productUrl)}
            />
            <ProductDetails product={product} />
          </section>
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
