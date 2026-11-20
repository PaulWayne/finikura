import React from "react";
import Link from "next/link";
import { messages } from "@/messages/fr";
import { FooterLink, SocialLink } from "@/lib/content/types";
import { Logo } from "@/components/layout/Logo";

interface FooterProps {
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
}

export function Footer({
  footerLinks = [],
  socialLinks = [],
}: FooterProps) {
  return (
    <footer className="bg-brand-surface text-brand-text border-t border-brand-surface mt-16 md:mt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Logo Footer */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
            <Logo variant="full" className="h-28 md:h-32" />
          </Link>
        </div>

        {/* Links in warm taupe brown */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 mb-6 text-xs tracking-[0.15em] uppercase font-medium">
          {footerLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="inline-flex min-h-11 items-center text-brand-text hover:underline underline-offset-4 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social Icons in warm taupe brown */}
        <div className="flex items-center space-x-4 mb-6">
          {socialLinks.map((social) => {
            if (social.platform === "whatsapp") {
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-sm bg-brand-bg flex items-center justify-center text-brand-text hover:text-brand-primary border border-brand-text/20 transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </a>
              );
            }
            if (social.platform === "facebook") {
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-sm bg-brand-bg flex items-center justify-center text-brand-text hover:text-brand-primary border border-brand-text/20 transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                  </svg>
                </a>
              );
            }
            return (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-11 h-11 rounded-sm bg-brand-bg flex items-center justify-center text-brand-text hover:text-brand-primary border border-brand-text/20 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.01 2.22-.84 4.38-2.39 5.92-1.89 1.88-4.59 2.79-7.25 2.4-2.67-.39-5-2.02-6.19-4.42-1.19-2.4-1.04-5.32.39-7.58 1.43-2.26 3.96-3.66 6.64-3.65.34 0 .68.03 1.01.08v4.06c-.34-.1-.7-.16-1.06-.16-1.28-.02-2.52.55-3.32 1.54-.8 1-.99 2.37-.5 3.58.49 1.21 1.63 2.05 2.94 2.18 1.31.13 2.62-.48 3.37-1.57.38-.55.58-1.21.58-1.88V.02z" />
                </svg>
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-xs text-brand-text">
          {messages.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
