import "server-only";

// Shapes of the Medusa v2 Store API responses, limited to the fields we read.
// Checked against Medusa 2.22.6 responses (see the step 4 notes in BACKLOG.md).

export interface MedusaCalculatedPrice {
  calculated_amount: number | null;
  currency_code: string | null;
}

export interface MedusaStoreVariant {
  id: string;
  title: string;
  sku?: string | null;
  // Present when requested with `+variants.inventory_quantity` (and a sales channel key).
  inventory_quantity?: number | null;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  // Present when requested with `*variants.calculated_price` and a region_id.
  calculated_price?: MedusaCalculatedPrice | null;
}

export interface MedusaStoreCategory {
  id: string;
  name: string;
  handle: string;
  description?: string | null;
  metadata?: {
    ageRange?: string;
    tagline?: string;
    image?: string;
  } | null;
}

export interface MedusaStoreCollection {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
}

export interface MedusaStoreTag {
  id: string;
  value: string;
}

export interface MedusaStoreProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string | null;
  description?: string | null;
  material?: string | null;
  thumbnail?: string | null;
  images?: { id: string; url: string }[] | null;
  categories?: MedusaStoreCategory[] | null;
  collection?: MedusaStoreCollection | null;
  tags?: MedusaStoreTag[] | null;
  variants: MedusaStoreVariant[] | null;
  metadata?: { care_instructions?: string } & Record<string, unknown> | null;
}

export interface MedusaStoreLineItem {
  id: string;
  product_id?: string | null;
  variant_id?: string | null;
  title: string;
  product_title?: string | null;
  product_handle?: string | null;
  variant_title?: string | null;
  thumbnail?: string | null;
  unit_price: number;
  quantity: number;
  metadata?: { category_handle?: string } & Record<string, unknown> | null;
}

export interface MedusaStoreCart {
  id: string;
  items?: MedusaStoreLineItem[] | null;
  subtotal: number;
  total: number;
  currency_code: string;
}

export interface MedusaStoreAddress {
  first_name?: string | null;
  phone?: string | null;
  address_1?: string | null; // neighbourhood
  address_2?: string | null; // delivery landmarks
  city?: string | null; // Bamako
  country_code?: string | null; // ml
}

export interface MedusaStoreOrder {
  id: string;
  display_id: number;
  items?: MedusaStoreLineItem[] | null;
  total: number;
  currency_code: string;
  email: string | null;
  shipping_address?: MedusaStoreAddress | null;
  status: string;
  created_at: string;
}
