import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentService } from "@/lib/content";
import { EditorialPageView } from "@/components/editorial/EditorialPageView";
import { pageTitle } from "@/lib/seo";
import { aboutJsonLd, breadcrumbJsonLd, faqItemsOf, faqJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

// Shared by the editorial routes: content comes from Strapi, 404 when absent.

const ABOUT_SLUG = "notre-histoire";

export async function editorialMetadata(slug: string): Promise<Metadata> {
  const page = await contentService.getEditorialPage(slug);
  if (!page) return {};
  return {
    title: { absolute: pageTitle(page.seo.title) },
    description: page.seo.description,
    alternates: { canonical: `/${slug}` },
  };
}

export async function EditorialRoute({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([
    contentService.getEditorialPage(slug),
    contentService.getGlobalSettings(),
  ]);
  if (!page) notFound();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: `/${slug}` }])} />
      {slug === ABOUT_SLUG && (
        <JsonLd
          data={aboutJsonLd(
            { slug, title: page.title, description: page.seo.description, updatedAt: page.updatedAt },
            settings
          )}
        />
      )}
      <JsonLd data={faqJsonLd(faqItemsOf(page.blocks))} />
      <EditorialPageView page={page} whatsappUrl={settings.whatsappUrl} />
    </>
  );
}
