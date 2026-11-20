import { expect, test } from "@playwright/test";

// FK-34, mock mode: the home page fixture has three testimonials, two of them naming an outfit.
test("les témoignages se lisent tous d'un coup, chacun avec son lien vers la tenue", async ({ page }) => {
  await page.goto("/");
  const section = page.locator('[data-purpose="testimonials-block"]');
  await section.scrollIntoViewIfNeeded();

  // Flat cards: the three quotes are on the page at once, nothing to click to read them.
  await expect(section.locator("blockquote")).toHaveCount(3);
  await expect(section.getByRole("button")).toHaveCount(0);

  // Two of the three name an outfit still sold: each has its own link.
  const outfits = section.locator("figure a");
  await expect(outfits).toHaveCount(2);
  await expect(outfits.nth(0)).toHaveAttribute("href", "/produit/ensemble-rose-et-lin");
  await expect(outfits.nth(1)).toHaveAttribute("href", "/produit/ensemble-blouse-creme-jupe-jean");
});
