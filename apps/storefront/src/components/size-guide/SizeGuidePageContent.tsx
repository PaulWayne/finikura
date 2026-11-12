"use client";
import Link from "next/link";

import React, { useState } from "react";
import {
  Ruler,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Truck,
  Sparkles,
  MessageCircle,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { messages } from "@/messages/fr";

interface SizeGuidePageContentProps {
  whatsappUrl?: string;
  initialCategory?: "filles" | "garcons";
}

interface SizeRowData {
  age: string;
  stature: string;
  chest: string;
  waist: string;
}

const GIRLS_SIZES: SizeRowData[] = [
  { age: "3-4 ans", stature: "98 - 104 cm", chest: "54 - 56 cm", waist: "51 - 53 cm" },
  { age: "5-6 ans", stature: "110 - 116 cm", chest: "58 - 60 cm", waist: "53 - 55 cm" },
  { age: "7-8 ans", stature: "122 - 128 cm", chest: "62 - 65 cm", waist: "56 - 58 cm" },
  { age: "9-10 ans", stature: "134 - 140 cm", chest: "67 - 71 cm", waist: "59 - 62 cm" },
  { age: "11-12 ans", stature: "146 - 152 cm", chest: "73 - 77 cm", waist: "63 - 66 cm" },
  { age: "13-14 ans", stature: "158 - 164 cm", chest: "79 - 84 cm", waist: "67 - 70 cm" },
];

const BOYS_SIZES: SizeRowData[] = [
  { age: "3-4 ans", stature: "98 - 104 cm", chest: "55 - 57 cm", waist: "52 - 54 cm" },
  { age: "5-6 ans", stature: "110 - 116 cm", chest: "59 - 62 cm", waist: "54 - 56 cm" },
  { age: "7-8 ans", stature: "122 - 128 cm", chest: "63 - 67 cm", waist: "57 - 60 cm" },
  { age: "9-10 ans", stature: "134 - 140 cm", chest: "69 - 74 cm", waist: "61 - 64 cm" },
  { age: "11-12 ans", stature: "146 - 152 cm", chest: "75 - 80 cm", waist: "65 - 68 cm" },
  { age: "13-14 ans", stature: "158 - 166 cm", chest: "81 - 87 cm", waist: "69 - 73 cm" },
];

export function SizeGuidePageContent({
  whatsappUrl = "https://wa.me/22370000000",
  initialCategory = "filles",
}: SizeGuidePageContentProps) {
  const [activeTab, setActiveTab] = useState<"filles" | "garcons">(initialCategory);

  const t = messages.sizeGuidePage;
  const currentRows = activeTab === "filles" ? GIRLS_SIZES : BOYS_SIZES;

  const whatsappMessage = encodeURIComponent(
    "Bonjour Fini Kura, j'ai besoin d'aide pour choisir la bonne taille pour mon enfant."
  );
  const targetWhatsappLink = whatsappUrl.includes("?")
    ? `${whatsappUrl}&text=${whatsappMessage}`
    : `${whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Breadcrumb & Ambient Aura */}
      <div className="w-full relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-[#FEDDC0]/30 via-[#F7E5D4]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-2 relative z-10">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-[#5E5245]/70">
            <Link href="/" className="hover:text-[#CA7154] transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span className="text-[#80756C]/40">/</span>
            <span className="text-[#8A7058] font-medium">{t.breadcrumbTitle}</span>
          </nav>
        </div>

        {/* Page Header */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-2 pb-8 sm:pb-10 relative z-10">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#B15D42] mb-2 sm:mb-3 inline-block font-semibold">
            {t.eyebrow}
          </span>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl md:text-[46px] uppercase text-[#5E5245] tracking-[0.08em] leading-tight mb-3">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#5E5245]/80 max-w-xl mx-auto font-normal leading-relaxed">
            {t.intro}
          </p>

          {/* Category Filter Tabs */}
          <div
            aria-label="Catégories vestiaires"
            className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "filles"}
              onClick={() => setActiveTab("filles")}
              className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer ${
                activeTab === "filles"
                  ? "bg-[#8A7058] text-white shadow-sm"
                  : "bg-[#EADCCC] text-[#5E5245] hover:bg-[#ded2c2]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === "filles" ? "bg-[#DEE5D1]" : "bg-[#80756C]"
                }`}
              />
              <span className="hidden sm:inline">{t.tabGirls}</span>
              <span className="sm:hidden">{t.tabGirlsShort}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "garcons"}
              onClick={() => setActiveTab("garcons")}
              className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer ${
                activeTab === "garcons"
                  ? "bg-[#8A7058] text-white shadow-sm"
                  : "bg-[#EADCCC] text-[#5E5245] hover:bg-[#ded2c2]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === "garcons" ? "bg-[#DEE5D1]" : "bg-[#80756C]"
                }`}
              />
              <span className="hidden sm:inline">{t.tabBoys}</span>
              <span className="sm:hidden">{t.tabBoysShort}</span>
            </button>
          </div>
        </header>
      </div>

      {/* Size Chart Table Section */}
      <section className="w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-[920px] mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(94,82,69,0.06)] border border-[#EADCCC]/60 overflow-hidden">
            {/* Table Header Context */}
            <div className="px-5 sm:px-6 py-3.5 bg-[#FFF1E5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADCCC]/60">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#705841]" />
                <span className="text-xs uppercase tracking-wider text-[#231A10] font-semibold">
                  {activeTab === "filles" ? t.standardScaleGirls : t.standardScaleBoys}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#80756C]">
                {t.unitNote}
              </span>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF8F4] border-b border-[#EADCCC]/60">
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#231A10] font-semibold">
                      {t.colAge}
                    </th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#231A10] font-semibold text-center">
                      <span className="hidden sm:inline">{t.colHeight}</span>
                      <span className="sm:hidden">{t.colStature}</span>
                    </th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#231A10] font-semibold text-center">
                      {t.colChest}
                    </th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#231A10] font-semibold text-center sm:text-center">
                      {t.colWaist}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-sm">
                  {currentRows.map((row, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <tr
                        key={row.age}
                        className={`${
                          isEven ? "bg-[#FFF8F4]/70" : "bg-[#FDEBDA]/40"
                        } hover:bg-[#F7E5D4]/50 transition-colors`}
                      >
                        <td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-[#5E5245]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                activeTab === "filles" ? "bg-[#B15D42]" : "bg-[#5A6151]"
                              }`}
                            />
                            <span>{row.age}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-[#5E5245]">
                          {row.stature}
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-[#5E5245]">
                          {row.chest}
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-[#5E5245]">
                          {row.waist}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Micro-Footer */}
            <div className="p-4 bg-[#FFF1E5]/80 border-t border-[#EADCCC]/50 flex items-center justify-between flex-wrap gap-2 text-xs text-[#5E5245]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5A6151] shrink-0" />
                <span>{t.microFooterCut}</span>
              </div>
              <span className="text-[#80756C] text-[11px]">{t.microFooterFabrics}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Visual Trio (Desktop) & Highlight Banner (Mobile) */}
      <section className="max-w-[920px] mx-auto px-4 sm:px-6 md:px-8 my-8 sm:my-10 w-full">
        {/* Desktop 3-photo grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs group">
            <img
              src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80"
              alt={t.galleryCaption1}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium">{t.galleryCaption1}</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs group">
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80"
              alt={t.galleryCaption2}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium">{t.galleryCaption2}</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs group">
            <img
              src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"
              alt={t.galleryCaption3}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium">{t.galleryCaption3}</span>
            </div>
          </div>
        </div>

        {/* Mobile single banner */}
        <div className="md:hidden w-full relative rounded-2xl overflow-hidden bg-[#FDEBDA] border border-[#EADCCC]/60 shadow-xs">
          <div className="w-full h-44 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
              alt={t.ampleCutTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-[#FDEBDA] flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-[#5A6151] font-semibold">
              Confection Adaptée
            </span>
            <h2 className="font-serif text-lg uppercase text-[#5E5245] tracking-[0.06em]">
              {t.ampleCutTitle}
            </h2>
            <p className="text-xs text-[#5E5245]/80 leading-relaxed">
              {t.ampleCutDesc}
            </p>
          </div>
        </div>
      </section>

      {/* "Comment bien mesurer votre enfant ?" Section */}
      <section className="w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-[920px] mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_8px_30px_rgba(94,82,69,0.05)] border border-[#EADCCC]/60">
          <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#5A6151] font-semibold">
              {t.howToMeasureEyebrow}
            </span>
            <h2 className="font-serif font-normal text-2xl sm:text-[28px] uppercase text-[#5E5245] tracking-[0.08em] mt-1 leading-tight">
              {t.howToMeasureTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-2">
              {t.howToMeasureIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Stylized Child Anatomy SVG Infographic */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FFF1E5] rounded-2xl relative overflow-hidden border border-[#EADCCC]/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#80756C] mb-2">
                Repères anatomiques
              </span>
              <svg
                aria-label="Schéma de mesure enfant Fini Kura"
                className="w-full max-w-[220px] h-[320px] sm:h-[340px]"
                fill="none"
                viewBox="0 0 240 380"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Glow base */}
                <ellipse cx="120" cy="355" fill="#dee5d1" fillOpacity="0.6" rx="55" ry="10" />

                {/* Head */}
                <circle cx="120" cy="52" r="26" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.5" />
                <path d="M102 46C105 34 125 30 138 42" stroke="#8a7058" strokeLinecap="round" strokeWidth="2" />

                {/* Neck & Shoulders */}
                <path d="M114 78V92C114 94 100 102 92 106L72 150" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.2" />
                <path d="M126 78V92C126 94 140 102 148 106L168 150" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.2" />

                {/* Torso & Inseam */}
                <path d="M96 108C94 135 96 175 96 215L88 340" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.2" />
                <path d="M144 108C146 135 144 175 144 215L152 340" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.2" />
                <path d="M110 340L118 225L122 225L130 340" stroke="#8a7058" strokeLinecap="round" strokeWidth="2.2" />

                {/* 1: Stature / Hauteur totale */}
                <line stroke="#92452c" strokeDasharray="4 3" strokeWidth="1.5" x1="42" x2="42" y1="26" y2="352" />
                <path d="M38 30L42 26L46 30" stroke="#92452c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <path d="M38 348L42 352L46 348" stroke="#92452c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <text fill="#92452c" fontFamily="sans-serif" fontSize="10" fontWeight="600" textAnchor="middle" transform="rotate(-90 32 195)" x="32" y="195">
                  1. HAUTEUR TOTALE
                </text>

                {/* 2: Tour de Poitrine */}
                <ellipse cx="120" cy="138" rx="38" ry="8" stroke="#705841" strokeDasharray="3 3" strokeWidth="1.8" />
                <circle cx="158" cy="138" fill="#705841" r="3.5" />
                <line stroke="#705841" strokeWidth="1.2" x1="162" x2="204" y1="138" y2="138" />
                <circle cx="204" cy="138" fill="#705841" r="2" />
                <text fill="#705841" fontFamily="sans-serif" fontSize="10" fontWeight="600" x="208" y="141">
                  2. Poitrine
                </text>

                {/* 3: Tour de Taille */}
                <ellipse cx="120" cy="180" rx="33" ry="7" stroke="#b15d42" strokeDasharray="3 3" strokeWidth="1.8" />
                <circle cx="153" cy="180" fill="#b15d42" r="3.5" />
                <line stroke="#b15d42" strokeWidth="1.2" x1="157" x2="204" y1="180" y2="180" />
                <circle cx="204" cy="180" fill="#b15d42" r="2" />
                <text fill="#b15d42" fontFamily="sans-serif" fontSize="10" fontWeight="600" x="208" y="183">
                  3. Taille
                </text>

                <text fill="#92452c" fontFamily="sans-serif" fontSize="9" fontWeight="600" x="54" y="28">
                  Sommet tête
                </text>
                <text fill="#92452c" fontFamily="sans-serif" fontSize="9" fontWeight="600" x="54" y="356">
                  Pieds nus au sol
                </text>
              </svg>
              <p className="text-[11px] text-center text-[#5E5245]/70 mt-2 max-w-[220px]">
                Position stable, bras relâchés le long du corps.
              </p>
            </div>

            {/* 3 Distinct Measurement Steps */}
            <div className="md:col-span-7 flex flex-col justify-center gap-5 sm:gap-6 pl-0 md:pl-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FDEBDA] flex items-center justify-center shrink-0 text-[#92452C] font-semibold text-sm shadow-xs group-hover:bg-[#FFDBD0] transition-colors">
                  1
                </div>
                <div className="flex flex-col">
                  <h3 className="font-serif text-base sm:text-lg text-[#231A10] font-medium tracking-tight">
                    {t.step1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-1 leading-relaxed">
                    {t.step1Desc}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FDEBDA] flex items-center justify-center shrink-0 text-[#705841] font-semibold text-sm shadow-xs group-hover:bg-[#FEDDC0] transition-colors">
                  2
                </div>
                <div className="flex flex-col">
                  <h3 className="font-serif text-base sm:text-lg text-[#231A10] font-medium tracking-tight">
                    {t.step2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-1 leading-relaxed">
                    {t.step2Desc}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FDEBDA] flex items-center justify-center shrink-0 text-[#B15D42] font-semibold text-sm shadow-xs group-hover:bg-[#FFDBD0] transition-colors">
                  3
                </div>
                <div className="flex flex-col">
                  <h3 className="font-serif text-base sm:text-lg text-[#231A10] font-medium tracking-tight">
                    {t.step3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-1 leading-relaxed">
                    {t.step3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Card: Between Two Sizes */}
      <section className="w-full px-4 sm:px-6 md:px-8 mt-8 sm:mt-10">
        <div className="max-w-[920px] mx-auto bg-[#FDEBDA] rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(94,82,69,0.04)] relative overflow-hidden flex flex-col sm:flex-row items-center gap-5 border border-[#EADCCC]/60">
          {/* Vertical Terracotta Accent Band */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#B15D42]" />

          {/* Icon Disc */}
          <div className="w-12 h-12 rounded-xl bg-[#FFDBD0] flex items-center justify-center shrink-0 text-[#92452C]">
            <Lightbulb className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left pl-2 sm:pl-0">
            <span className="text-[11px] uppercase tracking-wider text-[#B15D42] font-semibold block">
              {t.betweenSizesEyebrow}
            </span>
            <h4 className="font-serif text-lg sm:text-[22px] uppercase text-[#5E5245] tracking-[0.06em] mt-0.5">
              {t.betweenSizesTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-1 leading-relaxed">
              {t.betweenSizesDesc}
            </p>
          </div>

          {/* Interactive Metric Tag */}
          <div className="shrink-0 bg-white/80 px-4 py-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-xs border border-[#EADCCC]/40">
            <span className="text-[10px] uppercase text-[#80756C] font-semibold tracking-wider">
              {t.fabricEaseTag}
            </span>
            <span className="font-serif text-lg sm:text-xl text-[#B15D42] font-bold">
              {t.fabricEaseMetric}
            </span>
          </div>
        </div>
      </section>

      {/* Reassurance Grid (3 items) */}
      <section className="max-w-[920px] mx-auto px-4 sm:px-6 md:px-8 my-8 sm:my-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="bg-[#FFF1E5] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 border border-[#EADCCC]/50">
            <div className="w-9 h-9 rounded-lg bg-[#FDEBDA] flex items-center justify-center text-[#5A6151] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-semibold text-[#231A10] tracking-wide">
                {t.reassuranceExchangeTitle}
              </div>
              <p className="text-[11px] text-[#5E5245]/80 leading-tight mt-0.5">
                {t.reassuranceExchangeDesc}
              </p>
            </div>
          </div>

          <div className="bg-[#FFF1E5] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 border border-[#EADCCC]/50">
            <div className="w-9 h-9 rounded-lg bg-[#FDEBDA] flex items-center justify-center text-[#5A6151] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-semibold text-[#231A10] tracking-wide">
                {t.reassuranceCodTitle}
              </div>
              <p className="text-[11px] text-[#5E5245]/80 leading-tight mt-0.5">
                {t.reassuranceCodDesc}
              </p>
            </div>
          </div>

          <div className="bg-[#FFF1E5] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 border border-[#EADCCC]/50">
            <div className="w-9 h-9 rounded-lg bg-[#FDEBDA] flex items-center justify-center text-[#5A6151] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-semibold text-[#231A10] tracking-wide">
                {t.reassuranceWaistTitle}
              </div>
              <p className="text-[11px] text-[#5E5245]/80 leading-tight mt-0.5">
                {t.reassuranceWaistDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Help Line Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <div className="max-w-[920px] mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-[0_6px_25px_rgba(94,82,69,0.04)] border border-[#EADCCC]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-[#DEE5D1] flex items-center justify-center text-[#5A6151] shrink-0 hidden sm:flex">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg uppercase text-[#5E5245] tracking-[0.06em]">
                {t.assistanceTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-0.5">
                {t.assistanceDesc}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={targetWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium inline-flex items-center justify-center gap-2.5 text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-xs tracking-[0.15em] uppercase shadow-sm transition"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.26-1.74 1.34-.49.07-1.12.1-3.26-.78-2.57-1.06-4.22-3.66-4.35-3.83-.13-.17-1.04-1.38-1.04-2.64 0-1.25.66-1.87.89-2.12.24-.25.52-.31.69-.31.18 0 .35 0 .5.01.16.01.38-.06.59.45.22.53.75 1.83.82 1.96.07.14.11.3.02.48-.09.17-.14.28-.27.44-.14.16-.29.35-.41.47-.14.14-.28.29-.12.57.16.27.7 1.15 1.5 1.87 1.03.92 1.9 1.21 2.17 1.34.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.25.09 1.56.74 1.83.87.27.14.45.2.52.31.06.13.06.74-.18 1.42z" />
              </svg>
              <span>{t.whatsAppButton}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
