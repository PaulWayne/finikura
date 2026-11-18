import React from "react";
import { contentService } from "@/lib/content";
import { commerceService } from "@/lib/commerce";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Product } from "@/lib/commerce/types";
import { getHomeBlocks } from "@/lib/home-blocks";
import { getOccasionShortcuts } from "@/lib/occasion-shortcuts";
import { pageTitle } from "@/lib/seo";
import { faqItemsOf, faqJsonLd, storeJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const homeData = await contentService.getHomePage();
  return {
    // An absolute title: the home page is the only one whose name is the brand itself.
    title: { absolute: pageTitle(homeData.seo.title) },
    description: homeData.seo.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [blocks, settings] = await Promise.all([getHomeBlocks(), contentService.getGlobalSettings()]);

  // Find all collection handles referenced in productSection blocks
  const collectionHandles = blocks
    .filter((b) => b.type === "productSection")
    .map((b) => (b as { collectionHandle: string }).collectionHandle);

  // Fetch products for each referenced collection from the commerce service
  const collectionProductsMap: Record<string, Product[]> = {};
  await Promise.all(
    collectionHandles.map(async (handle) => {
      collectionProductsMap[handle] =
        await commerceService.getCollectionProducts(handle, 4);
    })
  );

  // Occasion shortcuts under the category photos, for the categories the block shows.
  const cardHandles = blocks.flatMap((b) => (b.type === "categoryCards" ? b.cards.map((card) => card.categoryHandle) : []));
  const occasionShortcuts = cardHandles.length > 0 ? await getOccasionShortcuts([...new Set(cardHandles)]) : [];

  return (
    <div className="space-y-10 md:space-y-16 pt-2 pb-4 md:py-8">
      <JsonLd data={storeJsonLd(settings.socialLinks)} />
      <JsonLd data={faqJsonLd(faqItemsOf(blocks))} />
      {blocks.map((block, index) => (
        // The first block is on screen when the page opens: it never waits for a scroll.
        <div key={`${block.type}-${block.id}`} className={index === 0 ? undefined : "fk-reveal"}>
          <BlockRenderer
            block={block}
            collectionProductsMap={collectionProductsMap}
            occasionShortcuts={occasionShortcuts}
            reassuranceItems={settings.reassuranceItems}
          />
        </div>
      ))}
    </div>
  );
}
