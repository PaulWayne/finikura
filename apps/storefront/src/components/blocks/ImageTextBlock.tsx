import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { ImageTextBlockData } from "@/lib/content/types";
import { IMAGE_FALLBACKS } from "@/lib/images";

export function ImageTextBlock({ block }: { block: ImageTextBlockData }) {
  const paragraphs = block.text.split(/\n{2,}/).filter(Boolean);
  return (
    <section className="max-w-[1100px] mx-auto px-5" data-purpose="image-text-block">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {block.imageUrl && (
          <div className="relative rounded-md overflow-hidden bg-brand-surface aspect-[4/5] md:aspect-auto md:h-[480px]">
            <SafeImage
              src={block.imageUrl}
              alt={block.imageAlt}
              fallbackSrc={IMAGE_FALLBACKS.about}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={block.imageUrl ? "" : "md:col-span-2 max-w-[720px] mx-auto"}>
          {block.eyebrow && (
            <span className="block text-xs uppercase tracking-[0.15em] font-semibold text-brand-text mb-3">
              {block.eyebrow}
            </span>
          )}
          <h2 className="font-serif text-2xl md:text-4xl text-brand-text leading-snug mb-6">{block.title}</h2>
          <div className="space-y-4 text-base leading-relaxed text-brand-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
