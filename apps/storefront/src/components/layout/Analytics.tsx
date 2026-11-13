import Script from "next/script";
import { connection } from "next/server";

/**
 * Umami visit statistics (FK-10): no cookie, ~2 KB script loaded after the page is interactive.
 * Rendered only when UMAMI_SCRIPT_URL and UMAMI_WEBSITE_ID are set, so mock, dev and e2e count nothing.
 * Sent: page URL (with its query: category filters and utm_* campaign tags, never personal data;
 * checkout details go through a Server Action, not the URL), referrer, screen and language. No hash.
 */
export async function Analytics() {
  // Read the variables at request time (set in Dokploy), not at build time.
  await connection();
  const src = process.env.UMAMI_SCRIPT_URL;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!src || !websiteId) return null;

  return (
    <Script
      src={src}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-do-not-track="true"
      data-exclude-hash="true"
    />
  );
}
