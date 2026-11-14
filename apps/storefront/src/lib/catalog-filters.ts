import type { Product } from "@/lib/commerce/types";

const firstNumber = (label: string): number => {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
};

/**
 * Age filters of a category (FK-19): the sizes of its products in Medusa, youngest first.
 * A new size added in the admin shows up as a filter, with the same label as the variant.
 */
export function ageOptions(products: Product[]): string[] {
  const labels = new Set<string>();
  for (const product of products) {
    for (const variant of product.variants) {
      const label = variant.age.trim();
      if (label) labels.add(label);
    }
  }
  return [...labels].sort((a, b) => firstNumber(a) - firstNumber(b) || a.localeCompare(b, "fr"));
}
