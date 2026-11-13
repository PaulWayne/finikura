// Live end-to-end test (FK-35): storefront + Medusa + Strapi on a throwaway PostgreSQL, with the seeds.
// Usage: pnpm test:e2e:live   (Docker and Node 22 only; nothing from the dev setup is used or touched)
//
// 1. PostgreSQL 16 in a container (data in memory), databases "medusa" and "strapi".
// 2. Seeded databases come from a cache (SQL dumps) keyed by a hash of the migrations, seeds and fixtures.
//    On a miss: Medusa migrations + seed and Strapi seed run in parallel, then the dumps are saved.
// 3. Medusa and Strapi start in parallel, without building their admin.
// 4. Playwright builds the storefront in live mode and replays the order journey (e2e/live).
// 5. Everything is removed at the end: container, processes, temporary folders.
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const app = (name) => join(ROOT, "apps", name);
const started = Date.now();
const step = (label) => console.log(`\n▶ ${label} (${((Date.now() - started) / 1000).toFixed(0)} s)`);

const PG = `finikura-e2e-pg-${process.pid}`;
const MEDUSA_PORT = 9190;
const STRAPI_PORT = 1490;
const tmp = mkdtempSync(join(tmpdir(), "fk-e2e-live-"));
const children = [];

// --- Seeded database cache -------------------------------------------------------------------
function filesUnder(dir, filter = () => true) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .map((f) => join(dir, String(f)))
    .filter((f) => statSync(f).isFile() && filter(f))
    .sort();
}
const cacheInputs = [
  join(ROOT, "pnpm-lock.yaml"),
  join(app("medusa"), "medusa-config.ts"),
  join(app("medusa"), "src/scripts/seed.ts"),
  ...filesUnder(join(app("medusa"), "src/modules"), (f) => f.includes("/migrations/")),
  ...filesUnder(join(app("medusa"), "src/links")),
  join(app("strapi"), "scripts/seed.js"),
  ...filesUnder(join(app("strapi"), "src"), (f) => f.endsWith("schema.json")),
  ...filesUnder(join(app("storefront"), "src/mocks")),
  ...filesUnder(join(app("storefront"), "public/mock-media")),
];
const hash = createHash("sha256");
for (const f of cacheInputs) if (existsSync(f)) hash.update(f.slice(ROOT.length)).update(readFileSync(f));
const CACHE = join(ROOT, "node_modules/.cache/fk-e2e-live", hash.digest("hex").slice(0, 16));

// --- Helpers ---------------------------------------------------------------------------------
const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf-8", maxBuffer: 256 * 1024 * 1024, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
};
const psql = (db, sql) => sh("docker", ["exec", PG, "psql", "-U", "test", "-d", db, "-tAc", sql]).trim();

/** Runs a command, prefixing its output; resolves on exit 0. */
function run(label, cmd, args, opts) {
  return new Promise((ok, ko) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
    let log = "";
    const keep = (d) => { log = (log + d).slice(-20000); };
    p.stdout.on("data", keep);
    p.stderr.on("data", keep);
    p.on("exit", (code) => (code === 0 ? ok() : ko(new Error(`${label} failed (exit ${code}):\n${log}`))));
  });
}

/** Starts a long-running server in its own process group (killed at the end). */
function serve(label, cmd, args, opts) {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], detached: true, ...opts });
  let log = "";
  const keep = (d) => { log = (log + d).slice(-20000); };
  p.stdout.on("data", keep);
  p.stderr.on("data", keep);
  children.push(p);
  return { label, process: p, log: () => log };
}

async function waitHttp(server, url, timeoutMs = 180_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (server.process.exitCode !== null) throw new Error(`${server.label} stopped:\n${server.log()}`);
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`${server.label} not ready at ${url}:\n${server.log()}`);
}

function cleanup() {
  for (const c of children) {
    try { process.kill(-c.pid, "SIGKILL"); } catch {}
  }
  spawnSync("docker", ["rm", "-f", PG], { stdio: "ignore" });
  rmSync(tmp, { recursive: true, force: true });
}
process.on("SIGINT", () => { cleanup(); process.exit(130); });
process.on("SIGTERM", () => { cleanup(); process.exit(143); });

// --- Environment -----------------------------------------------------------------------------
// Empty values on purpose: they win over the dev .env files (dotenv never overrides),
// so no Redis, Garage, SMTP or revalidation from the dev setup is used.
const MEDUSA_UPLOADS = join(tmp, "medusa-static");
const STRAPI_PUBLIC = join(tmp, "strapi-public");
const DB = (name) => `postgres://test:test@localhost:${PG_PORT}/${name}`;
let PG_PORT;

const blank = {
  REDIS_URL: "", S3_ENDPOINT: "", MEDIA_PUBLIC_URL: "", SMTP_HOST: "",
  STOREFRONT_REVALIDATE_URL: "", REVALIDATE_SECRET: "",
};
const medusaEnv = () => ({
  ...process.env, ...blank,
  NODE_ENV: "development",
  DATABASE_URL: DB("medusa"),
  PORT: String(MEDUSA_PORT),
  JWT_SECRET: "e2e-only", COOKIE_SECRET: "e2e-only",
  STORE_CORS: "http://localhost:3300", ADMIN_CORS: `http://localhost:${MEDUSA_PORT}`,
  AUTH_CORS: `http://localhost:${MEDUSA_PORT}`,
  MEDUSA_ADMIN_DISABLED: "true",
  MEDUSA_UPLOAD_DIR: MEDUSA_UPLOADS,
  LOG_LEVEL: "error",
});
const strapiEnv = () => ({
  ...process.env, ...blank,
  NODE_ENV: "development",
  HOST: "127.0.0.1", PORT: String(STRAPI_PORT), PUBLIC_URL: "",
  APP_KEYS: "e2eA,e2eB", API_TOKEN_SALT: "e2e", ADMIN_JWT_SECRET: "e2e", TRANSFER_TOKEN_SALT: "e2e",
  JWT_SECRET: "e2e", ENCRYPTION_KEY: "e2e-e2e-e2e-e2e-e2e-e2e-e2e-e2e",
  DATABASE_CLIENT: "postgres", DATABASE_HOST: "localhost", DATABASE_PORT: String(PG_PORT),
  DATABASE_NAME: "strapi", DATABASE_USERNAME: "test", DATABASE_PASSWORD: "test",
  STRAPI_PUBLIC_DIR: STRAPI_PUBLIC,
  STRAPI_TELEMETRY_DISABLED: "true",
});

