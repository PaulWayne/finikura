import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { messages } from "@/messages/fr";

/**
 * Confirmation shown on a device that did not place the order (FK-23):
 * order number only, no personal data. Receives the number alone, never the order.
 */
export function OrderConfirmationLimited({ orderNumber }: { orderNumber: string }) {
  const t = messages.confirmation;
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 py-6 sm:py-10">
      <div className="w-full bg-brand-white rounded-2xl border border-brand-surface/60 p-6 sm:p-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-brand-sage-soft px-4 py-1.5 rounded-full mb-6">
          <CheckCircle2 aria-hidden className="w-4 h-4 text-brand-text" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text">
            {t.badgeStatus}
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-text mb-1 font-medium">{t.orderRefLabel}</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-text font-normal mb-4">
          {t.orderNumberPrefix} {orderNumber}
        </h1>
        <p className="text-sm text-brand-text mb-6">{t.limitedNotice}</p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center px-6 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          {t.backToStore}
        </Link>
      </div>
    </div>
  );
}
