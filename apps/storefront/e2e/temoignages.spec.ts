import { expect, test } from "@playwright/test";

// FK-34, mock mode: the home page fixture has three testimonials, each naming an outfit.
test("les flèches des témoignages changent l'avis, la citation et le lien vers la tenue", async ({ page }) => {
  await page.goto("/");
  const section = page.locator('[data-purpose="testimonials-block"]');
  await section.scrollIntoViewIfNeeded();

  const quote = section.locator("blockquote");
  const outfit = section.locator("figure a");
  const firstQuote = await quote.textContent();
  await expect(outfit).toHaveAttribute("href", "/produit/robe-terracotta-brodee");

  await section.getByRole("button", { name: "Avis suivant" }).click();
  await expect(quote).not.toHaveText(firstQuote ?? "");
  await expect(outfit).toHaveAttribute("href", "/produit/ensemble-sauge-et-lin");

  // The arrow back returns to the first one; nothing moved on its own meanwhile.
  await section.getByRole("button", { name: "Avis précédent" }).click();
  await expect(quote).toHaveText(firstQuote ?? "");

  // A neighbour brought forward by a touch.
  await section.getByRole("button", { name: /Afficher l'avis de Cliente 3/ }).click();
  await expect(outfit).toHaveAttribute("href", "/produit/robe-poudree-en-lin");
});
