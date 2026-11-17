import { expect, type Page } from "@playwright/test";

export const CUSTOMER = {
  fullName: "Awa Test",
  phone: "76 12 34 56",
  neighborhood: "Badalabougou",
  landmarks: "Près de la pharmacie, portail vert",
};

/** The customer journey on a phone: product -> cart -> checkout -> confirmation. Returns the chosen size. */
export async function orderFromProductPage(page: Page, handle: string, title: string, phone = CUSTOMER.phone): Promise<string> {
  const size = await addAndOpenCheckout(page, handle, title);
  const submit = page.locator('button[form="checkout-form"]:visible').first();
  await fillCheckout(page, phone);
  await submit.click();

  // Confirmation page with the order number and the WhatsApp button.
  await expect(page).toHaveURL(/\/commande\/confirmation\//, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /Commande n°/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Confirmer sur WhatsApp/i })).toHaveAttribute("href", /wa\.me/);
  return size;
}

/**
 * Product -> size -> cart -> checkout page. Returns the size. On a first order, checks the four
 * errors of the empty form; after one, the form is filled with the saved contact details.
 */
export async function addAndOpenCheckout(page: Page, handle: string, title: string, firstOrder = true): Promise<string> {
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

  await expect(page).toHaveURL(/\/commande$/);
  if (firstOrder) {
    // Empty form: the four errors show up.
    await page.locator('button[form="checkout-form"]:visible').first().click();
    await expect(page.locator("#checkout-form").getByRole("alert")).toHaveCount(4);
  }
  return size;
}

/** Fills in the form like a customer in Bamako. */
export async function fillCheckout(page: Page, phone = CUSTOMER.phone): Promise<void> {
  await page.locator("#fullName").fill(CUSTOMER.fullName);
  await page.locator("#phone").fill(phone);
  await page.locator("#neighborhood").fill(CUSTOMER.neighborhood);
  await page.locator("#deliveryLandmarks").fill(CUSTOMER.landmarks);
}
