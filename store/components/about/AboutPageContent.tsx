"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  Scissors,
  Sun,
  Activity,
  ArrowRight,
  ShieldCheck,
  Banknote,
  Palette,
  Heart,
  Ruler,
} from "lucide-react";
import { messages } from "@/src/messages/fr";

export function AboutPageContent() {
  const t = messages.aboutPage;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Breadcrumb & Opening Hero Section */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center space-x-2 text-xs text-[#5E5245]/70 mb-6 sm:mb-8"
        >
          <a href="/" className="hover:text-[#CA7154] transition-colors">
            {t.breadcrumbHome}
          </a>
          <span className="text-[#80756C]/40">/</span>
          <span className="text-[#8A7058] font-medium">{t.breadcrumbTitle}</span>
        </nav>

        {/* 2-Column Asymmetric Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Opening Image: Artisan Hands folding dress */}
          <div className="lg:col-span-7 relative">
            <div className="relative bg-[#FFF1E5] rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border border-[#EADCCC]/60">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAevXAyuHbFW3ixCT7Ss3jQiYgKsRwkOCIgRuIFAXn3bKw1Z39v4CiPfNXCjjFO66GOaH-SgIi1gh9AkvIDifivQdIajp0xJJxZJA94lilwH_o8hbiteubqlQIEnU5yOsGIK-YMfyH9a2RQZ3DGfuPEXAxzEivx_VWkC1lrAFo5Jz3TdZM954lHsZGfoWDBML5rMBQLKnl3d7suIIfJRgZWON7i-BmYhy6jgqK-Pw4"
                alt="Mains habiles de la fondatrice pliant avec délicatesse une robe d'enfant en lin artisanal à Bamako"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Atelier Ambiance Tag */}
            <div className="absolute -bottom-4 right-4 sm:right-6 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md border border-[#EADCCC] flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-[#8A7058]" />
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-[#5E5245] font-semibold">
                {t.hero.tag}
              </span>
            </div>
          </div>

          {/* Narrative & Title */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 sm:space-y-6 pt-2 lg:pt-0">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-7 h-[1.5px] bg-[#8A7058]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#8A7058]">
                {t.hero.eyebrow}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] uppercase font-normal leading-[1.15] text-[#5E5245] tracking-[0.08em]">
              <span className="hidden sm:inline whitespace-pre-line">{t.hero.title}</span>
              <span className="sm:hidden">{t.hero.titleMobile}</span>
            </h1>

            <p className="text-sm sm:text-base md:text-[17px] text-[#5E5245]/90 leading-relaxed font-light">
              <span className="hidden sm:inline">{t.hero.p1}</span>
              <span className="sm:hidden">{t.hero.pMobile}</span>
            </p>

            <p className="hidden sm:block text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
              {t.hero.p2}
            </p>

            <div className="pt-2 flex items-center gap-6 sm:gap-8 border-t border-[#EADCCC]/60">
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl text-[#705841] font-semibold">
                  {t.hero.stat1Value}
                </span>
                <span className="text-[11px] sm:text-xs text-[#80756C] mt-0.5">
                  {t.hero.stat1Label}
                </span>
              </div>
              <div className="w-px h-10 bg-[#EADCCC]" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl text-[#705841] font-semibold">
                  {t.hero.stat2Value}
                </span>
                <span className="text-[11px] sm:text-xs text-[#80756C] mt-0.5">
                  {t.hero.stat2Label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Warm Sand Banner: "Fini Kura, c'est quoi ?" */}
      <section className="w-full bg-[#EADCCC] py-14 sm:py-20 my-6 sm:my-8 border-y border-[#DED2C2]">
        <div className="max-w-[880px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center space-y-4 sm:space-y-5">
          <div className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center text-[#705841] mb-1 shadow-xs">
            <BookOpen className="w-5 h-5 stroke-[1.8]" />
          </div>

          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#705841] uppercase">
            <span className="hidden sm:inline">{t.origins.eyebrow}</span>
            <span className="sm:hidden">{t.origins.eyebrowMobile}</span>
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-[38px] uppercase font-normal text-[#5E5245] tracking-[0.08em]">
            {t.origins.title}
          </h2>

          <div className="w-14 h-0.5 bg-[#8A7058]/50 my-1" />

          <p className="text-sm sm:text-base md:text-lg text-[#5E5245] leading-relaxed text-justify sm:text-center font-normal max-w-2xl">
            <span className="hidden sm:inline">{t.origins.p1}</span>
            <span className="sm:hidden">{t.origins.pMobile1}</span>
          </p>

          <p className="text-xs sm:text-sm text-[#5E5245]/85 leading-relaxed max-w-xl">
            <span className="hidden sm:inline">{t.origins.p2}</span>
            <span className="sm:hidden">{t.origins.pMobile2}</span>
          </p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Portrait of the Founder */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FFF1E5] shadow-sm border border-[#EADCCC]/80">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWB-6WYFDVMNKMhXw4WdlLAZ7Tq2F6woRB0HUNyiH06aR6kMvlwvflI7XBejw6nXdFBDsP_PO2NQw1kdUp8JymWtcYjynIpcYZgWriWIcJms4pNWH4I3ZveEIGRguBvTJ3XoYw6HEOaNRKItm3jzHuZhYlTEwX4W7wxw_pJfKSWMWNu0DLpwig1CVXIGQRU6GYs9xW1Ggm7jnkJzap2_ksWG2NSNcF2SgE76OVvsY"
                  alt="Portrait souriant et lumineux de la fondatrice dans son atelier de couture à Bamako"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Framed Quote Card */}
              <div className="bg-white/95 backdrop-blur-xs p-5 sm:p-6 rounded-xl mt-4 border border-[#EADCCC] shadow-xs">
                <p className="font-serif text-sm sm:text-base italic text-[#705841] leading-relaxed">
                  {t.founder.quote}
                </p>
                <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#80756C] font-semibold mt-2.5">
                  {t.founder.author}
                </span>
              </div>
            </div>
          </div>

          {/* Intimate Story Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col space-y-5 sm:space-y-6">
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#8A7058] font-semibold">
                <span className="hidden sm:inline">{t.founder.eyebrow}</span>
                <span className="sm:hidden">{t.founder.eyebrowMobile}</span>
              </span>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl uppercase font-normal text-[#5E5245] tracking-[0.08em] mt-1.5 leading-tight">
                <span className="hidden sm:inline">{t.founder.title}</span>
                <span className="sm:hidden">{t.founder.titleMobile}</span>
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#5E5245]/90 leading-relaxed">
              <p>
                <span className="hidden sm:inline">{t.founder.p1}</span>
                <span className="sm:hidden">{t.founder.pMobile1}</span>
              </p>
              <p>
                <span className="hidden sm:inline">{t.founder.p2}</span>
                <span className="sm:hidden">{t.founder.pMobile2}</span>
              </p>
            </div>

            {/* Artisanal Certification Stamp */}
            <div className="pt-4 border-t border-[#EADCCC]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E5] flex items-center justify-center text-[#705841] shrink-0 border border-[#EADCCC]/60">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-[13px] font-semibold text-[#231A10]">
                    {t.founder.certifiedBadge}
                  </p>
                  <p className="text-[11px] text-[#80756C]">
                    {t.founder.certifiedSub}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl text-[#CA7154] italic font-semibold">
                  Fini Kura
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Values Grid */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#8A7058] font-semibold">
            <span className="hidden sm:inline">{t.values.eyebrow}</span>
            <span className="sm:hidden">{t.values.eyebrowMobile}</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-normal text-[#5E5245] tracking-[0.08em]">
            {t.values.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Valeur 1: Élégance sobre */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#EADCCC]/70 shadow-[0_4px_20px_rgba(94,82,69,0.03)] hover:border-[#8A7058]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF1E5] flex items-center justify-center mb-5 text-[#705841] group-hover:bg-[#FDEBDA] transition-colors">
                <Scissors className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl uppercase font-normal text-[#5E5245] tracking-[0.06em] mb-2">
                {t.values.v1Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
                {t.values.v1Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADCCC]/50 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#8A7058]">
              {t.values.v1Tag}
            </div>
          </div>

          {/* Valeur 2: Confort pour bouger */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#EADCCC]/70 shadow-[0_4px_20px_rgba(94,82,69,0.03)] hover:border-[#8A7058]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF1E5] flex items-center justify-center mb-5 text-[#705841] group-hover:bg-[#FDEBDA] transition-colors">
                <Activity className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl uppercase font-normal text-[#5E5245] tracking-[0.06em] mb-2">
                {t.values.v2Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
                {t.values.v2Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADCCC]/50 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#8A7058]">
              {t.values.v2Tag}
            </div>
          </div>

          {/* Valeur 3: Fait pour Bamako */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#EADCCC]/70 shadow-[0_4px_20px_rgba(94,82,69,0.03)] hover:border-[#8A7058]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF1E5] flex items-center justify-center mb-5 text-[#705841] group-hover:bg-[#FDEBDA] transition-colors">
                <Sun className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl uppercase font-normal text-[#5E5245] tracking-[0.06em] mb-2">
                {t.values.v3Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
                {t.values.v3Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADCCC]/50 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#8A7058]">
              {t.values.v3Tag}
            </div>
          </div>
        </div>
      </section>

      {/* Season Closure Card */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 mb-8">
        <div className="bg-[#FDEBDA] rounded-3xl p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center space-y-5 sm:space-y-6 relative overflow-hidden border border-[#EADCCC]/80 shadow-xs">
          {/* Subtle Watermark Aura */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#8A7058]/10 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#CA7154]/10 pointer-events-none" />

          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8A7058]">
            {t.cta.eyebrow}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-[38px] uppercase font-normal max-w-2xl text-[#5E5245] tracking-[0.08em] leading-tight">
            <span className="hidden sm:inline">{t.cta.title}</span>
            <span className="sm:hidden">{t.cta.titleMobile}</span>
          </h2>

          <p className="text-xs sm:text-base text-[#5E5245]/85 max-w-lg leading-relaxed font-light">
            <span className="hidden sm:inline">{t.cta.desc}</span>
            <span className="sm:hidden">{t.cta.descMobile}</span>
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <a
              href="/categorie/filles"
              className="w-full sm:w-auto min-h-[44px] h-12 px-7 rounded-xl text-white bg-[#8A7058] hover:bg-[#725A43] active:scale-[0.99] text-xs uppercase font-medium tracking-[0.15em] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.cta.discoverBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/guide-des-tailles"
              className="w-full sm:w-auto min-h-[44px] h-12 px-6 rounded-xl text-xs uppercase font-medium tracking-[0.15em] border border-[#8A7058] text-[#5E5245] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ruler className="w-4 h-4 stroke-[1.8]" />
              <span>{t.cta.sizeGuideBtn}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[#5E5245]/80 text-xs font-medium">
            <Banknote className="w-4 h-4 text-[#92452C]" />
            <span>{t.cta.codNote}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
