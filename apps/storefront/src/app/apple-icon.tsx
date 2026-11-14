import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// iPhone home-screen icon: the clothes on hangers on the site background.
// iOS needs an opaque PNG (it would show a transparent one on black) and rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = await readFile(path.join(process.cwd(), "public/brand/fini-kura-icon.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  // The image renderer cannot read Tailwind classes: take the background from the charter token.
  const css = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  const background = css.match(/--brand-bg:\s*([^;]+);/)?.[1].trim();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background }}>
        <img src={src} width={144} height={144} alt="" />
      </div>
    ),
    size
  );
}
