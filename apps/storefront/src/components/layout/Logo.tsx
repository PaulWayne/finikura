// The client's logo (SVG files in public/brand). The only place where the logo
// colours (rose and navy) may appear: the charter keeps them out of the interface.
const VARIANTS = {
  // « Fini Kura » lettering alone, for the header and the menu.
  wordmark: { src: "/brand/fini-kura-wordmark.svg", width: 755, height: 225, alt: "Fini Kura" },
  // Full emblem: clothes on hangers, lettering and « Habits pour enfants ».
  full: { src: "/brand/fini-kura-logo.svg", width: 780, height: 665, alt: "Fini Kura, habits pour enfants" },
} as const;

export function Logo({
  variant = "wordmark",
  className = "",
  priority = false,
}: {
  variant?: keyof typeof VARIANTS;
  /** Set the height (h-8…) here; the width follows the drawing. */
  className?: string;
  priority?: boolean;
}) {
  const v = VARIANTS[variant];
  return (
    // A plain <img>: an SVG gains nothing from the image optimiser, and the file stays cached.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={v.src}
      width={v.width}
      height={v.height}
      alt={v.alt}
      fetchPriority={priority ? "high" : undefined}
      className={`w-auto ${className}`}
    />
  );
}
