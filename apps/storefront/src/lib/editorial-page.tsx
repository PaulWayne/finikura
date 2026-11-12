import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentService } from "@/lib/content";
import { EditorialPageView } from "@/components/editorial/EditorialPageView";

// Shared by the editorial routes: content comes from Strapi, 404 when absent.

export async function editorialMetadata(slug: string): Promise<Metadata> {
  const page = await contentService.getEditorialPage(slug);
  if (!page) return {};
  return { title: page.seo.title, description: page.seo.description };
}

export async function EditorialRoute({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([
    contentService.getEditorialPage(slug),
    contentService.getGlobalSettings(),
  ]);
  if (!page) notFound();
  return <EditorialPageView page={page} whatsappUrl={settings.whatsappUrl} />;
}
