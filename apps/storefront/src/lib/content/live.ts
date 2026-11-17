import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { StrapiStorefrontContent } from "./raw";
import {
  mapStrapiCampaignToDomain,
  mapStrapiEditorialPageToDomain,
  mapStrapiGlobalSettingsToDomain,
  mapStrapiHomePageToDomain,
  mapStrapiSizeGuideToDomain,
  mapStrapiCategoryBannerToDomain,
} from "./mappers";
import {
  Campaign,
  ContentService,
  EditorialPage,
  GlobalSettings,
  HomePageData,
  SizeGuide,
  CategoryBanner,
} from "./types";

// One read for the whole site: Strapi assembles every displayed document in a single answer
// (apps/strapi/src/api/storefront), with its own populate rules. The site sends no query.
// A publication in Strapi revalidates the "content" tag, and the next page reads it again once.

async function fetchContent(): Promise<StrapiStorefrontContent> {
  const base = process.env.STRAPI_URL;
  if (!base) throw new Error("STRAPI_URL est requis en mode live.");
  const token = process.env.STRAPI_TOKEN;
  const res = await fetch(`${base.replace(/\/$/, "")}/api/storefront-content`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Strapi ${res.status} sur storefront-content`);
  return ((await res.json()) as { data: StrapiStorefrontContent }).data;
}

// Pages rendered together on a cold cache share the request already on its way.
let pending: Promise<StrapiStorefrontContent> | null = null;

async function content(): Promise<StrapiStorefrontContent> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.content);
  pending ??= fetchContent().finally(() => {
    pending = null;
  });
  return pending;
}

export const liveContentService: ContentService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    return mapStrapiGlobalSettingsToDomain((await content()).global_setting);
  },

  async getHomePage(): Promise<HomePageData> {
    return mapStrapiHomePageToDomain((await content()).home_page);
  },

  async getCategoryBanner(categoryHandle: string): Promise<CategoryBanner | null> {
    const banner = (await content()).category_banners.find((b) => b.category_handle === categoryHandle);
    return banner ? mapStrapiCategoryBannerToDomain(banner) : null;
  },

  async getSizeGuide(categoryHandle: string): Promise<SizeGuide | null> {
    const guide = (await content()).size_guides.find((g) => g.category_handle === categoryHandle);
    return guide ? mapStrapiSizeGuideToDomain(guide) : null;
  },

  async getAllSizeGuides(): Promise<SizeGuide[]> {
    return (await content()).size_guides.map(mapStrapiSizeGuideToDomain);
  },

  async getCampaign(slug: string): Promise<Campaign | null> {
    const campaign = (await content()).campaigns.find((c) => c.slug === slug);
    return campaign ? mapStrapiCampaignToDomain(campaign) : null;
  },

  async getFeaturedCampaigns(): Promise<Campaign[]> {
    return (await content()).campaigns.filter((c) => c.feature_on_home === true).map(mapStrapiCampaignToDomain);
  },

  async getEditorialPage(slug: string): Promise<EditorialPage | null> {
    const page = (await content()).pages.find((p) => p.slug === slug);
    return page ? mapStrapiEditorialPageToDomain(page) : null;
  },
};
