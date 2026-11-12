"use client";

import type { ImgHTMLAttributes } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc: string };

/** <img> that swaps to a fallback URL once if the source fails to load. */
export function SafeImage({ fallbackSrc, alt = "", ...props }: SafeImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallbackSrc) {
          img.onerror = null;
          img.src = fallbackSrc;
        }
      }}
    />
  );
}
