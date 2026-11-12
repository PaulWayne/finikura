import { EditorialRoute, editorialMetadata } from "@/lib/editorial-page";

const SLUG = "contact";

export function generateMetadata() {
  return editorialMetadata(SLUG);
}

export default function ContactPage() {
  return <EditorialRoute slug={SLUG} />;
}
