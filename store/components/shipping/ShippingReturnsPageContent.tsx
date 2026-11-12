"use client";

import React from "react";
import {
  Truck,
  Banknote,
  Repeat,
  Store,
  Clock,
  MapPin,
  Lock,
  HeartHandshake,
  MessageCircle,
  Home,
  CheckCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

interface ShippingReturnsPageContentProps {
  whatsappUrl?: string;
}

export function ShippingReturnsPageContent({
  whatsappUrl = "https://wa.me/22370000000",
}: ShippingReturnsPageContentProps) {
  const steps = [
    {
      num: 1,
      title: "1. Vous commandez sur le site",
      desc: "Sélectionnez vos pièces favorites pour vos enfants en quelques clics, sans obligation de créer de compte.",
    },
    {
      num: 2,
      title: "2. Nous vous confirmons sur WhatsApp",
      desc: "Notre équipe d'atelier vous contacte pour confirmer la taille, vos repères et convenir du passage du coursier.",
    },
    {
      num: 3,
      title: "3. Nous livrons à Bamako",
      desc: "Un coursier partenaire habitué aux quartiers bamakois achemine délicatement votre paquet ficelé directement chez vous.",
    },
    {
      num: 4,
      title: "4. Vous payez à la réception",
      desc: "Inspectez vos créations et réglez directement en main propre en espèces ou Mobile Money en toute sérénité.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Fil d'Ariane & En-tête */}
      <section className="w-full max-w-[1200px] mx-auto pt-4 md:pt-8 pb-6 md:pb-10">
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 mb-6 text-xs text-[#5E5245]/70"
        >
          <a
            href="/"
            className="hover:text-[#CA7154] transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5 text-[#8A7058]" />
            <span>Accueil</span>
          </a>
          <span className="text-[#80756C]/40">•</span>
          <span className="text-[#8A7058] font-medium">Livraison et échanges</span>
        </nav>

        <div className="flex flex-col max-w-3xl space-y-3">
          <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-[#8A7058] uppercase">
            Service d&apos;Atelier &amp; Logistique Locale
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-[#5E5245] uppercase tracking-[0.08em] font-normal leading-tight">
            Livraison et Échanges
          </h1>
          <p className="text-sm md:text-base text-[#5E5245]/85 font-light leading-relaxed">
            Chaque création Fini Kura voyage depuis notre atelier avec la même
            délicatesse que celle apportée à ses coutures. À Bamako, nous privilégions
            une relation de proximité fondée sur l&apos;écoute attentive, des repères
            urbains partagés et une confiance mutuelle sans détour.
          </p>
        </div>
      </section>

      {/* Frise Chronologique (4 étapes : horizontale desktop avec fil conducteur taupe, verticale mobile) */}
      <section className="w-full bg-[#FFF1E5] py-10 md:py-14 my-4 rounded-2xl border border-[#EADCCC]/60 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] text-[#8A7058] uppercase">
                Parcours d&apos;expédition
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-[#5E5245] uppercase tracking-[0.08em] font-normal mt-0.5">
                La sérénité d&apos;un pas à pas limpide
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#FDF7F2] px-3.5 py-1.5 rounded-full shadow-xs border border-[#EADCCC]">
              <ShieldCheck className="w-4 h-4 text-[#8A7058]" />
              <span className="text-xs text-[#5E5245] font-medium">
                Confiance &amp; contact direct
              </span>
            </div>
          </div>

          {/* Timeline 4 colonnes */}
          <div className="relative pt-2">
            {/* Ligne continue taupe sur desktop */}
            <div className="hidden lg:block absolute top-[2.35rem] left-[10%] right-[10%] h-[2px] bg-[#8A7058]/25 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left group bg-[#FDF7F2]/60 lg:bg-transparent p-4 lg:p-0 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-serif text-lg font-medium shadow-sm mb-4 bg-[#8A7058] ring-8 ring-[#FFF1E5] transition-transform duration-300 group-hover:scale-105">
                    {step.num}
                  </div>
                  <h3 className="font-medium text-[16px] md:text-[17px] text-[#5E5245] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#5E5245]/80 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Les 3 Cartes côte à côte (3 colonnes équilibrées en #EADCCC) */}
      <section className="w-full max-w-[1200px] mx-auto py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* CARTE 1: LIVRAISON */}
          <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm border border-[#ded2c2] bg-[#EADCCC]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-[#8A7058] shadow-xs">
                  <Truck className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="bg-[#8A7058]/15 text-[#5E5245] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                  Zone Bamako
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal tracking-[0.08em] uppercase text-[#5E5245]">
                Livraison
              </h3>
              <div className="space-y-3.5 text-[#5E5245]/90 text-sm">
                <div className="p-3 bg-[#FDF7F2]/80 rounded-xl border border-[#ded2c2]/60">
                  <p className="font-medium text-[#8A7058] leading-snug">
                    Nous livrons uniquement à Bamako pour le moment.
                  </p>
                </div>
                <div className="p-3 bg-[#FDF7F2]/80 rounded-xl border border-[#ded2c2]/60">
                  <p className="text-[#5E5245] leading-snug">
                    La livraison est à votre charge. Les modalités vous sont
                    confirmées sur WhatsApp avant l&apos;envoi.
                  </p>
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed text-[#5E5245]/80 pt-1">
                  Desserte attentionnée des 6 communes du district de Bamako. Nos
                  livreurs partenaires se repèrent selon vos indications
                  familières : carrefours, écoles, pharmacies ou commerces de
                  proximité.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ded2c2] flex items-center gap-2 text-xs text-[#5E5245]/80 font-medium">
              <MapPin className="w-4 h-4 text-[#8A7058]" />
              <span>Communes I à VI • Repères sur mesure</span>
            </div>
          </div>

          {/* CARTE 2: PAIEMENT */}
          <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm border border-[#ded2c2] bg-[#EADCCC]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-[#8A7058] shadow-xs">
                  <Banknote className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="bg-[#8A7058]/15 text-[#5E5245] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                  À Réception
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal tracking-[0.08em] uppercase text-[#5E5245]">
                Paiement
              </h3>
              <div className="space-y-3.5 text-[#5E5245]/90 text-sm">
                <div className="p-3 bg-[#FDF7F2]/80 rounded-xl border border-[#ded2c2]/60">
                  <p className="font-medium text-[#8A7058] leading-snug">
                    Vous payez à la réception de votre commande.
                  </p>
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed text-[#5E5245]/80">
                  Aucun débit à l&apos;avance n&apos;est requis sur notre site. Le
                  règlement s&apos;effectue auprès du coursier au moment même où il vous
                  confie vos paquets d&apos;habits.
                </p>
                <div className="p-3 bg-[#FDF7F2]/60 rounded-xl space-y-2">
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Moyens acceptés en main propre :
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#FDF7F2] text-[#5E5245] font-medium border border-[#ded2c2]">
                      Espèces
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#FDF7F2] text-[#CA7154] font-medium border border-[#ded2c2]">
                      Orange Money
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#FDF7F2] text-[#304054] font-medium border border-[#ded2c2]">
                      Moov Africa
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ded2c2] flex items-center gap-2 text-xs text-[#5E5245]/80 font-medium">
              <Lock className="w-4 h-4 text-[#8A7058]" />
              <span>Règlement sécurisé à la livraison</span>
            </div>
          </div>

          {/* CARTE 3: ÉCHANGES */}
          <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm border border-[#ded2c2] bg-[#EADCCC]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-[#8A7058] shadow-xs">
                  <Repeat className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="bg-[#8A7058]/15 text-[#5E5245] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                  Ajustement
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal tracking-[0.08em] uppercase text-[#5E5245]">
                Échanges
              </h3>
              <div className="space-y-3.5 text-[#5E5245]/90 text-sm">
                <div className="p-3 bg-[#FDF7F2]/80 rounded-xl border border-[#ded2c2]/60">
                  <p className="text-xs md:text-sm text-[#5E5245] leading-relaxed">
                    Les échanges de taille sont possibles pour les pièces non
                    portées dans leur état d&apos;origine. Possibilité d&apos;essayage et
                    d&apos;ajustement direct à l&apos;atelier du Quartier du Fleuve.
                  </p>
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed text-[#5E5245]/80">
                  Les enfants grandissent vite et chaque silhouette est singulière.
                  Si un habit nécessite une taille supérieure ou inférieure, nos
                  artisanes veillent à trouver avec vous la coupe parfaitement seyante.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ded2c2] flex items-center gap-2 text-xs text-[#5E5245]/80 font-medium">
              <HeartHandshake className="w-4 h-4 text-[#8A7058]" />
              <span>Accompagnement bienveillant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cartouche d'accueil à l'atelier physique */}
      <section className="w-full max-w-[1200px] mx-auto mb-10 md:mb-14">
        <div className="bg-[#EADCCC]/70 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#ded2c2]">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-11 h-11 rounded-full bg-[#FDF7F2] flex-shrink-0 flex items-center justify-center text-[#8A7058] shadow-xs mt-0.5">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg md:text-xl text-[#5E5245] uppercase tracking-[0.08em] font-normal mb-1.5">
                Vous préférez toucher les étoffes ?
              </h4>
              <p className="text-xs md:text-sm text-[#5E5245]/80 leading-relaxed font-light">
                Notre atelier de confection vous accueille chaleureusement au
                Quartier du Fleuve. Venez découvrir nos lins souples, nos cotons
                lavés et essayer directement sur vos enfants avec l&apos;aide de notre
                couturière.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-[#FDF7F2] px-4 py-2.5 rounded-lg text-[#5E5245] text-xs font-medium shadow-xs border border-[#ded2c2]">
              <Clock className="w-4 h-4 text-[#8A7058]" />
              <span>Lun - Sam : 09h00 - 18h30</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ligne d'aide & Contact WhatsApp */}
      <section className="w-full max-w-[680px] mx-auto py-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#FFF1E5] flex items-center justify-center text-[#8A7058] mb-3 border border-[#EADCCC]">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl md:text-2xl text-[#5E5245] uppercase tracking-[0.08em] font-normal mb-2">
          Une question ? Écrivez-nous sur WhatsApp
        </h2>
        <p className="text-xs md:text-sm text-[#5E5245]/80 mb-6 leading-relaxed max-w-md font-light">
          Qu&apos;il s&apos;agisse d&apos;un repère de livraison à préciser ou d&apos;un conseil de
          stature pour vos petits, notre équipe d&apos;atelier vous répond avec plaisir.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-touch-btn inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-[#25D366] text-white text-xs md:text-sm font-medium tracking-[0.15em] uppercase hover:bg-[#20ba59] transition shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Écrire sur WhatsApp (+223 70 00 00 00)</span>
        </a>
        <span className="text-xs text-[#5E5245]/70 mt-3 tracking-wide">
          Réponse attentionnée • Du lundi au samedi
        </span>
      </section>
    </div>
  );
}
