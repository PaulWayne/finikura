import { messages } from "@/messages/fr";

/** Lightweight placeholder shown while request-time content streams in. */
export function PageFallback() {
  return (
    <div role="status" aria-live="polite" className="py-24 flex justify-center">
      <span className="sr-only">{messages.common.loading}</span>
      <span className="w-10 h-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
    </div>
  );
}
