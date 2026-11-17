import { cn } from "@/lib/utils";
import { messages } from "@/messages/fr";

// Placeholders shown while a page streams in. Each one draws the outline of the page that
// follows (same grid, same photo ratio), so nothing jumps when the content arrives.

function Bone({ className }: { className: string }) {
  return <div aria-hidden="true" className={cn("bg-brand-surface rounded-md", className)} />;
}

/** Announces the wait once to screen readers; the grey shapes themselves are hidden from them. */
function SkeletonFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div role="status" className={className} data-purpose="page-skeleton">
      <span className="sr-only">{messages.common.loading}</span>
      <div className="animate-pulse motion-reduce:animate-none">{children}</div>
    </div>
  );
}

function Breadcrumb() {
  return <Bone className="h-4 w-40" />;
}

/** Same outline as ProductCard: white rounded card, 4:5 photo, small line, name, price. */
function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-xl md:rounded-2xl bg-brand-white border border-brand-surface overflow-hidden"
    >
      <div className="w-full aspect-[4/5] bg-brand-surface" />
      <div className="px-2.5 pt-2.5 pb-3 md:px-4 md:pt-3.5 md:pb-4 space-y-2">
        <Bone className="h-2.5 w-1/3" />
        <Bone className="h-4 w-4/5" />
        <Bone className="h-4 w-2/5" />
      </div>
    </div>
  );
}

function ProductCards({ count, className }: { count: number; className: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        // The last two only fill the wider rows: on a phone, four cards already fill the screen.
        <div key={i} className={i >= 4 ? "hidden md:block" : undefined}>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

const CATALOG_GRID = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10";
const CARD_GRID = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6";

/** Category page: breadcrumb, banner with its small photo, two rows of filters, the grid. */
export function CatalogSkeleton() {
  return (
    <SkeletonFrame>
      <div className="pt-3 pb-4 md:py-8 space-y-4 md:space-y-8">
        <Breadcrumb />
        <div className="flex items-center gap-3.5 md:gap-6">
          <Bone className="w-20 h-24 md:w-28 md:h-36 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <Bone className="h-7 md:h-9 w-32 md:w-48" />
            <Bone className="h-4 w-full max-w-md" />
            <Bone className="h-4 w-2/3 max-w-xs" />
          </div>
        </div>
        <div className="flex flex-col md:items-center gap-4 my-2 md:my-6 overflow-hidden">
          {[0, 1].map((row) => (
            <div key={row} className="flex gap-2 px-2 md:px-0">
              {Array.from({ length: row === 0 ? 5 : 4 }, (_, i) => (
                <Bone key={i} className="h-11 w-24 shrink-0 rounded-full" />
              ))}
            </div>
          ))}
        </div>
        <Bone className="h-3 w-24 mx-auto" />
        <ProductCards count={8} className={CATALOG_GRID} />
      </div>
    </SkeletonFrame>
  );
}

/** Product page: the photo edge to edge on a phone, then the name, the price, the sizes, the button. */
export function ProductSkeleton() {
  return (
    <SkeletonFrame>
      <div className="pt-2 pb-4 md:py-8 space-y-3 md:space-y-8">
        <Breadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 flex gap-4 items-start">
            <div className="hidden md:flex flex-col gap-3 shrink-0 w-20">
              {[0, 1, 2].map((i) => (
                <Bone key={i} className="w-20 aspect-[4/5]" />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="flex-1 w-[calc(100%+2rem)] -mx-4 md:mx-0 md:w-full aspect-[4/5] bg-brand-surface md:rounded-md"
            />
          </div>
          <div className="lg:col-span-5 pt-1 space-y-4">
            <Bone className="h-8 md:h-10 w-4/5" />
            <Bone className="h-7 w-32" />
            <div className="w-full h-px bg-brand-surface" />
            <Bone className="h-4 w-28" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <Bone key={i} className="h-11" />
              ))}
            </div>
            <Bone className="h-12 w-full rounded-lg" />
            <div className="space-y-2 pt-2">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-11/12" />
              <Bone className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonFrame>
  );
}

/** Campaign page: the banner, its three lines of text, the outfits. */
export function CampaignSkeleton() {
  return (
    <SkeletonFrame>
      <div className="pt-2 pb-4 md:py-8 space-y-8 md:space-y-12">
        <Breadcrumb />
        <div className="rounded-2xl overflow-hidden border border-brand-surface">
          <div aria-hidden="true" className="aspect-[4/3] md:aspect-[21/9] bg-brand-surface" />
          <div className="p-6 md:p-10 flex flex-col items-center gap-3">
            <Bone className="h-3 w-28" />
            <Bone className="h-8 w-3/4 max-w-md" />
            <Bone className="h-4 w-full max-w-lg" />
          </div>
        </div>
        <ProductCards count={8} className={CARD_GRID} />
      </div>
    </SkeletonFrame>
  );
}

/** A plain grid of outfits (saved outfits). */
export function ProductGridSkeleton() {
  return (
    <SkeletonFrame>
      <ProductCards count={4} className={CARD_GRID} />
    </SkeletonFrame>
  );
}

/** Checkout: the form on the left, the summary of the order on the right (below on a phone). */
export function CheckoutSkeleton() {
  return (
    <SkeletonFrame>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-12 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <Bone className="h-8 w-3/5" />
            <Bone className="h-16 w-full rounded-xl" />
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Bone className="h-4 w-28" />
                <Bone className="h-12 w-full" />
              </div>
            ))}
            <Bone className="h-12 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3">
                <Bone className="w-16 h-20 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Bone className="h-4 w-3/4" />
                  <Bone className="h-4 w-1/3" />
                </div>
              </div>
            ))}
            <Bone className="h-10 w-full" />
          </div>
        </div>
      </div>
    </SkeletonFrame>
  );
}

/** Order confirmation: the white card with its badge, its tick and its lines. */
export function ConfirmationSkeleton() {
  return (
    <SkeletonFrame>
      <div className="pt-2 md:pt-16 pb-16">
        <div className="w-full max-w-[680px] mx-auto sm:px-4">
          <div className="bg-brand-white rounded-2xl border border-brand-surface/60 px-4 py-5 sm:p-10 flex flex-col items-center gap-4">
            <Bone className="h-7 w-44 rounded-full" />
            <Bone className="w-14 h-14 sm:w-20 sm:h-20 rounded-full" />
            <Bone className="h-8 w-3/4" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-12 w-full rounded-lg mt-2" />
            <Bone className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </SkeletonFrame>
  );
}
