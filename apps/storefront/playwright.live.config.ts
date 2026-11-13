import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Live e2e (FK-35), started by scripts/e2e-live.mjs, which sets the Medusa / Strapi URLs and the key.
export default defineConfig({
  ...base,
  testDir: "./e2e/live",
  testIgnore: [],
  timeout: 90_000,
  webServer: {
    ...(Array.isArray(base.webServer) ? base.webServer[0] : base.webServer!),
    // Environment inherited from scripts/e2e-live.mjs (live sources, backend URLs, publishable key).
    env: {},
    timeout: 300_000,
  },
});
