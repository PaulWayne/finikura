import "server-only";

export interface MedusaStoreVariantPrice {
  id?: string;
  currency_code: string;
  amount: number;
}

export interface MedusaStoreVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  prices: MedusaStoreVariantPrice[];
  options?: { id?: string; value: string }[];
}

export interface MedusaStoreCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  metadata?: {
    ageRange?: string;
    tagline?: string;
    image?: string;
  };
}

export interface MedusaStoreCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
}

export interface MedusaStoreTag {
  id: string;
  value: string;
}

export interface MedusaStoreProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  material?: string;
  care_instructions?: string;
  thumbnail?: string;
  images?: { id: string; url: string }[];
  categories?: MedusaStoreCategory[];
  collection?: MedusaStoreCollection;
  tags?: MedusaStoreTag[];
  variants: MedusaStoreVariant[];
  metadata?: Record<string, unknown>;
}

export interface MedusaStoreCartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  unit_price: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export interface MedusaStoreCart {
  id: string;
  items: MedusaStoreCartItem[];
  subtotal: number;
  total: number;
  currency_code: string;
}

export interface MedusaStoreOrder {
  id: string;
  display_id: number;
  items: MedusaStoreCartItem[];
  total: number;
  currency_code: string;
  customer: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  shipping_address: {
    address_1: string; // neighborhood
    address_2: string; // delivery landmarks
    city: string; // Bamako
    country_code: string; // ml
  };
  status: string;
  created_at: string;
}
