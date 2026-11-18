import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { scheduleIndexNow } from "@/lib/indexnow";

// Called by the Strapi webhook and the Medusa subscriber when content or
// catalogue data changes. Both send the shared secret in x-revalidate-secret.
// POST /api/revalidate?source=strapi | medusa

const TAG_BY_SOURCE: Record<string, string> = {
  strapi: CACHE_TAGS.content,
  medusa: CACHE_TAGS.catalog,
};

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  const received = request.headers.get("x-revalidate-secret");
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  const source = request.nextUrl.searchParams.get("source") ?? "";
  const tag = TAG_BY_SOURCE[source];
  if (!tag) {
    return Response.json({ revalidated: false, error: "unknown source" }, { status: 400 });
  }
  // Stale-while-revalidate: visitors never wait; Medusa still checks stock at checkout.
  revalidateTag(tag, "max");
  // Pages changed: Bing (ChatGPT, Copilot) is told within minutes, in production only.
  scheduleIndexNow();
  return Response.json({ revalidated: true, tag });
}
