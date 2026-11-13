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
