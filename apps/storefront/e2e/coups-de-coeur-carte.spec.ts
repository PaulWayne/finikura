import { expect, test } from "@playwright/test";

// The heart on a catalogue card keeps an outfit in the favourites of this phone (FK-37). Mock mode.
test("le cœur d'une carte ajoute la tenue aux coups de cœur, puis la retire", async ({ page }) => {
  await page.goto("/categorie/filles");
  const card = page.locator('[data-purpose="product-card"]').first();
  const title = ((await card.getByRole("heading").textContent()) ?? "").trim();

  await card.getByRole("button", { name: `Ajouter ${title} à mes coups de cœur` }).click();
  const remove = card.getByRole("button", { name: `Retirer ${title} de mes coups de cœur` });
  await expect(remove).toHaveAttribute("aria-pressed", "true");
  // The header counter follows.
  await expect(page.getByRole("link", { name: "Mes coups de cœur (1)" }).first()).toBeVisible();

  // The outfit is on the favourites page.
  await page.goto("/coups-de-coeur");
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  // Back in the catalogue, the heart is still on; a second touch removes the outfit.
  await page.goto("/categorie/filles");
  await remove.click();
  await expect(card.getByRole("button", { name: `Ajouter ${title} à mes coups de cœur` })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("link", { name: "Mes coups de cœur", exact: true }).first()).toBeVisible();
});
