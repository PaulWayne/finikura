import Link from "next/link";
import { Banknote, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { messages } from "@/messages/fr";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutProvider, CheckoutSubmitButton } from "./CheckoutState";
import { MobileSummaryAccordion } from "./MobileSummaryAccordion";
import { OrderSummaryItem } from "./OrderSummaryItem";

/** Checkout page layout (server). Only the form, the accordion and the submit buttons run on the client. */
export function CheckoutView({ cart }: { cart: Cart }) {
  const totalItemsCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CheckoutProvider>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-6 md:py-10">
        {/* Breadcrumb & top indicator */}
        <div className="hidden sm:flex flex-row items-center justify-between pb-6 gap-3 border-b border-brand-surface/50 mb-8">
          <nav aria-label="Fil d'Ariane Commande" className="flex items-center space-x-2 text-xs text-brand-text">
            <Link href="/" className="hover:underline underline-offset-4 transition-colors">
              {messages.checkout.breadcrumbPanier}
            </Link>
            <span>/</span>
            <span className="text-brand-text font-medium">{messages.checkout.breadcrumbFinalisation}</span>
            <span>/</span>
            <span className="text-brand-text">{messages.checkout.breadcrumbConfirmation}</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-surface text-brand-text text-xs font-medium">
            <Truck className="w-4 h-4 text-brand-primary" />
            <span>{messages.checkout.topDeliveryBadge}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left column: the form */}
          <section className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6">
            <div className="space-y-1.5 text-left">
              <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-brand-text font-semibold">
                <span className="hidden sm:inline">{messages.checkout.stepEyebrowDesktop}</span>
                <span className="sm:hidden">{messages.checkout.stepEyebrowMobile}</span>
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] uppercase text-brand-text tracking-[0.06em] leading-tight">
                <span className="hidden sm:inline">{messages.checkout.titleDesktop}</span>
                <span className="sm:hidden">{messages.checkout.titleMobile}</span>
              </h1>
              <p className="hidden sm:block text-base text-brand-text pt-1 leading-relaxed">
                <span className="hidden sm:inline">{messages.checkout.subtitleDesktop}</span>
                <span className="sm:hidden">{messages.checkout.subtitleMobile}</span>
              </p>
            </div>

            <MobileSummaryAccordion
              label={messages.checkout.seeItemsAccordion(totalItemsCount, formatPrice(cart.total))}
            >
              <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5 bg-brand-surface/70 border-t border-brand-surface/40">
                {cart.items.map((item) => (
                  <OrderSummaryItem key={item.id} item={item} variant="compact" />
                ))}
                <div className="flex items-baseline justify-between pt-2 px-1 text-xs text-brand-text">
                  <span>{messages.checkout.subtotalArticlesMobile}</span>
                  <span className="font-semibold text-sm text-brand-text">{formatPrice(cart.total)}</span>
                </div>
              </div>
            </MobileSummaryAccordion>

            <div className="bg-brand-surface px-4 py-3 sm:p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-sm font-medium text-brand-text">{messages.checkout.reassuranceTitle}</h2>
                <p className="hidden sm:block text-xs text-brand-text leading-relaxed">{messages.checkout.reassuranceDesc}</p>
              </div>
            </div>

            <CheckoutForm cart={cart}>
              {/* Mobile: notices and submit button inside the form flow */}
              <div className="lg:hidden pt-4 space-y-4">
                <Notice
                  icon={<MessageCircle className="w-4 h-4" />}
                  className="bg-brand-surface shadow-xs"
                  iconClassName="bg-brand-surface text-brand-primary"
                  title={messages.checkout.courierNoticeMobile}
                  text={messages.checkout.courierNoticeMobileDesc}
                />
                <Notice
                  icon={<Banknote className="w-4 h-4" />}
                  className="bg-brand-announcement/50"
                  iconClassName="bg-brand-announcement/20 text-brand-text"
                  title={messages.checkout.paymentOnDeliveryTitle}
                  text={messages.checkout.paymentOnDeliveryDesc}
                />
                <CheckoutSubmitButton variant="mobile" />
                <p className="text-center text-[11px] text-brand-text">{messages.checkout.submitFootnoteMobile}</p>
              </div>
            </CheckoutForm>
          </section>

          {/* Right column: sticky summary card (desktop) */}
          <aside className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="bg-brand-surface rounded-xl p-6 shadow-sm space-y-5 border border-brand-surface">
              <div className="flex items-baseline justify-between border-b border-brand-surface pb-3">
                <h2 className="font-serif text-lg uppercase text-brand-text tracking-[0.08em] font-normal">
                  {messages.checkout.summaryTitle}
                </h2>
                <span className="text-[11px] uppercase tracking-wider bg-brand-white/80 px-2.5 py-0.5 rounded text-brand-text font-semibold">
                  {messages.checkout.itemsBadge(totalItemsCount)}
                </span>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <OrderSummaryItem key={item.id} item={item} variant="card" />
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-surface">
                <div className="flex items-baseline justify-between text-xs text-brand-text">
                  <span>{messages.checkout.subtotalArticles}</span>
                  <span className="font-medium text-brand-text">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-sm font-semibold text-brand-text block">{messages.checkout.totalArticles}</span>
                    <span className="text-[11px] text-brand-text">{messages.checkout.withoutCourierFee}</span>
                  </div>
                  <span className="text-xl font-semibold text-brand-text">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-lg flex items-start gap-2.5 shadow-xs">
                <MessageCircle className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-brand-text">{messages.checkout.courierNoticeDelivery}</p>
                  <p className="text-[11px] text-brand-text leading-snug">{messages.checkout.courierNoticeDeliveryDesc}</p>
                </div>
              </div>

              <div className="bg-brand-bg p-3 rounded-lg flex items-center justify-between px-3.5 border border-brand-surface/60">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-brand-text" />
                  <span className="text-xs font-medium text-brand-text">{messages.checkout.paymentOnDeliveryTitle}</span>
                </div>
              </div>

              <div className="pt-2">
                <CheckoutSubmitButton variant="desktop" />
                <p className="text-center text-[11px] text-brand-text mt-2 tracking-wide">
                  {messages.checkout.submitFootnoteDesktop}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </CheckoutProvider>
  );
}

function Notice(props: { icon: React.ReactNode; className: string; iconClassName: string; title: string; text: string }) {
  return (
    <div className={`p-4 rounded-xl flex items-start gap-3 ${props.className}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${props.iconClassName}`}>
        {props.icon}
      </div>
      <div className="flex flex-col">
        <p className="text-xs font-medium text-brand-text">{props.title}</p>
        <p className="text-[11px] text-brand-text mt-0.5">{props.text}</p>
      </div>
    </div>
  );
}
