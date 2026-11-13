// One-off: downloads the mock-up images (lh3.googleusercontent.com, temporary) into public/mock-media/
// with readable names, and rewrites the fixtures and src/lib/images.ts to point to /mock-media/….
// The seeds then upload these files to the media storage (Garage). Run once: node scripts/fetch-mock-media.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { globSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/mock-media");
const PREFIX = "https://lh3.googleusercontent.com/";
const names = new Map(); // url -> file name
const used = new Set();

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function name(url, hint) {
  if (names.has(url)) return;
  let base = slug(hint) || "image";
  let n = base;
  for (let i = 2; used.has(n); i++) n = `${base}-${i}`;
  used.add(n);
  names.set(url, n);
}

// Walk a JSON value; the nearest handle/slug/title gives the image its name.
function walk(value, hint) {
  if (typeof value === "string") {
    if (value.startsWith(PREFIX)) name(value, hint);
  } else if (Array.isArray(value)) {
    value.forEach((v) => walk(v, hint));
  } else if (value && typeof value === "object") {
    const own = value.handle ?? value.slug ?? value.title ?? value.name ?? value.__component ?? hint;
    for (const [k, v] of Object.entries(value)) walk(v, k === "thumbnail" ? own : own);
  }
}

const fixtures = globSync("src/mocks/**/*.json", { cwd: ROOT });
// Products first, so product photos get product names.
fixtures.sort((a, b) => Number(!a.includes("products")) - Number(!b.includes("products")));
for (const f of fixtures) walk(JSON.parse(await readFile(path.join(ROOT, f), "utf8")), path.basename(f, ".json"));

const imagesTs = path.join(ROOT, "src/lib/images.ts");
const imagesSrc = await readFile(imagesTs, "utf8");
for (const [, key, url] of imagesSrc.matchAll(/(\w+): "(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g)) name(url, `fallback-${key}`);

await mkdir(OUT, { recursive: true });
const files = new Map();
for (const [url, n] of names) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${n}`);
  const type = res.headers.get("content-type") ?? "image/jpeg";
  const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
  const file = `${n}.${ext}`;
  await writeFile(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
  files.set(url, `/mock-media/${file}`);
  console.log(`${file}`);
}

const replaceAll = (s) => [...files].reduce((acc, [url, local]) => acc.split(url).join(local), s);
for (const f of fixtures) {
  const p = path.join(ROOT, f);
  const s = await readFile(p, "utf8");
  const r = replaceAll(s);
  if (r !== s) await writeFile(p, r);
}
await writeFile(imagesTs, replaceAll(imagesSrc));
console.log(`${files.size} images saved in public/mock-media/`);
