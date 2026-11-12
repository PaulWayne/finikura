"use client";
import Link from "next/link";

import React from "react";
import {
  Shield,
  Palette,
  MapPin,
  Mail,
  Phone,
  CloudCheck,
  Sparkles,
  Layers,
  Banknote,
  CheckCircle,
  Truck,
  HandCoins,
  Repeat,
  Lock,
  MessageCircle,
  Scale,
  Calendar,
  Award,
  ChevronRight,
  Send,
  Ruler,
  Home,
  Clock,
  Store,
} from "lucide-react";

interface LegalPageContentProps {
  whatsappUrl?: string;
}

export function LegalPageContent({
  whatsappUrl = "https://wa.me/22370000000",
}: LegalPageContentProps) {
  const sections = [
    { id: "section-editeur", num: 1, title: "Éditeur & Atelier" },
    { id: "section-creations", num: 2, title: "Créations & Confection" },
    { id: "section-tarifs", num: 3, title: "Prix en FCFA & Commandes" },
    { id: "section-livraison", num: 4, title: "Livraison par Coursier" },
    { id: "section-paiement", num: 5, title: "Paiement à la Réception" },
    { id: "section-retours", num: 6, title: "Échanges & Essayages" },
    { id: "section-donnees", num: 7, title: "Protection des Données" },
    { id: "section-conciliation", num: 8, title: "Dialogue & Conciliation" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Fil d'Ariane & En-tête */}
      <section className="w-full max-w-[1200px] mx-auto pt-4 md:pt-8 pb-8 md:pb-12">
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 mb-6 text-xs text-[#5E5245]/70"
        >
          <Link
            href="/"
            className="hover:text-[#CA7154] transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5 text-[#8A7058]" />
            <span>Accueil</span>
          </Link>
          <span className="text-[#80756C]/40">•</span>
          <span className="text-[#8A7058] font-medium">Mentions Légales &amp; CGV</span>
        </nav>

        <div className="flex flex-col max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADCCC] text-[#5E5245] text-[11px] font-semibold tracking-widest uppercase w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A7058]" />
            <span>Fini Kura Bamako • Cadre Légal &amp; Conditions</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-[#5E5245] uppercase tracking-[0.08em] font-normal leading-tight">
            Mentions Légales &amp; Conditions Générales de Vente
          </h1>

          <p className="text-sm md:text-base text-[#5E5245]/85 font-light leading-relaxed max-w-3xl">
            Chez Fini Kura, nous concevons des habits d’enfants pensés pour durer.
            Nos relations avec vous reposent sur la transparence, le respect du
            travail artisanal bien fait et la sérénité du service local à Bamako.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E5245]/75 pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8A7058]" />
              <span>Dernière mise à jour : Février 2025 • Bamako</span>
            </div>
            <span className="text-[#ded2c2]">•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#8A7058]" />
              <span>Conforme droit commercial UEMOA &amp; Mali</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de navigation mobile pour les articles */}
      <div className="w-full lg:hidden overflow-x-auto no-scrollbar pb-4 mb-4">
        <div className="flex items-center gap-2 px-2 whitespace-nowrap">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className="px-3.5 py-2 rounded-full bg-[#EADCCC] text-[#5E5245] text-xs font-medium hover:bg-[#8A7058] hover:text-white transition-all shadow-xs cursor-pointer"
            >
              {s.num}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Corps en 2 colonnes Desktop (Sommaire sticky 4 cols + Articles 8 cols) */}
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative pb-16">
        {/* Colonne Gauche : Sommaire Sticky */}
        <aside className="hidden lg:flex lg:col-span-4 sticky top-28 flex-col gap-6">
          <div className="bg-[#FFF1E5] rounded-2xl p-6 shadow-xs border border-[#EADCCC]">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#EADCCC]">
              <Scale className="w-5 h-5 text-[#8A7058]" />
              <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-[#5E5245]">
                Sommaire du Cadre
              </h2>
            </div>
            <nav className="flex flex-col space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-[#EADCCC]/70 text-left transition text-xs text-[#5E5245] cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#EADCCC] text-[#8A7058] text-[11px] font-medium flex items-center justify-center group-hover:bg-[#8A7058] group-hover:text-white transition-colors">
                      {s.num}
                    </span>
                    <span className="font-medium">{s.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#CA7154]" />
                </button>
              ))}
            </nav>
          </div>

          {/* Encart d'assistance directe */}
          <div className="bg-[#EADCCC] rounded-2xl p-6 shadow-xs border border-[#ded2c2] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8A7058] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] text-[#5E5245] uppercase tracking-wider font-normal leading-snug">
                  Besoin d&apos;une précision ?
                </h3>
                <p className="text-xs text-[#5E5245]/80 mt-0.5">
                  L’équipe de l’atelier vous répond directement.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs text-[#5E5245]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8A7058]" />
                <span className="font-medium">+223 76 45 89 12</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                <span className="text-[#5E5245]/80 leading-relaxed">
                  Quartier du Fleuve / ACI 2000,
                  <br />
                  Face pharmacie du Fleuve, Bamako
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-touch-btn bg-[#25D366] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#20ba59] transition shadow-xs uppercase text-xs font-medium tracking-[0.15em]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Écrire sur WhatsApp</span>
            </a>
          </div>
        </aside>

        {/* Colonne Droite : Articles Juridiques */}
        <div className="lg:col-span-8 flex flex-col space-y-12">
          {/* Article 1: Éditeur & Atelier */}
          <section id="section-editeur" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 1
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Mentions Légales de l&apos;Éditeur &amp; Atelier
              </h2>
            </div>
            <div className="bg-[#FFF1E5] rounded-2xl p-6 md:p-8 space-y-5 border border-[#EADCCC]/60 shadow-xs">
              <p className="text-sm md:text-base text-[#5E5245] leading-relaxed">
                Le site web et les créations textiles de la marque{" "}
                <strong>Fini Kura</strong> sont conçus, édités et distribués par :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-[#5E5245]">
                <div className="p-4 bg-[#FDF7F2] rounded-xl space-y-1 border border-[#EADCCC]">
                  <span className="text-[10px] font-bold tracking-wider text-[#8A7058] uppercase">
                    Forme juridique
                  </span>
                  <p className="font-semibold text-[#5E5245]">Maison Fini Kura</p>
                  <p className="text-xs text-[#5E5245]/70">
                    Entreprise individuelle artisanale enregistrée au RCCM de
                    Bamako, République du Mali.
                  </p>
                </div>
                <div className="p-4 bg-[#FDF7F2] rounded-xl space-y-1 border border-[#EADCCC]">
                  <span className="text-[10px] font-bold tracking-wider text-[#8A7058] uppercase">
                    Direction artistique
                  </span>
                  <p className="font-semibold text-[#5E5245]">Aminata Traoré</p>
                  <p className="text-xs text-[#5E5245]/70">
                    Styliste, modéliste et directrice de la publication.
                  </p>
                </div>
                <div className="p-4 bg-[#FDF7F2] rounded-xl space-y-1 border border-[#EADCCC]">
                  <span className="text-[10px] font-bold tracking-wider text-[#8A7058] uppercase">
                    Atelier physique
                  </span>
                  <p className="font-semibold text-[#5E5245]">
                    Quartier du Fleuve / ACI 2000
                  </p>
                  <p className="text-xs text-[#5E5245]/70">
                    À proximité de la pharmacie du Fleuve, Bamako.
                  </p>
                </div>
                <div className="p-4 bg-[#FDF7F2] rounded-xl space-y-1 border border-[#EADCCC]">
                  <span className="text-[10px] font-bold tracking-wider text-[#8A7058] uppercase">
                    Contacts directs
                  </span>
                  <p className="font-semibold text-[#5E5245]">
                    +223 76 45 89 12 / +223 20 22 00 00
                  </p>
                  <p className="text-xs text-[#5E5245]/70">
                    contact@finikura-bamako.com
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#5E5245]/70 flex items-center gap-2 border-t border-[#EADCCC]/60">
                <CloudCheck className="w-4 h-4 text-[#8A7058] shrink-0" />
                <span>
                  Hébergement : Infrastructure cloud européenne certifiée pour la
                  sécurité, la haute disponibilité et la confidentialité des échanges numériques.
                </span>
              </div>
            </div>
          </section>

          {/* Bannière Photo Atelier */}
          <div className="w-full rounded-2xl overflow-hidden bg-[#EADCCC] shadow-xs border border-[#ded2c2]">
            <img
              className="w-full h-48 md:h-56 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjRJ60W_bHfF31m8_MsjOmrgav-y4KSoGhArH6VS1j0qeMsblj5KvZlvhyn74BAre6SmvjlZSMcu1ID96fjfvFzHPjEXPNVQZcQf2iTsM4ik9ty6TIkYpVJYbwqbI1-thnFye9E1vJLRzRXm37v28DQhKM3hiw2_VePCSJIGxpPZU8bFuOHu_hfRorENgNXIJ0maQp2PxYuSSs08f2PuhYC-9D9DgZjnmdlVsAGjU"
              alt="Artisanat textile pour enfants cousu main à l'atelier Fini Kura de Bamako"
            />
            <div className="p-3.5 bg-[#EADCCC] flex items-center justify-between text-xs text-[#5E5245]">
              <span className="font-serif uppercase tracking-wider font-medium">
                Artisanat 100% fait main à Bamako
              </span>
              <span className="font-semibold text-[#8A7058] uppercase text-[10px] tracking-widest">
                Fibres Naturelles
              </span>
            </div>
          </div>

          {/* Article 2: Créations & Confection */}
          <section id="section-creations" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 2
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Pièces Textiles &amp; Authenticité Artisanale
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-[#5E5245] leading-relaxed">
              <p>
                Fini Kura imagine et confectionne exclusivement des pièces
                destinées aux enfants de <strong>3 à 14 ans</strong> (robes
                légères, blouses, chemises à col mandarin, ensembles d’explorateur,
                tuniques douces et bloomers de fête).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                <div className="bg-[#FFF1E5] p-4 rounded-xl border border-[#EADCCC] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7058]">
                    Matières Végétales
                  </span>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Lins certifiés aérés, popelines et cotons peignés issus de
                    coopératives cotonnières d’Afrique de l’Ouest.
                  </p>
                </div>
                <div className="bg-[#FFF1E5] p-4 rounded-xl border border-[#EADCCC] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7058]">
                    Finitions Délicates
                  </span>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Boutons sculptés en bois poli ou en nacre véritable, coutures
                    anglaises douces et broderies cousues main.
                  </p>
                </div>
                <div className="bg-[#FFF1E5] p-4 rounded-xl border border-[#EADCCC] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7058]">
                    Bains Naturels
                  </span>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Teintures respectueuses de la peau des enfants, inspirées des
                    nuances d’ocre, de sauge et d’argile fluviale.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-[#EADCCC]/60 rounded-xl flex items-start gap-3 border border-[#ded2c2]">
                <Sparkles className="w-5 h-5 text-[#8A7058] shrink-0 mt-0.5" />
                <p className="text-xs text-[#5E5245]/85 leading-relaxed">
                  <strong>Le caractère artisanal :</strong> Chaque vêtement est
                  coupé et façonné à l’atelier de Bamako. Les micro-variations de
                  tissage, le grain du fil ou de légères nuances de bain végétal
                  d’un rouleau à l’autre témoignent du geste de l’artisan et de la
                  singularité de chaque modèle, ne pouvant être assimilés à des
                  défauts de fabrication.
                </p>
              </div>
            </div>
          </section>

          {/* Article 3: Tarifs & Modalités de Commande */}
          <section id="section-tarifs" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 3
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Prix en FCFA &amp; Commande Simplifiée
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-[#5E5245] leading-relaxed">
              <p>
                Tous les tarifs mentionnés sur notre plateforme sont libellés en{" "}
                <strong>Francs CFA (XOF / FCFA)</strong>, valeur nette toutes
                taxes comprises.
              </p>
              <div className="bg-[#FFF1E5] rounded-xl p-5 md:p-6 space-y-4 border border-[#EADCCC]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8A7058] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    1
                  </span>
                  <div>
                    <h4 className="font-medium text-[#5E5245] text-sm">
                      Zéro compte contraignant
                    </h4>
                    <p className="text-xs text-[#5E5245]/80 mt-0.5">
                      Pas d’obligation de créer un compte avec mot de passe.
                      Seules les informations strictement utiles à la livraison
                      (votre prénom, numéro WhatsApp, quartier de résidence à
                      Bamako et repère connu) sont demandées.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8A7058] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    2
                  </span>
                  <div>
                    <h4 className="font-medium text-[#5E5245] text-sm">
                      Validation humaine par messagerie
                    </h4>
                    <p className="text-xs text-[#5E5245]/80 mt-0.5">
                      Dès l’enregistrement de votre panier, notre équipe vous
                      envoie un récapitulatif par message WhatsApp. Nous vérifions
                      la corpulence de l’enfant pour valider la bonne taille avant
                      tout départ de l’atelier.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8A7058] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    3
                  </span>
                  <div>
                    <h4 className="font-medium text-[#5E5245] text-sm">
                      Disponibilité des séries limitées
                    </h4>
                    <p className="text-xs text-[#5E5245]/80 mt-0.5">
                      Nos séries étant confectionnées en volumes raisonnés, en
                      cas d’indisponibilité fortuite d’un métrage, une alternative
                      de coloris ou un délai de confection de 3 jours vous est
                      proposé en toute transparence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Article 4: Livraison Bamako */}
          <section id="section-livraison" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 4
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Modalités de Livraison par Coursier à Bamako
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-[#5E5245] leading-relaxed">
              <p>
                Pour honorer le rythme des familles bamakoises, la livraison
                s’effectue par des coursiers partenaires de confiance, habitués
                aux repères et quartiers de la capitale.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFF1E5] p-5 rounded-xl border border-[#EADCCC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8A7058] font-medium text-xs">
                    <Truck className="w-4 h-4" />
                    <span>Zone de livraison &amp; Communes</span>
                  </div>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Nous couvrons l’intégralité des{" "}
                    <strong>Communes I, II, III, IV, V et VI du District de Bamako</strong>{" "}
                    (Badalabougou, ACI 2000, Hamdallaye, Faladié, Sotuba,
                    Titibougou, Kalaban-Coro, Sébénikoro). Pour la périphérie
                    (Kati, Baguinéda), un accord préalable par téléphone est
                    nécessaire.
                  </p>
                </div>
                <div className="bg-[#FFF1E5] p-5 rounded-xl border border-[#EADCCC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8A7058] font-medium text-xs">
                    <Banknote className="w-4 h-4" />
                    <span>Tarification à prix coûtant</span>
                  </div>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    La course est facturée selon l’éloignement réel de l’atelier :
                    généralement entre <strong>1 000 FCFA et 2 000 FCFA</strong>.
                    Fini Kura ne prend <em>aucune marge commerciale</em> sur ce
                    montant, versé directement au coursier pour son travail.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-[#EADCCC]/60 rounded-xl flex items-center justify-between border border-[#ded2c2]">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#8A7058]" />
                  <div>
                    <h4 className="font-medium text-xs text-[#5E5245]">
                      Délais de mise en route
                    </h4>
                    <p className="text-xs text-[#5E5245]/80">
                      Livraison sous 24h à 48h ouvrées après confirmation de
                      l’adresse par WhatsApp.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-[#FDF7F2] text-[#5E5245] text-[11px] font-medium rounded-full shadow-xs border border-[#ded2c2]">
                  Du Lundi au Samedi
                </span>
              </div>
            </div>
          </section>

          {/* Article 5: Paiement à la réception */}
          <section id="section-paiement" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 5
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Paiement Exclusif à la Réception
              </h2>
            </div>
            <div className="bg-[#FFF1E5] rounded-2xl p-6 md:p-8 space-y-5 border border-[#EADCCC]/60 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EADCCC] text-[#8A7058] flex items-center justify-center shrink-0 shadow-xs">
                  <HandCoins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#5E5245] uppercase tracking-wider font-normal">
                    La confiance avant tout : 0 FCFA débité d&apos;avance
                  </h3>
                  <p className="text-xs md:text-sm text-[#5E5245]/80 mt-1 leading-relaxed">
                    Pour votre parfaite tranquillité d’esprit, aucun paiement
                    n’est exigé lors de la validation du panier en ligne. Vous ne
                    réglez vos pièces que lorsque le coursier sonne à votre porte
                    avec votre paquet Fini Kura scellé.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-[#FDF7F2] rounded-xl shadow-xs border border-[#ded2c2] space-y-2">
                  <div className="flex items-center gap-2 text-[#5E5245] font-medium text-xs">
                    <Banknote className="w-4 h-4 text-[#8A7058]" />
                    <span>Règlement en Espèces</span>
                  </div>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Paiement en liquide à la remise en main propre. L’appoint ou
                    la monnaie exacte est vivement apprécié pour faciliter le
                    quotidien de nos livreurs.
                  </p>
                </div>
                <div className="p-4 bg-[#FDF7F2] rounded-xl shadow-xs border border-[#ded2c2] space-y-2">
                  <div className="flex items-center gap-2 text-[#5E5245] font-medium text-xs">
                    <Phone className="w-4 h-4 text-[#8A7058]" />
                    <span>Mobile Money Mali</span>
                  </div>
                  <p className="text-xs text-[#5E5245]/80 leading-relaxed">
                    Transfert direct et instantané au numéro marchand sécurisé de
                    la maison (Orange Money Mali ou Moov Africa) sous les yeux
                    du coursier.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#5E5245]/70 italic pt-1">
                * Droit de regard : vous disposez de quelques instants pour vous
                assurer que l’emballage et les pièces correspondent bien à votre
                commande avant de finaliser la transaction.
              </p>
            </div>
          </section>

          {/* Article 6: Échanges & Tailles */}
          <section id="section-retours" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 6
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Échanges Faciles, Tailles &amp; Essayages
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-[#5E5245] leading-relaxed">
              <p>
                Les enfants grandissent vite, et nous savons qu’un vêtement doit
                tomber avec une élégance naturelle. Si la taille ne convient pas
                parfaitement, notre politique d’échange est fluide et bienveillante :
              </p>
              <div className="bg-[#FFF1E5] rounded-xl p-5 md:p-6 space-y-3.5 border border-[#EADCCC]">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5E5245]">
                    <strong>Délai de prévenance :</strong> Vous avez un délai de{" "}
                    <strong>48 heures ouvrées</strong> suivant la réception pour
                    nous faire part d’un souhait d’échange de taille sur WhatsApp.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Repeat className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5E5245]">
                    <strong>État de conservation :</strong> L’habit doit demeurer
                    parfaitement neuf, non porté lors d&apos;activités extérieures, non
                    lavé, dans son pochon textile d’origine et avec son étiquette
                    cousue intacte.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Store className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5E5245]">
                    <strong>Essayage &amp; ajustement à l’atelier :</strong> Vous
                    pouvez également passer directement à notre atelier du
                    Quartier du Fleuve avec votre enfant pour procéder à l’essayage
                    des autres statures ou faire retoucher un ourlet si besoin.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#5E5245]/70">
                * En cas de nouvel envoi par coursier pour un motif de simple
                convenance de taille (hors erreur de préparation de notre part),
                les frais de déplacement du coursier sont à la charge de
                l’acheteur.
              </p>
            </div>
          </section>

          {/* Article 7: Protection des données */}
          <section id="section-donnees" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 7
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Confidentialité &amp; Protection des Données Privées
              </h2>
            </div>
            <div className="bg-[#FFF1E5] rounded-2xl p-6 md:p-8 space-y-4 text-xs md:text-sm text-[#5E5245] leading-relaxed border border-[#EADCCC]/60 shadow-xs">
              <p>
                Nous accordons une valeur sacrée à l’intimité des familles qui nous
                confient la garde-robe de leurs petits :
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <span>
                    <strong>Usage exclusivement logistique :</strong> Vos numéros
                    d&apos;appel et repères géographiques ne servent qu’à la
                    coordination de la livraison du jour.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zéro cession commerciale :</strong> Aucune base de
                    données n’est transmise, louée ou vendue à des tiers, régies
                    publicitaires ou partenaires extérieurs.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#8A7058] shrink-0 mt-0.5" />
                  <span>
                    <strong>Droit d’effacement immédiat :</strong> Un simple
                    message sur WhatsApp demandant la suppression de votre fiche
                    client est exécuté sous 24 heures sans justification requise.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Article 8: Dialogue & Conciliation */}
          <section id="section-conciliation" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#EADCCC]">
              <span className="text-xs font-bold text-[#CA7154] uppercase tracking-wider">
                Article 8
              </span>
              <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.08em] font-normal text-[#5E5245]">
                Dialogue Bienveillant &amp; Conciliation Amiable
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-[#5E5245] leading-relaxed">
              <p>
                La culture de Fini Kura s’inscrit dans l’art du dialogue (
                <em>Maaya</em> et respect mutuel). Dans l’éventualité où une
                commande ne vous apporterait pas l’entière satisfaction espérée,
                nous vous invitons à contacter sans délai notre atelier.
              </p>
              <p className="text-xs md:text-sm text-[#5E5245]/80">
                Toute difficulté fait l’objet d’une recherche de solution cordiale
                et généreuse (échange, retouche gracieuse ou avoir sans limitation
                de date). À défaut de conciliation amiable, les juridictions
                compétentes du ressort du Tribunal de Commerce de Bamako sont
                seules reconnues applicables selon les lois en vigueur en
                République du Mali.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Grande Bannière de Synthèse & Engagement Sérénité */}
      <section className="w-full max-w-[1200px] mx-auto bg-[#EADCCC] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden border border-[#ded2c2] mb-12">
        <div className="max-w-3xl relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 text-[#8A7058] text-xs font-bold uppercase tracking-widest">
            <CheckCircle className="w-4 h-4" />
            <span>La Promesse de Sérénité Fini Kura</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-[#5E5245] leading-snug uppercase tracking-wider font-normal">
            Une confection noble, un service respectueux et un dialogue direct
            avec nos couturières.
          </h2>
          <p className="text-xs md:text-sm text-[#5E5245]/80 leading-relaxed font-light">
            Que ce soit pour valider un tour de poitrine avant confection, convenir
            d’un horaire précis avec le livreur ou organiser un essayage à
            l’atelier du Quartier du Fleuve, nous sommes à votre écoute au
            quotidien.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-touch-btn px-6 py-3 bg-[#25D366] text-white rounded-md flex items-center gap-2 hover:bg-[#20ba59] transition shadow-xs uppercase text-xs font-medium tracking-[0.15em]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l’atelier sur WhatsApp</span>
            </a>
            <Link
              href="/guide-des-tailles"
              className="min-touch-btn px-6 py-3 border border-[#8A7058] text-[#8A7058] bg-[#FDF7F2] rounded-md flex items-center gap-2 hover:bg-[#8A7058] hover:text-white transition uppercase text-xs font-medium tracking-[0.15em]"
            >
              <Ruler className="w-4 h-4" />
              <span>Consulter le Guide des Tailles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature finale */}
      <div className="text-center text-xs text-[#5E5245]/70 space-y-1 pb-8">
        <p className="italic">
          « Habiller l’enfance avec la douceur des fibres nobles et la fierté du
          savoir-faire malien. »
        </p>
        <p className="text-[#8A7058] font-medium uppercase tracking-wider text-[11px]">
          Maison Fini Kura • Bamako, République du Mali
        </p>
      </div>
    </div>
  );
}
