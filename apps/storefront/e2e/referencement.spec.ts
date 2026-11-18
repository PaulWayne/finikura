import { expect, test } from "@playwright/test";

// What Google reads in the first answer of the server (audit marketing, référencement).

function head(html: string): string {
  return html.slice(0, html.indexOf("</head>"));
}

function jsonLd(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]) as Record<string, unknown>
  );
}

test("une catégorie filtrée garde une seule adresse canonique, sans les filtres", async ({ request }) => {
  const html = await (await request.get("/categorie/filles?occasion=ceremonie&voir=16")).text();
  expect(head(html)).toMatch(/<link rel="canonical" href="[^"]*\/categorie\/filles"/);
  expect(head(html)).toContain("<title>Vêtements fille de 3 à 14 ans à Bamako | Fini Kura</title>");
  expect(head(html)).toContain('property="og:image"');
  expect(html).toContain('data-purpose="category-presentation"');
});

test("une fiche décrit la tenue, ses tailles et son prix en FCFA", async ({ request }) => {
  const html = await (await request.get("/produit/robe-terracotta-brodee")).text();
  expect(head(html)).toContain("<title>Robe Terracotta Brodée | Fini Kura</title>");
  const product = jsonLd(html).find((d) => d["@type"] === "Product") as
    | { name: string; offers: { priceCurrency: string; price: number; availability: string }[] }
    | undefined;
  expect(product?.name).toBe("Robe Terracotta Brodée");
  expect(product?.offers.length).toBeGreaterThan(0);
  expect(product?.offers.every((o) => o.priceCurrency === "XOF" && Number.isInteger(o.price))).toBe(true);
  expect(jsonLd(html).some((d) => d["@type"] === "BreadcrumbList")).toBe(true);
});

test("l'accueil présente la boutique, et la page livraison ses questions", async ({ request }) => {
  const home = await (await request.get("/")).text();
  expect(jsonLd(home).some((d) => d["@type"] === "OnlineStore")).toBe(true);
  const delivery = await (await request.get("/livraison-et-echanges")).text();
  expect(jsonLd(delivery).some((d) => d["@type"] === "FAQPage")).toBe(true);
  expect(head(delivery)).toMatch(/<title>[^<]+ \| Fini Kura<\/title>/);
});
