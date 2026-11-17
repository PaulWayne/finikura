import "server-only";
import { CustomerError } from "./errors";
import { messages } from "@/messages/fr";
import { isNotFound, isStockError, medusa } from "./client";
import {
  mapMedusaCartToDomain,
  mapMedusaCategoryToDomain,
  mapMedusaLineItemToDomain,
  mapMedusaOrderToDomain,
  mapMedusaProductToDomain,
  hasAgeInStock,
} from "./mappers";
import {
  MedusaStoreCart,
  MedusaStoreCategory,
  MedusaStoreOrder,
  MedusaStoreProduct,
} from "./raw";
import {
  Cart,
  CartItem,
  CatalogFilterParams,
  Category,
  CommerceService,
  CustomerInput,
  Order,
  Product,
  ShippingAddressInput,
} from "./types";

// Names set by apps/medusa/src/scripts/seed.ts.
const REGION_NAME = "Mali";
const SHIPPING_OPTION_NAME = "Livraison à Bamako";
const PAYMENT_PROVIDER = "pp_system_default"; // paiement à la réception

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,*categories,*collection,*tags,*images,+metadata";
const CATEGORY_FIELDS = "id,name,handle,description,metadata";
const CART_FIELDS =
  "id,currency_code,subtotal,total,*items,items.product_handle,items.product_title,items.variant_title,items.metadata";
const ORDER_FIELDS =
  "id,display_id,status,email,currency_code,total,created_at,*items,*shipping_address";

const EMPTY_CART = (id: string): Cart => ({ id, items: [], subtotal: 0, total: 0, currency: "XOF" });

let regionIdPromise: Promise<string> | null = null;
function regionId(): Promise<string> {
  regionIdPromise ??= medusa()
    .store.region.list({ fields: "id,name" })
    .then(({ regions }) => {
      const region = regions.find((r) => r.name === REGION_NAME);
      if (!region) throw new Error(`Région Medusa « ${REGION_NAME} » introuvable.`);
      return region.id;
    })
    .catch((err) => {
      regionIdPromise = null;
      throw err;
    });
  return regionIdPromise;
}

const PRODUCT_PAGE = 100;

/** Every matching product: Medusa answers by pages of at most PRODUCT_PAGE. */
async function listProducts(query: Record<string, unknown>): Promise<MedusaStoreProduct[]> {
  const region_id = await regionId();
  const all: MedusaStoreProduct[] = [];
  for (let offset = 0; ; offset += PRODUCT_PAGE) {
    const { products, count } = await medusa().store.product.list({
      ...query,
      region_id,
      fields: PRODUCT_FIELDS,
      limit: PRODUCT_PAGE,
      offset,
    });
    all.push(...(products as unknown as MedusaStoreProduct[]));
    if (products.length < PRODUCT_PAGE || all.length >= count) return all;
  }
}

async function findCategory(handle: string): Promise<MedusaStoreCategory | null> {
  const { product_categories } = await medusa().store.category.list({
    handle,
    fields: CATEGORY_FIELDS,
  });
  return (product_categories[0] as unknown as MedusaStoreCategory) ?? null;
}

async function retrieveCart(cartId: string): Promise<MedusaStoreCart> {
  const { cart } = await medusa().store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return cart as unknown as MedusaStoreCart;
}

