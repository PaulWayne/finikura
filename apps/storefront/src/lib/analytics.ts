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
  // FK-39: sent by Umami from data-umami-event attributes, data { hero: name }.
  heroClick: "clic-hero",
  // FK-38: a customer started the clip of a product, data { produit: handle }.
  videoPlay: "lecture-video",
  // An outfit page was opened, data { produit: handle }: which outfits are looked at but not bought.
  productView: "vue-produit",
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
