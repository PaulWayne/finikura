"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { messages } from "@/messages/fr";

/**
 * Floating WhatsApp button (FK-20). Hidden on /commande and the confirmation page,
 * which have their own WhatsApp button. On mobile it sits above the tab bar, and on
 * product pages above the sticky "Ajouter au panier" bar.
 */
export function WhatsAppFloatingButton({ href }: { href: string }) {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/commande")) return null;

  const onProduct = pathname.startsWith("/produit/");
  const mobileBottom = onProduct
    ? "bottom-[calc(7.5rem+env(safe-area-inset-bottom))]"
    : "bottom-[calc(5rem+env(safe-area-inset-bottom))]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={messages.whatsapp.floatingLabel}
      title={messages.whatsapp.floatingLabel}
      className={`fixed right-4 ${mobileBottom} md:bottom-6 md:right-6 z-30 w-14 h-14 rounded-full bg-brand-primary text-brand-white shadow-lg flex items-center justify-center hover:bg-brand-text transition-colors`}
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  );
}
