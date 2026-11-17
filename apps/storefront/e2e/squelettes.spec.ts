import { expect, test } from "@playwright/test";

// The first bytes of a page already draw its outline: the skeleton is in the HTML sent
// before the content, and it is gone once the content is there.
const PAGES = [
  { path: "/categorie/filles", content: '[data-purpose="catalog-page"]' },
  { path: "/produit/robe-terracotta-brodee", content: '[data-purpose="product-page"]' },
];

for (const { path, content } of PAGES) {
  test(`${path} envoie son squelette, puis le remplace par le contenu`, async ({ page, request }) => {
    const html = await (await request.get(path)).text();
    const skeletonAt = html.indexOf('data-purpose="page-skeleton"');
    expect(skeletonAt).toBeGreaterThan(-1);
    // The skeleton comes first in the stream, the content after.
    expect(skeletonAt).toBeLessThan(html.indexOf(content.slice(1, -1)));

    await page.goto(path);
    await expect(page.locator(content)).toBeVisible();
    await expect(page.locator('[data-purpose="page-skeleton"]')).toHaveCount(0);
  });
}
