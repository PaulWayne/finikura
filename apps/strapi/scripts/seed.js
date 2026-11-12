// Seeds Strapi from the storefront mock fixtures (same shape as the REST responses) (apps/storefront/src/mocks/strapi).
// Usage: pnpm --filter strapi seed (CommonJS: the ESM build of @strapi/core fails on lodash imports)
// Idempotent: single types are only created when empty, collection entries
// are skipped when their slug / category handle already exists.
// Images referenced by URL in the fixtures are imported into the media library.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { compileStrapi, createStrapi } = require("@strapi/strapi");

async function main() {

const FIXTURES = path.resolve(process.cwd(), "../storefront/src/mocks/strapi");
const read = (file) => JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf-8"));

const app = await createStrapi(await compileStrapi()).load();
app.log.level = "error";
const strapi = app;

// --- Media import, cached by URL ---------------------------------------------
const mediaCache = new Map();
async function importImage(url, alt) {
  if (!url) return null;
  if (mediaCache.has(url)) return mediaCache.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const mimetype = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    const ext = mimetype.split("/")[1] ?? "jpg";
    const name = `seed-${mediaCache.size + 1}.${ext}`;
    const filepath = path.join(os.tmpdir(), name);
    fs.writeFileSync(filepath, buffer);
    const [file] = await strapi
      .plugin("upload")
      .service("upload")
      .upload({
        data: { fileInfo: { name, alternativeText: alt ?? "" } },
        files: { filepath, originalFilename: name, mimetype, size: buffer.length },
      });
    mediaCache.set(url, file.id);
    return file.id;
  } catch (err) {
    console.warn(`Image ignorée (${err.message}) : ${url.slice(0, 60)}…`);
    mediaCache.set(url, null);
    return null;
  }
}

// --- Block mapping: fixture (Strapi 5 response shape) -> component data --------
async function mapBlock(b) {
  const { id: _id, image, cards, ...rest } = b;
  const out = { ...rest };
  if ("image" in b) out.image = await importImage(image?.url, image?.alternativeText);
  if (cards) {
    out.cards = [];
    for (const { image: cardImage, ...card } of cards) {
      out.cards.push({ ...card, image: await importImage(cardImage?.url, cardImage?.alternativeText) });
    }
  }
  return out;
}
const mapBlocks = async (blocks = []) => Promise.all(blocks.map(mapBlock));

async function upsertSingle(uid, data) {
  const existing = await strapi.documents(uid).findFirst();
  if (existing) return console.log(`${uid} : déjà présent`);
  await strapi.documents(uid).create({ data, status: "published" });
  console.log(`${uid} : créé`);
}

async function createIfMissing(uid, filters, data) {
  const existing = await strapi.documents(uid).findFirst({ filters });
  if (existing) return console.log(`${uid} ${JSON.stringify(filters)} : déjà présent`);
  await strapi.documents(uid).create({ data, status: "published" });
  console.log(`${uid} ${JSON.stringify(filters)} : créé`);
}

const strip = ({ documentId: _d, id: _i, ...rest }) => rest;

// --- Global settings -----------------------------------------------------------
await upsertSingle("api::global-setting.global-setting", strip(read("global-settings.json").data));

// --- Home ----------------------------------------------------------------------
const home = read("home.json").data;
await upsertSingle("api::home-page.home-page", { seo: home.seo, blocks: await mapBlocks(home.blocks) });

// --- Pages ---------------------------------------------------------------------
for (const page of read("editorial-pages.json").data) {
  await createIfMissing("api::page.page", { slug: page.slug }, {
    ...strip(page),
    blocks: await mapBlocks(page.blocks),
  });
}

// --- Size guides ---------------------------------------------------------------
for (const guide of read("size-guides.json").data) {
  await createIfMissing("api::size-guide.size-guide", { category_handle: guide.category_handle }, strip(guide));
}

// --- Campaigns -----------------------------------------------------------------
for (const c of read("campaigns.json").data) {
  await createIfMissing("api::campaign.campaign", { slug: c.slug }, {
    ...strip(c),
    banner: await importImage(c.banner?.url, c.banner?.alternativeText),
  });
}

await strapi.destroy();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
