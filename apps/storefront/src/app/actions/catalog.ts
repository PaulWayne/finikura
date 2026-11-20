"use server";
import { commerceService } from "@/lib/commerce";
import type { CategoryHandle, Product } from "@/lib/commerce/types";
import { ageFilterValues, CATALOG_PAGE_SIZE, knownFilter, OCCASION_VALUES } from "@/lib/catalog-filters";

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
  // Same rule as the page (audit S5): only the filters it offers reach the cached read.
  const all = await commerceService.getProducts({ categoryHandle: input.categoryHandle });
  const age = knownFilter(input.age, ageFilterValues(all));
  const occasion = knownFilter(input.occasion, OCCASION_VALUES);
  const products =
    age || occasion ? await commerceService.getProducts({ categoryHandle: input.categoryHandle, age, occasion }) : all;
  return products.slice(offset, offset + CATALOG_PAGE_SIZE);
}
