import React from "react";
import { ReassuranceBlockData, ReassuranceItem } from "@/lib/content/types";
import { CreditCard, MessageCircle, Ruler, Shirt, Sparkles } from "lucide-react";

interface ReassuranceBlockProps {
  block?: ReassuranceBlockData;
  items?: ReassuranceItem[];
}

const defaultItems: ReassuranceItem[] = [
  {
    id: "reass_1",
    title: "100 % coton",
    description: "Un coton doux qui respire, pour l'école comme pour les fêtes.",
    icon: "cotton",
  },
  {
    id: "reass_2",
    title: "Petites séries",
    description: "Des collections en petites séries, avec peu de pièces par taille.",
    icon: "series",
  },
  {
    id: "reass_3",
    title: "Paiement à la réception",
    description: "Vous payez quand vous recevez votre commande, à Bamako.",
    icon: "payments",
  },
];

function renderIcon(iconName: string) {
  switch (iconName) {
    case "payments":
      return <CreditCard className="w-6 h-6 stroke-[1.5] text-brand-text" />;
    case "chat":
      return <MessageCircle className="w-6 h-6 stroke-[1.5] text-brand-text" />;
    case "cotton":
      return <Shirt className="w-6 h-6 stroke-[1.5] text-brand-text" />;
    case "series":
      return <Sparkles className="w-6 h-6 stroke-[1.5] text-brand-text" />;
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
