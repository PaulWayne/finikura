import "server-only";
import {
  StrapiCampaign,
  StrapiGlobalSettings,
  StrapiHomePage,
  StrapiMedia,
  StrapiPage,
  StrapiRawBlock,
  StrapiSizeGuide,
} from "./raw";
import {
  GlobalSettings,
  HomePageData,
  ContentBlock,
  CategoryCardItem,
  SizeGuide,
  Campaign,
  EditorialPage,
} from "./types";

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const optStr = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);
const toCategoryHandle = (v: unknown): "filles" | "garcons" => (v === "garcons" ? "garcons" : "filles");

/**
 * Local Strapi uploads come back as /uploads/...; make them absolute with the public Strapi URL
 * (STRAPI_PUBLIC_URL), since STRAPI_URL may be an internal address in production.
 */
export function mediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media?.url) return "";
  if (/^https?:\/\//.test(media.url)) return media.url;
  const base = (process.env.STRAPI_PUBLIC_URL ?? process.env.STRAPI_URL ?? "").replace(/\/$/, "");
  return `${base}${media.url}`;
}

const imageAlt = (raw: { image?: StrapiMedia | null; image_alt?: unknown }) =>
  str(raw.image_alt) || raw.image?.alternativeText || "";

export function mapStrapiBlockToDomain(raw: StrapiRawBlock): ContentBlock | null {
  const id = raw.id ?? raw.__component;
  switch (raw.__component) {
    case "blocks.hero":
      return {
        type: "hero",
        id,
        eyebrow: str(raw.eyebrow),
        title: str(raw.title),
        subtitle: str(raw.subtitle),
        ctaText: str(raw.cta_text),
        ctaLink: str(raw.cta_link),
        imageUrl: mediaUrl(raw.image),
        imageAlt: imageAlt(raw),
      };

    case "blocks.category-cards": {
      const cards = (raw.cards as Array<Record<string, unknown>> | undefined) ?? [];
      return {
        type: "categoryCards",
        id,
        eyebrow: str(raw.eyebrow),
        title: str(raw.title),
        subtitle: str(raw.subtitle),
        cards: cards.map(
          (c): CategoryCardItem => ({
            categoryHandle: toCategoryHandle(c.category_handle),
            title: str(c.title),
            ageRange: str(c.age_range),
            tagline: optStr(c.tagline),
            ctaText: str(c.cta_text),
            imageUrl: mediaUrl(c.image as StrapiMedia | null),
            imageAlt: str(c.image_alt) || (c.image as StrapiMedia | null)?.alternativeText || "",
          })
        ),
      };
    }

    case "blocks.product-section":
      // Rendered only if Medusa knows the collection (checked when rendering).
      return raw.collection_handle
        ? {
            type: "productSection",
            id,
            eyebrow: str(raw.eyebrow),
            title: str(raw.title),
            collectionHandle: str(raw.collection_handle),
          }
        : null;

    case "blocks.reassurance":
      return { type: "reassurance", id };

    case "blocks.about-excerpt":
      return {
        type: "aboutExcerpt",
        id,
        eyebrow: str(raw.eyebrow),
        title: str(raw.title),
        content: str(raw.content),
        ctaText: str(raw.cta_text),
        ctaLink: str(raw.cta_link),
        imageUrl: mediaUrl(raw.image),
        imageAlt: imageAlt(raw),
      };

    case "blocks.rich-text":
      return { type: "richText", id, title: str(raw.title), body: str(raw.body) };

    case "blocks.image-text":
      return {
        type: "imageText",
        id,
        eyebrow: optStr(raw.eyebrow),
        title: str(raw.title),
        text: str(raw.text),
        imageUrl: mediaUrl(raw.image),
        imageAlt: imageAlt(raw),
      };

    case "blocks.values":
      return {
        type: "values",
        id,
        title: str(raw.title),
        items: ((raw.items as Array<Record<string, unknown>> | undefined) ?? []).map((i) => ({
          title: str(i.title),
          description: str(i.description),
        })),
      };

    case "blocks.faq":
      return {
        type: "faq",
        id,
        title: str(raw.title),
        items: ((raw.items as Array<Record<string, unknown>> | undefined) ?? []).map((i) => ({
          question: str(i.question),
          answer: str(i.answer),
        })),
      };

    case "blocks.cta":
      return {
        type: "cta",
        id,
        title: str(raw.title),
        subtitle: optStr(raw.subtitle),
        ctaText: str(raw.cta_text),
        ctaLink: str(raw.cta_link),
      };

    default:
      // Unknown block types are ignored.
      return null;
  }
}

const mapBlocks = (blocks: StrapiRawBlock[] | null | undefined): ContentBlock[] =>
  (blocks ?? []).map(mapStrapiBlockToDomain).filter((b): b is ContentBlock => b !== null);

export function mapStrapiGlobalSettingsToDomain(raw: StrapiGlobalSettings | null): GlobalSettings {
  const number = (raw?.whatsapp_number ?? "").replace(/\D/g, "");
  return {
    announcementBar: raw?.announcement_bar ?? "",
    whatsappNumber: number,
    whatsappUrl: number ? `https://wa.me/${number}` : "",
    // The WhatsApp link always uses whatsapp_number, never a second copy of it.
    socialLinks: (raw?.social_links ?? [])
      .map((s) => ({
        platform: s.platform,
        url: s.platform === "whatsapp" ? (number ? `https://wa.me/${number}` : "") : s.url,
        label: s.label,
      }))
      .filter((s) => s.url),
    footerLinks: (raw?.footer_links ?? []).map((f) => ({ label: f.label, url: f.url })),
    reassuranceItems: (raw?.reassurance_items ?? []).map((r, i) => ({
      id: String(i),
      title: r.title,
      description: r.description,
      icon: r.icon,
    })),
  };
}

export function mapStrapiHomePageToDomain(raw: StrapiHomePage | null): HomePageData {
  return {
    seo: {
      title: raw?.seo?.title ?? "",
      description: raw?.seo?.description ?? "",
    },
    blocks: mapBlocks(raw?.blocks),
  };
}

export function mapStrapiSizeGuideToDomain(raw: StrapiSizeGuide): SizeGuide {
  return {
    categoryHandle: toCategoryHandle(raw.category_handle),
    title: raw.title,
    measuringTips: (raw.measuring_tips ?? []).map((t) => t.text),
    rows: (raw.rows ?? []).map((r) => ({
      age: r.age,
      heightCm: r.height_cm,
      chestCm: r.chest_cm,
      waistCm: r.waist_cm,
      hipsCm: r.hips_cm,
    })),
  };
}

export function mapStrapiCampaignToDomain(raw: StrapiCampaign): Campaign {
  return {
    slug: raw.slug,
    title: raw.title,
    collectionHandle: raw.collection_handle,
    startDate: raw.start_date,
    endDate: raw.end_date,
    texts: {
      headline: raw.headline ?? "",
      description: raw.description ?? "",
    },
    visuals: { bannerUrl: mediaUrl(raw.banner) },
  };
}

export function mapStrapiEditorialPageToDomain(raw: StrapiPage): EditorialPage {
  return {
    slug: raw.slug,
    title: raw.title,
    seo: {
      title: raw.seo?.title || raw.title,
      description: raw.seo?.description ?? "",
    },
    blocks: mapBlocks(raw.blocks),
  };
}
