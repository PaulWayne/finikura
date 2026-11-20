import type { Metadata, Viewport } from "next";
import { brandBackground } from "@/lib/brand-icon";
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
import { ScrollToTopOnNavigate } from "@/components/layout/ScrollToTopOnNavigate";
import { WhatsAppClickTracker } from "@/components/layout/WhatsAppClickTracker";
import { messages } from "@/messages/fr";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-playfair",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

/** Colour of the browser bar on a phone: the linen ground of the site, read from the charter token. */
export async function generateViewport(): Promise<Viewport> {
  "use cache";
  return { themeColor: await brandBackground() };
}

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
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:min-h-11 focus:inline-flex focus:items-center focus:px-5 focus:rounded-[4px] focus:bg-brand-primary focus:text-brand-white focus:text-sm"
        >
          {messages.header.skipToContent}
        </a>
        <AnnouncementBar text={settings.announcementBar} />
        <Header
          cartSlot={
            <Suspense fallback={<CartTrigger initialCount={0} />}>
              <CartCount />
            </Suspense>
          }
        />
        <main id="contenu" className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6">{children}</main>
        <Footer footerLinks={settings.footerLinks} socialLinks={settings.socialLinks} />
        <MobileMenu whatsappUrl={settings.whatsappUrl} />
        {settings.showWhatsAppButton && (
          // usePathname() must stream in under Suspense with Cache Components.
          <Suspense fallback={null}>
            <WhatsAppFloatingButton href={settings.whatsappUrl} />
          </Suspense>
        )}
        {/* usePathname() must stream in under Suspense with Cache Components. */}
        <Suspense fallback={null}>
          <ScrollToTopOnNavigate />
        </Suspense>
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
