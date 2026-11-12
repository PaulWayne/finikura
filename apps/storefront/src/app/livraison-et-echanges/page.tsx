import { EditorialRoute, editorialMetadata } from "@/lib/editorial-page";

const SLUG = "livraison-et-echanges";

export function generateMetadata() {
  return editorialMetadata(SLUG);
}

export default function LivraisonEtEchangesPage() {
  return <EditorialRoute slug={SLUG} />;
}
