"use client";
import React from "react";
import { triggerOpenMenu } from "@/lib/cart-events";
import { messages } from "@/messages/fr";

export function MobileMenuTrigger() {
  return (
    <button
      type="button"
      aria-label={messages.header.openMenuAria}
      onClick={triggerOpenMenu}
      className="p-2 -ml-2 text-brand-text hover:text-brand-primary transition-colors focus:outline-none md:hidden min-touch-btn flex items-center justify-center"
    >
      <svg
        className="w-6 h-6 stroke-[1.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
