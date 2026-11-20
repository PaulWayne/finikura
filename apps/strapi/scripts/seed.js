// Seeds Strapi from the storefront mock fixtures (same shape as the REST responses) (apps/storefront/src/mocks/strapi).
// Usage: pnpm --filter strapi seed (CommonJS: the ESM build of @strapi/core fails on lodash imports)
// Idempotent: single types are only created when empty, collection entries
// are skipped when their slug / category handle already exists.
// To bring content already in Strapi back to the fixtures, name it: --refresh=home,global,notre-histoire
// (home page, global settings, or a page slug). This overwrites what was typed in the admin for these entries,
// photos included: a photo chosen in the admin is replaced by the one of the fixtures.
// To add to the home page the blocks of the fixtures it does not have yet, and leave the others
// exactly as they are in the admin: --add-home-blocks
// To also rewrite one kind of block from the fixtures: --add-home-blocks --replace=blocks.testimonials
// Production (audit B3): SEED_WHATSAPP_NUMBER=223XXXXXXXX pnpm --filter strapi seed --sans-demo
// writes the shop's WhatsApp number instead of the test one, and leaves out what is made up for the
// demo: the testimonials blocks (no review is invented) and the campaigns (demo collections).
// Images referenced in the fixtures (/mock-media/… files, or URLs) are imported into the media library,
// which stores them in Garage when S3_ENDPOINT is set.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { compileStrapi, createStrapi } = require("@strapi/strapi");

