import React from "react";
import { contentService } from "@/lib/content";
import { ShippingReturnsPageContent } from "@/components/shipping/ShippingReturnsPageContent";

export const metadata = {
  title: "Livraison et Échanges à Bamako | Fini Kura",
  description:
    "Modalités de livraison par coursier dans les 6 communes de Bamako. Paiement à la réception en espèces ou Mobile Money, échanges de tailles sous 48h.",
};

export default async function LivraisonEtEchangesPage() {
  const settings = await contentService.getGlobalSettings();

  return (
    <div className="min-h-screen bg-[#FDF7F2] pt-20 md:pt-28 pb-16">
      <ShippingReturnsPageContent whatsappUrl={settings?.whatsappUrl} />
    </div>
  );
}
