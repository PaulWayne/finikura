import React from "react";
import { ContentBlock, ReassuranceItem } from "@/src/lib/content/types";
import { Product } from "@/src/lib/commerce/types";
import { HeroBlock } from "./HeroBlock";
import { CategoryCardsBlock } from "./CategoryCardsBlock";
import { ProductSectionBlock } from "./ProductSectionBlock";
import { ReassuranceBlock } from "./ReassuranceBlock";
import { AboutExcerptBlock } from "./AboutExcerptBlock";

interface BlockRendererProps {
  block: ContentBlock;
  collectionProductsMap?: Record<string, Product[]>;
  reassuranceItems?: ReassuranceItem[];
}

export function BlockRenderer({
  block,
  collectionProductsMap = {},
  reassuranceItems,
}: BlockRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;

    case "categoryCards":
      return <CategoryCardsBlock block={block} />;

    case "productSection": {
      const products = collectionProductsMap[block.collectionHandle] || [];
      if (products.length === 0) {
        return null;
      }
      return <ProductSectionBlock block={block} products={products} />;
    }

    case "reassurance":
      return (
        <ReassuranceBlock
          block={block}
          items={reassuranceItems || block.items}
        />
      );

    case "aboutExcerpt":
      return <AboutExcerptBlock block={block} />;

    default:
      // Unknown block types are gracefully ignored per architecture rules
      return null;
  }
}
