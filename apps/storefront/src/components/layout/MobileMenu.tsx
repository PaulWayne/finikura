"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CART_EVENTS, triggerCloseMenu } from "@/lib/cart-events";
import { messages } from "@/messages/fr";
import { Logo } from "@/components/layout/Logo";

interface MobileMenuProps {
  whatsappUrl?: string | null;
}

export function MobileMenu({
  whatsappUrl,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }
    function handleClose() {
      setIsOpen(false);
      document.body.style.overflow = "";
    }

    window.addEventListener(CART_EVENTS.OPEN_MENU, handleOpen);
    window.addEventListener(CART_EVENTS.CLOSE_MENU, handleClose);

    return () => {
      window.removeEventListener(CART_EVENTS.OPEN_MENU, handleOpen);
      window.removeEventListener(CART_EVENTS.CLOSE_MENU, handleClose);
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    triggerCloseMenu();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-brand-text/40 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        id="mobile-drawer"
        aria-label="Menu mobile"
        className={`fixed top-0 right-0 bottom-0 w-[310px] max-w-[85vw] bg-brand-bg z-50 shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out border-l border-brand-surface md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-5 border-b border-brand-surface">
            <div>
              <Logo className="text-xl leading-tight block" />
              <span className="text-[8px] tracking-[0.2em] text-brand-text uppercase font-medium">
                {messages.header.brandSubtitle}
              </span>
            </div>
            <button
              type="button"
              aria-label={messages.header.closeMenuAria}
              className="p-2 text-brand-text hover:text-brand-primary rounded-full hover:bg-brand-surface/40 transition min-touch-btn flex items-center justify-center cursor-pointer"
              onClick={close}
            >
              <svg
                className="w-6 h-6 stroke-[1.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="mt-6 flex flex-col space-y-4">
            <Link
              href="/categorie/filles"
              onClick={close}
              className="font-serif text-lg font-medium text-brand-text hover:text-brand-primary transition py-1 flex items-center justify-between"
            >
              <span>Filles (3 - 14 ans)</span>
              <svg
                className="w-4 h-4 stroke-[1.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/categorie/garcons"
              onClick={close}
              className="font-serif text-lg font-medium text-brand-text hover:text-brand-primary transition py-1 flex items-center justify-between"
            >
              <span>Garçons (3 - 14 ans)</span>
              <svg
                className="w-4 h-4 stroke-[1.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/#nouveautes"
              onClick={close}
              className="font-serif text-lg font-medium text-brand-text hover:text-brand-primary transition py-1 flex items-center justify-between"
            >
              <span>Nouveautés</span>
              <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-brand-terracotta/15 text-brand-terracotta font-medium tracking-wider uppercase">
                Nouveau
              </span>
            </Link>

            <div className="w-full h-px bg-brand-surface my-2" />

            <Link
              href="/guide-des-tailles"
              onClick={close}
              className="text-base font-normal text-brand-text hover:text-brand-primary transition py-1"
            >
              {messages.header.navSizeGuide}
            </Link>

            <Link
              href="/notre-histoire"
              onClick={close}
              className="min-touch-btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[4px] border border-brand-primary text-brand-primary font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-primary hover:text-brand-white transition shadow-xs"
            >
              <span>{messages.header.navHistory}</span>
              <svg
                className="w-4 h-4 stroke-[2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/livraison-et-echanges"
              onClick={close}
              className="text-base font-normal text-brand-text hover:text-brand-primary transition py-1"
            >
              Livraison et échanges
            </Link>

            <Link
              href="/contact"
              onClick={close}
              className="text-base font-normal text-brand-text hover:text-brand-primary transition py-1"
            >
              {messages.header.navContact}
            </Link>

            <Link
              href="/mentions-legales"
              onClick={close}
              className="text-sm font-normal text-brand-text/80 hover:text-brand-primary transition py-1"
            >
              Mentions Légales &amp; CGV
            </Link>
          </nav>
        </div>

        {/* Bottom of Drawer: WhatsApp advice */}
        <div className="pt-6 border-t border-brand-surface">
          <div className="p-3 bg-brand-surface/60 rounded-xl mb-3">
            <p className="text-xs font-semibold text-brand-text">
              {messages.drawer.needAdviceTitle}
            </p>
            <p className="text-[11px] text-brand-text/80 mt-0.5 leading-relaxed">
              {messages.drawer.needAdviceText}
            </p>
          </div>
          {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch-btn w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em] hover:bg-brand-text transition shadow-xs"
          >
            <span>{messages.drawer.whatsAppContactBtn}</span>
          </a>
          )}
        </div>
      </aside>
    </>
  );
}
