import { Suspense } from "react";
import type { Metadata } from "next";
import { PageFallback } from "@/components/layout/PageFallback";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import { commerceService } from "@/lib/commerce";
import { messages } from "@/messages/fr";

export const metadata: Metadata = {
  title: `${messages.favorites.title} | Fini Kura`,
  // Personal to each phone: nothing to index.
  robots: { index: false, follow: true },
};

async function FavoritesContent() {
  const products = await commerceService.getProducts();
  return <FavoritesList products={products} />;
}

export default function FavoritesPage() {
  return (
    <div className="pt-3 pb-12 md:py-8 space-y-5 md:space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl md:text-[40px] uppercase font-normal text-brand-text tracking-[0.08em] leading-tight">
          {messages.favorites.title}
        </h1>
        <p className="text-sm md:text-base text-brand-text">{messages.favorites.intro}</p>
      </div>
      <Suspense fallback={<PageFallback />}>
        <FavoritesContent />
      </Suspense>
    </div>
  );
}
