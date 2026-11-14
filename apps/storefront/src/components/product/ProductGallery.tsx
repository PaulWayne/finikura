"use client";
import React, { useEffect, useState, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { messages } from "@/messages/fr";
import { ZoomIn, Heart } from "lucide-react";
import { triggerToast } from "@/lib/cart-events";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { FAVORITES_EVENT, loadFavorites, toggleFavorite } from "@/lib/favorites";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  productHandle: string;
  wornCaptions?: (string | null)[];
}

export function ProductGallery({ images, productTitle, productHandle, wornCaptions = [] }: ProductGalleryProps) {
  const displayImages =
    images && images.length > 0
      ? images
      : [IMAGE_FALLBACKS.product];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Read after mount: the saved list only exists on the phone.
  useEffect(() => {
    const sync = () => setIsWishlisted(loadFavorites().includes(productHandle));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, [productHandle]);
  const activeCaption = wornCaptions[activeIndex] ?? null;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = (idx: number) => {
    setActiveIndex(idx);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * idx,
        behavior: "smooth",
      });
    }
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.offsetWidth;
    if (width > 0) {
      const idx = Math.round(container.scrollLeft / width);
      setActiveIndex(idx);
    }
  };

  const toggleWishlist = () => {
    const added = toggleFavorite(productHandle);
    if (added === null) {
      triggerToast(messages.favorites.unavailable);
      return;
    }
    setIsWishlisted(added);
    trackEvent(ANALYTICS_EVENTS.favorite, { action: added ? "ajout" : "retrait" });
    triggerToast(added ? messages.favorites.added : messages.favorites.removed);
  };

  return (
    <section
      aria-label="Galerie photos du produit"
      className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 items-start w-full"
    >
      {/* Vignettes verticales (Desktop Left Rail) */}
      <div
        className="hidden md:flex flex-col gap-3 shrink-0 w-20"
        id="thumb-container"
      >
        {displayImages.map((src, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              aria-label={`Afficher la vue ${idx + 1}`}
              onClick={() => handleThumbnailClick(idx)}
              className={`thumb-btn relative w-20 h-24 rounded-lg bg-brand-surface/40 overflow-hidden transition-all duration-200 shrink-0 group cursor-pointer ${
                isActive
                  ? "outline outline-2 outline-brand-primary outline-offset-2"
                  : "outline outline-1 outline-transparent hover:outline-brand-surface"
              }`}
            >
              <SafeImage
                src={src}
                alt={`${productTitle} vue miniature ${idx + 1}`}
                fallbackSrc={IMAGE_FALLBACKS.product}
                sizes="80px"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          );
        })}
      </div>

      {/* Main image container */}
      <div className="relative flex-1 w-full bg-brand-surface/30 rounded-xl md:rounded-2xl overflow-hidden group border border-brand-surface">
        {/* Desktop single main display with smooth transition */}
        <div className="hidden md:block aspect-[4/5] w-full overflow-hidden relative bg-brand-surface/30">
          <SafeImage
            src={displayImages[activeIndex] || displayImages[0]}
            alt={`${productTitle} - Vue haute résolution`}
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="(min-width: 1200px) 560px, 50vw"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />


          {/* Loupe / Interaction Hint */}
          <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg/90 backdrop-blur-xs text-brand-text shadow-xs transition-opacity group-hover:opacity-100">
            <ZoomIn className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-brand-text font-normal">
              {messages.product.mainStudioView}
            </span>
          </div>
        </div>

        {/* Mobile Horizontal Swipeable Carousel (390px) */}
        <div className="block md:hidden relative w-full aspect-[5/4] overflow-hidden select-none">

          {/* Favorite subtle button */}
          <button
            type="button"
            aria-label={isWishlisted ? messages.favorites.removeAria : messages.favorites.addAria}
            aria-pressed={isWishlisted}
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-brand-bg/90 backdrop-blur-xs flex items-center justify-center text-brand-text hover:text-brand-terracotta shadow-xs transition active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isWishlisted
                  ? "fill-brand-terracotta text-brand-text"
                  : "text-brand-text"
              }`}
            />
          </button>

          {/* Horizontal snap carousel */}
          <div
            ref={scrollContainerRef}
            onScroll={handleMobileScroll}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {displayImages.map((src, idx) => (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 snap-center relative aspect-[5/4] bg-brand-surface/40"
              >
                <SafeImage
                  src={src}
                  alt={`${productTitle} - Vue ${idx + 1}`}
                  fallbackSrc={IMAGE_FALLBACKS.product}
                  sizes="(min-width: 768px) 1px, 100vw"
                  preload={idx === 0}
                  className="object-cover object-[center_20%]"
                />
              </div>
            ))}
          </div>

          {/* Photo counter: tells the customer there is more to swipe */}
          {displayImages.length > 1 && (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-brand-bg/90 text-xs font-medium text-brand-text shadow-xs">
              {messages.product.galleryCounter(activeIndex + 1, displayImages.length)}
            </span>
          )}

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx
                    ? "w-4 h-2 bg-brand-primary"
                    : "w-2 h-2 bg-brand-bg/90 border border-brand-text/60"
                }`}
              />
            ))}
          </div>
        </div>
        {activeCaption && (
          <p className="px-3 py-2 text-xs text-brand-text bg-brand-bg border-t border-brand-surface">
            {activeCaption}
          </p>
        )}
      </div>
    </section>
  );
}
