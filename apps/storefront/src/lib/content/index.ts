import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { ContentService } from "./types";
import { mockContentService } from "./mock";
import { liveContentService } from "./live";

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
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getHomePage();
}
async function getFeaturedCampaigns() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  return source.getFeaturedCampaigns();
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
  getFeaturedCampaigns,
  getAllSizeGuides,
  getCampaign,
  getEditorialPage,
};

export * from "./types";
