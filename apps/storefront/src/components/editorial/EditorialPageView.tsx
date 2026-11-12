import React from "react";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { EditorialPage } from "@/lib/content/types";

interface EditorialPageViewProps {
  page: EditorialPage;
  whatsappUrl?: string | null;
}

/** Strapi editorial page: title then blocks, all rendered on the server. */
export function EditorialPageView({ page, whatsappUrl }: EditorialPageViewProps) {
  return (
    <div className="pt-20 md:pt-28 pb-16 space-y-12 md:space-y-16">
      <h1 className="sr-only">{page.title}</h1>
      {page.blocks.map((block) => (
        <BlockRenderer key={`${block.type}-${block.id}`} block={block} whatsappUrl={whatsappUrl} />
      ))}
    </div>
  );
}
