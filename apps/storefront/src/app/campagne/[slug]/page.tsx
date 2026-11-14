import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageFallback } from "@/components/layout/PageFallback";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { isCampaignActive, todayInBamako } from "@/lib/content/campaign";
import { messages } from "@/messages/fr";

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CampaignPageProps) {
  const { slug } = await params;
  const campaign = await contentService.getCampaign(slug);
  if (!campaign) {
    return { title: messages.meta.defaultTitle, description: messages.meta.defaultDescription };
  }
  return {
    title: `${campaign.seo.title} | Fini Kura`,
    description: campaign.seo.description,
    openGraph: { title: campaign.seo.title, description: campaign.seo.description },
  };
}

async function CampaignContent({ params }: CampaignPageProps) {
  const { slug } = await params;
  const campaign = await contentService.getCampaign(slug);

  // The date check runs per request, outside the cache, so a campaign opens
  // and closes exactly at midnight in Bamako.
  await connection();
  if (!campaign || !isCampaignActive(campaign, todayInBamako())) notFound();

  // A collection unknown to Medusa yields no products: the section is hidden.
  const products = await commerceService.getCollectionProducts(campaign.collectionHandle, 48);

  return (
    <div className="pt-2 pb-4 md:py-8 space-y-8 md:space-y-12" data-purpose="campaign-page">
      <nav aria-label="Fil d'Ariane" className="flex items-center space-x-2 text-xs text-brand-text">
        <Link href="/" className="hover:underline underline-offset-4 transition-colors">
          {messages.catalog.homeBreadcrumb}
        </Link>
        <span>/</span>
        <span className="font-medium">{campaign.title}</span>
      </nav>

      <section className="relative w-full rounded-2xl overflow-hidden bg-brand-surface border border-brand-surface">
        <div className="aspect-[4/3] md:aspect-[21/9] relative">
          <SafeImage
            src={campaign.visuals.bannerUrl || IMAGE_FALLBACKS.hero}
            alt={campaign.visuals.bannerAlt}
            fallbackSrc={IMAGE_FALLBACKS.hero}
            sizes="(min-width: 1200px) 1150px, 100vw"
            preload
            className="w-full h-full object-cover object-[center_25%]"
          />
        </div>
        <div className="p-6 md:p-10 text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-[0.15em] font-medium text-brand-text">
            {campaign.title}
          </p>
          <h1 className="font-serif text-3xl md:text-[40px] uppercase font-normal text-brand-text tracking-[0.08em] leading-tight">
            {campaign.texts.headline}
          </h1>
          {campaign.texts.description && (
            <p className="text-sm md:text-base text-brand-text font-light leading-relaxed">
              {campaign.texts.description}
            </p>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section aria-labelledby="campaign-products" className="space-y-6">
          <h2
            id="campaign-products"
            className="font-serif text-2xl md:text-3xl uppercase text-center text-brand-text tracking-[0.08em]"
          >
            {messages.campaign.productsTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function CampaignPage(props: CampaignPageProps) {
  return (
    <Suspense fallback={<PageFallback />}>
      <CampaignContent {...props} />
    </Suspense>
  );
}
