import "server-only";
import globalSettingsFixture from "@/src/mocks/strapi/global-settings.json";
import homeFixture from "@/src/mocks/strapi/home.json";
import sizeGuidesFixture from "@/src/mocks/strapi/size-guides.json";
import campaignsFixture from "@/src/mocks/strapi/campaigns.json";
import editorialPagesFixture from "@/src/mocks/strapi/editorial-pages.json";

import {
  StrapiGlobalSettingsResponse,
  StrapiHomePageResponse,
  StrapiSizeGuidesResponse,
  StrapiCampaignsResponse,
  StrapiEditorialPagesResponse,
} from "./raw";

import {
  mapStrapiGlobalSettingsToDomain,
  mapStrapiHomePageToDomain,
  mapStrapiSizeGuideToDomain,
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

function simulateDelay(): Promise<void> {
  const ms = Math.floor(Math.random() * 200) + 200; // 200 - 400 ms
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockContentService: ContentService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    await simulateDelay();
    return mapStrapiGlobalSettingsToDomain(
      globalSettingsFixture as unknown as StrapiGlobalSettingsResponse
    );
  },

  async getHomePage(): Promise<HomePageData> {
    await simulateDelay();
    return mapStrapiHomePageToDomain(
      homeFixture as unknown as StrapiHomePageResponse
    );
  },

  async getSizeGuide(categoryHandle: string): Promise<SizeGuide | null> {
    await simulateDelay();
    const raw = sizeGuidesFixture as unknown as StrapiSizeGuidesResponse;
    const match = raw.data.find(
      (item) => item.attributes.category_handle === categoryHandle
    );
    return match ? mapStrapiSizeGuideToDomain(match) : null;
  },

  async getAllSizeGuides(): Promise<SizeGuide[]> {
    await simulateDelay();
    const raw = sizeGuidesFixture as unknown as StrapiSizeGuidesResponse;
    return raw.data.map(mapStrapiSizeGuideToDomain);
  },

  async getCampaign(slug: string): Promise<Campaign | null> {
    await simulateDelay();
    const raw = campaignsFixture as unknown as StrapiCampaignsResponse;
    const match = raw.data.find((item) => item.attributes.slug === slug);
    return match ? mapStrapiCampaignToDomain(match) : null;
  },

  async getEditorialPage(slug: string): Promise<EditorialPage | null> {
    await simulateDelay();
    const raw = editorialPagesFixture as unknown as StrapiEditorialPagesResponse;
    const match = raw.data.find((item) => item.attributes.slug === slug);
    return match ? mapStrapiEditorialPageToDomain(match) : null;
  },
};