// --- Main ------------------------------------------------------------------------------------
let code = 1;
try {
  step("PostgreSQL jetable");
  sh("docker", ["run", "-d", "--rm", "--name", PG, "-e", "POSTGRES_USER=test", "-e", "POSTGRES_PASSWORD=test",
    "-p", "127.0.0.1::5432", "--tmpfs", "/var/lib/postgresql/data", "postgres:16-alpine"]);
  PG_PORT = sh("docker", ["port", PG, "5432/tcp"]).trim().split("\n")[0].split(":").pop();
  for (let i = 0; ; i++) {
    const r = spawnSync("docker", ["exec", PG, "psql", "-U", "test", "-d", "postgres", "-tAc", "select 1"], { stdio: "ignore" });
    if (r.status === 0) break;
    if (i > 120) throw new Error("PostgreSQL did not start");
    await new Promise((r) => setTimeout(r, 500));
  }
  psql("postgres", "create database medusa");
  psql("postgres", "create database strapi");
  mkdirSync(MEDUSA_UPLOADS, { recursive: true });
  mkdirSync(join(STRAPI_PUBLIC, "uploads"), { recursive: true });

  if (existsSync(join(CACHE, "done"))) {
    step(`Bases seedées depuis le cache (${CACHE.slice(ROOT.length + 1)})`);
    for (const db of ["medusa", "strapi"]) {
      sh("docker", ["exec", "-i", PG, "psql", "-q", "-v", "ON_ERROR_STOP=1", "-U", "test", "-d", db],
        { input: readFileSync(join(CACHE, `${db}.sql`)) });
    }
    cpSync(join(CACHE, "medusa-static"), MEDUSA_UPLOADS, { recursive: true });
    cpSync(join(CACHE, "strapi-public"), STRAPI_PUBLIC, { recursive: true });
  } else {
    step("Migrations et seeds (pas de cache)");
    const medusa = { cwd: app("medusa"), env: medusaEnv() };
    await Promise.all([
      run("medusa migrate", "pnpm", ["exec", "medusa", "db:migrate"], medusa)
        .then(() => run("medusa seed", "pnpm", ["seed"], medusa)),
      run("strapi seed", "pnpm", ["seed"], { cwd: app("strapi"), env: strapiEnv() }),
    ]);
    mkdirSync(CACHE, { recursive: true });
    for (const db of ["medusa", "strapi"]) {
      writeFileSync(join(CACHE, `${db}.sql`), sh("docker", ["exec", PG, "pg_dump", "-U", "test", "--no-owner", db]));
    }
    cpSync(MEDUSA_UPLOADS, join(CACHE, "medusa-static"), { recursive: true });
    cpSync(STRAPI_PUBLIC, join(CACHE, "strapi-public"), { recursive: true });
    writeFileSync(join(CACHE, "done"), new Date().toISOString());
  }

  step("Medusa et Strapi (sans admin)");
  const medusa = serve("Medusa", "pnpm", ["exec", "medusa", "develop"], { cwd: app("medusa"), env: medusaEnv() });
  const strapi = serve("Strapi", "pnpm", ["exec", "strapi", "develop", "--no-watch-admin", "--no-build-admin"],
    { cwd: app("strapi"), env: strapiEnv() });
  await Promise.all([
    waitHttp(medusa, `http://localhost:${MEDUSA_PORT}/health`),
    waitHttp(strapi, `http://localhost:${STRAPI_PORT}/_health`),
  ]);

  const key = psql("medusa", "select token from api_key where type = 'publishable' and revoked_at is null and deleted_at is null limit 1");
  if (!key) throw new Error("No publishable key in the seeded database");

  step("Front en mode live et parcours Playwright");
  const r = spawnSync("node", ["scripts/e2e.mjs", "--config", "playwright.live.config.ts"], {
    cwd: app("storefront"),
    stdio: "inherit",
    env: {
      ...process.env,
      COMMERCE_SOURCE: "live", CONTENT_SOURCE: "live",
      MEDUSA_BACKEND_URL: `http://localhost:${MEDUSA_PORT}`, MEDUSA_PUBLIC_URL: "",
      MEDUSA_PUBLISHABLE_KEY: key,
      STRAPI_URL: `http://localhost:${STRAPI_PORT}`, STRAPI_PUBLIC_URL: "", STRAPI_TOKEN: "",
      MEDIA_PUBLIC_URL: "", REVALIDATE_SECRET: "", UMAMI_SCRIPT_URL: "", UMAMI_WEBSITE_ID: "",
      SITE_URL: "http://localhost:3300",
      E2E_PG_CONTAINER: PG,
    },
  });
  code = r.status ?? 1;
} catch (e) {
  console.error(`\n✖ ${e.message}`);
} finally {
  cleanup();
  console.log(`\nE2E live : ${code === 0 ? "réussi" : "échec"} en ${((Date.now() - started) / 1000).toFixed(0)} s. Conteneur et dossiers temporaires supprimés.`);
}
process.exit(code);
