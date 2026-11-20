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
 * One shortcut per category and occasion that has outfits, pictured by one of its outfits:
 * Medusa decides what exists, an empty occasion gives no shortcut. An outfit tagged for several
 * occasions pictures only the first one, so two circles never show the same photo when another fits.
 */
export async function getOccasionShortcuts(categoryHandles: CategoryHandle[]): Promise<OccasionShortcut[]> {
  const pairs = categoryHandles.flatMap((categoryHandle) => OCCASIONS.map((occasion) => ({ categoryHandle, occasion })));
  const lists = await Promise.all(
    pairs.map(({ categoryHandle, occasion }) => commerceService.getProducts({ categoryHandle, occasion: occasion.value })),
  );
  const used = new Set<string>();
  const shortcuts: OccasionShortcut[] = [];
  pairs.forEach(({ categoryHandle, occasion }, i) => {
    const pictured = lists[i].filter((p) => p.thumbnail);
    const pick = pictured.find((p) => !used.has(p.thumbnail)) ?? pictured[0];
    if (!pick) return;
    used.add(pick.thumbnail);
    shortcuts.push({ categoryHandle, occasion: occasion.value, occasionLabel: occasion.label, imageUrl: pick.thumbnail });
  });
  return shortcuts;
}
