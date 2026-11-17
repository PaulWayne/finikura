import type { Product } from "@/lib/commerce/types";

/**
 * FK-43: products shown first on a category page, then added by this many. The e2e tests
 * lower it (CATALOG_PAGE_SIZE) because the demo categories hold fewer than 12 products.
 */
export const CATALOG_PAGE_SIZE = Number(process.env.CATALOG_PAGE_SIZE) || 12;

/** How many products the page renders, from its « voir » parameter (kept on return from a product). */
export function shownCount(voir: string | undefined, total: number): number {
  const asked = Number.parseInt(voir ?? "", 10);
  const wanted = Number.isFinite(asked) && asked > CATALOG_PAGE_SIZE ? asked : CATALOG_PAGE_SIZE;
  return Math.min(total, Math.ceil(wanted / CATALOG_PAGE_SIZE) * CATALOG_PAGE_SIZE);
}

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

/** Occasion tags of the catalogue (Medusa tags), in the order of the filter chips. */
export const OCCASION_VALUES = ["tous-les-jours", "fete", "ceremonie"] as const;

/**
 * Keeps a filter only when it is one the page offers (audit S5). Every value reaches a cached
 * read, so an invented one would add a cache entry: it is dropped and the page shows everything.
 */
export function knownFilter(value: string | undefined, allowed: readonly string[]): string | undefined {
  return value && allowed.includes(value) ? value : undefined;
}

/** Shape of a Medusa handle (product, category, collection): letters, digits, dashes, underscores. */
export function isHandle(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,100}$/.test(value);
}
