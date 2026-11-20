import type { Product } from "@/lib/commerce/types";
import type { ContentBlock, GlobalSettings, SocialLink } from "@/lib/content/types";
import { absoluteUrl } from "@/lib/site";
import { BRAND_NAME } from "@/lib/seo";
import { messages } from "@/messages/fr";

// schema.org descriptions of the pages, read by Google and the AI assistants (audit marketing,
// « Données structurées »). Built only from what the page already shows: Medusa for the
// outfits, Strapi for the shop and its questions. Nothing here is written for the engines alone.

type JsonLdObject = Record<string, unknown>;

const SCHEMA = "https://schema.org";

type ShopFacts = Pick<GlobalSettings, "founderName" | "founderRole" | "exchangeDays" | "deliveryMaxDays">;

/** The founder as typed in the Strapi global settings; nothing when the name is empty. */
function founderOf(shop: ShopFacts): JsonLdObject {
  if (!shop.founderName) return {};
  return {
    founder: {
      "@type": "Person",
      name: shop.founderName,
      ...(shop.founderRole ? { jobTitle: shop.founderRole } : {}),
    },
  };
}

/**
 * What an order comes with, from the Strapi global settings: exchange only (no refund, the
 * courier's trip paid by the customer) and home delivery in Bamako. No delivery rate: the amount
 * is confirmed on WhatsApp, never shown. A number left empty in Strapi leaves its part out.
 */
function offerTerms(shop: ShopFacts): JsonLdObject {
  return {
    ...(shop.exchangeDays
      ? {
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "ML",
            returnPolicyCategory: `${SCHEMA}/MerchantReturnFiniteReturnWindow`,
            merchantReturnDays: shop.exchangeDays,
            refundType: `${SCHEMA}/ExchangeRefund`,
            returnFees: `${SCHEMA}/ReturnFeesCustomerResponsibility`,
            itemCondition: `${SCHEMA}/NewCondition`,
          },
        }
      : {}),
    ...(shop.deliveryMaxDays
      ? {
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "ML", addressRegion: "Bamako" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: shop.deliveryMaxDays, unitCode: "DAY" },
            },
          },
        }
      : {}),
  };
}

/** The shop: an online store serving Bamako, linked to its Facebook and TikTok pages. */
export function storeJsonLd(socialLinks: SocialLink[], shop: ShopFacts): JsonLdObject {
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
    ...founderOf(shop),
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
export function productJsonLd(product: Product, shop: ShopFacts): JsonLdObject {
  const terms = offerTerms(shop);
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
      ...terms,
    })),
  };
}

/** Notre histoire: the shop and the woman who founded it, as the page signs it. */
export function aboutJsonLd(
  page: { slug: string; title: string; description: string; updatedAt: string | null },
  shop: ShopFacts
): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "AboutPage",
    name: page.title,
    url: absoluteUrl(`/${page.slug}`),
    ...(page.description ? { description: page.description } : {}),
    ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
    inLanguage: "fr",
    mainEntity: {
      "@type": "OnlineStore",
      name: BRAND_NAME,
      url: absoluteUrl("/"),
      areaServed: { "@type": "City", name: "Bamako" },
      ...founderOf(shop),
    },
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