export const liveCommerceService: CommerceService = {
  async getCategories(): Promise<Category[]> {
    const { product_categories } = await medusa().store.category.list({ fields: CATEGORY_FIELDS });
    return (product_categories as unknown as MedusaStoreCategory[]).map(mapMedusaCategoryToDomain);
  },

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    const category = await findCategory(handle);
    return category ? mapMedusaCategoryToDomain(category) : null;
  },

  async getProducts(filters?: CatalogFilterParams): Promise<Product[]> {
    const query: Record<string, unknown> = {};
    if (filters?.categoryHandle) {
      const category = await findCategory(filters.categoryHandle);
      if (!category) return [];
      query.category_id = [category.id];
    }
    let products = await listProducts(query);
    // Tags and variant titles belong to the product module: filtering here is cheap
    // for a catalogue of this size and keeps the same rules as the mock.
    if (filters?.occasion) {
      products = products.filter((p) => p.tags?.some((t) => t.value === filters.occasion));
    }
    if (filters?.age) {
      const age = filters.age;
      products = products.filter((p) => hasAgeInStock(p, age));
    }
    return products.map(mapMedusaProductToDomain);
  },

  async getProductByHandle(handle: string): Promise<Product | null> {
    const [product] = await listProducts({ handle });
    return product ? mapMedusaProductToDomain(product) : null;
  },

  async getCollectionProducts(collectionHandle: string, limit = 4): Promise<Product[]> {
    const { collections } = await medusa().store.collection.list({
      handle: collectionHandle,
      fields: "id,handle",
    });
    // A collection unknown to Medusa yields no products, the block is then hidden.
    if (!collections[0]) return [];
    const products = await listProducts({ collection_id: [collections[0].id] });
    return products.slice(0, limit).map(mapMedusaProductToDomain);
  },

  async getCart(cartId?: string | null): Promise<Cart> {
    if (!cartId) return EMPTY_CART("");
    try {
      const cart = await retrieveCart(cartId);
      return mapMedusaCartToDomain(cart);
    } catch (err) {
      if (isNotFound(err)) return EMPTY_CART("");
      throw err;
    }
  },

  async addItemToCart(
    cartId: string | null,
    variantId: string,
    quantity = 1
  ): Promise<{ cart: Cart; addedItem: CartItem }> {
    const sdk = medusa();
    let id = cartId;
    if (id) {
      // A completed or deleted cart cannot take new items: start a new one.
      try {
        const existing = await sdk.store.cart.retrieve(id, { fields: "id,completed_at" });
        if (existing.cart.completed_at) id = null;
      } catch (err) {
        if (!isNotFound(err)) throw err;
        id = null;
      }
    }
    if (!id) {
      const { cart } = await sdk.store.cart.create({ region_id: await regionId() }, { fields: "id" });
      id = cart.id;
    }

    try {
      await sdk.store.cart.createLineItem(id, { variant_id: variantId, quantity }, { fields: "id" });
    } catch (err) {
      if (isStockError(err)) throw new CustomerError(messages.errors.notEnoughStock);
      throw err;
    }

    // The Store API does not expose a line item's product categories: keep the
    // category handle in the line item metadata (used for the badge in the cart).
    let raw = await retrieveCart(id);
    const line = (raw.items ?? []).find((i) => i.variant_id === variantId);
    if (line?.product_handle && !line.metadata?.category_handle) {
      const { products } = await sdk.store.product.list({
        handle: line.product_handle,
        fields: "id,categories.handle",
      });
      const categoryHandle = products[0]?.categories?.[0]?.handle;
      if (categoryHandle) {
        await sdk.store.cart.updateLineItem(
          id,
          line.id,
          { quantity: line.quantity, metadata: { category_handle: categoryHandle } },
          { fields: "id" }
        );
        raw = await retrieveCart(id);
      }
    }

    const added = (raw.items ?? []).find((i) => i.variant_id === variantId);
    if (!added) throw new CustomerError(messages.errors.addToCart);
    return { cart: mapMedusaCartToDomain(raw), addedItem: mapMedusaLineItemToDomain(added) };
  },

  async updateCartItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) return liveCommerceService.removeItemFromCart(cartId, itemId);
    try {
      await medusa().store.cart.updateLineItem(cartId, itemId, { quantity }, { fields: "id" });
    } catch (err) {
      if (isStockError(err)) throw new CustomerError(messages.errors.notEnoughStock);
      throw err;
    }
    return mapMedusaCartToDomain(await retrieveCart(cartId));
  },

  async removeItemFromCart(cartId: string, itemId: string): Promise<Cart> {
    await medusa().store.cart.deleteLineItem(cartId, itemId);
    return mapMedusaCartToDomain(await retrieveCart(cartId));
  },

  async placeOrder(
    cartId: string,
    customer: CustomerInput,
    shippingAddress: ShippingAddressInput
  ): Promise<Order> {
    const sdk = medusa();
    const current = await retrieveCart(cartId);
    if (!current.items?.length) throw new CustomerError(messages.errors.emptyCart);

    // No e-mail: the customer is identified by name and phone only.
    const { cart } = await sdk.store.cart.update(
      cartId,
      {
        shipping_address: {
          first_name: customer.fullName,
          phone: customer.phone,
          address_1: shippingAddress.neighborhood,
          address_2: shippingAddress.deliveryLandmarks,
          city: "Bamako",
          country_code: "ml",
        },
      },
      { fields: "id,region_id,currency_code,total,*payment_collection" }
    );

    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
    const option = shipping_options.find((o) => o.name === SHIPPING_OPTION_NAME);
    if (!option) throw new Error(`Option de livraison « ${SHIPPING_OPTION_NAME} » introuvable.`);
    await sdk.store.cart.addShippingMethod(cartId, { option_id: option.id }, { fields: "id" });

    await sdk.store.payment.initiatePaymentSession(cart, { provider_id: PAYMENT_PROVIDER });

    let result;
    try {
      result = await sdk.store.cart.complete(cartId);
    } catch (err) {
      if (isStockError(err)) {
        const title = current.items?.[0]?.product_title ?? current.items?.[0]?.title ?? "";
        throw new CustomerError(current.items.length === 1 ? messages.errors.outOfStock(title) : messages.errors.orderNotEnoughStock);
      }
      throw err;
    }
    if (result.type !== "order") {
      throw new CustomerError(/stock|inventory/i.test(result.error?.message ?? "") ? messages.errors.orderNotEnoughStock : messages.errors.placeOrder);
    }
    const order = await liveCommerceService.getOrderById(result.order.id);
    if (!order) throw new CustomerError(messages.errors.placeOrder);
    return order;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { order } = await medusa().store.order.retrieve(orderId, { fields: ORDER_FIELDS });
      return mapMedusaOrderToDomain(order as unknown as MedusaStoreOrder);
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },
};
