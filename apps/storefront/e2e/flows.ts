import { expect, type Page } from "@playwright/test";

export const CUSTOMER = {
  fullName: "Awa Test",
  phone: "76 12 34 56",
  neighborhood: "Badalabougou",
  landmarks: "Près de la pharmacie, portail vert",
};

/** The customer journey on a phone: product -> cart -> checkout -> confirmation. Returns the chosen size. */
export async function orderFromProductPage(page: Page, handle: string, title: string): Promise<string> {
  await page.goto(`/produit/${handle}`);

  // Choose a size, then add to cart from the sticky mobile bar.
  const sizes = page.getByRole("radio", { disabled: false });
  await sizes.nth(1).click();
  await expect(sizes.nth(1)).toHaveAttribute("aria-checked", "true");
  const size = ((await sizes.nth(1).textContent()) ?? "").trim();
  await page.getByRole("button", { name: /Ajouter au panier/i }).last().click();

  // The cart drawer opens with the item.
  const drawer = page.locator("#cart-drawer");
  await expect(drawer).toHaveClass(/translate-y-0/);
  await expect(drawer.getByText(title)).toBeVisible();
  await drawer.getByRole("link", { name: /Commander/i }).click();

  // Empty form: the four errors show up.
  await expect(page).toHaveURL(/\/commande$/);
  const submit = page.locator('button[form="checkout-form"]').first();
  await submit.click();
  await expect(page.locator("#checkout-form").getByRole("alert")).toHaveCount(4);

  // Fill in the form like a customer in Bamako.
  await page.locator("#fullName").fill(CUSTOMER.fullName);
  await page.locator("#phone").fill(CUSTOMER.phone);
  await page.locator("#neighborhood").fill(CUSTOMER.neighborhood);
  await page.locator("#deliveryLandmarks").fill(CUSTOMER.landmarks);
  await submit.click();

  // Confirmation page with the order number and the WhatsApp button.
  await expect(page).toHaveURL(/\/commande\/confirmation\//, { timeout: 15_000 });
  await expect(page.getByText(/Commande n°/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Confirmer sur WhatsApp/i })).toHaveAttribute("href", /wa\.me/);
  return size;
}
