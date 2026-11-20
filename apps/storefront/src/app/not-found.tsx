import Link from "next/link";
import { messages } from "@/messages/fr";

export const metadata = { title: messages.meta.notFoundTitle };

export default function NotFound() {
  const t = messages.notFound;
  return (
    <section className="py-24 px-4 text-center max-w-xl mx-auto">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-text mb-3">{t.eyebrow}</p>
      <h1 className="font-serif text-3xl text-brand-text mb-4">{t.title}</h1>
      <p className="text-sm text-brand-text mb-8">{t.description}</p>
      {/* One column per button, all of the same width. */}
      <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr sm:w-max sm:mx-auto">
        <Link
          href="/"
          className="min-h-11 inline-flex items-center justify-center px-6 whitespace-nowrap rounded bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          {t.backHome}
        </Link>
        <Link
          href="/categorie/filles"
          className="min-h-11 inline-flex items-center justify-center px-6 whitespace-nowrap rounded border border-brand-primary text-brand-text text-xs font-medium uppercase tracking-[0.15em]"
        >
          {t.seeGirls}
        </Link>
        <Link
          href="/categorie/garcons"
          className="min-h-11 inline-flex items-center justify-center px-6 whitespace-nowrap rounded border border-brand-primary text-brand-text text-xs font-medium uppercase tracking-[0.15em]"
        >
          {t.seeBoys}
        </Link>
      </div>
    </section>
  );
}
