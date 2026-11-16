"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A new page always opens at its top. Next leaves the scroll where it was when it judges
 * the top of the new page already visible, which happens while a page streams in: the
 * customer then landed in the middle of a category. Back and forward keep their place
 * (the browser restores it), and so do filters and anchors, which do not change the path.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const cameFromHistory = useRef(false);

  useEffect(() => {
    // Back within the same path (a filter) changes no path: the mark must not outlive this navigation.
    const onPopState = () => {
      cameFromHistory.current = true;
      window.setTimeout(() => {
        cameFromHistory.current = false;
      }, 1000);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
