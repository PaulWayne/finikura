"use client";
import Link from "next/link";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  MapPin,
  AlertCircle,
  ShoppingBag,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Banknote,
  Truck,
  CheckCircle2,
} from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { checkoutSchema, CheckoutFormData } from "@/lib/validation/checkout";
import { placeOrderAction } from "@/app/actions/cart";
import { formatPrice } from "@/lib/format";
import { IMAGE_FALLBACKS, handleImgError } from "@/lib/images";
import { messages } from "@/messages/fr";
import { triggerCartUpdated, triggerCartToast } from "@/lib/cart-events";
import { loadContact, saveContact } from "@/lib/saved-contact";

interface CheckoutFormProps {
  cart: Cart;
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      neighborhood: "",
      deliveryLandmarks: "",
    },
    mode: "onTouched",
  });

  // Pre-fill with the details saved on this phone after a previous order.
  useEffect(() => {
    const saved = loadContact();
    if (saved) reset(saved);
  }, [reset]);

  const submittingRef = useRef(false);

  const onSubmit = async (data: CheckoutFormData) => {
    if (submittingRef.current) return; // guard against double tap
    submittingRef.current = true;
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await placeOrderAction(data);

      if (res.success && res.order) {
        saveContact(data);
        triggerCartUpdated({ ...cart, items: [], subtotal: 0, total: 0 });
        triggerCartToast(messages.checkout.orderPlacedToast(res.order.orderNumber));

        router.push(`/commande/confirmation/${res.order.id}`);
      } else {
        setServerError(res.error || messages.errors.placeOrder);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : messages.errors.placeOrder;
      setServerError(msg);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => handleSubmit(onSubmit)(e);

  const totalItemsCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-surface/40 flex items-center justify-center mx-auto mb-4 text-brand-primary">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl uppercase text-brand-text mb-2 tracking-[0.05em]">
          {messages.checkout.emptyCartTitle}
        </h2>
        <p className="text-sm text-brand-text/80 mb-6 max-w-md mx-auto">
          {messages.checkout.emptyCartDesc}
        </p>
        <Link
          href="/categorie/filles"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary hover:bg-brand-text text-brand-white text-xs font-medium tracking-[0.15em] uppercase rounded shadow-sm transition"
        >
          {messages.checkout.emptyCartCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
      {/* Breadcrumb & Top Indicator (Desktop & Tablet) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-3 border-b border-brand-surface/50 mb-8">
        <nav
          aria-label="Fil d'Ariane Commande"
          className="flex items-center space-x-2 text-xs text-brand-text/70"
        >
          <Link
            href="/"
            className="hover:text-brand-terracotta transition-colors"
          >
            {messages.checkout.breadcrumbPanier}
          </Link>
          <span>/</span>
          <span className="text-brand-primary font-medium">
            {messages.checkout.breadcrumbFinalisation}
          </span>
          <span>/</span>
          <span className="text-brand-text/60">{messages.checkout.breadcrumbConfirmation}</span>
        </nav>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-surface text-brand-text text-xs font-medium">
          <Truck className="w-4 h-4 text-brand-primary" />
          <span>{messages.checkout.topDeliveryBadge}</span>
        </div>
      </div>

      {/* Main Form container: 2-column layout on Desktop, single column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Express Checkout Form without account (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          {/* Header Section */}
          <div className="space-y-1.5 text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-text font-semibold block">
              <span className="hidden sm:inline">{messages.checkout.stepEyebrowDesktop}</span>
              <span className="sm:hidden">{messages.checkout.stepEyebrowMobile}</span>
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] uppercase text-brand-text tracking-[0.06em] leading-tight">
              <span className="hidden sm:inline">{messages.checkout.titleDesktop}</span>
              <span className="sm:hidden">{messages.checkout.titleMobile}</span>
            </h1>
            <p className="text-sm sm:text-base text-brand-text/80 pt-1 leading-relaxed">
              <span className="hidden sm:inline">{messages.checkout.subtitleDesktop}</span>
              <span className="sm:hidden">{messages.checkout.subtitleMobile}</span>
            </p>
          </div>

          {/* Mobile Collapsible Order Summary Accordion (Mockup mobile 390px) */}
          <div className="lg:hidden w-full bg-brand-surface rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              aria-expanded={isMobileSummaryOpen}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left focus:outline-none bg-brand-surface hover:bg-brand-surface transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingBag className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-brand-text truncate">
                  {messages.checkout.seeItemsAccordion(
                    totalItemsCount,
                    formatPrice(cart.total)
                  )}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-brand-primary transition-transform duration-300 ${
                  isMobileSummaryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileSummaryOpen && (
              <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5 bg-brand-surface/70 border-t border-brand-surface/40">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-white shadow-xs"
                  >
                    <img
                      src={item.thumbnail || IMAGE_FALLBACKS.product}
                      alt={item.productTitle}
                      onError={handleImgError(IMAGE_FALLBACKS.product)}
                      className="w-14 h-14 rounded-md object-cover shrink-0 bg-brand-surface"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-brand-text truncate">
                        {item.productTitle}
                      </p>
                      <p className="text-[11px] text-brand-text/70">
                        Taille : {item.variantTitle} · Qté : {item.quantity}
                      </p>
                      <span className="text-xs font-semibold text-brand-primary mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-baseline justify-between pt-2 px-1 text-xs text-brand-text">
                  <span>{messages.checkout.subtotalArticlesMobile}</span>
                  <span className="font-semibold text-sm text-brand-text">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Reassurance Banner */}
          <div className="bg-brand-surface p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <h2 className="text-xs sm:text-sm font-medium text-brand-text">
                {messages.checkout.reassuranceTitle}
              </h2>
              <p className="text-xs text-brand-text leading-relaxed">
                {messages.checkout.reassuranceDesc}
              </p>
            </div>
          </div>

          {/* Form Block */}
          <form
            method="post"
            onSubmit={submitForm}
            className="space-y-4 pt-1"
            noValidate
          >
            {/* Field 1: Full Name */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs uppercase tracking-wider text-brand-text font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.nameLabel}{" "}
                  <span className="text-brand-terracotta">*</span>
                </span>
                <span className="text-brand-text normal-case tracking-normal text-[11px]">
                  {messages.checkout.nameRequiredBadge}
                </span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  placeholder={messages.checkout.namePlaceholder}
                  className={`w-full h-12 px-4 pr-10 rounded bg-brand-white text-brand-text text-sm shadow-xs border transition-all placeholder:text-brand-text/50 focus:outline-none ${
                    errors.fullName
                      ? "border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta"
                      : "border-brand-surface focus:border-brand-primary"
                  }`}
                />
                <User className="w-4 h-4 text-brand-text absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-brand-terracotta font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName.message}</span>
                </p>
              )}
            </div>

            {/* Field 2: Phone */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="phone"
                className="text-xs uppercase tracking-wider text-brand-text font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.phoneLabel}{" "}
                  <span className="text-brand-terracotta">*</span>
                </span>
                <span className="text-brand-text normal-case tracking-normal text-[11px]">
                  {messages.checkout.phoneHelp}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  {...register("phone")}
                  placeholder={messages.checkout.phonePlaceholder}
                  className={`w-full h-12 px-4 pr-10 rounded bg-brand-white text-brand-text text-sm tracking-wide shadow-xs border transition-all placeholder:text-brand-text/50 focus:outline-none ${
                    errors.phone
                      ? "border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta"
                      : "border-brand-surface focus:border-brand-primary"
                  }`}
                />
                <Phone className="w-4 h-4 text-brand-text absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.phone && (
                <p className="text-xs text-brand-terracotta font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone.message}</span>
                </p>
              )}
            </div>

            {/* Field 3: Bamako Neighborhood */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="neighborhood"
                className="text-xs uppercase tracking-wider text-brand-text font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.neighborhoodLabel}{" "}
                  <span className="text-brand-terracotta">*</span>
                </span>
                <span className="text-brand-text normal-case tracking-normal text-[11px]">
                  {messages.checkout.neighborhoodHelp}
                </span>
              </label>
              <div className="relative">
                <input
                  id="neighborhood"
                  type="text"
                  {...register("neighborhood")}
                  placeholder={messages.checkout.neighborhoodPlaceholder}
                  className={`w-full h-12 px-4 pr-10 rounded bg-brand-white text-brand-text text-sm shadow-xs border transition-all placeholder:text-brand-text/50 focus:outline-none ${
                    errors.neighborhood
                      ? "border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta"
                      : "border-brand-surface focus:border-brand-primary"
                  }`}
                />
                <MapPin className="w-4 h-4 text-brand-text absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.neighborhood && (
                <p className="text-xs text-brand-terracotta font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.neighborhood.message}</span>
                </p>
              )}
            </div>

            {/* Field 4: Delivery Landmarks (Required, with terracotta alert) */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="deliveryLandmarks"
                className="text-xs uppercase tracking-wider text-brand-text font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.landmarksLabel}{" "}
                  <span className="text-brand-terracotta">*</span>
                </span>
                <span className="text-brand-terracotta font-medium normal-case tracking-normal text-[11px]">
                  {messages.checkout.landmarksRequiredBadge}
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="deliveryLandmarks"
                  rows={2}
                  {...register("deliveryLandmarks")}
                  placeholder={messages.checkout.landmarksPlaceholder}
                  className={`w-full p-3.5 pr-10 rounded bg-brand-white text-brand-text text-sm shadow-xs border transition-all placeholder:text-brand-text/50 resize-none focus:outline-none ${
                    errors.deliveryLandmarks
                      ? "border-brand-terracotta bg-brand-terracotta/20 focus:ring-1 focus:ring-brand-terracotta"
                      : "border-brand-surface focus:border-brand-primary"
                  }`}
                />
                <AlertCircle
                  className={`w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none ${
                    errors.deliveryLandmarks ? "text-brand-terracotta" : "text-brand-text/40"
                  }`}
                />
              </div>

              {/* Dedicated terracotta warning notice */}
              {errors.deliveryLandmarks ? (
                <div className="flex items-center gap-1.5 pt-0.5 text-brand-terracotta">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-medium leading-tight">
                    {errors.deliveryLandmarks.message}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pt-0.5 text-brand-text">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    Important pour guider le coursier sans appel inutile à Bamako.
                  </p>
                </div>
              )}
            </div>


            {/* Server Error feedback if any */}
            {serverError && (
              <div className="p-3.5 rounded-lg bg-brand-terracotta/15 text-brand-terracotta text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Mobile Financial Summary & Submit Button (visible on mobile only inside the form flow) */}
            <div className="lg:hidden pt-4 space-y-4">
              <div className="bg-brand-surface p-4 rounded-xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center shrink-0 text-brand-primary">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-brand-text">
                    {messages.checkout.courierNoticeMobile}
                  </p>
                  <p className="text-[11px] text-brand-text mt-0.5">
                    {messages.checkout.courierNoticeMobileDesc}
                  </p>
                </div>
              </div>

              <div className="bg-brand-announcement/50 p-4 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-announcement/20 flex items-center justify-center shrink-0 text-brand-text">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-brand-text">
                    {messages.checkout.paymentOnDeliveryTitle}
                  </p>
                  <p className="text-[11px] text-brand-text mt-0.5">
                    {messages.checkout.paymentOnDeliveryDesc}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[46px] rounded-lg bg-brand-primary hover:bg-brand-text active:scale-[0.99] text-brand-white font-medium text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{messages.checkout.submittingCta}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{messages.checkout.submitCta}</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-brand-text">
                {messages.checkout.submitFootnoteMobile}
              </p>
            </div>
          </form>
        </section>

        {/* RIGHT COLUMN: Sticky Order Summary Card (5 cols on Desktop) */}
        <aside className="hidden lg:block lg:col-span-5 sticky top-28">
          <div className="bg-brand-surface rounded-xl p-6 shadow-sm space-y-5 border border-brand-surface">
            {/* Card Header */}
            <div className="flex items-baseline justify-between border-b border-brand-surface pb-3">
              <h2 className="font-serif text-lg uppercase text-brand-text tracking-[0.08em] font-normal">
                {messages.checkout.summaryTitle}
              </h2>
              <span className="text-[11px] uppercase tracking-wider bg-brand-white/80 px-2.5 py-0.5 rounded text-brand-text font-semibold">
                {messages.checkout.itemsBadge(totalItemsCount)}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 bg-brand-white p-3 rounded-lg shadow-xs"
                >
                  <div className="w-16 h-16 rounded bg-brand-surface overflow-hidden shrink-0">
                    <img
                      src={item.thumbnail || IMAGE_FALLBACKS.product}
                      alt={item.productTitle}
                      onError={handleImgError(IMAGE_FALLBACKS.product)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-brand-text truncate">
                      {item.productTitle}
                    </h3>
                    <p className="text-xs text-brand-text/80 mt-0.5">
                      Taille : <span className="font-medium text-brand-text">{item.variantTitle}</span>
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-brand-text">Qté : {item.quantity}</span>
                      <span className="text-xs font-semibold text-brand-text">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation Section */}
            <div className="space-y-2 pt-2 border-t border-brand-surface">
              <div className="flex items-baseline justify-between text-xs text-brand-text">
                <span>{messages.checkout.subtotalArticles}</span>
                <span className="font-medium text-brand-text">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-sm font-semibold text-brand-text block">
                    {messages.checkout.totalArticles}
                  </span>
                  <span className="text-[11px] text-brand-text/70">
                    {messages.checkout.withoutCourierFee}
                  </span>
                </div>
                <span className="text-xl font-semibold text-brand-text">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            {/* Delivery WhatsApp coordination notice */}
            <div className="bg-brand-surface p-3.5 rounded-lg flex items-start gap-2.5 shadow-xs">
              <MessageCircle className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-brand-text">
                  {messages.checkout.courierNoticeDelivery}
                </p>
                <p className="text-[11px] text-brand-text leading-snug">
                  {messages.checkout.courierNoticeDeliveryDesc}
                </p>
              </div>
            </div>

            {/* Cash / Orange Money on delivery reminder */}
            <div className="bg-brand-bg p-3 rounded-lg flex items-center justify-between px-3.5 border border-brand-surface/60">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-brand-text" />
                <span className="text-xs font-medium text-brand-text">
                  {messages.checkout.paymentOnDeliveryTitle}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className="w-full rounded min-h-[46px] bg-brand-primary hover:bg-brand-text text-brand-white text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer group"
              >
                {isSubmitting ? (
                  <span>{messages.checkout.submittingCta}</span>
                ) : (
                  <>
                    <span>{messages.checkout.submitCta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-brand-text mt-2 tracking-wide">
                {messages.checkout.submitFootnoteDesktop}
              </p>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
