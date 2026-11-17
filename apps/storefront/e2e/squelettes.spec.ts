import { expect, test } from "@playwright/test";

// Pages read per visit (filters, cart cookie): the first bytes already draw the outline of the
// page, and the skeleton is gone once the content is there. Product pages are built ahead:
// their content comes in the same answer.
const PAGES = [
  { path: "/categorie/filles", content: page => page.locator('[data-purpose="catalog-page"]') },
  { path: "/commande", content: page => page.getByRole("heading", { level: 2 }).first() },
] satisfies { path: string; content: (page: import("@playwright/test").Page) => import("@playwright/test").Locator }[];

for (const { path, content } of PAGES) {
  test(`${path} envoie son squelette, puis le remplace par le contenu`, async ({ page, request }) => {
    const html = await (await request.get(path)).text();
    expect(html).toContain('data-purpose="page-skeleton"');

    await page.goto(path);
    await expect(content(page)).toBeVisible();
    await expect(page.locator('[data-purpose="page-skeleton"]')).toHaveCount(0);
  });
}

test("une fiche produit est construite à l'avance, avec sa description dans l'en-tête", async ({ request }) => {
  const html = await (await request.get("/produit/robe-terracotta-brodee")).text();
  const head = html.slice(0, html.indexOf("</head>"));
  expect(head).toContain('<meta name="description"');
  // The content is in the first answer: the skeleton is replaced as soon as the page is read.
  expect(html).toContain('data-purpose="product-page"');
});
