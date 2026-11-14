import { expect, test } from "@playwright/test";

// FK-43, mock mode with CATALOG_PAGE_SIZE=4 (playwright.config.ts): 10 products in Filles.
const cards = (page: import("@playwright/test").Page) =>
  page.locator('[data-purpose="catalog-page"] .grid a[href^="/produit/"]:has(img)');

test("les produits suivants se chargent en descendant, et le retour garde la liste", async ({ page }) => {
  await page.goto("/categorie/filles");
  await expect(cards(page)).toHaveCount(4);

  // Each batch arrives before the end of the list is reached: the next ones follow.
  await page.mouse.wheel(0, 4000);
  await expect(cards(page)).toHaveCount(10);
  await expect(page).toHaveURL(/voir=10/);
  await expect(page.getByRole("link", { name: "Voir plus de vêtements" })).toHaveCount(0);

  const hrefs = await cards(page).evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(new Set(hrefs).size).toBe(10);

  await cards(page).last().click();
  await expect(page).toHaveURL(/\/produit\//);
  await page.goBack();
  await expect(cards(page)).toHaveCount(10);
});

test("le bouton de secours charge la suite, et un filtre repart du début", async ({ page }) => {
  await page.goto("/categorie/filles?voir=4");
  const more = page.getByRole("link", { name: "Voir plus de vêtements" });
  await more.focus();
  await page.keyboard.press("Enter");
  await expect(cards(page)).not.toHaveCount(4);
  await expect(page.getByText(/vêtements? ajoutés?/)).toBeAttached();

  // The filter links start again from the first products (no « voir »); the 8 products
  // of 13-14 ans then load while the list is short.
  const filter = page.getByRole("link", { name: "13-14 ans" });
  await expect(filter).not.toHaveAttribute("href", /voir=/);
  await filter.click();
  await expect(page).toHaveURL(/age=13-14/);
  await expect(cards(page)).toHaveCount(8);
});
