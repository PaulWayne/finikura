import "server-only";
import { cookies } from "next/headers";

// Orders placed from this browser. Only these show the full confirmation page (FK-23).
const ORDERS_COOKIE = "fk_orders";
const MAX_ORDERS = 10;

export async function readOrderIds(): Promise<string[]> {
  const raw = (await cookies()).get(ORDERS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const ids: unknown = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function rememberOrder(orderId: string): Promise<void> {
  const ids = [orderId, ...(await readOrderIds()).filter((id) => id !== orderId)].slice(0, MAX_ORDERS);
  (await cookies()).set(ORDERS_COOKIE, JSON.stringify(ids), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
