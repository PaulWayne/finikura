import React from "react";
import { contentService } from "@/lib/content";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata = {
  title: "Contact & FAQ | Atelier Fini Kura Bamako",
  description:
    "Contactez notre atelier à Bamako (Quartier du Fleuve / ACI 2000) par WhatsApp ou formulaire. Réponses aux questions fréquentes sur la livraison et le paiement à la réception.",
};

export default async function ContactPage() {
  const settings = await contentService.getGlobalSettings();

  return (
    <div className="min-h-screen bg-[#FFF8F4] pt-20 md:pt-28 pb-16">
      <ContactPageContent whatsappUrl={settings?.whatsappUrl} />
    </div>
  );
}
