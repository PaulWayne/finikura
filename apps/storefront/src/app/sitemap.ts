import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { todayInBamako } from "@/lib/content/campaign";
import { listPublicPaths } from "@/lib/site-paths";
import { absoluteUrl } from "@/lib/site";

/** Audit E2: every page a customer can land on from Google. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The campaign dates are checked per request, at the time in Bamako.
  await connection();
  return (await listPublicPaths(todayInBamako())).map((path) => ({ url: absoluteUrl(path) }));
}
