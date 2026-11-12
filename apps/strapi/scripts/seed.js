// Seeds Strapi from the storefront mock fixtures (apps/storefront/src/mocks/strapi).
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

// --- Block mapping: fixture (v4-like) -> Strapi 5 component data --------------
async function mapBlock(b) {
  const { __component, id: _id, image_url, cards, ...rest } = b;
  const out = { __component, ...rest };
  if ("image_url" in b) out.image = await importImage(image_url, b.image_alt);
  if (cards) {
    out.cards = [];
    for (const { image_url: cardImage, ...card } of cards) {
      out.cards.push({ ...card, image: await importImage(cardImage, card.image_alt) });
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

// --- Global settings -----------------------------------------------------------
const settings = read("global-settings.json").data.attributes;
await upsertSingle("api::global-setting.global-setting", {
  announcement_bar: settings.announcement_bar,
  whatsapp_number: settings.whatsapp_number.replace(/\D/g, ""),
  social_links: settings.social_links,
  footer_links: settings.footer_links,
  reassurance_items: settings.reassurance_items.map(({ id: _id, ...item }) => item),
});

// --- Home ----------------------------------------------------------------------
const home = read("home.json").data.attributes;
await upsertSingle("api::home-page.home-page", {
  seo: home.seo,
  blocks: await mapBlocks(home.blocks),
});

// --- Pages ---------------------------------------------------------------------
for (const { attributes: page } of read("editorial-pages.json").data) {
  await createIfMissing("api::page.page", { slug: page.slug }, {
    title: page.title,
    slug: page.slug,
    seo: page.seo,
    blocks: await mapBlocks(page.blocks),
  });
}

// --- Size guides ---------------------------------------------------------------
for (const { attributes: guide } of read("size-guides.json").data) {
  await createIfMissing("api::size-guide.size-guide", { category_handle: guide.category_handle }, {
    title: guide.title,
    category_handle: guide.category_handle,
    measuring_tips: guide.measuring_tips.map((text) => ({ text })),
    rows: guide.rows,
  });
}

// --- Campaigns -----------------------------------------------------------------
for (const { attributes: c } of read("campaigns.json").data) {
  await createIfMissing("api::campaign.campaign", { slug: c.slug }, {
    title: c.title,
    slug: c.slug,
    collection_handle: c.collection_handle,
    start_date: c.start_date,
    end_date: c.end_date,
    headline: c.texts.headline,
    description: c.texts.description,
    banner: await importImage(c.visuals.banner_url, c.title),
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
