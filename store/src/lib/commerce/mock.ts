import "server-only";
import productsFixture from "@/src/mocks/medusa/products.json";
import categoriesFixture from "@/src/mocks/medusa/categories.json";
import collectionsFixture from "@/src/mocks/medusa/collections.json";
import {
  MedusaStoreProduct,
  MedusaStoreCategory,
  MedusaStoreCollection,
  MedusaStoreCart,
  MedusaStoreOrder,
  MedusaStoreCartItem,
} from "./raw";
import {
  mapMedusaProductToDomain,
  mapMedusaCategoryToDomain,
  mapMedusaCollectionToDomain,
  mapMedusaCartToDomain,
  mapMedusaOrderToDomain,
  generateTechnicalEmailFromPhone,
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

// In-memory state for carts and orders
const inMemoryCarts = new Map<string, MedusaStoreCart>();
const inMemoryOrders = new Map<string, MedusaStoreOrder>();
let nextOrderDisplayId = 1001;

// Clone product list with mutable inventory for stock tracking in memory
const currentProducts: MedusaStoreProduct[] = JSON.parse(
  JSON.stringify(productsFixture.products)
);

function simulateDelay(): Promise<void> {
  const ms = Math.floor(Math.random() * 200) + 200; // 200 - 400 ms
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function recalculateCartTotals(cart: MedusaStoreCart): void {
  cart.subtotal = cart.items.reduce(
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
        p.variants.some((v) => v.title.toLowerCase().includes(filters.age!.toLowerCase()))
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
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        targetProduct = p;
        targetVariant = v;
        break;
      }
    }

    if (!targetProduct || !targetVariant) {
      throw new Error("Produit ou taille introuvable.");
    }

    if (targetVariant.inventory_quantity < quantity) {
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

    const existingItem = cart.items.find((i) => i.variant_id === variantId);
    const unitPrice = targetVariant.prices[0]?.amount ?? 0;

    let addedOrUpdatedItem: MedusaStoreCartItem;

    if (existingItem) {
      if (targetVariant.inventory_quantity < existingItem.quantity + quantity) {
        throw new Error("Quantité maximale disponible atteinte pour cette taille.");
      }
      existingItem.quantity += quantity;
      addedOrUpdatedItem = existingItem;
    } else {
      const newItem: MedusaStoreCartItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product_id: targetProduct.id,
        variant_id: targetVariant.id,
        title: targetProduct.title,
        unit_price: unitPrice,
        quantity,
        thumbnail: targetProduct.thumbnail,
        metadata: {
          product_handle: targetProduct.handle,
          variant_title: targetVariant.title,
          category_handle: targetProduct.categories?.[0]?.handle || "filles",
        },
      };
      cart.items.push(newItem);
      addedOrUpdatedItem = newItem;
    }

    recalculateCartTotals(cart);

    const domainCart = mapMedusaCartToDomain(cart);
    const domainItem: CartItem = {
      id: addedOrUpdatedItem.id,
      productId: targetProduct.id,
      productHandle: targetProduct.handle,
      productTitle: targetProduct.title,
      variantId: targetVariant.id,
      variantTitle: targetVariant.title,
      price: Math.round(unitPrice),
      quantity: addedOrUpdatedItem.quantity,
      thumbnail: targetProduct.thumbnail || "",
      categoryHandle: (targetProduct.categories?.[0]?.handle || "filles") as "filles" | "garcons",
    };

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

    cart.items = cart.items.filter((i) => i.id !== itemId);
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
    if (!cart || cart.items.length === 0) {
      throw new Error("Votre panier est vide.");
    }

    // Check stock for every item before finalizing order
    for (const item of cart.items) {
      let foundVariant = null;
      for (const p of currentProducts) {
        const v = p.variants.find((variant) => variant.id === item.variant_id);
        if (v) {
          foundVariant = v;
          break;
        }
      }

      if (!foundVariant || foundVariant.inventory_quantity < item.quantity) {
        throw new Error(`Stock insuffisant pour l'article ${item.title}.`);
      }
    }

    // Decrement stock in memory so last item can never be sold twice
    for (const item of cart.items) {
      for (const p of currentProducts) {
        const v = p.variants.find((variant) => variant.id === item.variant_id);
        if (v) {
          v.inventory_quantity -= item.quantity;
          break;
        }
      }
    }

    const orderDisplayId = nextOrderDisplayId++;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const rawOrder: MedusaStoreOrder = {
      id: orderId,
      display_id: orderDisplayId,
      items: [...cart.items],
      total: cart.total,
      currency_code: "xof",
      customer: {
        first_name: customer.fullName.split(" ")[0] || customer.fullName,
        last_name: customer.fullName.split(" ").slice(1).join(" ") || "Client",
        phone: customer.phone,
        email: generateTechnicalEmailFromPhone(customer.phone),
      },
      shipping_address: {
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

    // 3. Fallback demo order corresponding to the mockups (FK-2025-0842)
    if (!raw) {
      const demoOrder: MedusaStoreOrder = {
        id: orderId || "order_fk_2025_0842",
        display_id: 20250842,
        items: [
          {
            id: "item_demo_1",
            product_id: "prod_robe_terracotta",
            variant_id: "var_robe_terracotta_6a",
            title: "Robe Terracotta Brodée",
            quantity: 1,
            unit_price: 12500,
            thumbnail: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
            metadata: {
              product_handle: "robe-terracotta-brodee",
              variant_title: "6 ans",
              category_handle: "filles",
            },
          },
          {
            id: "item_demo_2",
            product_id: "prod_chemise_sauge",
            variant_id: "var_chemise_sauge_8a",
            title: "Chemise Mandarin Sauge",
            quantity: 1,
            unit_price: 8500,
            thumbnail: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
            metadata: {
              product_handle: "chemise-mandarin-sauge",
              variant_title: "8 ans",
              category_handle: "garcons",
            },
          },
        ],
        total: 21000,
        currency_code: "xof",
        customer: {
          first_name: "Aminata",
          last_name: "Traoré",
          phone: "+223 76 45 89 12",
          email: "client.22376458912@commande.finikura.ml",
        },
        shipping_address: {
          address_1: "Badalabougou",
          address_2: "Près de la pharmacie du fleuve, villa beige portail vert",
          city: "Bamako",
          country_code: "ml",
        },
        status: "pending",
        created_at: new Date().toISOString(),
      };
      return mapMedusaOrderToDomain(demoOrder);
    }

    return mapMedusaOrderToDomain(raw);
  },
};
