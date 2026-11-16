import React from "react";
import { commerceService } from "@/lib/commerce";
import { TestimonialsBlockData } from "@/lib/content/types";
import { TestimonialsShowcase, type ShownTestimonial } from "./TestimonialsShowcase";

/**
 * Words of real customers (FK-34), typed in Strapi. Each one may name the outfit worn: Medusa
 * then gives the link and, when the customer sent no photo, the photo of the outfit. Medusa
 * decides what exists: a testimonial about an outfit no longer sold is not shown.
 */
export async function TestimonialsBlock({ block }: { block: TestimonialsBlockData }) {
  const resolved = await Promise.all(
    block.items.map(async (item): Promise<ShownTestimonial | null> => {
      if (!item.productHandle) return { ...item, product: null };
      const product = await commerceService.getProductByHandle(item.productHandle);
      if (!product) return null;
      return {
        ...item,
        photoUrl: item.photoUrl || product.thumbnail,
        product: { handle: product.handle, title: product.title },
      };
    }),
  );
  const items = resolved.filter((item): item is ShownTestimonial => item !== null);
  if (items.length === 0) return null;

  return <TestimonialsShowcase title={block.title} items={items} />;
}
