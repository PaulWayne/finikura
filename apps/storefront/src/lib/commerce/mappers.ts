import { ageBand, inAgeBand } from "@/lib/catalog-filters";
import "server-only";
import {
  MedusaStoreCategory,
  MedusaStoreCollection,
  MedusaStoreProduct,
  MedusaStoreVariant,
  MedusaStoreCart,
  MedusaStoreOrder,
  MedusaStoreLineItem,
} from "./raw";
import {
  Category,
  Collection,
  Product,
  ProductVideo,
  ProductVariant,
  Cart,
  Order,
  CartItem,
  CategoryHandle,
  OccasionTag,
} from "./types";

const OCCASION_TAGS: OccasionTag[] = ["tous-les-jours", "fete", "ceremonie"];

const toCategoryHandle = (handle?: string | null): CategoryHandle =>
  handle === "garcons" ? "garcons" : "filles";

export function mapMedusaVariantToDomain(raw: MedusaStoreVariant): ProductVariant {
  const price = Math.round(raw.calculated_price?.calculated_amount ?? 0);
  // Without inventory management Medusa does not limit the quantity.
  const inventoryQuantity =
    raw.manage_inventory === false ? Number.MAX_SAFE_INTEGER : Math.max(0, raw.inventory_quantity ?? 0);
  return {
    id: raw.id,
    title: raw.title,
    age: raw.title,
    price,
    inventoryQuantity,
    inStock: inventoryQuantity > 0 || raw.allow_backorder === true,
  };
}

/**
 * Age filter: the size for this age exists and can still be ordered. The filter value is the
 * variant title itself (FK-19), compared exactly: « 3-4 ans » must not match « 13-14 ans ».
 */
export function hasAgeInStock(raw: MedusaStoreProduct, age: string): boolean {
  const wanted = age.trim().toLowerCase();
  const band = ageBand(wanted);
  return (raw.variants ?? []).some(
    (v) =>
      (band ? inAgeBand(v.title, band) : v.title.trim().toLowerCase() === wanted) &&
      mapMedusaVariantToDomain(v).inStock,
  );
}

/**
 * Product metadata « fk_videos » (FK-38): a JSON list written by the Medusa admin, where the
 * manager drops her phone videos. Only the clips that are ready are shown. AV1 is about 40 %
 * lighter than H.264 at the same quality; H.264 plays everywhere, so it is the fallback.
 */
function mapVideos(metadata: Record<string, unknown> | null | undefined, fallbackPoster: string): ProductVideo[] {
  const raw = metadata?.fk_videos;
  if (typeof raw !== "string" || !raw.trim()) return [];
  let list: unknown;
  try {
    list = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : "");
  return list.flatMap((entry: Record<string, unknown> | null) => {
    if (!entry || entry.status !== "ready") return [];
    const sources = [
      { src: text(entry.av1_url), type: 'video/mp4; codecs="av01.0.04M.08"' },
      { src: text(entry.mp4_url), type: "video/mp4" },
    ].filter((source) => source.src);
    if (sources.length === 0) return [];
    return [{ sources, poster: text(entry.poster_url) || fallbackPoster, caption: text(entry.caption) || null }];
  });
}

/** First age of a size title (« 13-14 ans » → 13); titles without a number go last. */
const ageStart = (title: string) => {
  const match = title.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

export function mapMedusaProductToDomain(raw: MedusaStoreProduct): Product {
  // Sizes read from the youngest to the oldest (« 3-4 ans » before « 13-14 ans »), whatever the order in Medusa.
  const variants = (raw.variants ?? []).map(mapMedusaVariantToDomain).sort((a, b) => ageStart(a.title) - ageStart(b.title));
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

  const occasionTag = raw.tags?.find((t) =>
    OCCASION_TAGS.includes(t.value as OccasionTag)
  )?.value as OccasionTag | undefined;

  const images = (raw.images ?? []).map((img) => img.url);
  if (images.length === 0 && raw.thumbnail) {
    images.push(raw.thumbnail);
  }
  const description = raw.description ?? "";
  // Product metadata « photo_portee_<n> » (n = position in the gallery, from 1):
  // Medusa 2.22 cannot edit image metadata from the admin, product metadata it can.
  const wornCaptions = images.map((_, i) => {
    const value = raw.metadata?.[`photo_portee_${i + 1}`];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  });

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    subtitle: raw.subtitle ?? undefined,
    description,
    material: raw.material ?? "",
    careInstructions: raw.metadata?.care_instructions ?? "",
    images,
    wornCaptions,
    videos: mapVideos(raw.metadata, raw.thumbnail || images[0] || ""),
    thumbnail: raw.thumbnail || images[0] || "",
    price: minPrice,
    categoryHandle: toCategoryHandle(raw.categories?.[0]?.handle),
    collections: raw.collection?.handle ? [raw.collection.handle] : [],
    occasionTag,
    variants,
    seo: {
      title: raw.title,
      description,
    },
  };
}

export function mapMedusaCategoryToDomain(raw: MedusaStoreCategory): Category {
  return {
    id: raw.id,
    handle: toCategoryHandle(raw.handle),
    name: raw.name,
    description: raw.description ?? "",
    ageRange: raw.metadata?.ageRange ?? "",
    tagline: raw.metadata?.tagline ?? undefined,
    image: raw.metadata?.image ?? undefined,
  };
}

export function mapMedusaCollectionToDomain(raw: MedusaStoreCollection): Collection {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description ?? undefined,
  };
}

export function mapMedusaLineItemToDomain(item: MedusaStoreLineItem): CartItem {
  return {
    id: item.id,
    productId: item.product_id ?? "",
    productHandle: item.product_handle ?? "",
    productTitle: item.product_title ?? item.title,
    variantId: item.variant_id ?? "",
    variantTitle: item.variant_title ?? "",
    price: Math.round(item.unit_price),
    quantity: item.quantity,
    thumbnail: item.thumbnail ?? "",
    categoryHandle: toCategoryHandle(item.metadata?.category_handle),
  };
}

export function mapMedusaCartToDomain(raw: MedusaStoreCart): Cart {
  return {
    id: raw.id,
    items: (raw.items ?? []).map(mapMedusaLineItemToDomain),
    subtotal: Math.round(raw.subtotal),
    total: Math.round(raw.total),
    currency: "XOF",
  };
}

export function mapMedusaOrderToDomain(raw: MedusaStoreOrder): Order {
  const address = raw.shipping_address ?? {};
  return {
    id: raw.id,
    orderNumber: `FK-${raw.display_id}`,
    items: (raw.items ?? []).map(mapMedusaLineItemToDomain),
    total: Math.round(raw.total),
    currency: "XOF",
    customer: {
      fullName: address.first_name ?? "",
      phone: address.phone ?? "",
    },
    shippingAddress: {
      neighborhood: address.address_1 ?? "",
      deliveryLandmarks: address.address_2 ?? "",
    },
    paymentMethod: "paiement_a_la_reception",
    status: "pending",
    createdAt: raw.created_at,
  };
}
