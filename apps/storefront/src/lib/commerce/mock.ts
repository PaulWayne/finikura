import "server-only";
import productsFixture from "@/mocks/medusa/products.json";
import categoriesFixture from "@/mocks/medusa/categories.json";
import collectionsFixture from "@/mocks/medusa/collections.json";
import {
  MedusaStoreProduct,
  MedusaStoreCategory,
  MedusaStoreCollection,
  MedusaStoreCart,
  MedusaStoreOrder,
  MedusaStoreLineItem,
  MedusaStoreVariant,
} from "./raw";
import {
  mapMedusaProductToDomain,
  mapMedusaCategoryToDomain,
  mapMedusaCollectionToDomain,
  mapMedusaCartToDomain,
  mapMedusaOrderToDomain,
  mapMedusaLineItemToDomain,
} from "./mappers";
import {
  CommerceService,
  Product,
  Category,
  Collection,
  Cart,
  Order,
  CatalogFilterParams,
  CustomerInput,
  ShippingAddressInput,
  CartItem,
} from "./types";

// In-memory server state, kept on globalThis so it survives dev module reloads.
interface MockState {
  carts: Map<string, MedusaStoreCart>;
  orders: Map<string, MedusaStoreOrder>;
  nextOrderDisplayId: number;
  products: MedusaStoreProduct[];
}
const globalForMock = globalThis as unknown as { __finikuraMock?: MockState };
const state: MockState = (globalForMock.__finikuraMock ??= {
  carts: new Map(),
  orders: new Map(),
  nextOrderDisplayId: 1001,
  products: JSON.parse(JSON.stringify(productsFixture.products)),
});
const inMemoryCarts = state.carts;
const inMemoryOrders = state.orders;
const currentProducts = state.products;

async function simulateDelay(): Promise<void> {}

const stockOf = (v: MedusaStoreVariant) => v.inventory_quantity ?? 0;

function recalculateCartTotals(cart: MedusaStoreCart): void {
  cart.subtotal = (cart.items ?? []).reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  cart.total = cart.subtotal;
}

