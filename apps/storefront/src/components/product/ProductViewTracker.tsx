"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

/** Tells Umami which outfit is being looked at: the handle only, never the customer. */
export function ProductViewTracker({ handle }: { handle: string }) {
  useEffect(() => {
    // The Umami script loads after the page: wait for it a few seconds, then give up.
    let tries = 0;
    const send = () => {
      if ((window as unknown as { umami?: unknown }).umami) {
        trackEvent(ANALYTICS_EVENTS.productView, { produit: handle });
        return true;
      }
      return false;
    };
    if (send()) return;
    const timer = window.setInterval(() => {
      if (send() || ++tries >= 10) window.clearInterval(timer);
    }, 500);
    return () => window.clearInterval(timer);
  }, [handle]);
  return null;
}
