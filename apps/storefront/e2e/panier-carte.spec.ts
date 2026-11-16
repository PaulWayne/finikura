import { expect, test, type Page } from "@playwright/test";

// The button on a catalogue card never adds a size by default: it opens the sizes,
// or adds the size of the age filter. Mock mode (no backend).
const firstCard = (page: Page) => page.locator('[data-purpose="product-card"]').first();
// The closed drawer is inert; its classes always hold « md:translate-y-0 », so they say nothing.
const drawer = (page: Page) => page.locator("#cart-drawer");

test("sans filtre d'âge, le bouton de la carte ouvre les tailles et la taille choisie part au panier", async ({ page }) => {
  await page.goto("/categorie/filles");
  const card = firstCard(page);
  const title = ((await card.getByRole("heading").textContent()) ?? "").trim();

  await card.getByRole("button", { name: `Choisir la taille pour ${title}` }).click();
  // Nothing is in the cart yet: the customer still has to pick a size.
  await expect(drawer(page)).toHaveAttribute("inert");

  const size = card.getByRole("button", { name: /^Ajouter .* en .* au panier$/, disabled: false }).nth(1);
  const sizeName = ((await size.getAttribute("aria-label")) ?? "").replace(/^.* en (.*) au panier$/, "$1");
  await size.click();

  await expect(drawer(page)).not.toHaveAttribute("inert");
  await expect(drawer(page).getByText(title)).toBeVisible();
  await expect(drawer(page).getByText(sizeName, { exact: true })).toBeVisible();
  // The sizes close once the outfit is in the cart.
  await expect(card.getByRole("button", { name: `Choisir la taille pour ${title}` })).toBeVisible();
});

test("avec un filtre d'âge, le bouton de la carte ajoute cette taille directement", async ({ page }) => {
  await page.goto("/categorie/filles?age=5-6+ans");
  const card = firstCard(page);
  const title = ((await card.getByRole("heading").textContent()) ?? "").trim();

  await card.getByRole("button", { name: `Ajouter ${title} en 5-6 ans au panier` }).click();

  await expect(drawer(page)).not.toHaveAttribute("inert");
  await expect(drawer(page).getByText(title)).toBeVisible();
  await expect(drawer(page).getByText("5-6 ans", { exact: true })).toBeVisible();
});
