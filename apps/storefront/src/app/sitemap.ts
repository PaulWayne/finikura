import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { isCampaignActive, todayInBamako } from "@/lib/content/campaign";
import { absoluteUrl } from "@/lib/site";

// Pages that do not depend on data. The checkout and the saved outfits are left out (robots.ts).
const STATIC_PATHS = ["/", "/notre-histoire", "/guide-des-tailles", "/livraison-et-echanges", "/contact", "/mentions-legales"];

/**
 * Audit E2: every page a customer can land on from Google. Medusa decides which categories and
 * products exist; a campaign is listed only while it is open, like its page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, campaigns] = await Promise.all([
    commerceService.getCategories(),
    commerceService.getProducts(),
    contentService.getCampaigns(),
  ]);
  // The campaign dates are checked per request, at the time in Bamako.
  await connection();
  const today = todayInBamako();

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...categories.map((c) => ({ url: absoluteUrl(`/categorie/${c.handle}`) })),
    ...products.map((p) => ({ url: absoluteUrl(`/produit/${p.handle}`) })),
    ...campaigns
      .filter((c) => isCampaignActive(c, today))
      .map((c) => ({ url: absoluteUrl(`/campagne/${c.slug}`) })),
  ];
}
