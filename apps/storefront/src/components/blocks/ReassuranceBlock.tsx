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
      className="border-y border-brand-surface py-6 md:py-8"
      data-purpose="reassurance-block"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        {displayItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-start gap-4"
          >
            <div className="shrink-0 mt-0.5">
              {renderIcon(item.icon)}
            </div>
            <div>
              <h3 className="font-serif text-lg text-brand-text leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-brand-text mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
