import "server-only";
import { Redis } from "ioredis";

// Limits how many orders can be placed in a row (audit B2). A placed order reserves its stock in
// Medusa, so a script placing fake orders could show the whole shop as sold out.
//
// Two keys are counted: the phone number given at checkout, and the address the request comes from.
// In Bamako, hundreds of phones on the same mobile network share one public address, and a TikTok
// live sends many of them to the shop in the same minutes. So the phone limit is the real one (a
// customer is a phone), and the address limit is set far above a live's sales: it only stops a
// script that would invent phone numbers to reserve the whole stock.
//
// Counts are kept in Redis when ORDER_LIMIT_REDIS_URL is set (production): they survive a restart
// or a redeploy of the site. Without it (mock mode, tests), or whenever Redis does not answer, they
// live in the memory of the site's server: an order is never refused because Redis is down.
// Only orders actually placed are counted; a refused attempt (stock, form) is not.

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
    : [limit("ORDER_LIMIT_IP_15MIN", 60), limit("ORDER_LIMIT_IP_DAY", 400)];
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

/** In-memory count: true when one more order would go over a limit. */
function isLimitReachedInMemory(phone: string, ip: string | null, now = Date.now()): boolean {
  return keysFor(phone, ip).some(({ key, kind }) => {
    const times = recent(key, now);
    return WINDOWS.some((w, i) => times.filter((t) => now - t < w.ms).length >= limits(kind)[i]);
  });
}

/** In-memory count of an order that Medusa accepted. */
function recordOrderInMemory(phone: string, ip: string | null, now = Date.now()): void {
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

// --- Redis: one sorted set per key, one entry per order, scored by its time ---------------------

const REDIS_PREFIX = "fk:order-limit:";
const DAY_MS = WINDOWS[WINDOWS.length - 1].ms;
let redisClient: Redis | null | undefined;

// After a failure Redis is left alone for 30 seconds: only the first order of an outage waits.
const REDIS_PAUSE_MS = 30_000;
let redisPausedUntil = 0;

function redisFailed(what: string, err: unknown): void {
  redisPausedUntil = Date.now() + REDIS_PAUSE_MS;
  console.warn(`[order limit] redis unavailable, ${what}`, (err as Error).message);
}

function redis(): Redis | null {
  if (Date.now() < redisPausedUntil) return null;
  if (redisClient !== undefined) return redisClient;
  const url = process.env.ORDER_LIMIT_REDIS_URL;
  if (!url) return (redisClient = null);
  // The first commands wait for the connection to open. Past 1.5 s without an answer a command
  // fails and the count falls back to memory: a customer never waits for a Redis that is down.
  redisClient = new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 1000, commandTimeout: 1500 });
  redisClient.on("error", (err) => console.warn("[order limit] redis", err.message));
  return redisClient;
}

/** True when one more order from this phone and this address would go over a limit. */
export async function isOrderLimitReached(phone: string, ip: string | null, now = Date.now()): Promise<boolean> {
  const client = redis();
  if (client) {
    try {
      for (const { key, kind } of keysFor(phone, ip)) {
        const name = REDIS_PREFIX + key;
        await client.zremrangebyscore(name, 0, now - DAY_MS);
        for (const [i, w] of WINDOWS.entries()) {
          if ((await client.zcount(name, now - w.ms + 1, "+inf")) >= limits(kind)[i]) return true;
        }
      }
      return false;
    } catch (err) {
      redisFailed("counting in memory", err);
    }
  }
  return isLimitReachedInMemory(phone, ip, now);
}

/** Counts an order that Medusa accepted. */
export async function recordOrder(phone: string, ip: string | null, now = Date.now()): Promise<void> {
  // Always counted in memory too: the fallback stays right if Redis stops answering later.
  recordOrderInMemory(phone, ip, now);
  const client = redis();
  if (!client) return;
  try {
    for (const { key } of keysFor(phone, ip)) {
      const name = REDIS_PREFIX + key;
      await client.zadd(name, now, `${now}-${Math.random().toString(36).slice(2, 8)}`);
      await client.pexpire(name, DAY_MS);
    }
  } catch (err) {
    redisFailed("order counted in memory only", err);
  }
}

/**
 * The customer's address. Traefik, the proxy in front of the site, writes X-Real-Ip and the last
 * entry of X-Forwarded-For itself: both are the address that reached Traefik. The entries before
 * it can be written by anyone, so they are never used on their own.
 *
 * Behind Cloudflare (ORDER_LIMIT_PROXY_HOPS=1), the address that reaches Traefik is Cloudflare's.
 * Traefik trusts Cloudflare's ranges and keeps what Cloudflare added: X-Forwarded-For then reads
 * « ..., customer, Cloudflare ». The customer is one entry before the last: without this, every
 * customer of a live would be counted as one address.
 */
export function clientAddress(headers: Headers): string | null {
  const hops = Number(process.env.ORDER_LIMIT_PROXY_HOPS);
  const forwarded = headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (Number.isInteger(hops) && hops > 0) {
    // Fewer entries than expected: the request did not come through the proxy, the last entry is its sender.
    return forwarded[forwarded.length - 1 - hops] ?? forwarded[forwarded.length - 1] ?? null;
  }
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  return forwarded.length ? forwarded[forwarded.length - 1] : null;
}

/** Tests only. */
export function resetOrderLimits(): void {
  placed.clear();
}
