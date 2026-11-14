// Umami custom events (FK-30). Only event names and non-personal properties:
// never a name, phone, neighborhood, amount or order id.
// Without the Umami script (mock, dev, e2e) window.umami is undefined and nothing is sent.

type UmamiTracker = { track: (event: string, data?: Record<string, string>) => void };

export const ANALYTICS_EVENTS = {
  addToCart: "ajout-panier",
  orderPlaced: "commande",
  whatsappClick: "clic-whatsapp",
  // FK-37: data { action: "ajout" | "retrait" }, never the customer.
  favorite: "coup-de-coeur",
} as const;

export function trackEvent(event: string, data?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: UmamiTracker }).umami;
  try {
    umami?.track(event, data);
  } catch {
    // Statistics must never break the shop.
  }
}

/** Page kind from the path, without ids (« /commande/confirmation/xyz » -> « commande »). */
export function pageKind(pathname: string): string {
  return pathname.split("/")[1] || "accueil";
}
