import "server-only";

export interface StrapiReassuranceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StrapiSocialLink {
  platform: "whatsapp" | "facebook" | "tiktok";
  url: string;
  label: string;
}

export interface StrapiFooterLink {
  label: string;
  url: string;
}

export interface StrapiGlobalSettingsResponse {
  data: {
    id: number;
    attributes: {
      announcement_bar: string;
      whatsapp_number: string;
      whatsapp_url: string;
      social_links: StrapiSocialLink[];
      footer_links: StrapiFooterLink[];
      reassurance_items: StrapiReassuranceItem[];
    };
  };
  meta: Record<string, unknown>;
}

export interface StrapiRawBlock {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export interface StrapiHomePageResponse {
  data: {
    id: number;
    attributes: {
      seo: {
        title: string;
        description: string;
      };
      blocks: StrapiRawBlock[];
    };
  };
  meta: Record<string, unknown>;
}

export interface StrapiSizeGuideItem {
  id: number;
  attributes: {
    category_handle: string;
    title: string;
    measuring_tips: string[];
    rows: {
      age: string;
      height_cm: string;
      chest_cm: string;
      waist_cm: string;
      hips_cm: string;
    }[];
  };
}

export interface StrapiSizeGuidesResponse {
  data: StrapiSizeGuideItem[];
  meta: Record<string, unknown>;
}

export interface StrapiCampaignItem {
  id: number;
  attributes: {
    slug: string;
    title: string;
    collection_handle: string;
    start_date: string;
    end_date: string;
    texts: {
      headline: string;
      description: string;
    };
    visuals: {
      banner_url: string;
    };
  };
}

export interface StrapiCampaignsResponse {
  data: StrapiCampaignItem[];
  meta: Record<string, unknown>;
}

export interface StrapiEditorialPageItem {
  id: number;
  attributes: {
    slug: string;
    title: string;
    seo: {
      title: string;
      description: string;
    };
    blocks: StrapiRawBlock[];
  };
}

export interface StrapiEditorialPagesResponse {
  data: StrapiEditorialPageItem[];
  meta: Record<string, unknown>;
}