async function main() {

const FIXTURES = path.resolve(process.cwd(), "../storefront/src/mocks/strapi");
const MOCK_PUBLIC = path.resolve(process.cwd(), "../storefront/public");
const read = (file) => JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf-8"));

const noDemo = process.argv.includes("--sans-demo");
const shopWhatsApp = (process.env.SEED_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
if (noDemo && !/^223\d{8}$/.test(shopWhatsApp)) {
  throw new Error("--sans-demo : indiquez le numéro WhatsApp de la boutique, SEED_WHATSAPP_NUMBER=223 suivi de 8 chiffres.");
}
/** Demo mode keeps every block; --sans-demo drops the made-up testimonials. */
const keepBlocks = (blocks = []) => (noDemo ? blocks.filter((b) => b.__component !== "blocks.testimonials") : blocks);

const app = await createStrapi(await compileStrapi()).load();
app.log.level = "error";
const strapi = app;

// --- Media import, cached by URL ---------------------------------------------
const mediaCache = new Map();
async function importImage(url, alt) {
  if (!url) return null;
  if (mediaCache.has(url)) return mediaCache.get(url);
  try {
    let buffer, mimetype, name;
    if (url.startsWith("/mock-media/")) {
      // Mock images are versioned in the storefront (public/mock-media), read from disk.
      buffer = fs.readFileSync(path.join(MOCK_PUBLIC, url));
      const ext = path.extname(url).slice(1) || "jpg";
      mimetype = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      name = path.basename(url);
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      buffer = Buffer.from(await res.arrayBuffer());
      mimetype = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
      name = `seed-${mediaCache.size + 1}.${mimetype.split("/")[1] ?? "jpg"}`;
    }
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
  const { id: _id, image, cards, items, ...rest } = b;
  const out = { ...rest };
  // Items with a photo (testimonials); the other lists of items are plain text.
  if (items) {
    out.items = [];
    for (const { id: _itemId, photo, ...item } of items) {
      out.items.push(photo === undefined ? item : { ...item, photo: await importImage(photo?.url, photo?.alternativeText) });
    }
  }
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

const refresh = new Set(
  (process.argv.find((arg) => arg.startsWith("--refresh=")) ?? "").replace("--refresh=", "").split(",").filter(Boolean),
);

async function upsertSingle(uid, data, refreshKey) {
  const existing = await strapi.documents(uid).findFirst();
  if (existing && refresh.has(refreshKey)) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data, status: "published" });
    return console.log(`${uid} : mis à jour depuis les fixtures`);
  }
  if (existing) return console.log(`${uid} : déjà présent`);
  await strapi.documents(uid).create({ data, status: "published" });
  console.log(`${uid} : créé`);
}

/**
 * Adds the fixture blocks whose kind the home page does not have, each after the block that
 * precedes it in the fixtures. The blocks already there are sent back unchanged, with their photos.
 */
async function addMissingHomeBlocks(fixtureBlocks) {
  const uid = "api::home-page.home-page";
  const doc = await strapi.documents(uid).findFirst({ populate: { blocks: { populate: "*" } } });
  // Photos nested in a list (category cards, testimonials) need their own populate.
  const nested = await strapi.documents(uid).findFirst({
    populate: {
      blocks: {
        on: {
          "blocks.category-cards": { populate: { cards: { populate: "image" } } },
          "blocks.testimonials": { populate: { items: { populate: "photo" } } },
        },
      },
    },
  });
  const nestedById = new Map((nested.blocks ?? []).map((b) => [`${b.__component}:${b.id}`, b]));
  const mediaId = (media) => media?.id ?? null;
  const current = (doc.blocks ?? []).map((b) => {
    const { id: _id, image, cards: _cards, items, ...rest } = b;
    const out = { ...rest };
    if ("image" in b) out.image = mediaId(image);
    const deep = nestedById.get(`${b.__component}:${b.id}`);
    if (deep?.cards) out.cards = deep.cards.map(({ id: _i, image: cardImage, ...card }) => ({ ...card, image: mediaId(cardImage) }));
    if (deep?.items) out.items = deep.items.map(({ id: _i, photo, ...item }) => ({ ...item, photo: mediaId(photo) }));
    else if (items) out.items = items.map(({ id: _i, ...item }) => item);
    return out;
  });

  const replaced = (process.argv.find((arg) => arg.startsWith("--replace=")) ?? "").replace("--replace=", "").split(",").filter(Boolean);
  for (let i = current.length - 1; i >= 0; i--) {
    if (replaced.includes(current[i].__component)) current.splice(i, 1);
  }

  const added = [];
  for (const [index, fixture] of fixtureBlocks.entries()) {
    // A replaced kind is written back whole: every fixture block of that kind, not only the first.
    if (!replaced.includes(fixture.__component) && current.some((b) => b.__component === fixture.__component)) continue;
    const previous = fixtureBlocks[index - 1]?.__component;
    // The first fixture block (the hero) goes first, not at the end.
    const after = previous ? current.findLastIndex((b) => b.__component === previous) : -1;
    const at = !previous ? 0 : after === -1 ? current.length : after + 1;
    current.splice(at, 0, await mapBlock(fixture));
    added.push(fixture.__component);
  }
  if (added.length === 0) return console.log(`${uid} : aucun bloc à ajouter`);
  await strapi.documents(uid).update({ documentId: doc.documentId, data: { blocks: current }, status: "published" });
  refresh.add("home");
  console.log(`${uid} : blocs écrits depuis les fixtures (${added.join(", ")})`);
}

async function createIfMissing(uid, filters, data) {
  const existing = await strapi.documents(uid).findFirst({ filters });
  if (existing) return console.log(`${uid} ${JSON.stringify(filters)} : déjà présent`);
  await strapi.documents(uid).create({ data, status: "published" });
  console.log(`${uid} ${JSON.stringify(filters)} : créé`);
}

const strip = ({ documentId: _d, id: _i, ...rest }) => rest;

// --- Global settings -----------------------------------------------------------
const globalSettings = strip(read("global-settings.json").data);
if (noDemo) globalSettings.whatsapp_number = shopWhatsApp;
await upsertSingle("api::global-setting.global-setting", globalSettings, "global");

// --- Home ----------------------------------------------------------------------
// Images are only imported when the entry is written: a plain run uploads nothing twice.
const homeFixture = read("home.json").data;
const home = { ...homeFixture, blocks: keepBlocks(homeFixture.blocks) };
const homeExists = await strapi.documents("api::home-page.home-page").findFirst();
if (homeExists && process.argv.includes("--add-home-blocks")) {
  await addMissingHomeBlocks(home.blocks);
} else if (!homeExists || refresh.has("home")) {
  await upsertSingle("api::home-page.home-page", { seo: home.seo, blocks: await mapBlocks(home.blocks) }, "home");
} else {
  console.log("api::home-page.home-page : déjà présent");
}

// --- Pages ---------------------------------------------------------------------
for (const pageFixture of read("editorial-pages.json").data) {
  const page = { ...pageFixture, blocks: keepBlocks(pageFixture.blocks) };
  if (refresh.has(page.slug)) {
    const existing = await strapi.documents("api::page.page").findFirst({ filters: { slug: page.slug } });
    if (existing) {
      await strapi.documents("api::page.page").update({
        documentId: existing.documentId,
        data: { ...strip(page), blocks: await mapBlocks(page.blocks) },
        status: "published",
      });
      console.log(`api::page.page ${page.slug} : mis à jour depuis les fixtures`);
      continue;
    }
  }
  await createIfMissing("api::page.page", { slug: page.slug }, {
    ...strip(page),
    blocks: await mapBlocks(page.blocks),
  });
}

// --- Size guides ---------------------------------------------------------------
for (const guide of read("size-guides.json").data) {
  // --refresh=guide-filles rewrites that size guide from the fixtures.
  if (refresh.has(`guide-${guide.category_handle}`)) {
    const existing = await strapi
      .documents("api::size-guide.size-guide")
      .findFirst({ filters: { category_handle: guide.category_handle } });
    if (existing) {
      await strapi.documents("api::size-guide.size-guide").update({
        documentId: existing.documentId,
        data: strip(guide),
        status: "published",
      });
      console.log(`api::size-guide.size-guide ${guide.category_handle} : mis à jour depuis les fixtures`);
      continue;
    }
  }
  await createIfMissing("api::size-guide.size-guide", { category_handle: guide.category_handle }, strip(guide));
}

// --- Category banners (FK-40) ---------------------------------------------------
for (const b of read("category-banners.json").data) {
  // --refresh=banner-filles rewrites that banner from the fixtures, photo included.
  if (refresh.has(`banner-${b.category_handle}`)) {
    const existing = await strapi
      .documents("api::category-banner.category-banner")
      .findFirst({ filters: { category_handle: b.category_handle } });
    if (existing) {
      await strapi.documents("api::category-banner.category-banner").update({
        documentId: existing.documentId,
        data: { ...strip(b), image: await importImage(b.image?.url, b.image?.alternativeText) },
        status: "published",
      });
      console.log(`api::category-banner.category-banner ${b.category_handle} : mis à jour depuis les fixtures`);
      continue;
    }
  }
  await createIfMissing("api::category-banner.category-banner", { category_handle: b.category_handle }, {
    ...strip(b),
    image: await importImage(b.image?.url, b.image?.alternativeText),
  });
}

// --- Campaigns -----------------------------------------------------------------
for (const c of noDemo ? [] : read("campaigns.json").data) {
  await createIfMissing("api::campaign.campaign", { slug: c.slug }, {
    ...strip(c),
    banner: await importImage(c.banner?.url, c.banner?.alternativeText),
  });
}

// A refresh publishes entries: leave time for the storefront revalidation request to go out.
if (refresh.size > 0) await new Promise((resolve) => setTimeout(resolve, 2000));

await strapi.destroy();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
