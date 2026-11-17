import type { NextConfig } from "next";

// Hosts allowed for next/image: the media storage (Garage, MEDIA_PUBLIC_URL) and the public
// Medusa and Strapi URLs (media stored before the move to object storage). Mock images are local (/mock-media).
function imageHost(url: string | undefined): URL[] {
  if (!url) return [];
  try {
    return [new URL("/**", url)];
  } catch {
    return [];
  }
}
const imagePatterns = [
  ...imageHost(process.env.MEDIA_PUBLIC_URL),
  ...imageHost(process.env.MEDUSA_PUBLIC_URL || process.env.MEDUSA_BACKEND_URL),
  ...imageHost(process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL),
];

// Security headers (audit S1). The CSP lists the only other origins the pages use: the media storage
// and the back offices (photos and product videos), and Umami (statistics). Inline scripts stay
// allowed: Next writes its page data inline, and nonces would make every page dynamic (no PPR).
// HSTS is sent by Traefik for every domain, see infra/dokploy/docker-compose.prod.yml.
function origin(url: string | undefined): string[] {
  if (!url) return [];
  try {
    return [new URL(url).origin];
  } catch {
    return [];
  }
}
const isDev = process.env.NODE_ENV !== "production";
const mediaOrigins = [
  ...origin(process.env.MEDIA_PUBLIC_URL),
  ...origin(process.env.MEDUSA_PUBLIC_URL || process.env.MEDUSA_BACKEND_URL),
  ...origin(process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL),
];
const statsOrigins = origin(process.env.UMAMI_SCRIPT_URL);
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${statsOrigins.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${mediaOrigins.join(" ")}`,
  `media-src 'self' blob: ${mediaOrigins.join(" ")}`,
  "font-src 'self'",
  `connect-src 'self' ${statsOrigins.join(" ")}${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // No upgrade-insecure-requests: it would also apply to http://localhost (e2e, local build);
  // in production, HSTS already keeps every request on HTTPS.
]
  .map((d) => d.replace(/\s+/g, " ").trim())
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Dev only: lets a phone on the local Wi-Fi load the dev server (e.g. DEV_LAN_HOST=192.168.1.20).
  allowedDevOrigins: process.env.DEV_LAN_HOST ? [process.env.DEV_LAN_HOST] : [],
  cacheComponents: true,
  images: {
    remotePatterns: imagePatterns,
    // Dev only: Medusa and Strapi run on localhost, which Next blocks by default.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
