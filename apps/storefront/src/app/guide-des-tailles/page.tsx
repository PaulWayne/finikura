import type { Metadata } from "next";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { SizeGuideTable } from "@/components/size-guide/SizeGuideTable";

const t = messages.sizeGuidePage;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

export default async function GuideDesTaillesPage() {
  const [guides, settings] = await Promise.all([
    contentService.getAllSizeGuides(),
    contentService.getGlobalSettings(),
  ]);

  return (
    <div className="pt-20 md:pt-28 pb-16 max-w-[900px] mx-auto px-5 space-y-12">
      <header className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-brand-text mb-4">{t.breadcrumbTitle}</h1>
        <p className="text-base text-brand-text">{t.intro}</p>
        <p className="text-sm text-brand-text mt-2">{t.unitNote}</p>
      </header>

      {guides.map((guide) => (
        <SizeGuideTable key={guide.categoryHandle} guide={guide} />
      ))}

      {settings.whatsappUrl && (
        <p className="text-center">
          <a
            href={settings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 inline-flex items-center justify-center px-6 rounded-sm border-[1.5px] border-brand-primary text-brand-text text-sm font-medium hover:bg-brand-surface/40 transition"
          >
            {t.whatsAppHelp}
          </a>
        </p>
      )}
    </div>
  );
}
