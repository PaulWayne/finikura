"use client";
import { useState } from "react";
import type { SizeGuide } from "@/lib/content/types";
import { HeightAdvisor } from "@/components/product/HeightAdvisor";
import { SizeGuideTable } from "./SizeGuideTable";

/** Size guide page (FK-36): the height calculator highlights the matching row of this guide. */
export function SizeGuideWithAdvisor({ guide, whatsappUrl }: { guide: SizeGuide; whatsappUrl?: string | null }) {
  const [suggestedAge, setSuggestedAge] = useState<string | null>(null);
  return (
    <SizeGuideTable
      guide={guide}
      suggestedAge={suggestedAge}
      advisor={
        <HeightAdvisor
          rows={guide.rows}
          onAdvice={(row) => setSuggestedAge(row?.age ?? null)}
          whatsappHref={whatsappUrl}
        />
      }
    />
  );
}
