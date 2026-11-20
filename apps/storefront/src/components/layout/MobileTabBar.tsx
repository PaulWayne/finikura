"use client";

import React from "react";
import { Home, Layers, Ruler, ShoppingBag, User } from "lucide-react";
import { triggerOpenCart } from "@/lib/cart-events";

interface MobileTabBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  cartCount?: number;
}

export function MobileTabBar({
  currentPath,
  onNavigate,
  cartCount = 2,
}: MobileTabBarProps) {
  const isHome = currentPath === "/" || currentPath === "";
  const isCollections = currentPath.startsWith("/categorie/");
  const isSizeGuide = currentPath === "/guide-des-tailles";

  const isContact = currentPath === "/contact" || currentPath === "/contact-faq";

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md border-t border-brand-surface shadow-[0_-2px_12px_rgba(63,55,47,0.06)] pb-safe"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {/* Accueil */}
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 transition-colors cursor-pointer ${
            isHome
              ? "text-brand-text font-semibold"
              : "text-brand-text hover:text-brand-text"
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] leading-tight">Accueil</span>
        </button>

        {/* Collections */}
        <button
          type="button"
          onClick={() => onNavigate("/categorie/filles")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 transition-colors cursor-pointer ${
            isCollections
              ? "text-brand-text font-semibold"
              : "text-brand-text hover:text-brand-text"
          }`}
        >
          <Layers className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] leading-tight">Collections</span>
        </button>

        {/* Tailles */}
        <button
          type="button"
          onClick={() => onNavigate("/guide-des-tailles")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 transition-colors cursor-pointer ${
            isSizeGuide
              ? "text-brand-text font-semibold"
              : "text-brand-text hover:text-brand-text"
          }`}
          aria-current={isSizeGuide ? "page" : undefined}
        >
          <Ruler className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] leading-tight font-medium">Tailles</span>
        </button>

        {/* Panier */}
        <button
          type="button"
          onClick={() => triggerOpenCart()}
          className="relative flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 text-brand-text hover:text-brand-text transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-brand-primary text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">Panier</span>
        </button>

        {/* Contact */}
        <button
          type="button"
          onClick={() => onNavigate("/contact")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 transition-colors cursor-pointer ${
            isContact
              ? "text-brand-text font-semibold"
              : "text-brand-text hover:text-brand-text"
          }`}
          aria-current={isContact ? "page" : undefined}
        >
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] leading-tight">Contact</span>
        </button>
      </div>
    </nav>
  );
}
