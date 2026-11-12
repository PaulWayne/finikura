"use client";
import React, { useState, useRef } from "react";
import { messages } from "@/messages/fr";
import { Sparkles, ZoomIn, Heart } from "lucide-react";
import { triggerToast } from "@/lib/cart-events";
import { IMAGE_FALLBACKS, handleImgError } from "@/lib/images";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
}

const DEFAULT_CAPTIONS = [
  "Vue cintre studio - Broderies fines",
  "Portée - Tombé souple et délicat",
  "Détail du plastron brodé et finitions",
  "Harmonie de teintes de la collection lin",
];

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const displayImages =
    images && images.length > 0
      ? images
      : [IMAGE_FALLBACKS.product];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setIsWishlisted(!isWishlisted);
    triggerToast(
      !isWishlisted ? "Ajouté à votre sélection" : "Retiré de votre sélection"
    );
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
              className={`thumb-btn relative w-20 h-24 rounded-lg bg-[#EADCCC]/40 overflow-hidden transition-all duration-200 shrink-0 group focus:outline-none cursor-pointer ${
                isActive
                  ? "outline outline-2 outline-[#8A7058] outline-offset-2"
                  : "outline outline-1 outline-transparent hover:outline-[#ded2c2]"
              }`}
            >
              <img
                src={src}
                alt={`${productTitle} vue miniature ${idx + 1}`}
                onError={handleImgError(IMAGE_FALLBACKS.product)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          );
        })}
      </div>

      {/* Main image container */}
      <div className="relative flex-1 w-full bg-[#EADCCC]/30 rounded-xl md:rounded-2xl overflow-hidden group border border-[#EADCCC]">
        {/* Desktop single main display with smooth transition */}
        <div className="hidden md:block aspect-[4/5] w-full overflow-hidden relative bg-[#EADCCC]/30">
          <img
            src={displayImages[activeIndex] || displayImages[0]}
            alt={`${productTitle} - Vue haute résolution`}
            onError={handleImgError(IMAGE_FALLBACKS.product)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          {/* Editorial Badges on Desktop Image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF7F2]/95 backdrop-blur-xs uppercase shadow-xs text-[11px] tracking-[0.15em] font-medium text-[#CA7154]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CA7154]" />
              {messages.product.confectionBamako}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF7F2]/95 backdrop-blur-xs text-[#5E5245] uppercase shadow-xs text-[11px] tracking-[0.15em] font-medium">
              {messages.product.pureLinen}
            </span>
          </div>

          {/* Loupe / Interaction Hint */}
          <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF7F2]/90 backdrop-blur-xs text-[#5E5245] shadow-xs transition-opacity group-hover:opacity-100">
            <ZoomIn className="w-4 h-4 text-[#8A7058]" />
            <span className="text-xs text-[#5E5245]/80 font-normal">
              {DEFAULT_CAPTIONS[activeIndex] || messages.product.mainStudioView}
            </span>
          </div>
        </div>

        {/* Mobile Horizontal Swipeable Carousel (390px) */}
        <div className="block md:hidden relative w-full aspect-square overflow-hidden select-none">
          {/* Badge Brodée Main */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#CA7154] text-white text-[10px] tracking-[0.15em] uppercase font-medium shadow-xs">
              <Sparkles className="w-3 h-3" />
              {messages.product.handEmbroidered}
            </span>
          </div>

          {/* Favorite subtle button */}
          <button
            type="button"
            aria-label="Enregistrer aux favoris"
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[#FDF7F2]/90 backdrop-blur-xs flex items-center justify-center text-[#5E5245] hover:text-[#CA7154] shadow-xs transition active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isWishlisted
                  ? "fill-[#CA7154] text-[#CA7154]"
                  : "text-[#5E5245]"
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
                className="w-full h-full flex-shrink-0 snap-center relative aspect-square bg-[#EADCCC]/40"
              >
                <img
                  src={src}
                  alt={`${productTitle} - Vue ${idx + 1}`}
                  onError={handleImgError(IMAGE_FALLBACKS.product)}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx
                    ? "w-3 h-1.5 bg-[#8A7058]"
                    : "w-1.5 h-1.5 bg-[#5E5245]/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
