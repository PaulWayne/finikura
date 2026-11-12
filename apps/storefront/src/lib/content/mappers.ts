import "server-only";
import {
  StrapiGlobalSettingsResponse,
  StrapiHomePageResponse,
  StrapiRawBlock,
  StrapiSizeGuideItem,
  StrapiCampaignItem,
  StrapiEditorialPageItem,
} from "./raw";
import {
  GlobalSettings,
  HomePageData,
  ContentBlock,
  HeroBlockData,
  CategoryCardsBlockData,
  ProductSectionBlockData,
  ReassuranceBlockData,
  AboutExcerptBlockData,
  RichTextBlockData,
  ImageTextBlockData,
  ValuesBlockData,
  FaqBlockData,
  CtaBlockData,
  SizeGuide,
  Campaign,
  EditorialPage,
} from "./types";

export function mapStrapiBlockToDomain(raw: StrapiRawBlock): ContentBlock | null {
  switch (raw.__component) {
    case "blocks.hero":
      return {
        type: "hero",
        id: raw.id,
        eyebrow: (raw.eyebrow as string) || "",
        title: (raw.title as string) || "",
        subtitle: (raw.subtitle as string) || "",
        ctaText: (raw.cta_text as string) || "DÉCOUVRIR",
        ctaLink: (raw.cta_link as string) || "#",
        imageUrl: (raw.image_url as string) || "",
        imageAlt: (raw.image_alt as string) || (raw.title as string) || "",
      } as HeroBlockData;

    case "blocks.category-cards":
      return {
        type: "categoryCards",
        id: raw.id,
        eyebrow: (raw.eyebrow as string) || "",
        title: (raw.title as string) || "",
        subtitle: (raw.subtitle as string) || "",
        cards: ((raw.cards as Array<Record<string, string>>) || []).map((c) => ({
          categoryHandle: (c.category_handle === "garcons" ? "garcons" : "filles") as "filles" | "garcons",
          title: c.title || "",
          ageRange: c.age_range || "3-14 ANS",
          tagline: c.tagline,
          ctaText: c.cta_text || "DÉCOUVRIR",
          imageUrl: c.image_url || "",
          imageAlt: c.image_alt || c.title || "",
        })),
      } as CategoryCardsBlockData;

    case "blocks.product-section":
      return {
        type: "productSection",
        id: raw.id,
        eyebrow: (raw.eyebrow as string) || "",
        title: (raw.title as string) || "",
        collectionHandle: (raw.collection_handle as string) || "nouveautes",
      } as ProductSectionBlockData;

    case "blocks.reassurance":
      return {
        type: "reassurance",
        id: raw.id,
      } as ReassuranceBlockData;

    case "blocks.about-excerpt":
      return {
        type: "aboutExcerpt",
        id: raw.id,
        eyebrow: (raw.eyebrow as string) || "",
        title: (raw.title as string) || "",
        content: (raw.content as string) || "",
        ctaText: (raw.cta_text as string) || "NOTRE HISTOIRE",
        ctaLink: (raw.cta_link as string) || "/notre-histoire",
        imageUrl: (raw.image_url as string) || "",
        imageAlt: (raw.image_alt as string) || "",
      } as AboutExcerptBlockData;

    case "blocks.rich-text":
      return {
        type: "richText",
        id: raw.id,
        title: (raw.title as string) || "",
        body: (raw.body as string) || "",
      } as RichTextBlockData;

    case "blocks.image-text":
      return {
        type: "imageText",
        id: raw.id,
        eyebrow: raw.eyebrow as string | undefined,
        title: (raw.title as string) || "",
        text: (raw.text as string) || "",
        imageUrl: (raw.image_url as string) || "",
        imageAlt: (raw.image_alt as string) || "",
      } as ImageTextBlockData;

    case "blocks.values":
      return {
        type: "values",
        id: raw.id,
        title: (raw.title as string) || "",
        items: (raw.items as Array<{ title: string; description: string }>) || [],
      } as ValuesBlockData;

    case "blocks.faq":
      return {
        type: "faq",
        id: raw.id,
        title: (raw.title as string) || "",
        items: (raw.items as Array<{ question: string; answer: string }>) || [],
      } as FaqBlockData;

    case "blocks.cta":
      return {
        type: "cta",
        id: raw.id,
        title: (raw.title as string) || "",
        subtitle: raw.subtitle as string | undefined,
        ctaText: (raw.cta_text as string) || "EN SAVOIR PLUS",
        ctaLink: (raw.cta_link as string) || "#",
      } as CtaBlockData;

    default:
      // Unknown block types are ignored per rules
      return null;
  }
}

export function mapStrapiGlobalSettingsToDomain(
  raw: StrapiGlobalSettingsResponse
): GlobalSettings {
  const attrs = raw.data.attributes;
  return {
    announcementBar: attrs.announcement_bar,
    whatsappNumber: attrs.whatsapp_number,
    whatsappUrl: attrs.whatsapp_url,
    socialLinks: attrs.social_links.map((s) => ({
      platform: s.platform,
      url: s.url,
      label: s.label,
    })),
    footerLinks: attrs.footer_links.map((f) => ({
      label: f.label,
      url: f.url,
    })),
    reassuranceItems: attrs.reassurance_items.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      icon: r.icon,
    })),
  };
}

export function mapStrapiHomePageToDomain(
  raw: StrapiHomePageResponse
): HomePageData {
  const attrs = raw.data.attributes;
  const blocks: ContentBlock[] = [];

  for (const rawBlock of attrs.blocks || []) {
    const mapped = mapStrapiBlockToDomain(rawBlock);
    if (mapped) {
      blocks.push(mapped);
    }
  }

  return {
    seo: {
      title: attrs.seo?.title || "Fini Kura — Habits pour enfants",
      description: attrs.seo?.description || "",
    },
    blocks,
  };
}

export function mapStrapiSizeGuideToDomain(raw: StrapiSizeGuideItem): SizeGuide {
  const attrs = raw.attributes;
  return {
    categoryHandle: (attrs.category_handle === "garcons" ? "garcons" : "filles") as "filles" | "garcons",
    title: attrs.title,
    measuringTips: attrs.measuring_tips || [],
    rows: (attrs.rows || []).map((r) => ({
      age: r.age,
      heightCm: r.height_cm,
      chestCm: r.chest_cm,
      waistCm: r.waist_cm,
      hipsCm: r.hips_cm,
    })),
  };
}

export function mapStrapiCampaignToDomain(raw: StrapiCampaignItem): Campaign {
  const attrs = raw.attributes;
  return {
    slug: attrs.slug,
    title: attrs.title,
    collectionHandle: attrs.collection_handle,
    startDate: attrs.start_date,
    endDate: attrs.end_date,
    texts: {
      headline: attrs.texts?.headline || "",
      description: attrs.texts?.description || "",
    },
    visuals: {
      bannerUrl: attrs.visuals?.banner_url || "",
    },
  };
}

export function mapStrapiEditorialPageToDomain(
  raw: StrapiEditorialPageItem
): EditorialPage {
  const attrs = raw.attributes;
  const blocks: ContentBlock[] = [];

  for (const rawBlock of attrs.blocks || []) {
    const mapped = mapStrapiBlockToDomain(rawBlock);
    if (mapped) {
      blocks.push(mapped);
    }
  }

  return {
    slug: attrs.slug,
    title: attrs.title,
    seo: {
      title: attrs.seo?.title || attrs.title,
      description: attrs.seo?.description || "",
    },
    blocks,
  };
}
