import React from "react";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { EditorialPage } from "@/lib/content/types";
import { messages } from "@/messages/fr";

interface EditorialPageViewProps {
  page: EditorialPage;
  whatsappUrl?: string | null;
}

/** Strapi editorial page: title then blocks, all rendered on the server. */
export function EditorialPageView({ page, whatsappUrl }: EditorialPageViewProps) {
  return (
    <div className="pt-6 md:pt-28 pb-16 space-y-10 md:space-y-16">
      <h1 className="sr-only">{page.title}</h1>
      {page.blocks.map((block) => (
        <BlockRenderer key={`${block.type}-${block.id}`} block={block} whatsappUrl={whatsappUrl} />
      ))}
      {/* Dated information is trusted more, by parents and by search engines and assistants. */}
      {page.updatedAt && (
        <p className="text-center text-sm text-brand-text">
          {messages.editorial.updatedOn(
            new Date(page.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Bamako" })
          )}
        </p>
      )}
    </div>
  );
}
