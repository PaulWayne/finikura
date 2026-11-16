import React from "react";
import { ReassuranceBlockData, ReassuranceItem } from "@/lib/content/types";
import { CreditCard, MessageCircle, Ruler } from "lucide-react";

interface ReassuranceBlockProps {
  block?: ReassuranceBlockData;
  items?: ReassuranceItem[];
}

const defaultItems: ReassuranceItem[] = [
  {
    id: "reass_1",
    title: "Paiement à la réception",
    description: "Réglez directement en mains propres à Bamako.",
    icon: "payments",
  },
  {
    id: "reass_2",
    title: "Confirmation sur WhatsApp",
    description: "Vous confirmez votre commande par un simple message.",
    icon: "chat",
  },
  {
    id: "reass_3",
    title: "Guide des tailles",
    description: "Les mesures par âge, pour choisir la bonne taille.",
    icon: "straighten",
  },
];

function renderIcon(iconName: string) {
  switch (iconName) {
    case "payments":
      return <CreditCard className="w-6 h-6 stroke-[1.5] text-brand-text" />;
    case "chat":
      return <MessageCircle className="w-6 h-6 stroke-[1.5] text-brand-text" />;
    case "straighten":
    default:
      return <Ruler className="w-6 h-6 stroke-[1.5] text-brand-text" />;
  }
}

export function ReassuranceBlock({ block, items }: ReassuranceBlockProps) {
  const displayItems = items && items.length > 0 ? items : block?.items || defaultItems;

  return (
    <section
      className="my-8 md:my-12 rounded-2xl bg-brand-surface/50 border border-brand-surface p-6 md:p-8 shadow-xs"
      data-purpose="reassurance-block"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-text/15">
        {displayItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`flex items-start gap-4 ${idx > 0 ? "pt-5 md:pt-0 md:pl-8" : ""}`}
          >
            <div className="w-12 h-12 rounded-full bg-brand-bg border border-brand-surface flex items-center justify-center shrink-0 shadow-xs">
              {renderIcon(item.icon)}
            </div>
            <div>
              <h3 className="font-serif text-base text-brand-text font-normal leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-brand-text font-light mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
