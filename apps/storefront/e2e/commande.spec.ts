import { expect, test } from "@playwright/test";

// The customer journey on a phone: product -> cart -> checkout -> confirmation (mock mode).
test("commande complète depuis une fiche produit", async ({ page }) => {
  await page.goto("/produit/robe-terracotta-brodee");

  // Choose a size, then add to cart from the sticky mobile bar.
  const sizes = page.getByRole("radio", { disabled: false });
  await sizes.nth(1).click();
  await expect(sizes.nth(1)).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /Ajouter au panier/i }).last().click();

  // The cart drawer opens with the item.
  const drawer = page.locator("#cart-drawer");
  await expect(drawer).toHaveClass(/translate-y-0/);
  await expect(drawer.getByText("Robe Terracotta Brodée")).toBeVisible();
  await drawer.getByRole("link", { name: /Commander/i }).click();

  // Empty form: the four errors show up.
  await expect(page).toHaveURL(/\/commande$/);
  const submit = page.locator('button[form="checkout-form"]').first();
  await submit.click();
  await expect(page.locator("#checkout-form").getByRole("alert")).toHaveCount(4);

  // Fill in the form like a customer in Bamako.
  await page.locator("#fullName").fill("Awa Test");
  await page.locator("#phone").fill("76 12 34 56");
  await page.locator("#neighborhood").fill("Badalabougou");
  await page.locator("#deliveryLandmarks").fill("Près de la pharmacie, portail vert");
  await submit.click();

  // Confirmation page with the order number and the WhatsApp button.
  await expect(page).toHaveURL(/\/commande\/confirmation\//, { timeout: 15_000 });
  await expect(page.getByText(/Commande n°/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Confirmer sur WhatsApp/i })).toHaveAttribute("href", /wa\.me/);
});
