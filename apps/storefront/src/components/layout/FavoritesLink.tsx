"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { FAVORITES_EVENT, loadFavorites } from "@/lib/favorites";
import { messages } from "@/messages/fr";

/** Header heart with the number of favourites saved on this phone (FK-37). */
export function FavoritesLink() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(loadFavorites().length);
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, []);

  return (
    <Link
      href="/coups-de-coeur"
      aria-label={messages.favorites.linkAria(count)}
      className="relative min-h-11 min-w-11 flex items-center justify-center text-brand-text"
    >
      <Heart className={`w-6 h-6 stroke-[1.5] ${count > 0 ? "fill-brand-terracotta" : ""}`} />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-brand-white text-[10px] font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
