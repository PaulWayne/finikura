import "server-only";

// Shapes of the Strapi 5 REST responses (flat documents, no `attributes`),
// limited to the fields we read. Matches the content types in apps/strapi.

export interface StrapiMedia {
  url: string; // relative (/uploads/...) for local uploads, absolute for a CDN
  alternativeText?: string | null;
}

export interface StrapiReassuranceItem {
  title: string;
  description: string;
  icon: string;
}

export interface StrapiSocialLink {
  platform: "whatsapp" | "facebook" | "tiktok" | "instagram";
  url: string;
  label: string;
}

export interface StrapiLink {
  label: string;
  url: string;
}

export interface StrapiSeo {
  title?: string | null;
  description?: string | null;
}

export interface StrapiGlobalSettings {
  documentId: string;
  announcement_bar?: string | null;
  whatsapp_number?: string | null; // digits only, e.g. 22376000000
  whatsapp_floating_button?: boolean | null;
  founder_name?: string | null;
  founder_role?: string | null;
  exchange_days?: number | null;
  delivery_max_days?: number | null;
  social_links?: StrapiSocialLink[] | null;
  footer_links?: StrapiLink[] | null;
  reassurance_items?: StrapiReassuranceItem[] | null;
}

export interface StrapiRawBlock {
  __component: string;
  id?: number;
  image?: StrapiMedia | null;
  [key: string]: unknown;
}

export interface StrapiHomePage {
  documentId: string;
  seo?: StrapiSeo | null;
  blocks?: StrapiRawBlock[] | null;
}

export interface StrapiCategoryBanner {
  documentId: string;
  category_handle: string;
  text: string;
  image?: StrapiMedia | null;
  image_alt?: string | null;
  /** Presentation text shown under the grid (occasions, sizes, cotton), for parents and for Google. */
  seo_text?: string | null;
  /** Questions shown under the presentation text, with their FAQPage description. */
  faq?: { question: string; answer: string }[] | null;
}

export interface StrapiSizeGuide {
  documentId: string;
  category_handle: string;
  title: string;
  measuring_tips?: { text: string }[] | null;
  rows?: {
    age: string;
    height_cm: string;
    chest_cm: string;
    waist_cm: string;
    hips_cm: string;
  }[] | null;
}

export interface StrapiCampaign {
  documentId: string;
  slug: string;
  title: string;
  collection_handle: string;
  start_date: string;
  end_date: string;
  feature_on_home?: boolean | null;
  hero_cta_text?: string | null;
  headline?: string | null;
  description?: string | null;
  banner?: StrapiMedia | null;
  seo?: StrapiSeo | null;
}

export interface StrapiPage {
  documentId: string;
  slug: string;
  title: string;
  seo?: StrapiSeo | null;
  blocks?: StrapiRawBlock[] | null;
  /** Set by Strapi at each save, ISO 8601. */
  updatedAt?: string | null;
}

/** Answer of GET /api/storefront-content: every displayed document, each in its REST shape. */
export interface StrapiStorefrontContent {
  global_setting: StrapiGlobalSettings | null;
  home_page: StrapiHomePage | null;
  campaigns: StrapiCampaign[];
  category_banners: StrapiCategoryBanner[];
  size_guides: StrapiSizeGuide[];
  pages: StrapiPage[];
}

// Shapes of the single REST routes, kept by the fixtures (src/mocks/strapi).
export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: Record<string, unknown>;
}
