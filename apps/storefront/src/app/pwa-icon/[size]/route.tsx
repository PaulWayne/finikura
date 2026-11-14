import { brandIconResponse } from "@/lib/brand-icon";

// Android home-screen icons listed in the manifest (app/manifest.ts).
const SIZES = [192, 512];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const px = Number((await params).size);
  if (!SIZES.includes(px)) return new Response(null, { status: 404 });
  return brandIconResponse(px);
}
