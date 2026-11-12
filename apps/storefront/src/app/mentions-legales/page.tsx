import { EditorialRoute, editorialMetadata } from "@/lib/editorial-page";

const SLUG = "mentions-legales";

export function generateMetadata() {
  return editorialMetadata(SLUG);
}

export default function MentionsLegalesPage() {
  return <EditorialRoute slug={SLUG} />;
}
