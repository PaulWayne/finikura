import React from "react";
import { contentService } from "@/lib/content";
import { LegalPageContent } from "@/components/legal/LegalPageContent";

export const metadata = {
  title: "Mentions Légales & Conditions de Vente | Fini Kura Bamako",
  description:
    "Mentions légales de l'Atelier Fini Kura au Quartier du Fleuve / ACI 2000, conditions de vente, confection artisanale, livraison et protection des données.",
};

export default async function MentionsLegalesPage() {
  const settings = await contentService.getGlobalSettings();

  return (
    <div className="min-h-screen bg-[#FDF7F2] pt-20 md:pt-28 pb-16">
      <LegalPageContent whatsappUrl={settings?.whatsappUrl} />
    </div>
  );
}
