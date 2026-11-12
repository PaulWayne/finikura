
export interface ReassuranceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  platform: "whatsapp" | "facebook" | "tiktok";
  url: string;
  label: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface GlobalSettings {
  announcementBar: string;
  whatsappNumber: string;
  whatsappUrl: string;
  socialLinks: SocialLink[];
  footerLinks: FooterLink[];
  reassuranceItems: ReassuranceItem[];
}

export interface HeroBlockData {
  type: "hero";
  id: string | number;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CategoryCardItem {
  categoryHandle: "filles" | "garcons";
  title: string;
  ageRange: string;
  tagline?: string;
  ctaText: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CategoryCardsBlockData {
  type: "categoryCards";
  id: string | number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: CategoryCardItem[];
}

export interface ProductSectionBlockData {
  type: "productSection";
  id: string | number;
  eyebrow: string;
  title: string;
  collectionHandle: string;
}

export interface ReassuranceBlockData {
  type: "reassurance";
  id: string | number;
  items?: ReassuranceItem[];
}

export interface AboutExcerptBlockData {
  type: "aboutExcerpt";
  id: string | number;
  eyebrow: string;
  title: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}

export interface RichTextBlockData {
  type: "richText";
  id: string | number;
  title: string;
  body: string;
}

export interface ImageTextBlockData {
  type: "imageText";
  id: string | number;
  eyebrow?: string;
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ValuesBlockData {
  type: "values";
  id: string | number;
  title: string;
  items: { title: string; description: string }[];
}

export interface FaqBlockData {
  type: "faq";
  id: string | number;
  title: string;
  items: { question: string; answer: string }[];
}

export interface CtaBlockData {
  type: "cta";
  id: string | number;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

export type ContentBlock =
  | HeroBlockData
  | CategoryCardsBlockData
  | ProductSectionBlockData
  | ReassuranceBlockData
  | AboutExcerptBlockData
  | RichTextBlockData
  | ImageTextBlockData
  | ValuesBlockData
  | FaqBlockData
  | CtaBlockData;

export interface HomePageData {
  seo: {
    title: string;
    description: string;
  };
  blocks: ContentBlock[];
}

export interface Campaign {
  slug: string;
  title: string;
  collectionHandle: string;
  startDate: string;
  endDate: string;
  texts: {
    headline: string;
    description: string;
  };
  visuals: {
    bannerUrl: string;
  };
}

export interface SizeGuideRow {
  age: string;
  heightCm: string;
  chestCm: string;
  waistCm: string;
  hipsCm: string;
}

export interface SizeGuide {
  categoryHandle: "filles" | "garcons";
  title: string;
  measuringTips: string[];
  rows: SizeGuideRow[];
}

export interface EditorialPage {
  slug: string;
  title: string;
  seo: {
    title: string;
    description: string;
  };
  blocks: ContentBlock[];
}

export interface ContentService {
  getGlobalSettings(): Promise<GlobalSettings>;
  getHomePage(): Promise<HomePageData>;
  getSizeGuide(categoryHandle: string): Promise<SizeGuide | null>;
  getAllSizeGuides(): Promise<SizeGuide[]>;
  getCampaign(slug: string): Promise<Campaign | null>;
  getEditorialPage(slug: string): Promise<EditorialPage | null>;
}
