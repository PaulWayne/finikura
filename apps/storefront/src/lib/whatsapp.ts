import { formatPrice } from "./format";
import { messages } from "@/messages/fr";
import type { Order } from "./commerce/types";

// WhatsApp links are always built from the number saved in Strapi
// (global settings -> whatsappUrl). No number in the code.

/** Returns null when no number is configured, so callers can hide the button. */
export function whatsappLink(baseUrl: string | null | undefined, text?: string): string | null {
  if (!baseUrl) return null;
  if (!text) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}text=${encodeURIComponent(text)}`;
}

/** Pre-filled message sent by the customer to confirm an order. */
export function orderConfirmationMessage(order: Order): string {
  const t = messages.whatsapp;
  const lines = order.items.map((item) =>
    t.orderLine(item.productTitle, item.variantTitle, item.quantity, formatPrice(item.price * item.quantity))
  );
  return [
    t.orderIntro(order.orderNumber),
    ...lines,
    t.orderTotal(formatPrice(order.total)),
    "",
    t.orderName(order.customer.fullName),
    t.orderPhone(order.customer.phone),
    t.orderNeighborhood(order.shippingAddress.neighborhood),
    t.orderLandmarks(order.shippingAddress.deliveryLandmarks),
  ].join("\n");
}
