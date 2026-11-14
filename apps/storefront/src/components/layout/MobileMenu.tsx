"use client";
import { useEffect, useState } from "react";
import { CART_EVENTS, triggerCloseMenu } from "@/lib/cart-events";
import { messages } from "@/messages/fr";
import { Logo } from "@/components/layout/Logo";
import { MobileMenuLinks } from "./MobileMenuLinks";

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
        aria-label={messages.header.mobileMenuAria}
        className={`fixed top-0 right-0 bottom-0 w-[310px] max-w-[85vw] bg-brand-bg z-50 shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out border-l border-brand-surface md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-5 border-b border-brand-surface">
            <div>
              <Logo className="h-7 mb-1" />
              <span className="text-[8px] tracking-[0.2em] text-brand-text uppercase font-medium">
                {messages.header.brandSubtitle}
              </span>
            </div>
            <button
              type="button"
              aria-label={messages.header.closeMenuAria}
              className="p-2 text-brand-text hover:underline underline-offset-4 rounded-full hover:bg-brand-surface/40 transition min-h-11 min-w-11 flex items-center justify-center cursor-pointer"
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

          <MobileMenuLinks onNavigate={close} />
        </div>

        {/* Bottom of Drawer: WhatsApp advice */}
        <div className="pt-6 border-t border-brand-surface">
          <div className="p-3 bg-brand-surface/60 rounded-xl mb-3">
            <p className="text-xs font-semibold text-brand-text">
              {messages.drawer.needAdviceTitle}
            </p>
            <p className="text-[11px] text-brand-text mt-0.5 leading-relaxed">
              {messages.drawer.needAdviceText}
            </p>
          </div>
          {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 min-w-11 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em] hover:bg-brand-text transition shadow-xs"
          >
            <span>{messages.drawer.whatsAppContactBtn}</span>
          </a>
          )}
        </div>
      </aside>
    </>
  );
}
