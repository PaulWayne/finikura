"use server";
import { cookies, headers } from "next/headers";
import { updateTag } from "next/cache";
import { commerceService } from "@/lib/commerce";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Cart, CartItem, Order } from "@/lib/commerce/types";
import { checkoutSchema } from "@/lib/validation/checkout";
import { messages } from "@/messages/fr";
import { rememberOrder } from "@/lib/order-access";
import { CustomerError } from "@/lib/commerce/errors";
import { clientAddress, isOrderLimitReached, recordOrder } from "@/lib/order-rate-limit";

const CART_COOKIE = "fk_cart_id";

async function readCartId(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

async function writeCartId(cartId: string | null): Promise<void> {
  const store = await cookies();
  if (!cartId) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/** The customer sees only messages written for her; anything else goes to the server logs (audit S4). */
function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof CustomerError) return err.message;
  console.error("[cart action]", err);
  return fallback;
}

export async function getCartAction(): Promise<Cart> {
  return commerceService.getCart(await readCartId());
}

// A server action can be called with anything, not only what the buttons send: ids must look like
// Medusa ids and a quantity is a small whole number.
const MAX_QUANTITY = 20;
const isId = (value: unknown): value is string => typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(value);
const isQuantity = (value: unknown, min: number): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= min && value <= MAX_QUANTITY;

export async function addToCartAction(
  variantId: string,
  quantity = 1
): Promise<{ success: boolean; cart: Cart; addedItem?: CartItem; error?: string }> {
  const cartId = await readCartId();
  try {
    if (!isId(variantId) || !isQuantity(quantity, 1)) throw new CustomerError(messages.errors.addToCart);
    const result = await commerceService.addItemToCart(cartId, variantId, quantity);
    if (result.cart.id !== cartId) await writeCartId(result.cart.id);
    return { success: true, cart: result.cart, addedItem: result.addedItem };
  } catch (err) {
    return {
      success: false,
      cart: await commerceService.getCart(cartId),
      error: errorMessage(err, messages.errors.addToCart),
    };
  }
}

export async function updateQuantityAction(
  itemId: string,
  quantity: number
): Promise<{ success: boolean; cart: Cart; error?: string }> {
  const cartId = await readCartId();
  try {
    if (!cartId) throw new CustomerError(messages.errors.cartNotFound);
    if (!isId(itemId) || !isQuantity(quantity, 0)) throw new CustomerError(messages.errors.updateCart);
    return { success: true, cart: await commerceService.updateCartItemQuantity(cartId, itemId, quantity) };
  } catch (err) {
    return {
      success: false,
      cart: await commerceService.getCart(cartId),
      error: errorMessage(err, messages.errors.updateCart),
    };
  }
}

export async function removeItemAction(
  itemId: string
): Promise<{ success: boolean; cart: Cart; error?: string }> {
  const cartId = await readCartId();
  try {
    if (!cartId) throw new CustomerError(messages.errors.cartNotFound);
    if (!isId(itemId)) throw new CustomerError(messages.errors.updateCart);
    return { success: true, cart: await commerceService.removeItemFromCart(cartId, itemId) };
  } catch (err) {
    return {
      success: false,
      cart: await commerceService.getCart(cartId),
      error: errorMessage(err, messages.errors.updateCart),
    };
  }
}

export async function placeOrderAction(
  input: unknown
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const validation = checkoutSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message ?? messages.errors.invalidOrder };
  }

  const cartId = await readCartId();
  if (!cartId) return { success: false, error: messages.errors.emptyCart };

  const { fullName, phone, neighborhood, deliveryLandmarks } = validation.data;
  const ip = clientAddress(await headers());
  if (await isOrderLimitReached(phone, ip)) {
    console.warn("[order limit] refused", { phone: phone.slice(-4), ip });
    return { success: false, error: messages.errors.tooManyOrders };
  }
  try {
    const order = await commerceService.placeOrder(
      cartId,
      { fullName, phone },
      { neighborhood, deliveryLandmarks }
    );
    await recordOrder(phone, ip);
    await writeCartId(null);
    await rememberOrder(order.id);
    updateTag(CACHE_TAGS.catalog); // stock changed
    return { success: true, order };
  } catch (err) {
    return { success: false, error: errorMessage(err, messages.errors.placeOrder) };
  }
}
