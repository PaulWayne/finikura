import { messages } from "@/messages/fr";

// One way to write the brand in every page title: « … | Fini Kura ».
// Titles typed in Strapi or Medusa may already end with a brand suffix (« | FINI KURA »,
// « — Fini Kura Bamako »): it is replaced, so the admin never has to think about it.

export const BRAND_NAME = "Fini Kura";

const BRAND_SUFFIX = /\s*[|—–-]\s*fini\s*kura(\s+bamako)?\s*$/i;
const BRAND_PREFIX = /^\s*fini\s*kura\s*[|—–-]\s*/i;

/** « Notre histoire | FINI KURA » or « Fini Kura — Notre histoire » → « Notre histoire | Fini Kura ». */
export function pageTitle(title: string): string {
  const name = title.replace(BRAND_SUFFIX, "").replace(BRAND_PREFIX, "").trim();
  return name ? `${name} | ${BRAND_NAME}` : BRAND_NAME;
}

/** Title of a category page: what a parent types in Google, then the brand. */
export function categoryTitle(handle: string, name: string): string {
  const title = messages.meta.categoryTitles[handle as keyof typeof messages.meta.categoryTitles];
  return pageTitle(title ?? name);
}
