"use client";
import React, { useEffect, useState, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { messages } from "@/messages/fr";
import { ZoomIn, Heart, Play } from "lucide-react";
import type { ProductVideo } from "@/lib/commerce/types";
import { triggerToast } from "@/lib/cart-events";
import { IMAGE_FALLBACKS } from "@/lib/images";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { FAVORITES_EVENT, loadFavorites, toggleFavorite } from "@/lib/favorites";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  productHandle: string;
  wornCaptions?: (string | null)[];
  /** Short clips shown after the photos (FK-38). */
  videos?: ProductVideo[];
}

type GalleryView = { kind: "photo"; src: string; caption: string | null } | { kind: "clip"; video: ProductVideo };

export function ProductGallery({ images, productTitle, productHandle, wornCaptions = [], videos = [] }: ProductGalleryProps) {
  const displayImages =
    images && images.length > 0
      ? images
      : [IMAGE_FALLBACKS.product];

  // The first photo opens the gallery (it is the one of the catalogue card, and the lightest to
  // show first). The first clip comes right after it, one swipe away; the other clips follow the photos.
  const photoViews: GalleryView[] = displayImages.map((src, i) => ({ kind: "photo", src, caption: wornCaptions[i] ?? null }));
  const clipViews: GalleryView[] = videos.map((video) => ({ kind: "clip", video }));
  const views = [photoViews[0], ...clipViews.slice(0, 1), ...photoViews.slice(1), ...clipViews.slice(1)];
  const viewCount = views.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Read after mount: the saved list only exists on the phone.
  useEffect(() => {
    const sync = () => setIsWishlisted(loadFavorites().includes(productHandle));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, [productHandle]);
  const activeView = views[activeIndex] ?? views[0];
  const activeCaption = activeView.kind === "clip" ? activeView.video.caption : activeView.caption;
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
        {views.map((view, idx) => {
          const isActive = activeIndex === idx;
          const outline = isActive
            ? "outline outline-2 outline-brand-primary outline-offset-2"
            : "outline outline-1 outline-transparent hover:outline-brand-surface";
          return view.kind === "clip" ? (
            <button
              key={view.video.sources[0].src}
              type="button"
              aria-label={messages.product.videoThumbAria}
              onClick={() => handleThumbnailClick(idx)}
              className={`thumb-btn relative w-20 h-24 rounded-lg bg-brand-surface/40 overflow-hidden transition-all duration-200 shrink-0 cursor-pointer ${outline}`}
            >
              <SafeImage
                src={view.video.poster}
                alt=""
                fallbackSrc={IMAGE_FALLBACKS.product}
                sizes="80px"
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-text">
                  <Play className="w-4 h-4 fill-brand-text" aria-hidden="true" />
                </span>
              </span>
            </button>
          ) : (
            <button
              key={`${view.src}-${idx}`}
              type="button"
              aria-label={`Afficher la vue ${idx + 1}`}
              onClick={() => handleThumbnailClick(idx)}
              className={`thumb-btn relative w-20 h-24 rounded-lg bg-brand-surface/40 overflow-hidden transition-all duration-200 shrink-0 group cursor-pointer ${outline}`}
            >
              <SafeImage
                src={view.src}
                alt={`${productTitle} vue miniature ${idx + 1}`}
                fallbackSrc={IMAGE_FALLBACKS.product}
                sizes="80px"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          );
        })}
      </div>

      {/* Main image container: edge to edge on a phone, past the page gutter */}
      <div className="relative flex-1 w-[calc(100%+2rem)] -mx-4 md:mx-0 md:w-full bg-brand-surface/30 md:rounded-md overflow-hidden group">
        {/* Desktop single main display with smooth transition */}
        <div className="hidden md:block aspect-[4/5] w-full overflow-hidden relative bg-brand-surface/30">
          {activeView.kind === "clip" ? (
            <ProductVideoView key={activeView.video.sources[0].src} video={activeView.video} productTitle={productTitle} productHandle={productHandle} />
          ) : (
          <SafeImage
            src={activeView.src}
            alt={`${productTitle} - Vue haute résolution`}
            fallbackSrc={IMAGE_FALLBACKS.product}
            sizes="(min-width: 1200px) 560px, 50vw"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          )}


          {/* Loupe / Interaction Hint */}
          <div hidden={activeView.kind === "clip"} className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg/90 backdrop-blur-xs text-brand-text shadow-xs transition-opacity group-hover:opacity-100">
            <ZoomIn className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-brand-text font-normal">
              {messages.product.mainStudioView}
            </span>
          </div>
        </div>

        {/* Mobile Horizontal Swipeable Carousel (390px) */}
        <div className="block md:hidden relative w-full aspect-[4/5] overflow-hidden select-none">

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
            {views.map((view, idx) => (
              <div
                key={view.kind === "clip" ? view.video.sources[0].src : `${view.src}-${idx}`}
                className="w-full h-full flex-shrink-0 snap-center relative aspect-[4/5] bg-brand-surface/40"
              >
                {view.kind === "clip" ? (
                  <ProductVideoView video={view.video} productTitle={productTitle} productHandle={productHandle} />
                ) : (
                  <SafeImage
                    src={view.src}
                    alt={`${productTitle} - Vue ${idx + 1}`}
                    fallbackSrc={IMAGE_FALLBACKS.product}
                    sizes="(min-width: 768px) 1px, 100vw"
                    preload={idx === 0}
                    className="object-cover object-top"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Photo counter: tells the customer there is more to swipe */}
          {viewCount > 1 && (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-brand-bg/90 text-xs font-medium text-brand-text shadow-xs">
              {messages.product.galleryCounter(activeIndex + 1, viewCount)}
            </span>
          )}

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {Array.from({ length: viewCount }, (_, idx) => (
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
          <p className="px-4 md:px-3 py-2 text-xs text-brand-text bg-brand-bg border-t border-brand-surface">
            {activeCaption}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * The clip of a product (FK-38). Only the still image is loaded with the page: the video file
 * is fetched when the customer asks for it, then plays muted and in a loop. Never on its own.
 */
function ProductVideoView({ video, productTitle, productHandle }: { video: ProductVideo; productTitle: string; productHandle: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <video
        aria-label={messages.product.videoAria(productTitle)}
        poster={video.poster}
        autoPlay
        muted
        loop
        playsInline
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover bg-brand-surface"
      >
        {video.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent(ANALYTICS_EVENTS.videoPlay, { produit: productHandle });
        setIsPlaying(true);
      }}
      className="absolute inset-0 w-full h-full cursor-pointer group/video"
    >
      <SafeImage
        src={video.poster}
        alt=""
        fallbackSrc={IMAGE_FALLBACKS.product}
        sizes="(min-width: 1200px) 560px, (min-width: 768px) 50vw, 100vw"
        className="w-full h-full object-cover object-top"
      />
      <span className="absolute inset-x-0 bottom-10 flex justify-center">
        <span className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-brand-bg text-brand-text text-sm font-medium shadow-sm">
          <Play className="w-4 h-4 fill-brand-text" aria-hidden="true" />
          {messages.product.videoPlay}
        </span>
      </span>
    </button>
  );
}
