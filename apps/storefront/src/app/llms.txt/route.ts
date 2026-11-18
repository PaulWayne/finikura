import { connection } from "next/server";
import { commerceService } from "@/lib/commerce";
import type { OccasionTag, Product } from "@/lib/commerce/types";
import { contentService } from "@/lib/content";
import { isCampaignActive, todayInBamako } from "@/lib/content/campaign";
import { formatPrice } from "@/lib/format";
import { BRAND_NAME } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { faqItemsOf } from "@/lib/structured-data";
import { messages } from "@/messages/fr";

// /llms.txt (llmstxt.org): the shop in plain Markdown for AI assistants (ChatGPT, Perplexity,
// Claude…), built from the same sources as the pages: Medusa for the outfits, prices and stock,
// Strapi for the texts and questions, fr.ts for the facts validated by the client.
// Google ignores it; it costs nothing and never says more than the site.

const EDITORIAL_SLUGS = ["notre-histoire", "livraison-et-echanges", "contact", "mentions-legales"];

const t = messages.llms;

const OCCASION_LABELS: Record<OccasionTag, string> = {
  "tous-les-jours": messages.catalog.occasions.everyday,
  fete: messages.catalog.occasions.party,
  ceremonie: messages.catalog.occasions.ceremony,
};

/** One line per text: Markdown would read a line break inside a list item as a new paragraph. */
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

function productLine(product: Product): string {
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  const lowest = prices.length > 0 ? Math.min(...prices) : product.price;
  const ages = product.variants.filter((v) => v.inStock).map((v) => v.age);
  const details = [
    t.price(formatPrice(lowest), new Set(prices).size > 1),
    ages.length > 0 ? t.ages(ages.join(", ")) : t.soldOut,
    product.occasionTag ? t.occasion(OCCASION_LABELS[product.occasionTag]) : null,
  ].filter(Boolean);
  const description = product.description ? ` ${oneLine(product.description)}` : "";
  return `- [${product.title}](${absoluteUrl(`/produit/${product.handle}`)}) : ${details.join(" ; ")}.${description}`;
}

export async function GET() {
  const [settings, home, categories, products, campaigns, pages] = await Promise.all([
    contentService.getGlobalSettings(),
    contentService.getHomePage(),
    commerceService.getCategories(),
    commerceService.getProducts(),
    contentService.getCampaigns(),
    Promise.all(EDITORIAL_SLUGS.map((slug) => contentService.getEditorialPage(slug))),
  ]);
  const banners = await Promise.all(categories.map((c) => contentService.getCategoryBanner(c.handle)));
  // Campaign dates are checked at the time in Bamako, like their pages.
  await connection();
  const today = todayInBamako();
  const openCampaigns = campaigns.filter((c) => isCampaignActive(c, today));

  const faq = [...faqItemsOf(home.blocks), ...banners.flatMap((b) => b?.faq ?? [])];
  const socials = settings.socialLinks.filter((l) => l.platform !== "whatsapp" && l.url);

  const lines: string[] = [
    `# ${BRAND_NAME}`,
    "",
    `> ${oneLine(home.seo.description || messages.meta.defaultDescription)}`,
    "",
    `## ${t.factsTitle}`,
    "",
    ...t.facts.map((fact) => `- ${fact}`),
    "",
    `## ${t.categoriesTitle}`,
    "",
    ...categories.map((c, i) => {
      const text = banners[i]?.text || c.description;
      return `- [${c.name}](${absoluteUrl(`/categorie/${c.handle}`)})${text ? ` : ${oneLine(text)}` : ""}`;
    }),
    "",
    `## ${t.productsTitle}`,
    "",
    ...products.map(productLine),
  ];

  if (openCampaigns.length > 0) {
    lines.push(
      "",
      `## ${t.campaignsTitle}`,
      "",
      ...openCampaigns.map(
        (c) => `- [${c.title}](${absoluteUrl(`/campagne/${c.slug}`)})${c.texts.description ? ` : ${oneLine(c.texts.description)}` : ""}`
      )
    );
  }

  if (faq.length > 0) {
    lines.push("", `## ${t.faqTitle}`, "");
    for (const item of faq) lines.push(`### ${oneLine(item.question)}`, "", oneLine(item.answer), "");
    lines.pop();
  }

  lines.push(
    "",
    `## ${t.pagesTitle}`,
    "",
    ...pages
      .filter((page) => page !== null)
      .map(
        (page) =>
          `- [${page.title}](${absoluteUrl(`/${page.slug}`)})${page.seo.description ? ` : ${oneLine(page.seo.description)}` : ""}`
      ),
    `- [${messages.sizeGuidePage.breadcrumbTitle}](${absoluteUrl("/guide-des-tailles")}) : ${oneLine(messages.sizeGuidePage.metaDescription)}`,
    "",
    `## ${t.contactTitle}`,
    "",
    `- ${t.whatsapp(settings.whatsappUrl)}`,
    ...socials.map((l) => `- [${l.label}](${l.url})`),
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
