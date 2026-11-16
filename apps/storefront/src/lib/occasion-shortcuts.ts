import "server-only";
import { commerceService } from "@/lib/commerce";
import type { CategoryHandle } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";

export interface OccasionShortcut {
  categoryHandle: CategoryHandle;
  occasion: string;
  occasionLabel: string;
  imageUrl: string;
}

// Same values as the catalogue filter: the customer lands on the outfits of her occasion.
const OCCASIONS = [
  { label: messages.catalog.occasions.ceremony, value: "ceremonie" },
  { label: messages.catalog.occasions.party, value: "fete" },
  { label: messages.catalog.occasions.everyday, value: "tous-les-jours" },
];

/**
 * One shortcut per category and occasion that has outfits, pictured by its first outfit:
 * Medusa decides what exists, an empty occasion gives no shortcut.
 */
export async function getOccasionShortcuts(categoryHandles: CategoryHandle[]): Promise<OccasionShortcut[]> {
  const pairs = categoryHandles.flatMap((categoryHandle) => OCCASIONS.map((occasion) => ({ categoryHandle, occasion })));
  const found = await Promise.all(
    pairs.map(async ({ categoryHandle, occasion }): Promise<OccasionShortcut | null> => {
      const products = await commerceService.getProducts({ categoryHandle, occasion: occasion.value });
      const pictured = products.find((p) => p.thumbnail);
      return pictured
        ? { categoryHandle, occasion: occasion.value, occasionLabel: occasion.label, imageUrl: pictured.thumbnail }
        : null;
    }),
  );
  return found.filter((shortcut): shortcut is OccasionShortcut => shortcut !== null);
}
