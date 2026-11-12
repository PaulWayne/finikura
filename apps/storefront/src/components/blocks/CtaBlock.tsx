import React from "react";
import Link from "next/link";
import { CtaBlockData } from "@/lib/content/types";

/** In Strapi, cta_link "whatsapp" means the shop's WhatsApp (number from the global settings). */
export const WHATSAPP_LINK_TOKEN = "whatsapp";

export function CtaBlock({ block, whatsappUrl }: { block: CtaBlockData; whatsappUrl?: string | null }) {
  const isWhatsapp = block.ctaLink === WHATSAPP_LINK_TOKEN;
  const href = isWhatsapp ? whatsappUrl : block.ctaLink;
  const buttonClass =
    "min-h-11 inline-flex items-center justify-center px-8 rounded-sm bg-brand-primary text-brand-white text-sm font-medium uppercase tracking-[0.04em] hover:opacity-90 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

  return (
    <section className="max-w-[720px] mx-auto px-5 text-center" data-purpose="cta-block">
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-3">{block.title}</h2>
      {block.subtitle && <p className="text-base text-brand-text mb-6">{block.subtitle}</p>}
      {href && block.ctaText &&
        (isWhatsapp || /^https?:/.test(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            {block.ctaText}
          </a>
        ) : (
          <Link href={href} className={buttonClass}>
            {block.ctaText}
          </Link>
        ))}
    </section>
  );
}
