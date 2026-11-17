import { expect, test } from "@playwright/test";
import { addAndOpenCheckout, fillCheckout, orderFromProductPage } from "./flows";
import { messages } from "../src/messages/fr";

// Audit B2: an order reserves stock, so the same phone cannot place orders without end.
// The e2e server allows 1 order per phone in 15 minutes (ORDER_LIMIT_PHONE_15MIN in playwright.config).
test("une deuxième commande avec le même numéro est refusée, avec un message clair", async ({ page }) => {
  const phone = "77 00 00 01";
  await orderFromProductPage(page, "robe-terracotta-brodee", "Robe Terracotta Brodée", phone);

  await addAndOpenCheckout(page, "robe-terracotta-brodee", "Robe Terracotta Brodée", false);
  await fillCheckout(page, phone);
  await page.locator('button[form="checkout-form"]:visible').first().click();

  await expect(page.getByText(messages.errors.tooManyOrders)).toBeVisible();
  await expect(page).toHaveURL(/\/commande$/);
});
