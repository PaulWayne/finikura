import Link from "next/link";
import { messages } from "@/messages/fr";
import { DEPARTMENTS } from "@/lib/main-nav";

const CATEGORY = "font-serif text-lg font-medium text-brand-text hover:underline underline-offset-4 transition min-h-11 flex items-center justify-between";
const SECONDARY = "font-normal text-brand-text hover:underline underline-offset-4 transition min-h-11 flex items-center";

function Chevron() {
  return (
    <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Links of the mobile menu. Every link closes the drawer. */
export function MobileMenuLinks({ onNavigate }: { onNavigate: () => void }) {
  const h = messages.header;
  return (
    <nav className="mt-6 flex flex-col space-y-4">
      {DEPARTMENTS.map((item) => (
        <Link key={item.href} href={item.href} onClick={onNavigate} className={CATEGORY}>
          <span>
            {item.label}
            <span className="font-sans text-sm font-light ml-2">{item.ages}</span>
          </span>
          <Chevron />
        </Link>
      ))}
      <Link href="/#nouveautes" onClick={onNavigate} className={CATEGORY}>
        <span>{h.navNew}</span>
        <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-brand-sage-soft text-brand-text font-medium tracking-wider uppercase">
          {h.mobileNewBadge}
        </span>
      </Link>

      <div className="w-full h-px bg-brand-surface my-2" />

      <Link href="/coups-de-coeur" onClick={onNavigate} className={`text-base ${SECONDARY}`}>
        {messages.favorites.title}
      </Link>
      <Link href="/guide-des-tailles" onClick={onNavigate} className={`text-base ${SECONDARY}`}>
        {h.navSizeGuide}
      </Link>
      <Link
        href="/notre-histoire"
        onClick={onNavigate}
        className="min-h-11 min-w-11 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[4px] border border-brand-primary text-brand-text font-medium text-xs tracking-[0.15em] uppercase hover:bg-brand-primary hover:text-brand-white transition shadow-xs"
      >
        <span>{h.navHistory}</span>
        <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <Link href="/livraison-et-echanges" onClick={onNavigate} className={`text-base ${SECONDARY}`}>
        {h.navDelivery}
      </Link>
      <Link href="/contact" onClick={onNavigate} className={`text-base ${SECONDARY}`}>
        {h.navContact}
      </Link>
      <Link href="/mentions-legales" onClick={onNavigate} className={`text-sm ${SECONDARY}`}>
        {h.navLegal}
      </Link>
    </nav>
  );
}
