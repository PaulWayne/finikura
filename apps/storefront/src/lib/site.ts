// Public URL of the storefront, used for absolute links (sharing, Open Graph).
// Production: https://<domain>. Falls back to the local dev server.
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3100").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
