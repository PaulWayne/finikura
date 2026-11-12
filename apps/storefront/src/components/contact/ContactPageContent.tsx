"use client";
import Link from "next/link";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Truck,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Ruler,
  Banknote,
  Send,
  Navigation,
} from "lucide-react";
import { ContactForm } from "./ContactForm";
import { messages } from "@/messages/fr";

interface ContactPageContentProps {
  whatsappUrl?: string;
}

export function ContactPageContent({
  whatsappUrl = "https://wa.me/22376458912",
}: ContactPageContentProps) {
  const [activeFaqFilter, setActiveFaqFilter] = useState<string>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("delivery-1");

  const t = messages.contactPage;

  const filteredFaqs =
    activeFaqFilter === "all"
      ? t.faq.items
      : t.faq.items.filter((item) => item.category === activeFaqFilter);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Breadcrumb & Header Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-10 sm:pb-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center space-x-2 text-xs text-[#5E5245]/70 mb-5 sm:mb-6"
        >
          <Link href="/" className="hover:text-[#CA7154] transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span className="text-[#80756C]/40">/</span>
          <span className="text-[#8A7058] font-medium">{t.breadcrumbTitle}</span>
        </nav>

        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#5A6151] font-semibold block">
            {t.eyebrow}
          </span>
          <h1 className="font-serif font-normal text-2xl sm:text-3xl md:text-[42px] uppercase text-[#5E5245] tracking-[0.08em] leading-tight">
            <span className="hidden sm:inline">{t.title}</span>
            <span className="sm:hidden">{t.titleMobile}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#5E5245]/80 max-w-2xl mx-auto font-normal leading-relaxed pt-1">
            <span className="hidden sm:inline">{t.subtitle}</span>
            <span className="sm:hidden">{t.subtitleMobile}</span>
          </p>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Channels & Atelier (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Priority WhatsApp Card */}
            <div className="bg-[#FDEBDA] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#EADCCC]/60 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5A6151]">
                  <span className="hidden sm:inline">{t.whatsappCard.tag}</span>
                  <span className="sm:hidden">{t.whatsappCard.tagMobile}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#25D366]/20 text-[#1E8A45]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span>{t.whatsappCard.liveBadge}</span>
                </span>
              </div>

              <h2 className="font-serif text-lg sm:text-xl uppercase font-normal text-[#5E5245] tracking-[0.08em] mt-3 mb-2">
                <span className="hidden sm:inline">{t.whatsappCard.title}</span>
                <span className="sm:hidden">{t.whatsappCard.titleMobile}</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed mb-6">
                <span className="hidden sm:inline">{t.whatsappCard.desc}</span>
                <span className="sm:hidden">{t.whatsappCard.descMobile}</span>
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] h-12 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm uppercase text-xs font-medium tracking-[0.15em] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.51 2 2.015 6.48 2.015 11.984c0 1.905.534 3.738 1.545 5.337L2 22l4.829-1.53c1.533.91 3.29 1.514 5.202 1.514 5.521 0 10.016-4.48 10.016-9.984C22.047 6.48 17.552 2 12.031 2zm0 18.234c-1.637 0-3.178-.47-4.52-1.325l-.324-.202-3.15.998.986-3.045-.213-.342c-.93-1.465-1.425-3.155-1.425-4.836 0-4.538 3.693-8.23 8.246-8.23 4.553 0 8.246 3.692 8.246 8.23 0 4.538-3.693 8.23-8.246 8.23zm4.512-6.173c-.247-.123-1.463-.722-1.69-.804-.227-.082-.392-.123-.557.123-.165.247-.64 0.804-.784.968-.144.165-.288.185-.535.062-.247-.123-1.043-.385-1.987-1.226-.735-.655-1.231-1.464-1.375-1.71-.144-.247-.015-.38.109-.502.111-.11.247-.288.371-.432.124-.144.165-.247.247-.411.082-.165.041-.309-.02-.432-.062-.124-.557-1.341-.763-1.836-.2-.483-.404-.418-.557-.426l-.474-.008c-.165 0-.432.062-.658.309-.227.247-.866.846-.866 2.062 0 1.216.886 2.392 1.01 2.557.124.165 1.745 2.664 4.228 3.737.591.256 1.053.409 1.413.523.593.189 1.134.162 1.56.099.476-.071 1.463-.598 1.669-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.288z" />
                </svg>
                <span>
                  <span className="hidden sm:inline">{t.whatsappCard.cta}</span>
                  <span className="sm:hidden">{t.whatsappCard.ctaMobile}</span>
                </span>
              </a>
            </div>

            {/* Atelier Bamako Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(94,82,69,0.04)] border border-[#EADCCC]/70 space-y-5">
              <div className="border-b border-[#EADCCC]/60 pb-3.5">
                <h3 className="font-serif text-lg sm:text-xl uppercase font-normal text-[#5E5245] tracking-[0.08em]">
                  {t.atelierCard.title}
                </h3>
                <p className="text-xs text-[#80756C] mt-0.5">{t.atelierCard.subtitle}</p>
              </div>

              <div className="space-y-4">
                {/* Emplacement */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E5] flex items-center justify-center text-[#705841] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#231A10] block">
                      {t.atelierCard.locationTitle}
                    </span>
                    <p className="text-xs text-[#5E5245]/80">{t.atelierCard.locationCountry}</p>
                    <p className="text-[11px] text-[#5A6151] flex items-center gap-1 mt-0.5 font-medium">
                      <Navigation className="w-3 h-3 text-[#5A6151]" />
                      <span>{t.atelierCard.landmark}</span>
                    </p>
                  </div>
                </div>

                {/* Téléphone direct */}
                <div className="flex items-start justify-between gap-3 pt-1 border-t border-[#EADCCC]/30">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF1E5] flex items-center justify-center text-[#705841] shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#231A10] block">
                        {t.atelierCard.phoneTitle}
                      </span>
                      <p className="text-xs text-[#5E5245] font-medium mt-0.5">
                        {t.atelierCard.phone1}
                      </p>
                      <p className="text-xs text-[#5E5245]/70 font-medium">
                        {t.atelierCard.phone2}
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:+22376458912"
                    className="sm:hidden px-3.5 py-1.5 rounded-lg bg-[#8A7058] text-white text-[11px] font-medium uppercase tracking-wider shrink-0"
                  >
                    {t.atelierCard.callCta}
                  </a>
                </div>

                {/* Horaires */}
                <div className="flex items-start gap-3.5 pt-1 border-t border-[#EADCCC]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E5] flex items-center justify-center text-[#705841] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#231A10] block">
                      {t.atelierCard.hoursTitle}
                    </span>
                    <p className="text-xs text-[#5E5245]/80">{t.atelierCard.hoursDesc}</p>
                    <p className="text-[11px] text-[#80756C]">{t.atelierCard.hoursClosed}</p>
                  </div>
                </div>

                {/* Service coursier */}
                <div className="flex items-start gap-3.5 pt-1 border-t border-[#EADCCC]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E5] flex items-center justify-center text-[#705841] shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#231A10] block">
                      {t.atelierCard.courierTitle}
                    </span>
                    <p className="text-xs text-[#5E5245]/80">{t.atelierCard.courierDesc}</p>
                  </div>
                </div>
              </div>

              {/* Mini encadré réassurance */}
              <div className="bg-[#FFF1E5] rounded-xl p-3.5 flex items-center gap-3 border border-[#EADCCC]/50">
                <Banknote className="w-5 h-5 text-[#92452C] shrink-0" />
                <p className="text-xs text-[#231A10] leading-snug">
                  Paiement en <span className="font-semibold text-[#705841]">espèces</span> ou{" "}
                  <span className="font-semibold text-[#705841]">Orange Money</span> à la livraison
                  en main propre.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Thematic FAQ Section */}
      <section className="w-full bg-[#FFF1E5] py-14 sm:py-20 border-y border-[#EADCCC]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FAQ Header */}
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 space-y-2.5">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#5A6151] font-semibold">
              {t.faq.eyebrow}
            </span>
            <h2 className="font-serif font-normal text-2xl sm:text-3xl uppercase text-[#5E5245] tracking-[0.08em]">
              {t.faq.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
              {t.faq.desc}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
            {Object.entries(t.faq.filters).map(([catKey, label]) => {
              const isActive = activeFaqFilter === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setActiveFaqFilter(catKey)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium tracking-[0.12em] uppercase transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#705841] text-white shadow-xs"
                      : "bg-white text-[#5E5245] hover:bg-[#FDEBDA] border border-[#EADCCC]/60"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-xs border border-[#EADCCC]/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-sm sm:text-base text-[#231A10] font-medium">
                      <span className="hidden sm:inline">{faq.question}</span>
                      <span className="sm:hidden">{faq.questionMobile}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#705841] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#5E5245]/90 border-t border-[#EADCCC]/40 pt-3.5 leading-relaxed animate-fade-in">
                      <span className="hidden sm:inline">{faq.answer}</span>
                      <span className="sm:hidden">{faq.answerMobile}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Serenity Trust Badge */}
          <div className="mt-8 bg-[#DEE5D1] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 border border-[#C2C9B6]/60">
            <div className="w-10 h-10 rounded-full bg-white text-[#5A6151] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[#171D11] block">
                {t.faq.reassuranceBadgeTitle}
              </span>
              <p className="text-[11px] sm:text-xs text-[#5A6151] mt-0.5">
                {t.faq.reassuranceBadgeDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warm Closure Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
        <div className="bg-[#FDEBDA] rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-[#EADCCC]/60">
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <span className="text-[11px] uppercase tracking-widest text-[#5A6151] font-semibold block">
              {t.closure.eyebrow}
            </span>
            <h3 className="font-serif text-lg sm:text-2xl uppercase font-normal text-[#5E5245] tracking-[0.08em]">
              {t.closure.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E5245]/80 leading-relaxed">
              {t.closure.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/guide-des-tailles"
              className="w-full sm:w-auto min-h-[44px] h-11 px-5 rounded-xl bg-white border border-[#8A7058] text-[#8A7058] hover:bg-[#FFF8F4] transition-colors shadow-xs uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ruler className="w-4 h-4 stroke-[1.8]" />
              <span>{t.closure.sizeGuideBtn}</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] h-11 px-5 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors shadow-xs uppercase text-xs font-medium tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 stroke-[1.8]" />
              <span>{t.closure.whatsAppBtn}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
