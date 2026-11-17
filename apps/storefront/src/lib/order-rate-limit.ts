import "server-only";

// Limits how many orders can be placed in a row (audit B2). A placed order reserves its stock in
// Medusa, so a script placing fake orders could show the whole shop as sold out.
//
// Two keys are counted: the phone number given at checkout, and the address the request comes from.
// In Bamako, many phones on the same mobile network share one public address, so the address limit
// is looser than the phone one: it only stops a script, never a family or a market stall.
//
// Counts live in the memory of the site's server: there is one container, and a restart only
// resets them. Only orders actually placed are counted; a refused attempt (stock, form) is not.

interface LimitWindow {
  label: string;
  ms: number;
}

const WINDOWS: LimitWindow[] = [
  { label: "short", ms: 15 * 60 * 1000 },
  { label: "day", ms: 24 * 60 * 60 * 1000 },
];

function limit(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

/** Orders allowed per key, in 15 minutes and in 24 hours. Adjustable without a deploy of code. */
function limits(kind: "phone" | "ip"): [number, number] {
  return kind === "phone"
    ? [limit("ORDER_LIMIT_PHONE_15MIN", 3), limit("ORDER_LIMIT_PHONE_DAY", 10)]
    : [limit("ORDER_LIMIT_IP_15MIN", 10), limit("ORDER_LIMIT_IP_DAY", 40)];
}

// key -> timestamps of the orders placed in the last 24 hours, oldest first.
const placed = new Map<string, number[]>();
// Upper bound on the number of keys kept, so the map itself cannot grow without end.
const MAX_KEYS = 20_000;

function recent(key: string, now: number): number[] {
  const day = WINDOWS[WINDOWS.length - 1].ms;
  const kept = (placed.get(key) ?? []).filter((t) => now - t < day);
  if (kept.length) placed.set(key, kept);
  else placed.delete(key);
  return kept;
}

function keysFor(phone: string, ip: string | null): { key: string; kind: "phone" | "ip" }[] {
  const keys: { key: string; kind: "phone" | "ip" }[] = [{ key: `phone:${phone}`, kind: "phone" }];
  if (ip) keys.push({ key: `ip:${ip}`, kind: "ip" });
  return keys;
}

/** True when one more order from this phone and this address would go over a limit. */
export function isOrderLimitReached(phone: string, ip: string | null, now = Date.now()): boolean {
  return keysFor(phone, ip).some(({ key, kind }) => {
    const times = recent(key, now);
    return WINDOWS.some((w, i) => times.filter((t) => now - t < w.ms).length >= limits(kind)[i]);
  });
}

/** Counts an order that Medusa accepted. */
export function recordOrder(phone: string, ip: string | null, now = Date.now()): void {
  if (placed.size >= MAX_KEYS) {
    // Drop the keys with no order in the last 24 hours, then, if still full, the oldest ones.
    for (const key of [...placed.keys()]) recent(key, now);
    for (const key of placed.keys()) {
      if (placed.size < MAX_KEYS) break;
      placed.delete(key);
    }
  }
  for (const { key } of keysFor(phone, ip)) {
    placed.set(key, [...recent(key, now), now]);
  }
}

/**
 * The customer's address as seen by Traefik, the proxy in front of the site. Traefik sets
 * X-Real-Ip itself; in X-Forwarded-For only the last entry is added by Traefik, the first ones
 * can be written by anyone, so they are never used.
 */
export function clientAddress(headers: Headers): string | null {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return forwarded?.length ? forwarded[forwarded.length - 1] : null;
}

/** Tests only. */
export function resetOrderLimits(): void {
  placed.clear();
}
