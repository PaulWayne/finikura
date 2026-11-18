import { indexNowKey } from "@/lib/indexnow";

// IndexNow checks this file holds the key sent with the page list (keyLocation).
export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
