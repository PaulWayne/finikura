import "server-only";
import {
  CommerceService,
  Category,
  Product,
  Cart,
  Order,
  CatalogFilterParams,
  CustomerInput,
  ShippingAddressInput,
  CartItem,
} from "./types";

export const liveCommerceService: CommerceService = {
  async getCategories(): Promise<Category[]> {
    // TODO: Connect to Medusa v2 Store API: GET /store/product-categories
    throw new Error("Not implemented: getCategories (GET /store/product-categories)");
  },

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    // TODO: Connect to Medusa v2 Store API: GET /store/product-categories?handle={handle}
    throw new Error(`Not implemented: getCategoryByHandle (GET /store/product-categories?handle=${handle})`);
  },

  async getProducts(_filters?: CatalogFilterParams): Promise<Product[]> {
    // TODO: Connect to Medusa v2 Store API: GET /store/products?category_id[]={id}&expand=variants,images,tags
    throw new Error("Not implemented: getProducts (GET /store/products)");
  },

  async getProductByHandle(handle: string): Promise<Product | null> {
    // TODO: Connect to Medusa v2 Store API: GET /store/products?handle={handle}&expand=variants,images,tags
    throw new Error(`Not implemented: getProductByHandle (GET /store/products?handle=${handle})`);
  },

  async getCollectionProducts(collectionHandle: string, _limit = 4): Promise<Product[]> {
    // TODO: Connect to Medusa v2 Store API: GET /store/products?collection_id[]={colId}
    throw new Error(`Not implemented: getCollectionProducts for ${collectionHandle}`);
  },

  async getCart(cartId?: string | null): Promise<Cart> {
    // TODO: Connect to Medusa v2 Store API: GET /store/carts/{cartId}
    throw new Error(`Not implemented: getCart (${cartId})`);
  },

  async addItemToCart(
    _cartId: string | null,
    _variantId: string,
    _quantity = 1
  ): Promise<{ cart: Cart; addedItem: CartItem }> {
    // TODO: Connect to Medusa v2 Store API: POST /store/carts/{cartId}/line-items
    throw new Error("Not implemented: addItemToCart (POST /store/carts/{cartId}/line-items)");
  },

  async updateCartItemQuantity(
    _cartId: string,
    _itemId: string,
    _quantity: number
  ): Promise<Cart> {
    // TODO: Connect to Medusa v2 Store API: POST /store/carts/{cartId}/line-items/{itemId}
    throw new Error("Not implemented: updateCartItemQuantity");
  },

  async removeItemFromCart(_cartId: string, _itemId: string): Promise<Cart> {
    // TODO: Connect to Medusa v2 Store API: DELETE /store/carts/{cartId}/line-items/{itemId}
    throw new Error("Not implemented: removeItemFromCart");
  },

  async placeOrder(
    _cartId: string,
    _customer: CustomerInput,
    _shippingAddress: ShippingAddressInput
  ): Promise<Order> {
    // TODO: Connect to Medusa v2 Store API: POST /store/carts/{cartId}/complete
    throw new Error("Not implemented: placeOrder (POST /store/carts/{cartId}/complete)");
  },

  async getOrderById(_orderId: string): Promise<Order | null> {
    // TODO: Connect to Medusa v2 Store API: GET /store/orders/{orderId}
    throw new Error("Not implemented: getOrderById (GET /store/orders/{orderId})");
  },
};
