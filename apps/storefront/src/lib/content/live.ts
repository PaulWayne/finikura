import "server-only";
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

// Strapi 5 REST API (published documents only, which is the REST default).
// Caching is handled by the "use cache" wrappers in ./index.ts.

class StrapiError extends Error {
  constructor(public status: number, path: string) {
    super(`Strapi ${status} sur ${path}`);
  }
}

async function strapi<T>(path: string, params: string[] = []): Promise<T> {
  const base = process.env.STRAPI_URL;
  if (!base) throw new Error("STRAPI_URL est requis en mode live.");
  const url = `${base.replace(/\/$/, "")}/api/${path}${params.length ? `?${params.join("&")}` : ""}`;
  const token = process.env.STRAPI_TOKEN;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new StrapiError(res.status, path);
  return (await res.json()) as T;
}

/** Strapi answers 404 for an empty single type. */
async function single<T>(path: string, params: string[]): Promise<T | null> {
  try {
    return (await strapi<StrapiSingleResponse<T>>(path, params)).data;
  } catch (err) {
    if (err instanceof StrapiError && err.status === 404) return null;
    throw err;
  }
}

const eq = (field: string, value: string) => `filters[${field}][$eq]=${encodeURIComponent(value)}`;

// Dynamic zones need one populate fragment per component (Strapi 5 "on" syntax).
const block = (uid: string, populate = "*") => `populate[blocks][on][${uid}][populate]=${populate}`;
const TESTIMONIALS_POPULATE = "populate[blocks][on][blocks.testimonials][populate][items][populate]=photo";
const HOME_POPULATE = [
  "populate[seo]=true",
  block("blocks.hero"),
  "populate[blocks][on][blocks.category-cards][populate][cards][populate]=image",
  block("blocks.product-section"),
  block("blocks.reassurance"),
  block("blocks.about-excerpt"),
  TESTIMONIALS_POPULATE,
];
const PAGE_POPULATE = [
  "populate[seo]=true",
  block("blocks.rich-text"),
  block("blocks.image-text"),
  block("blocks.values"),
  block("blocks.faq"),
  block("blocks.cta"),
  TESTIMONIALS_POPULATE,
];

export const liveContentService: ContentService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    return mapStrapiGlobalSettingsToDomain(
      await single<StrapiGlobalSettings>("global-setting", ["populate=*"])
    );
  },

  async getHomePage(): Promise<HomePageData> {
    return mapStrapiHomePageToDomain(await single<StrapiHomePage>("home-page", HOME_POPULATE));
  },

  async getCategoryBanner(categoryHandle: string): Promise<CategoryBanner | null> {
    const { data } = await strapi<StrapiListResponse<StrapiCategoryBanner>>("category-banners", [
      eq("category_handle", categoryHandle),
      "populate=image",
    ]);
    return data[0] ? mapStrapiCategoryBannerToDomain(data[0]) : null;
  },

  async getSizeGuide(categoryHandle: string): Promise<SizeGuide | null> {
    const { data } = await strapi<StrapiListResponse<StrapiSizeGuide>>("size-guides", [
      eq("category_handle", categoryHandle),
      "populate=*",
    ]);
    return data[0] ? mapStrapiSizeGuideToDomain(data[0]) : null;
  },

  async getAllSizeGuides(): Promise<SizeGuide[]> {
    const { data } = await strapi<StrapiListResponse<StrapiSizeGuide>>("size-guides", ["populate=*"]);
    return data.map(mapStrapiSizeGuideToDomain);
  },

  async getCampaign(slug: string): Promise<Campaign | null> {
    const { data } = await strapi<StrapiListResponse<StrapiCampaign>>("campaigns", [
      eq("slug", slug),
      "populate=*",
    ]);
    return data[0] ? mapStrapiCampaignToDomain(data[0]) : null;
  },

  async getFeaturedCampaigns(): Promise<Campaign[]> {
    const { data } = await strapi<StrapiListResponse<StrapiCampaign>>("campaigns", [
      "filters[feature_on_home][$eq]=true",
      "populate=*",
    ]);
    return data.map(mapStrapiCampaignToDomain);
  },

  async getEditorialPage(slug: string): Promise<EditorialPage | null> {
    const { data } = await strapi<StrapiListResponse<StrapiPage>>("pages", [eq("slug", slug), ...PAGE_POPULATE]);
    return data[0] ? mapStrapiEditorialPageToDomain(data[0]) : null;
  },
};
