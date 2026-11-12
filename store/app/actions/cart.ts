"use server";
import { commerceService } from "@/src/lib/commerce";
import { Cart, CartItem, Order, CustomerInput, ShippingAddressInput } from "@/src/lib/commerce/types";
import { checkoutSchema } from "@/src/lib/validation/checkout";

// Simple cookie mock/in-memory session handler for cart identification
let sessionCartId = "cart_client_session";

export async function getCartAction(): Promise<Cart> {
  return await commerceService.getCart(sessionCartId);
}

export async function addToCartAction(
  variantId: string,
  quantity = 1
): Promise<{ success: boolean; cart: Cart; addedItem?: CartItem; error?: string }> {
  try {
    const result = await commerceService.addItemToCart(sessionCartId, variantId, quantity);
    sessionCartId = result.cart.id;
    return { success: true, cart: result.cart, addedItem: result.addedItem };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Erreur lors de l'ajout au panier";
    const currentCart = await commerceService.getCart(sessionCartId);
    return { success: false, cart: currentCart, error };
  }
}

export async function updateQuantityAction(
  itemId: string,
  quantity: number
): Promise<{ success: boolean; cart: Cart; error?: string }> {
  try {
    const updated = await commerceService.updateCartItemQuantity(sessionCartId, itemId, quantity);
    return { success: true, cart: updated };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Erreur lors de la modification";
    const currentCart = await commerceService.getCart(sessionCartId);
    return { success: false, cart: currentCart, error };
  }
}

export async function removeItemAction(
  itemId: string
): Promise<{ success: boolean; cart: Cart; error?: string }> {
  try {
    const updated = await commerceService.removeItemFromCart(sessionCartId, itemId);
    return { success: true, cart: updated };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Erreur lors de la suppression";
    const currentCart = await commerceService.getCart(sessionCartId);
    return { success: false, cart: currentCart, error };
  }
}

export async function placeOrderAction(
  customer: CustomerInput,
  shippingAddress: ShippingAddressInput
): Promise<{ success: boolean; order?: Order; error?: string }> {
  // Re-validate strictly on server with shared Zod schema
  const validation = checkoutSchema.safeParse({
    fullName: customer.fullName,
    phone: customer.phone,
    neighborhood: shippingAddress.neighborhood,
    deliveryLandmarks: shippingAddress.deliveryLandmarks,
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Données de commande invalides";
    return { success: false, error: firstError };
  }

  try {
    const order = await commerceService.placeOrder(sessionCartId, customer, shippingAddress);
    // Reset session cart ID upon completion
    sessionCartId = `cart_session_${Date.now()}`;
    return { success: true, order };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Impossible d'enregistrer la commande";
    return { success: false, error };
  }
}
