import "server-only";
import Medusa, { FetchError } from "@medusajs/js-sdk";

// Medusa Store API client, used only on the server (Server Components and
// Server Actions). The publishable key ties requests to the "Site Fini Kura"
// sales channel, which scopes products, stock and shipping.

let client: Medusa | null = null;

export function medusa(): Medusa {
  if (client) return client;
  const baseUrl = process.env.MEDUSA_BACKEND_URL;
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;
  if (!baseUrl || !publishableKey) {
    throw new Error("MEDUSA_BACKEND_URL et MEDUSA_PUBLISHABLE_KEY sont requis en mode live.");
  }
  client = new Medusa({ baseUrl, publishableKey });
  return client;
}

export const isNotFound = (err: unknown): boolean =>
  err instanceof FetchError && err.status === 404;

/** Medusa's stock errors: "Not enough stock available for item …" / "… does not have the required inventory". */
export const isStockError = (err: unknown): boolean =>
  err instanceof Error && /stock|inventory/i.test(err.message);
