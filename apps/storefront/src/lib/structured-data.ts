import type { Product } from "@/lib/commerce/types";
import type { ContentBlock, SocialLink } from "@/lib/content/types";
import { absoluteUrl } from "@/lib/site";
import { BRAND_NAME } from "@/lib/seo";
import { messages } from "@/messages/fr";

// schema.org descriptions of the pages, read by Google and the AI assistants (audit marketing,
// « Données structurées »). Built only from what the page already shows: Medusa for the
// outfits, Strapi for the shop and its questions. Nothing here is written for the engines alone.

type JsonLdObject = Record<string, unknown>;

const SCHEMA = "https://schema.org";

/** The shop: an online store serving Bamako, linked to its Facebook and TikTok pages. */
export function storeJsonLd(socialLinks: SocialLink[]): JsonLdObject {
  const sameAs = socialLinks.filter((link) => link.platform !== "whatsapp" && link.url).map((link) => link.url);
  return {
    "@context": SCHEMA,
    "@type": "OnlineStore",
    name: BRAND_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/pwa-icon/512"),
    description: messages.meta.defaultDescription,
    areaServed: { "@type": "City", name: "Bamako" },
    currenciesAccepted: "XOF",
    paymentAccepted: messages.structuredData.paymentAccepted,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Breadcrumb as shown at the top of the page, the home page first. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: [{ name: messages.catalog.homeBreadcrumb, path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** An outfit, with one offer per size: its price in FCFA and whether it is still in stock. */
export function productJsonLd(product: Product): JsonLdObject {
  const url = absoluteUrl(`/produit/${product.handle}`);
  const images = (product.images.length > 0 ? product.images : [product.thumbnail]).filter(Boolean).map(absoluteUrl);
  return {
    "@context": SCHEMA,
    "@type": "Product",
    name: product.title,
    description: product.description,
    url,
    ...(images.length > 0 ? { image: images } : {}),
    brand: { "@type": "Brand", name: BRAND_NAME },
    ...(product.material ? { material: product.material } : {}),
    audience: { "@type": "PeopleAudience", suggestedMinAge: 3, suggestedMaxAge: 14 },
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      name: variant.age,
      price: variant.price,
      priceCurrency: "XOF",
      availability: variant.inStock ? `${SCHEMA}/InStock` : `${SCHEMA}/OutOfStock`,
      itemCondition: `${SCHEMA}/NewCondition`,
      url,
    })),
  };
}

type FaqItem = { question: string; answer: string };

/** The questions of the FAQ blocks of a page (home page, editorial pages). */
export function faqItemsOf(blocks: ContentBlock[]): FaqItem[] {
  return blocks.flatMap((block) => (block.type === "faq" ? block.items : []));
}

/** The questions and answers shown on a page, as they are shown; null when there are none. */
export function faqJsonLd(items: FaqItem[]): JsonLdObject | null {
  const answered = items.filter((item) => item.question.trim() && item.answer.trim());
  if (answered.length === 0) return null;
  return {
    "@context": SCHEMA,
    "@type": "FAQPage",
    mainEntity: answered.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
