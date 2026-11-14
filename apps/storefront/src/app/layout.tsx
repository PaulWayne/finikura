import type { Metadata } from "next";
import { Suspense, cache } from "react";
import { Playfair_Display, Poppins } from "next/font/google";
import { cookies } from "next/headers";
import { contentService } from "@/lib/content";
import { commerceService } from "@/lib/commerce";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CartTrigger } from "@/components/layout/CartTrigger";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { WhatsAppClickTracker } from "@/components/layout/WhatsAppClickTracker";
import { messages } from "@/messages/fr";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: messages.meta.defaultTitle,
  description: messages.meta.defaultDescription,
};

/** Per-visitor cart, read from the httpOnly cookie at request time (once per request). */
const getRequestCart = cache(async () => {
  const cartId = (await cookies()).get("fk_cart_id")?.value ?? null;
  return commerceService.getCart(cartId);
});

async function CartCount() {
  const cart = await getRequestCart();
  return <CartTrigger initialCount={cart.items.reduce((acc, it) => acc + it.quantity, 0)} />;
}

async function CartPanel() {
  return <CartDrawer initialCart={await getRequestCart()} />;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await contentService.getGlobalSettings();

  return (
    <html lang="fr" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased flex flex-col">
        <AnnouncementBar text={settings.announcementBar} />
        <Header
          cartSlot={
            <Suspense fallback={<CartTrigger initialCount={0} />}>
              <CartCount />
            </Suspense>
          }
        />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6">{children}</main>
        <Footer footerLinks={settings.footerLinks} socialLinks={settings.socialLinks} />
        <MobileMenu whatsappUrl={settings.whatsappUrl} />
        {settings.showWhatsAppButton && (
          // usePathname() must stream in under Suspense with Cache Components.
          <Suspense fallback={null}>
            <WhatsAppFloatingButton href={settings.whatsappUrl} />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <CartPanel />
        </Suspense>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <WhatsAppClickTracker />
      </body>
    </html>
  );
}
