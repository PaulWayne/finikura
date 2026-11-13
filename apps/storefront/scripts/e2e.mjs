// End-to-end tests of the storefront in mock mode.
// Installs a single Chromium headless shell in a temporary folder (not the global
// Playwright cache), runs the tests, then deletes the browser whatever the result.
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const browsers = mkdtempSync(join(tmpdir(), "fk-playwright-"));
const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsers };
const run = (args) => spawnSync("pnpm", ["exec", "playwright", ...args], { stdio: "inherit", env }).status ?? 1;

let code = 1;
try {
  code = run(["install", "--only-shell", "chromium"]);
  if (code === 0) code = run(["test", ...process.argv.slice(2)]);
} finally {
  rmSync(browsers, { recursive: true, force: true });
  console.log(`Navigateur de test supprimé (${browsers}).`);
}
process.exit(code);
