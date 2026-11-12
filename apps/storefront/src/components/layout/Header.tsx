import React from "react";
import Link from "next/link";
import { MobileMenuTrigger } from "./MobileMenuTrigger";
import { messages } from "@/messages/fr";
import { Logo } from "@/components/layout/Logo";

interface HeaderProps {
  /** Cart button, rendered by the layout inside a Suspense boundary. */
  cartSlot: React.ReactNode;
}

export function Header({ cartSlot }: HeaderProps) {
  return (
    <header className="w-full bg-brand-bg/95 backdrop-blur-md sticky top-0 z-40 border-b border-brand-surface">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Mobile menu hamburger button */}
        <MobileMenuTrigger />

        {/* Desktop Left Navigation Links */}
        <nav
          aria-label="Navigation principale gauche"
          className="hidden md:flex items-center space-x-7 text-xs font-medium tracking-[0.15em] uppercase"
        >
          <Link
            href="/categorie/filles"
            className="text-brand-text hover:text-brand-terracotta transition-colors"
          >
            {messages.header.navGirls}
          </Link>
          <Link
            href="/categorie/garcons"
            className="text-brand-text hover:text-brand-terracotta transition-colors"
          >
            {messages.header.navBoys}
          </Link>
          <Link
            href="/#nouveautes"
            className="text-brand-text hover:text-brand-terracotta transition-colors"
          >
            {messages.header.navNew}
          </Link>
        </nav>

        {/* Centered Editorial Logo (quarantined dustyRose and navyLogo per brand board) */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center hover:opacity-95 transition-opacity"
        >
          <Logo className="text-2xl md:text-3xl tracking-tight leading-none" />
          <span className="text-[8px] md:text-[10px] tracking-[0.28em] text-brand-text uppercase font-medium mt-1">
            {messages.header.brandSubtitle}
          </span>
        </Link>

        {/* Desktop Right Navigation Links & Cart Trigger */}
        <div className="flex items-center space-x-4 md:space-x-7">
          <nav
            aria-label="Navigation secondaire droite"
            className="hidden md:flex items-center space-x-7 text-xs font-medium tracking-[0.15em] uppercase"
          >
            <Link
              href="/contact"
              className="text-brand-text hover:text-brand-terracotta transition-colors"
            >
              {messages.header.navContact}
            </Link>
          </nav>

          {cartSlot}
        </div>
      </div>
    </header>
  );
}
