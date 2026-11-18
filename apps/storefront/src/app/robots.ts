import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Audit E2: the checkout, the order pages and the saved outfits are personal, not for search engines. */
export default function robots(): MetadataRoute.Robots {
  // Preview before the opening (src/proxy.ts): nothing is to be crawled, and no sitemap is announced.
  if (process.env.PREVIEW_PASSWORD?.trim()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/commande", "/coups-de-coeur", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
