import { cn } from "@/lib/utils";

/** Small leaf sprig taken from the logo, set before section eyebrows. Decorative. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className={cn("h-3.5 w-5 shrink-0", className)}
      fill="currentColor"
    >
      <path d="M2 14C7 13 12 10 15 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 11.5Q7.5 6.5 12 5Q12.5 10 8 11.5Z" />
      <path d="M12.5 8Q15.5 3.5 21 4.5Q18 9 12.5 8Z" />
      <path d="M5 13Q2.5 9.5 4.5 6.5Q7 10 5 13Z" />
    </svg>
  );
}
