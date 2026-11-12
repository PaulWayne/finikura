import React from "react";
import { contentService } from "@/src/lib/content";
import { commerceService } from "@/src/lib/commerce";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata() {
  const settings = await contentService.getGlobalSettings();
  return {
    title: "Fini Kura — Habits pour enfants à Bamako",
    description:
      "Grandir avec style, rayonner avec élégance. Maison de confection enfantine à Bamako pour filles et garçons de 3 à 14 ans.",
    openGraph: {
      title: "Fini Kura — Habits pour enfants à Bamako",
      description:
        "Maison de confection pour filles et garçons de 3 à 14 ans. Paiement à la réception à Bamako.",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, cart] = await Promise.all([
    contentService.getGlobalSettings(),
    commerceService.getCart(),
  ]);

  const initialCartCount = cart.items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#FDF7F2] text-[#5E5245] font-sans antialiased flex flex-col selection:bg-[#CA7154]/20 selection:text-[#5E5245]">
        <AnnouncementBar text={settings.announcementBar} />
        <Header initialCartCount={initialCartCount} />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6">
          {children}
        </main>
        <Footer
          footerLinks={settings.footerLinks}
          socialLinks={settings.socialLinks}
        />
        <MobileMenu whatsappUrl={settings.whatsappUrl} />
        <CartDrawer initialCart={cart} />
      </body>
    </html>
  );
}
