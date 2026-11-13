// Moves the media library files still stored by the local provider (public/uploads) to the
// configured object storage (Garage, S3_ENDPOINT). Each file keeps its id, so every link from
// the home page, campaigns and pages stays in place. Idempotent: files already moved are skipped.
// Usage: pnpm --filter strapi media:migrate (CommonJS, like the seed)

const fs = require("node:fs");
const path = require("node:path");
const { compileStrapi, createStrapi } = require("@strapi/strapi");

async function main() {
  if (!process.env.S3_ENDPOINT) {
    console.error("S3_ENDPOINT n'est pas défini : rien à migrer (le stockage reste local).");
    process.exit(1);
  }
  const strapi = await createStrapi(await compileStrapi()).load();
  strapi.log.level = "error";

  const uploads = path.join(strapi.dirs.static.public, "uploads");
  const files = await strapi.db.query("plugin::upload.file").findMany({ where: { provider: "local" } });
  let moved = 0;
  let missing = 0;
  for (const file of files) {
    const filepath = path.join(uploads, `${file.hash}${file.ext}`);
    if (!fs.existsSync(filepath)) {
      console.warn(`Fichier absent sur le disque, ignoré : ${file.name} (${file.url})`);
      missing++;
      continue;
    }
    await strapi
      .plugin("upload")
      .service("upload")
      .replace(file.id, {
        data: { fileInfo: { name: file.name, alternativeText: file.alternativeText, caption: file.caption } },
        file: { filepath, originalFilename: file.name, mimetype: file.mime, size: fs.statSync(filepath).size },
      });
    moved++;
  }
  console.log(`Médias déplacés vers le stockage d'objets : ${moved} (absents : ${missing}, déjà déplacés : ignorés).`);
  await strapi.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
