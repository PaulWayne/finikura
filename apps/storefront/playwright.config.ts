import { defineConfig, devices } from "@playwright/test";

// One browser instance only: a single Chromium headless shell, one worker,
// reused by every test. The browser is installed and removed by scripts/e2e.mjs.
const PORT = 3300;

export default defineConfig({
  testDir: "./e2e",
  // Live journeys need the backend: pnpm test:e2e:live (FK-35).
  testIgnore: ["live/**"],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    video: "off",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } }],
  outputDir: "./e2e/.results",
  webServer: {
    // Mock mode: no Medusa or Strapi needed. Port 3300 leaves the dev server (3100) alone.
    command: `pnpm exec next build && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // ORDER_LIMIT_REDIS_URL empty: the order counts stay in the memory of this server, so a run never
    // inherits the counts of the previous one (nor those of the local dev site).
    env: { COMMERCE_SOURCE: "mock", CONTENT_SOURCE: "mock", CATALOG_PAGE_SIZE: "4", ORDER_LIMIT_PHONE_15MIN: "1", ORDER_LIMIT_REDIS_URL: "" },
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
