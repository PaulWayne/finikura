"use client";
import { useEffect } from "react";
import { ANALYTICS_EVENTS, pageKind, trackEvent } from "@/lib/analytics";

/**
 * Counts every click on a WhatsApp link of the site (FK-30), whatever the button.
 * Sent: « contact » (shop number) or « partage » (no recipient, FK-31), and the page kind.
 */
export function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      if (url.hostname !== "wa.me" && url.hostname !== "api.whatsapp.com") return;
      const isShare = url.pathname === "/" || url.pathname === "";
      trackEvent(ANALYTICS_EVENTS.whatsappClick, {
        type: isShare ? "partage" : "contact",
        page: pageKind(window.location.pathname),
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
