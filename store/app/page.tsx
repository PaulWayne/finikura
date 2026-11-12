import React from "react";
import { contentService } from "@/src/lib/content";
import { commerceService } from "@/src/lib/commerce";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Product } from "@/src/lib/commerce/types";

export async function generateMetadata() {
  const homeData = await contentService.getHomePage();
  return {
    title: homeData.seo.title,
    description: homeData.seo.description,
  };
}

export default async function HomePage() {
  const [homeData, settings] = await Promise.all([
    contentService.getHomePage(),
    contentService.getGlobalSettings(),
  ]);

  // Find all collection handles referenced in productSection blocks
  const collectionHandles = homeData.blocks
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

  return (
    <div className="space-y-10 md:space-y-16 py-4 md:py-8">
      {homeData.blocks.map((block) => (
        <BlockRenderer
          key={String(block.id)}
          block={block}
          collectionProductsMap={collectionProductsMap}
          reassuranceItems={settings.reassuranceItems}
        />
      ))}
    </div>
  );
}
