"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src" | "fill"> & {
  src: string;
  fallbackSrc: string;
  /** Rendered widths, e.g. "(min-width: 768px) 33vw, 50vw". Required: the image fills its parent. */
  sizes: string;
};

/**
 * next/image that fills its positioned parent and swaps to a fallback URL once
 * if the source fails to load.
 */
export function SafeImage({ src, fallbackSrc, alt = "", ...props }: SafeImageProps) {
  // Remember which source failed, so a new src gets its own chance.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <Image
      {...props}
      fill
      src={failedSrc === src ? fallbackSrc : src}
      alt={alt}
      onError={() => setFailedSrc(src)}
    />
  );
}
