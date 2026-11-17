import "server-only";
import globalSettingsFixture from "@/mocks/strapi/global-settings.json";
import homeFixture from "@/mocks/strapi/home.json";
import sizeGuidesFixture from "@/mocks/strapi/size-guides.json";
import categoryBannersFixture from "@/mocks/strapi/category-banners.json";
import campaignsFixture from "@/mocks/strapi/campaigns.json";
import editorialPagesFixture from "@/mocks/strapi/editorial-pages.json";

import {
  StrapiCampaign,
  StrapiGlobalSettings,
  StrapiHomePage,
  StrapiListResponse,
  StrapiPage,
  StrapiSingleResponse,
  StrapiSizeGuide,
  StrapiCategoryBanner,
} from "./raw";

const globalSettings = globalSettingsFixture as unknown as StrapiSingleResponse<StrapiGlobalSettings>;
const home = homeFixture as unknown as StrapiSingleResponse<StrapiHomePage>;
const sizeGuides = sizeGuidesFixture as unknown as StrapiListResponse<StrapiSizeGuide>;
const categoryBanners = categoryBannersFixture as unknown as StrapiListResponse<StrapiCategoryBanner>;
const campaigns = campaignsFixture as unknown as StrapiListResponse<StrapiCampaign>;
const pages = editorialPagesFixture as unknown as StrapiListResponse<StrapiPage>;

import {
  mapStrapiGlobalSettingsToDomain,
  mapStrapiHomePageToDomain,
  mapStrapiSizeGuideToDomain,
  mapStrapiCategoryBannerToDomain,
  mapStrapiCampaignToDomain,
  mapStrapiEditorialPageToDomain,
} from "./mappers";

import {
  ContentService,
  GlobalSettings,
  HomePageData,
  SizeGuide,
  Campaign,
  EditorialPage,
} from "./types";

export const mockContentService: ContentService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    return mapStrapiGlobalSettingsToDomain(globalSettings.data);
  },

  async getHomePage(): Promise<HomePageData> {
    return mapStrapiHomePageToDomain(home.data);
  },

  async getCategoryBanner(categoryHandle: string) {
    const match = categoryBanners.data.find((b) => b.category_handle === categoryHandle);
    return match ? mapStrapiCategoryBannerToDomain(match) : null;
  },

  async getSizeGuide(categoryHandle: string): Promise<SizeGuide | null> {
    const match = sizeGuides.data.find((g) => g.category_handle === categoryHandle);
    return match ? mapStrapiSizeGuideToDomain(match) : null;
  },

  async getAllSizeGuides(): Promise<SizeGuide[]> {
    return sizeGuides.data.map(mapStrapiSizeGuideToDomain);
  },

  async getCampaign(slug: string): Promise<Campaign | null> {
    const match = campaigns.data.find((c) => c.slug === slug);
    return match ? mapStrapiCampaignToDomain(match) : null;
  },

  async getCampaigns(): Promise<Campaign[]> {
    return campaigns.data.map(mapStrapiCampaignToDomain);
  },

  async getFeaturedCampaigns(): Promise<Campaign[]> {
    return campaigns.data.filter((c) => c.feature_on_home === true).map(mapStrapiCampaignToDomain);
  },

  async getEditorialPage(slug: string): Promise<EditorialPage | null> {
    const match = pages.data.find((p) => p.slug === slug);
    return match ? mapStrapiEditorialPageToDomain(match) : null;
  },
};
