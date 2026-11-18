import { NextResponse, type NextRequest } from "next/server";

// Preview before the opening: while NOINDEX=1, the site stays visible to whoever has its address
// but tells search engines and AI crawlers to keep nothing: every answer carries « noindex »,
// robots.txt forbids everything (src/app/robots.ts), and the two files written for them,
// /sitemap.xml and /llms.txt, answer 404. Unset, this file does nothing.
// See docs/avant-ouverture.md.

const NO_INDEX = "noindex, nofollow, noarchive, nosnippet";
const FOR_ROBOTS_ONLY = new Set(["/sitemap.xml", "/llms.txt", "/indexnow-key.txt"]);

export function proxy(request: NextRequest) {
  if (process.env.NOINDEX !== "1") return NextResponse.next();

  if (FOR_ROBOTS_ONLY.has(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404, headers: { "X-Robots-Tag": NO_INDEX } });
  }
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", NO_INDEX);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|api/revalidate).*)"],
};
