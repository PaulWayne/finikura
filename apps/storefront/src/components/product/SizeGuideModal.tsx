"use client";

import { useEffect, useState } from "react";
import {
  Ruler,
  X,
  Lightbulb,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import type { SizeGuide, SizeGuideRow } from "@/lib/content/types";
import { whatsappLink } from "@/lib/whatsapp";
import { messages } from "@/messages/fr";
import { SizeTable } from "./SizeTable";
import { HeightAdvisor } from "./HeightAdvisor";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeGuide?: SizeGuide | null;
  activeSizeTitle?: string;
  productTitle?: string;
  whatsappUrl?: string | null;
  productUrl?: string;
  /** Selects the size suggested from the child's height (FK-36). */
  onChooseSize?: (row: SizeGuideRow) => void;
  isSizeAvailable?: (row: SizeGuideRow) => boolean;
  /** Reference child of the worn photos (FK-33), e.g. « Awa, 7 ans, 1,22 m, porte le 7-8 ans ». */
  modelReference?: string | null;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  sizeGuide,
  activeSizeTitle,
  productTitle,
  whatsappUrl,
  productUrl,
  onChooseSize,
  isSizeAvailable,
  modelReference,
}: SizeGuideModalProps) {
  const [suggestedAge, setSuggestedAge] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = messages.sizeGuidePage;
  // Measurements come from the Strapi size guide of the product category.
  const rows = sizeGuide?.rows ?? [];

  const targetWhatsappLink = whatsappLink(whatsappUrl, messages.whatsapp.sizeQuestion(productTitle ?? "", activeSizeTitle, productUrl));

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-text/40 backdrop-blur-[3px] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div
        className="w-full sm:max-w-[640px] bg-brand-bg rounded-t-[1.75rem] sm:rounded-2xl shadow-2xl flex flex-col max-h-[75dvh] sm:max-h-[85dvh] overflow-hidden border border-brand-surface/80 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full pt-3 pb-1 flex flex-col items-center justify-center cursor-grab">
          <div className="w-11 h-1.5 rounded-full bg-brand-surface/80" />
        </div>

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-3 sm:pt-6 pb-3 flex items-center justify-between border-b border-brand-surface/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-text">
              <span className="hidden sm:inline">{t.modalSubtitle}</span>
              <span className="sm:hidden">{t.modalSubtitleMobile}</span>
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-text font-normal tracking-wide">
              {t.modalTitle}
            </h2>
          </div>
          <button
            type="button"
            aria-label={messages.sizeGuidePage.closeAria}
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          {/* Intro Text / Notice Banner */}
          <div className="p-3 sm:p-3.5 bg-brand-bg rounded-xl flex items-start gap-2.5 border border-brand-surface/50">
            <Ruler className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
            <p className="text-xs text-brand-text leading-relaxed">
              <span className="hidden sm:inline">{t.modalIntro}</span>
              <span className="sm:hidden">{t.modalIntroMobile}</span>
            </p>
          </div>

          {modelReference && (
            <p className="text-sm text-brand-text bg-brand-white rounded-xl border border-brand-surface px-3.5 py-2.5">
              <span className="font-semibold">{messages.sizeAdvice.modelReference} : </span>
              {modelReference}
            </p>
          )}

          <HeightAdvisor
            rows={rows}
            onAdvice={(row) => setSuggestedAge(row?.age ?? null)}
            onChoose={onChooseSize}
            isAvailable={isSizeAvailable}
            whatsappHref={targetWhatsappLink}
          />

          <SizeTable rows={rows} activeSizeTitle={activeSizeTitle} suggestedAge={suggestedAge} />

          {/* Advice / Tip Box with Terracotta accent */}
          <div className="bg-brand-surface rounded-xl p-3.5 sm:p-4 flex items-start gap-3 border border-brand-surface/60">
            <div className="w-8 h-8 rounded-full bg-brand-terracotta text-brand-white flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                {t.modalTipTitle}
              </span>
              <p className="text-xs text-brand-text mt-0.5 leading-relaxed">
                {t.modalTipDesc}
              </p>
            </div>
          </div>

          {/* Actions Stack for Mobile */}
          <div className="sm:hidden space-y-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 bg-brand-primary text-brand-white rounded-xl text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 active:bg-brand-text transition-colors shadow-xs cursor-pointer"
            >
              <span>{t.modalChooseSizeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {targetWhatsappLink && (
            <a
              href={targetWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-brand-surface text-brand-text rounded-xl text-xs font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-2 active:bg-brand-surface transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-brand-whatsapp" />
              <span>{t.modalWhatsAppBtn}</span>
            </a>
            )}

          </div>
        </div>

        {/* WhatsApp Assistance Footer on Desktop */}
        <div className="hidden sm:flex bg-brand-surface px-6 py-3.5 items-center justify-between gap-3 border-t border-brand-surface/70">
          <div className="flex items-center gap-2 text-brand-text">
            <MessageCircle className="w-4 h-4 text-brand-text" />
            <span className="text-xs text-brand-text font-medium">
              {t.modalWhatsAppQuestion}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider text-brand-text hover:text-brand-text transition-colors cursor-pointer"
            >
              {messages.product.understood}
            </button>
            {targetWhatsappLink && (
            <a
              href={targetWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-white hover:bg-brand-bg text-brand-text text-xs font-medium uppercase tracking-wider transition-colors shadow-xs border border-brand-surface"
            >
              <span>{t.modalWhatsAppBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
