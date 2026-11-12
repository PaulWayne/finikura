import React from "react";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata = {
  title: "Notre histoire | Maison de confection enfantine Fini Kura Bamako",
  description:
    "Découvrez l'histoire de Fini Kura, des premiers habits d'enfance découpés sur la table du salon jusqu'à notre atelier de confection éthique au cœur de Bamako.",
};

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] pt-20 md:pt-28 pb-16">
      <AboutPageContent />
    </div>
  );
}
