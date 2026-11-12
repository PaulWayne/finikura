import { EditorialRoute, editorialMetadata } from "@/lib/editorial-page";

const SLUG = "notre-histoire";

export function generateMetadata() {
  return editorialMetadata(SLUG);
}

export default function NotreHistoirePage() {
  return <EditorialRoute slug={SLUG} />;
}
