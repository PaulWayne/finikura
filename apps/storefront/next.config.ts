import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the local Wi-Fi load the dev server (e.g. DEV_LAN_HOST=192.168.1.20).
  allowedDevOrigins: process.env.DEV_LAN_HOST ? [process.env.DEV_LAN_HOST] : [],
  cacheComponents: true,
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
