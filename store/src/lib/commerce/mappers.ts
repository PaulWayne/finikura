import "server-only";
import {
  MedusaStoreCategory,
  MedusaStoreCollection,
  MedusaStoreProduct,
  MedusaStoreVariant,
  MedusaStoreCart,
  MedusaStoreOrder,
} from "./raw";
import {
  Category,
  Collection,
  Product,
  ProductVariant,
  Cart,
  Order,
  CategoryHandle,
  OccasionTag,
} from "./types";

export function mapMedusaVariantToDomain(raw: MedusaStoreVariant): ProductVariant {
  const xofPrice = raw.prices.find((p) => p.currency_code.toLowerCase() === "xof")?.amount ??
    raw.prices[0]?.amount ?? 0;

  return {
    id: raw.id,
    title: raw.title,
    age: raw.title,
    price: Math.round(xofPrice),
    inventoryQuantity: raw.inventory_quantity,
    inStock: raw.inventory_quantity > 0,
  };
}

export function mapMedusaProductToDomain(raw: MedusaStoreProduct): Product {
  const variants = (raw.variants || []).map(mapMedusaVariantToDomain);
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

  const rawCatHandle = raw.categories?.[0]?.handle;
  const categoryHandle: CategoryHandle = rawCatHandle === "garcons" ? "garcons" : "filles";

  const occasionTag = raw.tags?.find((t) =>
    ["tous-les-jours", "fete", "ceremonie"].includes(t.value)
  )?.value as OccasionTag | undefined;

  const images = (raw.images || []).map((img) => img.url);
  if (images.length === 0 && raw.thumbnail) {
    images.push(raw.thumbnail);
  }

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description || "",
    material: raw.material || "100% Lin pur d'artisanat",
    careInstructions: raw.care_instructions || "Lavage délicat à 30°C. Séchage à l'ombre.",
    images,
    thumbnail: raw.thumbnail || images[0] || "",
    price: minPrice,
    categoryHandle,
    collections: raw.collection?.handle ? [raw.collection.handle] : [],
    occasionTag,
    variants,
    seo: {
      title: `${raw.title} — Fini Kura Bamako`,
      description: raw.description || `Confection d'exception pour enfants à Bamako. ${raw.title}.`,
    },
  };
}

export function mapMedusaCategoryToDomain(raw: MedusaStoreCategory): Category {
  const handle: CategoryHandle = raw.handle === "garcons" ? "garcons" : "filles";
  return {
    id: raw.id,
    handle,
    name: raw.name,
    description: raw.description || "",
    ageRange: raw.metadata?.ageRange || "3 à 14 ans",
    tagline: raw.metadata?.tagline,
    image: raw.metadata?.image,
  };
}

export function mapMedusaCollectionToDomain(raw: MedusaStoreCollection): Collection {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
  };
}

export function mapMedusaCartToDomain(raw: MedusaStoreCart): Cart {
  return {
    id: raw.id,
    items: raw.items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productHandle: (item.metadata?.product_handle as string) || "",
      productTitle: item.title,
      variantId: item.variant_id,
      variantTitle: (item.metadata?.variant_title as string) || "",
      price: Math.round(item.unit_price),
      quantity: item.quantity,
      thumbnail: item.thumbnail || "",
      categoryHandle: ((item.metadata?.category_handle as string) || "filles") as CategoryHandle,
    })),
    subtotal: Math.round(raw.subtotal),
    total: Math.round(raw.total),
    currency: "XOF",
  };
}

export function mapMedusaOrderToDomain(raw: MedusaStoreOrder): Order {
  return {
    id: raw.id,
    orderNumber: `FK-${raw.display_id}`,
    items: raw.items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productHandle: (item.metadata?.product_handle as string) || "",
      productTitle: item.title,
      variantId: item.variant_id,
      variantTitle: (item.metadata?.variant_title as string) || "",
      price: Math.round(item.unit_price),
      quantity: item.quantity,
      thumbnail: item.thumbnail || "",
      categoryHandle: ((item.metadata?.category_handle as string) || "filles") as CategoryHandle,
    })),
    total: Math.round(raw.total),
    currency: "XOF",
    customer: {
      fullName: `${raw.customer.first_name} ${raw.customer.last_name}`.trim(),
      phone: raw.customer.phone,
      technicalEmail: raw.customer.email,
    },
    shippingAddress: {
      neighborhood: raw.shipping_address.address_1,
      deliveryLandmarks: raw.shipping_address.address_2,
    },
    paymentMethod: "paiement_a_la_reception",
    status: "pending",
    createdAt: raw.created_at,
  };
}

/**
 * TODO: Medusa v2 Store API requires an email to create a customer order record.
 * Generates an internal technical email from phone number for the Medusa backend.
 * The UI never exposes this technical email to the user.
 */
export function generateTechnicalEmailFromPhone(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `client.${cleanPhone}@commande.finikura.ml`;
}
