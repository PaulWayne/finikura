"use server";
import { commerceService } from "@/lib/commerce";
import type { CategoryHandle, Product } from "@/lib/commerce/types";
import { CATALOG_PAGE_SIZE } from "@/lib/catalog-filters";

export interface MoreProductsInput {
  categoryHandle: CategoryHandle;
  age?: string;
  occasion?: string;
  offset: number;
}

/**
 * FK-43: the next products of a category page, with the same filters. The full list is
 * the cached one of the page, so the order stays the same and no product is repeated.
 */
export async function loadMoreProductsAction(input: MoreProductsInput): Promise<Product[]> {
  if (input.categoryHandle !== "filles" && input.categoryHandle !== "garcons") return [];
  const offset = Math.max(0, Math.floor(input.offset) || 0);
  const products = await commerceService.getProducts({
    categoryHandle: input.categoryHandle,
    age: input.age || undefined,
    occasion: input.occasion || undefined,
  });
  return products.slice(offset, offset + CATALOG_PAGE_SIZE);
}
