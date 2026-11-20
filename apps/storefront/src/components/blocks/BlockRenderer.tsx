import React from "react";
import { ContentBlock, ReassuranceItem } from "@/lib/content/types";
import { Product } from "@/lib/commerce/types";
import type { OccasionShortcut } from "@/lib/occasion-shortcuts";
import { HeroBlock } from "./HeroBlock";
import { CategoryCardsBlock } from "./CategoryCardsBlock";
import { ProductSectionBlock } from "./ProductSectionBlock";
import { ReassuranceBlock } from "./ReassuranceBlock";
import { AboutExcerptBlock } from "./AboutExcerptBlock";
import { RichTextBlock } from "./RichTextBlock";
import { ImageTextBlock } from "./ImageTextBlock";
import { ValuesBlock } from "./ValuesBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { FaqBlock } from "./FaqBlock";
import { CtaBlock } from "./CtaBlock";

interface BlockRendererProps {
  block: ContentBlock;
  collectionProductsMap?: Record<string, Product[]>;
  occasionShortcuts?: OccasionShortcut[];
  reassuranceItems?: ReassuranceItem[];
  whatsappUrl?: string | null;
  /** Pale sage ground for this block, where the block supports it. */
  sageBand?: boolean;
}

export function BlockRenderer({
  block,
  collectionProductsMap = {},
  occasionShortcuts,
  reassuranceItems,
  whatsappUrl,
  sageBand = false,
}: BlockRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;

    case "categoryCards":
      return <CategoryCardsBlock block={block} occasionShortcuts={occasionShortcuts} />;

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
      return <AboutExcerptBlock block={block} tone={sageBand ? "sage" : "surface"} />;

    case "richText":
      return <RichTextBlock block={block} />;

    case "imageText":
      return <ImageTextBlock block={block} />;

    case "values":
      return <ValuesBlock block={block} />;

    case "testimonials":
      return <TestimonialsBlock block={block} />;

    case "faq":
      return <FaqBlock block={block} />;

    case "cta":
      return <CtaBlock block={block} whatsappUrl={whatsappUrl} />;

    default:
      // Unknown block types are gracefully ignored per architecture rules
      return null;
  }
}
