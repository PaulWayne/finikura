import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Preview before the opening: while PREVIEW_PASSWORD is set, the whole site asks for that
// password (HTTP Basic, any user name) and tells search engines to index nothing. Empty, the
// site is open and this file does nothing. See docs/avant-ouverture.md.
//
// Left open: /robots.txt (it answers « Disallow: / » while the site is closed), /api/revalidate
// (Medusa and Strapi call it with its own secret) and the build files under /_next/static
// (fonts are fetched without credentials, and they hold nothing of the shop).

const NO_INDEX = "noindex, nofollow, noarchive";

function passwordOf(request: NextRequest): string | null {
  const header = request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    return colon === -1 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function proxy(request: NextRequest) {
  const expected = process.env.PREVIEW_PASSWORD?.trim();
  if (!expected) return NextResponse.next();

  const received = passwordOf(request);
  if (received !== null && same(received, expected)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", NO_INDEX);
    return response;
  }
  return new NextResponse(null, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Fini Kura", charset="UTF-8"',
      "X-Robots-Tag": NO_INDEX,
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|robots\\.txt|api/revalidate).*)"],
};
