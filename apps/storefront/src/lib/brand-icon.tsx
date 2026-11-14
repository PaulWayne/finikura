import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Site background colour, read from the charter token (the image renderer cannot use Tailwind). */
export async function brandBackground(): Promise<string | undefined> {
  const css = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  return css.match(/--brand-bg:\s*([^;]+);/)?.[1].trim();
}

/** Opaque square PNG of the clothes-on-hangers icon, for home screens (iPhone, Android). */
export async function brandIconResponse(px: number): Promise<ImageResponse> {
  const svg = await readFile(path.join(process.cwd(), "public/brand/fini-kura-icon.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  const background = await brandBackground();
  // 80 %: leaves the margin Android needs to crop the icon into a circle.
  const inner = Math.round(px * 0.8);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not a page image */}
        <img src={src} width={inner} height={inner} alt="" />
      </div>
    ),
    { width: px, height: px }
  );
}
