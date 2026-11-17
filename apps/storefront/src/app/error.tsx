"use client"; // Next requires error boundaries to be Client Components.

import Link from "next/link";
import { useEffect } from "react";
import { messages } from "@/messages/fr";

/**
 * Shown in place of a page that failed (audit E1), for example when Medusa does not answer.
 * The root layout stays around it, so the WhatsApp button and the menu are still there.
 */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const t = messages.errorPage;
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24 px-4 text-center max-w-xl mx-auto" data-purpose="error-page">
      <h1 className="font-serif text-3xl text-brand-text mb-4">{t.title}</h1>
      <p className="text-sm text-brand-text mb-8">{t.description}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => retry()}
          className="min-h-11 inline-flex items-center justify-center px-6 rounded bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em] cursor-pointer"
        >
          {t.retry}
        </button>
        <Link
          href="/"
          className="min-h-11 inline-flex items-center justify-center px-6 rounded border border-brand-primary text-brand-text text-xs font-medium uppercase tracking-[0.15em]"
        >
          {t.backHome}
        </Link>
      </div>
    </section>
  );
}
