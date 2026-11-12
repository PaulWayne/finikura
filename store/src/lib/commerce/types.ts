import "server-only";

export type CategoryHandle = "filles" | "garcons";
export type OccasionTag = "tous-les-jours" | "fete" | "ceremonie";

export interface ProductVariant {
  id: string;
  title: string;
  age: string;
  price: number;
  inventoryQuantity: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description: string;
  material: string;
  careInstructions: string;
  images: string[];
  thumbnail: string;
  price: number; // Integer XOF
  categoryHandle: CategoryHandle;
  collections: string[];
  occasionTag?: OccasionTag;
  variants: ProductVariant[];
  seo: {
    title: string;
    description: string;
  };
}

export interface Category {
  id: string;
  handle: CategoryHandle;
  name: string;
  description: string;
  ageRange: string;
  tagline?: string;
  image?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
  thumbnail: string;
  categoryHandle: CategoryHandle;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  currency: "XOF";
}

export interface CustomerInput {
  fullName: string;
  phone: string;
}

export interface ShippingAddressInput {
  neighborhood: string;
  deliveryLandmarks: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  currency: "XOF";
  customer: {
    fullName: string;
    phone: string;
    technicalEmail: string;
  };
  shippingAddress: ShippingAddressInput;
  paymentMethod: "paiement_a_la_reception";
  status: "pending" | "confirmed";
  createdAt: string;
}

export interface CatalogFilterParams {
  categoryHandle: CategoryHandle;
  age?: string;
  occasion?: string;
}

export interface CommerceService {
  getCategories(): Promise<Category[]>;
  getCategoryByHandle(handle: string): Promise<Category | null>;
  getProducts(filters?: CatalogFilterParams): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product | null>;
  getCollectionProducts(collectionHandle: string, limit?: number): Promise<Product[]>;
  getCart(cartId?: string | null): Promise<Cart>;
  addItemToCart(cartId: string | null, variantId: string, quantity?: number): Promise<{ cart: Cart; addedItem: CartItem }>;
  updateCartItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Cart>;
  removeItemFromCart(cartId: string, itemId: string): Promise<Cart>;
  placeOrder(cartId: string, customer: CustomerInput, shippingAddress: ShippingAddressInput): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
}
