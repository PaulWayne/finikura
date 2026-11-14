import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { ContentService } from "./types";
import { mockContentService } from "./mock";
import { liveContentService } from "./live";
import { pickHero } from "./hero-schedule";

const source: ContentService =
  process.env.CONTENT_SOURCE === "live" ? liveContentService : mockContentService;

async function getGlobalSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getGlobalSettings();
}
async function getHomePage() {
  "use cache";
  // Hourly: a scheduled hero (FK-39) shows up within the hour of its start date, without a deploy.
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  const home = await source.getHomePage();
  // A hero whose button leads to a campaign that no longer exists is skipped.
  const campaignSlugs = home.blocks.flatMap((b) =>
    b.type === "hero" && b.ctaLink.startsWith("/campagne/") ? [b.ctaLink.slice("/campagne/".length).split(/[?#]/)[0]] : [],
  );
  const existing = new Set(
    (await Promise.all(campaignSlugs.map(async (slug) => ((await source.getCampaign(slug)) ? slug : null)))).filter(Boolean),
  );
  const blocks = pickHero(home.blocks, Date.now(), (hero) =>
    hero.ctaLink.startsWith("/campagne/") ? existing.has(hero.ctaLink.slice("/campagne/".length).split(/[?#]/)[0]) : true,
  );
  return { ...home, blocks };
}
async function getCategoryBanner(categoryHandle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getCategoryBanner(categoryHandle);
}
async function getSizeGuide(categoryHandle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getSizeGuide(categoryHandle);
}
async function getAllSizeGuides() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getAllSizeGuides();
}
async function getCampaign(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getCampaign(slug);
}
async function getEditorialPage(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getEditorialPage(slug);
}

export const contentService: ContentService = {
  getGlobalSettings,
  getHomePage,
  getSizeGuide,
  getCategoryBanner,
  getAllSizeGuides,
  getCampaign,
  getEditorialPage,
};

export * from "./types";
