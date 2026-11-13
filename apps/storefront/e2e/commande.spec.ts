import { test } from "@playwright/test";
import { orderFromProductPage } from "./flows";

// Mock mode: the journey only (no backend).
test("commande complète depuis une fiche produit", async ({ page }) => {
  await orderFromProductPage(page, "robe-terracotta-brodee", "Robe Terracotta Brodée");
});
