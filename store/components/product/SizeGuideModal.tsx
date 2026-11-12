"use client";

import React, { useEffect, useState } from "react";
import {
  Ruler,
  X,
  Lightbulb,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { SizeGuide } from "@/src/lib/content/types";
import { messages } from "@/src/messages/fr";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeGuide?: SizeGuide | null;
  activeSizeTitle?: string;
  whatsappUrl?: string;
  initialGender?: "filles" | "garcons";
}

interface ModalSizeRow {
  age: string;
  stature: string;
  chest: string;
  waist: string;
}

const MODAL_GIRLS: ModalSizeRow[] = [
  { age: "3-4 ans", stature: "98-104 cm", chest: "54-56 cm", waist: "51-53 cm" },
  { age: "5-6 ans", stature: "110-116 cm", chest: "58-60 cm", waist: "53-55 cm" },
  { age: "7-8 ans", stature: "122-128 cm", chest: "62-65 cm", waist: "56-58 cm" },
  { age: "9-10 ans", stature: "134-140 cm", chest: "67-71 cm", waist: "59-62 cm" },
  { age: "11-12 ans", stature: "146-152 cm", chest: "73-77 cm", waist: "63-66 cm" },
  { age: "13-14 ans", stature: "158-164 cm", chest: "79-84 cm", waist: "67-70 cm" },
];

const MODAL_BOYS: ModalSizeRow[] = [
  { age: "3-4 ans", stature: "98-104 cm", chest: "55-57 cm", waist: "52-54 cm" },
  { age: "5-6 ans", stature: "110-116 cm", chest: "59-62 cm", waist: "54-56 cm" },
  { age: "7-8 ans", stature: "122-128 cm", chest: "63-66 cm", waist: "57-59 cm" },
  { age: "9-10 ans", stature: "134-140 cm", chest: "68-72 cm", waist: "60-63 cm" },
  { age: "11-12 ans", stature: "146-152 cm", chest: "74-78 cm", waist: "64-67 cm" },
  { age: "13-14 ans", stature: "158-164 cm", chest: "80-86 cm", waist: "68-72 cm" },
];

