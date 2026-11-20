"use client";
import Link from "next/link";
import React from "react";

/**
 * The logo leads home. Already on the home page, a link to the same address does nothing:
 * the tap then brings the customer back to the top, so the logo always answers.
 */
export function HomeLogoLink({ className, children }: { className?: string; children: React.ComponentProps<typeof Link>["children"] }) {
  return (
    <Link
      href="/"
      className={className}
      onClick={() => {
        // Read at the tap, not with a hook: the header is rendered ahead of time on every page.
        if (window.location.pathname !== "/") return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
