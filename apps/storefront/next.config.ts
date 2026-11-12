import type { NextConfig } from "next";

// Hosts allowed for next/image: the public Medusa and Strapi URLs, plus the
// host of the placeholder photos used by the fixtures and the seeds.
function imageHost(url: string | undefined): URL[] {
  if (!url) return [];
  try {
    return [new URL("/**", url)];
  } catch {
    return [];
  }
}
const imagePatterns = [
  ...imageHost(process.env.MEDUSA_PUBLIC_URL || process.env.MEDUSA_BACKEND_URL),
  ...imageHost(process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL),
  new URL("https://lh3.googleusercontent.com/**"),
];

const nextConfig: NextConfig = {
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
