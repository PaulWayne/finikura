import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CatalogFilterParams, CommerceService } from "./types";
import { mockCommerceService } from "./mock";
import { liveCommerceService } from "./live";

const source: CommerceService =
  process.env.COMMERCE_SOURCE === "live" ? liveCommerceService : mockCommerceService;

// Catalog reads are shared by every visitor: cached and invalidated by tag.
async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog);
  return source.getCategories();
}
async function getCategoryByHandle(handle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog);
  return source.getCategoryByHandle(handle);
}
async function getProducts(filters?: CatalogFilterParams) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog);
  return source.getProducts(filters);
}
async function getProductByHandle(handle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog);
  return source.getProductByHandle(handle);
}
async function getCollectionProducts(collectionHandle: string, limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.catalog);
  return source.getCollectionProducts(collectionHandle, limit);
}

// Cart and order data are per visitor and never cached.
export const commerceService: CommerceService = {
  getCategories,
  getCategoryByHandle,
  getProducts,
  getProductByHandle,
  getCollectionProducts,
  getCart: (cartId) => source.getCart(cartId),
  addItemToCart: (cartId, variantId, quantity) => source.addItemToCart(cartId, variantId, quantity),
  updateCartItemQuantity: (cartId, itemId, quantity) =>
    source.updateCartItemQuantity(cartId, itemId, quantity),
  removeItemFromCart: (cartId, itemId) => source.removeItemFromCart(cartId, itemId),
  placeOrder: (cartId, customer, address) => source.placeOrder(cartId, customer, address),
  getOrderById: (orderId) => source.getOrderById(orderId),
};

export * from "./types";
