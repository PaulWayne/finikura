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
  expect(head(html)).toContain("<title>Vêtements fille 3-14 ans en ligne, livrés à Bamako | Fini Kura</title>");
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

test("l'accueil et les catégories répondent aux questions des parents, lisibles par les moteurs", async ({ request }) => {
  for (const path of ["/", "/categorie/garcons"]) {
    const html = await (await request.get(path)).text();
    const faq = jsonLd(html).find((d) => d["@type"] === "FAQPage") as { mainEntity: unknown[] } | undefined;
    expect(faq?.mainEntity.length, path).toBeGreaterThan(0);
    expect(html, path).toContain('data-purpose="faq-block"');
  }
});

test("l'accueil dit clairement que la boutique est en ligne, sans magasin", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(head(html)).toMatch(/<title>Boutique en ligne [^<]+<\/title>/);
  const faq = jsonLd(html).find((d) => d["@type"] === "FAQPage") as { mainEntity: { name: string }[] } | undefined;
  expect(faq?.mainEntity.some((q) => q.name.includes("magasin"))).toBe(true);
});

test("/llms.txt résume la boutique, ses tenues et ses réponses, en texte", async ({ request }) => {
  const res = await request.get("/llms.txt");
  expect(res.headers()["content-type"]).toContain("text/markdown");
  const text = await res.text();
  expect(text.startsWith("# Fini Kura")).toBe(true);
  expect(text).toContain("Paiement à la réception.");
  expect(text).toContain("sans magasin physique");
  expect(text).toMatch(/\[Robe Terracotta Brodée\]\([^)]+\/produit\/robe-terracotta-brodee\) : [^\n]*FCFA/);
  expect(text).toContain("### Comment payer ma commande ?");
  // Without its key, IndexNow is off and its file does not exist.
  expect((await request.get("/indexnow-key.txt")).status()).toBe(404);
});

test("une page d'information affiche sa date de mise à jour", async ({ request }) => {
  const html = await (await request.get("/livraison-et-echanges")).text();
  expect(html).toContain("Mis à jour le 18 novembre 2026");
  expect(html).toContain("72 heures");
  expect(html).toContain("48 heures");
});
