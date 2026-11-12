import "server-only";
import {
  ContentService,
  GlobalSettings,
  HomePageData,
  SizeGuide,
  Campaign,
  EditorialPage,
} from "./types";

export const liveContentService: ContentService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    // TODO: Connect to Strapi v5 REST API: GET /api/global-setting?populate=*
    throw new Error("Not implemented: getGlobalSettings (GET /api/global-setting)");
  },

  async getHomePage(): Promise<HomePageData> {
    // TODO: Connect to Strapi v5 REST API: GET /api/home-page?populate=deep
    throw new Error("Not implemented: getHomePage (GET /api/home-page)");
  },

  async getSizeGuide(categoryHandle: string): Promise<SizeGuide | null> {
    // TODO: Connect to Strapi v5 REST API: GET /api/size-guides?filters[category_handle][$eq]={handle}
    throw new Error(`Not implemented: getSizeGuide for ${categoryHandle}`);
  },

  async getAllSizeGuides(): Promise<SizeGuide[]> {
    // TODO: Connect to Strapi v5 REST API: GET /api/size-guides?populate=*
    throw new Error("Not implemented: getAllSizeGuides (GET /api/size-guides)");
  },

  async getCampaign(slug: string): Promise<Campaign | null> {
    // TODO: Connect to Strapi v5 REST API: GET /api/campaigns?filters[slug][$eq]={slug}
    throw new Error(`Not implemented: getCampaign (${slug})`);
  },

  async getEditorialPage(slug: string): Promise<EditorialPage | null> {
    // TODO: Connect to Strapi v5 REST API: GET /api/editorial-pages?filters[slug][$eq]={slug}&populate=deep
    throw new Error(`Not implemented: getEditorialPage (${slug})`);
  },
};
