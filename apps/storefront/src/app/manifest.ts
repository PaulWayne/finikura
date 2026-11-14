import type { MetadataRoute } from "next";
import { brandBackground } from "@/lib/brand-icon";
import { messages } from "@/messages/fr";

// Read by Chrome on Android for « Ajouter à l'écran d'accueil ».
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const background = await brandBackground();
  return {
    name: messages.meta.defaultTitle,
    short_name: "Fini Kura",
    description: messages.meta.defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: background,
    theme_color: background,
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