export const mockCommerceService: CommerceService = {
  async getCategories(): Promise<Category[]> {
    await simulateDelay();
    const rawList = categoriesFixture.product_categories as MedusaStoreCategory[];
    return rawList.map(mapMedusaCategoryToDomain);
  },

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    await simulateDelay();
    const rawList = categoriesFixture.product_categories as MedusaStoreCategory[];
    const match = rawList.find((c) => c.handle === handle);
    return match ? mapMedusaCategoryToDomain(match) : null;
  },

  async getProducts(filters?: CatalogFilterParams): Promise<Product[]> {
    await simulateDelay();
    let filtered = currentProducts;

    if (filters?.categoryHandle) {
      filtered = filtered.filter((p) =>
        p.categories?.some((c) => c.handle === filters.categoryHandle)
      );
    }

    if (filters?.occasion && filters.occasion !== "all" && filters.occasion !== "toutes") {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => t.value === filters.occasion)
      );
    }

    if (filters?.age && filters.age !== "all") {
      filtered = filtered.filter((p) =>
        (p.variants ?? []).some((v) => v.title.toLowerCase().includes(filters.age!.toLowerCase()))
      );
    }

    return filtered.map(mapMedusaProductToDomain);
  },

  async getProductByHandle(handle: string): Promise<Product | null> {
    await simulateDelay();
    const match = currentProducts.find((p) => p.handle === handle);
    return match ? mapMedusaProductToDomain(match) : null;
  },

  async getCollectionProducts(collectionHandle: string, limit = 4): Promise<Product[]> {
    await simulateDelay();
    const matched = currentProducts.filter(
      (p) => p.collection?.handle === collectionHandle
    );
    return matched.slice(0, limit).map(mapMedusaProductToDomain);
  },

  async getCart(cartId?: string | null): Promise<Cart> {
    await simulateDelay();
    if (cartId && inMemoryCarts.has(cartId)) {
      return mapMedusaCartToDomain(inMemoryCarts.get(cartId)!);
    }

    // Return empty virtual cart if none exists yet
    return {
      id: cartId || "cart_temp",
      items: [],
      subtotal: 0,
      total: 0,
      currency: "XOF",
    };
  },

  async addItemToCart(
    cartId: string | null,
    variantId: string,
    quantity = 1
  ): Promise<{ cart: Cart; addedItem: CartItem }> {
    await simulateDelay();

    // Find product and variant to check inventory
    let targetProduct: MedusaStoreProduct | undefined;
    let targetVariant = null;

    for (const p of currentProducts) {
      const v = (p.variants ?? []).find((item) => item.id === variantId);
      if (v) {
        targetProduct = p;
        targetVariant = v;
        break;
      }
    }

    if (!targetProduct || !targetVariant) {
      throw new Error("Produit ou taille introuvable.");
    }

    if (stockOf(targetVariant) < quantity) {
      throw new Error("Cette taille est actuellement épuisée.");
    }

    const actualCartId = cartId || `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let cart = inMemoryCarts.get(actualCartId);

    if (!cart) {
      cart = {
        id: actualCartId,
        items: [],
        subtotal: 0,
        total: 0,
        currency_code: "xof",
      };
      inMemoryCarts.set(actualCartId, cart);
    }

    const items = (cart.items ??= []);
    const existingItem = items.find((i) => i.variant_id === variantId);
    const unitPrice = targetVariant.calculated_price?.calculated_amount ?? 0;

    let addedOrUpdatedItem: MedusaStoreLineItem;

    if (existingItem) {
      if (stockOf(targetVariant) < existingItem.quantity + quantity) {
        throw new Error("Quantité maximale disponible atteinte pour cette taille.");
      }
      existingItem.quantity += quantity;
      addedOrUpdatedItem = existingItem;
    } else {
      const newItem: MedusaStoreLineItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product_id: targetProduct.id,
        variant_id: targetVariant.id,
        title: targetProduct.title,
        product_title: targetProduct.title,
        product_handle: targetProduct.handle,
        variant_title: targetVariant.title,
        unit_price: unitPrice,
        quantity,
        thumbnail: targetProduct.thumbnail,
        metadata: { category_handle: targetProduct.categories?.[0]?.handle ?? "filles" },
      };
      items.push(newItem);
      addedOrUpdatedItem = newItem;
    }

    recalculateCartTotals(cart);

    const domainCart = mapMedusaCartToDomain(cart);
    const domainItem = mapMedusaLineItemToDomain(addedOrUpdatedItem);

    return { cart: domainCart, addedItem: domainItem };
  },

  async updateCartItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    await simulateDelay();
    const cart = inMemoryCarts.get(cartId);
    if (!cart) {
      throw new Error("Panier non trouvé.");
    }

    cart.items ??= [];
    const itemIndex = cart.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Article non trouvé dans le panier.");
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    recalculateCartTotals(cart);
    return mapMedusaCartToDomain(cart);
  },

  async removeItemFromCart(cartId: string, itemId: string): Promise<Cart> {
    await simulateDelay();
    const cart = inMemoryCarts.get(cartId);
    if (!cart) {
      throw new Error("Panier non trouvé.");
    }

    cart.items = (cart.items ?? []).filter((i) => i.id !== itemId);
    recalculateCartTotals(cart);
    return mapMedusaCartToDomain(cart);
  },

  async placeOrder(
    cartId: string,
    customer: CustomerInput,
    shippingAddress: ShippingAddressInput
  ): Promise<Order> {
    await simulateDelay();
    const cart = inMemoryCarts.get(cartId);
    if (!cart || !cart.items?.length) {
      throw new Error("Votre panier est vide.");
    }

    // Check stock for every item before finalizing order
    for (const item of cart.items) {
      let foundVariant = null;
      for (const p of currentProducts) {
        const v = (p.variants ?? []).find((variant) => variant.id === item.variant_id);
        if (v) {
          foundVariant = v;
          break;
        }
      }

      if (!foundVariant || stockOf(foundVariant) < item.quantity) {
        throw new Error(`Stock insuffisant pour l'article ${item.title}.`);
      }
    }

    // Decrement stock in memory so last item can never be sold twice
    for (const item of cart.items) {
      for (const p of currentProducts) {
        const v = (p.variants ?? []).find((variant) => variant.id === item.variant_id);
        if (v) {
          v.inventory_quantity = stockOf(v) - item.quantity;
          break;
        }
      }
    }

    const orderDisplayId = state.nextOrderDisplayId++;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const rawOrder: MedusaStoreOrder = {
      id: orderId,
      display_id: orderDisplayId,
      items: [...cart.items],
      total: cart.total,
      currency_code: "xof",
      email: null,
      shipping_address: {
        first_name: customer.fullName,
        phone: customer.phone,
        address_1: shippingAddress.neighborhood,
        address_2: shippingAddress.deliveryLandmarks,
        city: "Bamako",
        country_code: "ml",
      },
      status: "pending",
      created_at: new Date().toISOString(),
    };

    inMemoryOrders.set(orderId, rawOrder);
    // Clear cart in memory
    inMemoryCarts.delete(cartId);

    return mapMedusaOrderToDomain(rawOrder);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await simulateDelay();
    // 1. Direct lookup by order ID
    let raw = inMemoryOrders.get(orderId);

    // 2. Lookup by display_id or formatted order number
    if (!raw) {
      for (const order of inMemoryOrders.values()) {
        if (order.id === orderId || `FK-${order.display_id}` === orderId || `${order.display_id}` === orderId) {
          raw = order;
          break;
        }
      }
    }

    if (!raw) return null;

    return mapMedusaOrderToDomain(raw);
  },
};
