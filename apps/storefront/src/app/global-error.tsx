"use client"; // Next requires error boundaries to be Client Components.

import { useEffect } from "react";
import { messages } from "@/messages/fr";
import "./globals.css";

/**
 * Last resort (audit E1): the root layout itself failed, for example when Strapi does not answer,
 * so this page has its own document and no data at all, not even the WhatsApp number.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = messages.errorPage;
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased">
        <title>{t.documentTitle}</title>
        <main className="py-24 px-4 text-center max-w-xl mx-auto" data-purpose="error-page">
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
            {/* A full reload, not a client navigation: the layout must be fetched again. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="min-h-11 inline-flex items-center justify-center px-6 rounded border border-brand-primary text-brand-text text-xs font-medium uppercase tracking-[0.15em]"
            >
              {t.backHome}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