export function SizeGuideModal({
  isOpen,
  onClose,
  activeSizeTitle,
  whatsappUrl = "https://wa.me/22370000000",
  initialGender = "filles",
}: SizeGuideModalProps) {
  const [currentGender, setCurrentGender] = useState<"filles" | "garcons">(initialGender);

  useEffect(() => {
    if (initialGender) {
      setCurrentGender(initialGender);
    }
  }, [initialGender]);

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
  const rows = currentGender === "filles" ? MODAL_GIRLS : MODAL_BOYS;

  const whatsappMessage = encodeURIComponent(
    "Bonjour Fini Kura, j'ai besoin d'aide pour choisir la bonne taille pour mon enfant."
  );
  const targetWhatsappLink = whatsappUrl.includes("?")
    ? `${whatsappUrl}&text=${whatsappMessage}`
    : `${whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#392F23]/40 backdrop-blur-[3px] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div
        className="w-full sm:max-w-[640px] bg-[#FFF8F4] rounded-t-[1.75rem] sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden border border-[#EADCCC]/80 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full pt-3 pb-1 flex flex-col items-center justify-center cursor-grab">
          <div className="w-11 h-1.5 rounded-full bg-[#D2C4BA]/80" />
        </div>

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-3 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#EADCCC]/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#705841]">
              <span className="hidden sm:inline">{t.modalSubtitle}</span>
              <span className="sm:hidden">{t.modalSubtitleMobile}</span>
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#231A10] font-normal tracking-wide">
              {t.modalTitle}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fermer le guide des tailles"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#5E5245] hover:bg-[#FDEBDA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          {/* Intro Text / Notice Banner */}
          <div className="p-3 sm:p-3.5 bg-[#FFF1E5] rounded-xl flex items-start gap-2.5 border border-[#EADCCC]/50">
            <Ruler className="w-4 h-4 text-[#705841] shrink-0 mt-0.5" />
            <p className="text-xs text-[#5E5245] leading-relaxed">
              <span className="hidden sm:inline">{t.modalIntro}</span>
              <span className="sm:hidden">{t.modalIntroMobile}</span>
            </p>
          </div>

          {/* Gender Segmented Switcher */}
          <div className="flex justify-start">
            <div
              className="inline-flex p-1 bg-[#FDEBDA] rounded-xl gap-1 w-full sm:w-auto"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={currentGender === "filles"}
                onClick={() => setCurrentGender("filles")}
                className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2 rounded-lg text-xs font-medium uppercase tracking-[0.12em] transition-all cursor-pointer ${
                  currentGender === "filles"
                    ? "bg-[#8A7058] text-white shadow-xs font-semibold"
                    : "text-[#5E5245] hover:text-[#231A10]"
                }`}
              >
                <span className="hidden sm:inline">{t.modalTabGirls}</span>
                <span className="sm:hidden">Filles</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={currentGender === "garcons"}
                onClick={() => setCurrentGender("garcons")}
                className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2 rounded-lg text-xs font-medium uppercase tracking-[0.12em] transition-all cursor-pointer ${
                  currentGender === "garcons"
                    ? "bg-[#8A7058] text-white shadow-xs font-semibold"
                    : "text-[#5E5245] hover:text-[#231A10]"
                }`}
              >
                {t.modalTabBoys}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl bg-white border border-[#EADCCC]/70 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FDEBDA] text-[#4E453D] uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-2.5 px-3.5 sm:px-4">{t.colAge}</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center">{t.colStature}</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center">{t.colChest}</th>
                  <th className="py-2.5 px-3.5 sm:px-4 text-right sm:text-center">{t.colWaist}</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-xs sm:text-sm">
                {rows.map((row, index) => {
                  const isHighlighted =
                    activeSizeTitle &&
                    (row.age.includes(activeSizeTitle) ||
                      activeSizeTitle.includes(row.age.replace(" ans", "")));
                  const isEven = index % 2 === 0;

                  return (
                    <tr
                      key={row.age}
                      className={`transition-colors ${
                        isHighlighted
                          ? "bg-[#FEDDC0]/50 font-semibold text-[#8A7058]"
                          : isEven
                          ? "bg-white"
                          : "bg-[#FFF1E5]/60"
                      } hover:bg-[#F7E5D4]/40`}
                    >
                      <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 font-medium text-[#231A10]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              currentGender === "filles" ? "bg-[#B15D42]" : "bg-[#5A6151]"
                            }`}
                          />
                          <span>{row.age}</span>
                        </div>
                      </td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center text-[#5E5245]">
                        {row.stature}
                      </td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center text-[#5E5245]">
                        {row.chest}
                      </td>
                      <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-right sm:text-center text-[#5E5245]">
                        {row.waist}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Advice / Tip Box with Terracotta accent */}
          <div className="bg-[#F7E5D4] rounded-xl p-3.5 sm:p-4 flex items-start gap-3 border border-[#EADCCC]/60">
            <div className="w-8 h-8 rounded-full bg-[#B15D42] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#92452C] uppercase tracking-wide">
                {t.modalTipTitle}
              </span>
              <p className="text-xs text-[#5E5245] mt-0.5 leading-relaxed">
                {t.modalTipDesc}
              </p>
            </div>
          </div>

          {/* Actions Stack for Mobile */}
          <div className="sm:hidden space-y-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 bg-[#8A7058] text-white rounded-xl text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 active:bg-[#705841] transition-colors shadow-xs cursor-pointer"
            >
              <span>{t.modalChooseSizeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={targetWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-[#FDEBDA] text-[#705841] rounded-xl text-xs font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-2 active:bg-[#EADCCC] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{t.modalWhatsAppBtn}</span>
            </a>

            <p className="text-[11px] text-center text-[#80756C] pt-0.5">
              {t.modalReassuranceExchange}
            </p>
          </div>
        </div>

        {/* WhatsApp Assistance Footer on Desktop */}
        <div className="hidden sm:flex bg-[#FDEBDA] px-6 py-3.5 items-center justify-between gap-3 border-t border-[#EADCCC]/70">
          <div className="flex items-center gap-2 text-[#231A10]">
            <MessageCircle className="w-4 h-4 text-[#5A6151]" />
            <span className="text-xs text-[#5E5245] font-medium">
              {t.modalWhatsAppQuestion}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider text-[#5E5245] hover:text-[#231A10] transition-colors cursor-pointer"
            >
              {messages.product.understood}
            </button>
            <a
              href={targetWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#FFF8F4] text-[#705841] text-xs font-medium uppercase tracking-wider transition-colors shadow-xs border border-[#EADCCC]"
            >
              <span>{t.modalWhatsAppBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
