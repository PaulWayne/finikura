import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Default link preview (WhatsApp, Facebook…): the client's full logo on the site background.
// Product pages keep their own photo.
export const alt = "Fini Kura, habits pour enfants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const svg = await readFile(path.join(process.cwd(), "public/brand/fini-kura-logo.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  // The image renderer cannot read Tailwind classes: take the background from the charter token.
  const css = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  const background = css.match(/--brand-bg:\s*([^;]+);/)?.[1].trim();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background }}>
        <img src={src} width={624} height={532} alt={alt} />
      </div>
    ),
    size
  );
}
