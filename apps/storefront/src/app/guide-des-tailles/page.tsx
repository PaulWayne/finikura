import React from "react";
import { contentService } from "@/lib/content";
import { SizeGuidePageContent } from "@/components/size-guide/SizeGuidePageContent";

export const metadata = {
  title: "Guide des tailles enfants (3 à 14 ans) | Fini Kura Bamako",
  description:
    "Consultez les mensurations précises de nos collections filles et garçons à Bamako. Barème en centimètres et conseils d'aisance.",
};

export default async function GuideDesTaillesPage() {
  const settings = await contentService.getGlobalSettings();

  return (
    <div className="min-h-screen bg-[#FFF8F4] pt-24 md:pt-32 pb-16">
      <SizeGuidePageContent whatsappUrl={settings?.whatsappUrl} />
    </div>
  );
}
