import "server-only";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { isCampaignActive } from "@/lib/content/campaign";

// Pages that do not depend on data. The checkout and the saved outfits are left out (robots.ts).
const STATIC_PATHS = ["/", "/notre-histoire", "/guide-des-tailles", "/livraison-et-echanges", "/contact", "/mentions-legales"];

/**
 * Every page a customer can land on from a search engine (audit E2), shared by the sitemap and
 * IndexNow. Medusa decides which categories and products exist; a campaign is listed only while
 * it is open on `today` (YYYY-MM-DD in Bamako), like its page.
 */
export async function listPublicPaths(today: string): Promise<string[]> {
  const [categories, products, campaigns] = await Promise.all([
    commerceService.getCategories(),
    commerceService.getProducts(),
    contentService.getCampaigns(),
  ]);
  return [
    ...STATIC_PATHS,
    ...categories.map((c) => `/categorie/${c.handle}`),
    ...products.map((p) => `/produit/${p.handle}`),
    ...campaigns.filter((c) => isCampaignActive(c, today)).map((c) => `/campagne/${c.slug}`),
  ];
}
