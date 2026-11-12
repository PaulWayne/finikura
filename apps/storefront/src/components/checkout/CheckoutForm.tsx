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
        <div className="w-16 h-16 rounded-full bg-[#EADCCC]/40 flex items-center justify-center mx-auto mb-4 text-[#8A7058]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl uppercase text-[#5E5245] mb-2 tracking-[0.05em]">
          {messages.checkout.emptyCartTitle}
        </h2>
        <p className="text-sm text-[#5E5245]/80 mb-6 max-w-md mx-auto">
          {messages.checkout.emptyCartDesc}
        </p>
        <Link
          href="/categorie/filles"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#8A7058] hover:bg-[#78614b] text-white text-xs font-medium tracking-[0.15em] uppercase rounded shadow-sm transition"
        >
          {messages.checkout.emptyCartCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
      {/* Breadcrumb & Top Indicator (Desktop & Tablet) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-3 border-b border-[#EADCCC]/50 mb-8">
        <nav
          aria-label="Fil d'Ariane Commande"
          className="flex items-center space-x-2 text-xs text-[#5E5245]/70"
        >
          <Link
            href="/"
            className="hover:text-[#CA7154] transition-colors"
          >
            {messages.checkout.breadcrumbPanier}
          </Link>
          <span>/</span>
          <span className="text-[#8A7058] font-medium">
            {messages.checkout.breadcrumbFinalisation}
          </span>
          <span>/</span>
          <span className="text-[#80756C]/60">{messages.checkout.breadcrumbConfirmation}</span>
        </nav>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FDEBDA] text-[#705841] text-xs font-medium">
          <Truck className="w-4 h-4 text-[#8A7058]" />
          <span>{messages.checkout.topDeliveryBadge}</span>
        </div>
      </div>

      {/* Main Form container: 2-column layout on Desktop, single column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Express Checkout Form without account (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          {/* Header Section */}
          <div className="space-y-1.5 text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-[#5A6151] font-semibold block">
              <span className="hidden sm:inline">{messages.checkout.stepEyebrowDesktop}</span>
              <span className="sm:hidden">{messages.checkout.stepEyebrowMobile}</span>
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] uppercase text-[#5E5245] tracking-[0.06em] leading-tight">
              <span className="hidden sm:inline">{messages.checkout.titleDesktop}</span>
              <span className="sm:hidden">{messages.checkout.titleMobile}</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5E5245]/80 pt-1 leading-relaxed">
              <span className="hidden sm:inline">{messages.checkout.subtitleDesktop}</span>
              <span className="sm:hidden">{messages.checkout.subtitleMobile}</span>
            </p>
          </div>

          {/* Mobile Collapsible Order Summary Accordion (Mockup mobile 390px) */}
          <div className="lg:hidden w-full bg-[#FDEBDA] rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              aria-expanded={isMobileSummaryOpen}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left focus:outline-none bg-[#FDEBDA] hover:bg-[#F7E5D4] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingBag className="w-5 h-5 text-[#8A7058] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#705841] truncate">
                  {messages.checkout.seeItemsAccordion(
                    totalItemsCount,
                    formatPrice(cart.total)
                  )}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#8A7058] transition-transform duration-300 ${
                  isMobileSummaryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileSummaryOpen && (
              <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5 bg-[#FDEBDA]/70 border-t border-[#EADCCC]/40">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white shadow-xs"
                  >
                    <img
                      src={item.thumbnail || IMAGE_FALLBACKS.product}
                      alt={item.productTitle}
                      onError={handleImgError(IMAGE_FALLBACKS.product)}
                      className="w-14 h-14 rounded-md object-cover shrink-0 bg-[#F7E5D4]"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-[#5E5245] truncate">
                        {item.productTitle}
                      </p>
                      <p className="text-[11px] text-[#5E5245]/70">
                        Taille : {item.variantTitle} · Qté : {item.quantity}
                      </p>
                      <span className="text-xs font-semibold text-[#8A7058] mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-baseline justify-between pt-2 px-1 text-xs text-[#5E5245]">
                  <span>{messages.checkout.subtotalArticlesMobile}</span>
                  <span className="font-semibold text-sm text-[#705841]">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Reassurance Banner */}
          <div className="bg-[#F7E5D4] p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#5A6151] mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <h2 className="text-xs sm:text-sm font-medium text-[#231A10]">
                {messages.checkout.reassuranceTitle}
              </h2>
              <p className="text-xs text-[#4E453D] leading-relaxed">
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
                className="text-xs uppercase tracking-wider text-[#231A10] font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.nameLabel}{" "}
                  <span className="text-[#CA7154]">*</span>
                </span>
                <span className="text-[#80756C] normal-case tracking-normal text-[11px]">
                  {messages.checkout.nameRequiredBadge}
                </span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  placeholder={messages.checkout.namePlaceholder}
                  className={`w-full h-12 px-4 pr-10 rounded bg-white text-[#231A10] text-sm shadow-xs border transition-all placeholder:text-[#80756C]/50 focus:outline-none ${
                    errors.fullName
                      ? "border-[#CA7154] focus:ring-1 focus:ring-[#CA7154]"
                      : "border-[#EADCCC] focus:border-[#8A7058]"
                  }`}
                />
                <User className="w-4 h-4 text-[#5A6151] absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-[#CA7154] font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName.message}</span>
                </p>
              )}
            </div>

            {/* Field 2: Phone */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="phone"
                className="text-xs uppercase tracking-wider text-[#231A10] font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.phoneLabel}{" "}
                  <span className="text-[#CA7154]">*</span>
                </span>
                <span className="text-[#5A6151] normal-case tracking-normal text-[11px]">
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
                  className={`w-full h-12 px-4 pr-10 rounded bg-white text-[#231A10] text-sm tracking-wide shadow-xs border transition-all placeholder:text-[#80756C]/50 focus:outline-none ${
                    errors.phone
                      ? "border-[#CA7154] focus:ring-1 focus:ring-[#CA7154]"
                      : "border-[#EADCCC] focus:border-[#8A7058]"
                  }`}
                />
                <Phone className="w-4 h-4 text-[#5A6151] absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.phone && (
                <p className="text-xs text-[#CA7154] font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone.message}</span>
                </p>
              )}
            </div>

            {/* Field 3: Bamako Neighborhood */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="neighborhood"
                className="text-xs uppercase tracking-wider text-[#231A10] font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.neighborhoodLabel}{" "}
                  <span className="text-[#CA7154]">*</span>
                </span>
                <span className="text-[#80756C] normal-case tracking-normal text-[11px]">
                  {messages.checkout.neighborhoodHelp}
                </span>
              </label>
              <div className="relative">
                <input
                  id="neighborhood"
                  type="text"
                  {...register("neighborhood")}
                  placeholder={messages.checkout.neighborhoodPlaceholder}
                  className={`w-full h-12 px-4 pr-10 rounded bg-white text-[#231A10] text-sm shadow-xs border transition-all placeholder:text-[#80756C]/50 focus:outline-none ${
                    errors.neighborhood
                      ? "border-[#CA7154] focus:ring-1 focus:ring-[#CA7154]"
                      : "border-[#EADCCC] focus:border-[#8A7058]"
                  }`}
                />
                <MapPin className="w-4 h-4 text-[#5A6151] absolute right-3.5 top-4 pointer-events-none" />
              </div>
              {errors.neighborhood && (
                <p className="text-xs text-[#CA7154] font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.neighborhood.message}</span>
                </p>
              )}
            </div>

            {/* Field 4: Delivery Landmarks (Required, with terracotta alert) */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="deliveryLandmarks"
                className="text-xs uppercase tracking-wider text-[#231A10] font-medium flex items-center justify-between"
              >
                <span>
                  {messages.checkout.landmarksLabel}{" "}
                  <span className="text-[#CA7154]">*</span>
                </span>
                <span className="text-[#CA7154] font-medium normal-case tracking-normal text-[11px]">
                  {messages.checkout.landmarksRequiredBadge}
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="deliveryLandmarks"
                  rows={2}
                  {...register("deliveryLandmarks")}
                  placeholder={messages.checkout.landmarksPlaceholder}
                  className={`w-full p-3.5 pr-10 rounded bg-white text-[#231A10] text-sm shadow-xs border transition-all placeholder:text-[#80756C]/50 resize-none focus:outline-none ${
                    errors.deliveryLandmarks
                      ? "border-[#CA7154] bg-[#FFDAD6]/20 focus:ring-1 focus:ring-[#CA7154]"
                      : "border-[#EADCCC] focus:border-[#8A7058]"
                  }`}
                />
                <AlertCircle
                  className={`w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none ${
                    errors.deliveryLandmarks ? "text-[#CA7154]" : "text-[#80756C]/40"
                  }`}
                />
              </div>

              {/* Dedicated terracotta warning notice */}
              {errors.deliveryLandmarks ? (
                <div className="flex items-center gap-1.5 pt-0.5 text-[#CA7154]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-medium leading-tight">
                    {errors.deliveryLandmarks.message}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pt-0.5 text-[#80756C]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    Important pour guider le coursier sans appel inutile à Bamako.
                  </p>
                </div>
              )}
            </div>


            {/* Server Error feedback if any */}
            {serverError && (
              <div className="p-3.5 rounded-lg bg-[#FFDAD6] text-[#93000A] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Mobile Financial Summary & Submit Button (visible on mobile only inside the form flow) */}
            <div className="lg:hidden pt-4 space-y-4">
              <div className="bg-[#FDEBDA] p-4 rounded-xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#F7E5D4] flex items-center justify-center shrink-0 text-[#8A7058]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-[#231A10]">
                    {messages.checkout.courierNoticeMobile}
                  </p>
                  <p className="text-[11px] text-[#4E453D] mt-0.5">
                    {messages.checkout.courierNoticeMobileDesc}
                  </p>
                </div>
              </div>

              <div className="bg-[#DEE5D1]/50 p-4 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#DEE5D1] flex items-center justify-center shrink-0 text-[#5A6151]">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-[#5A6151]">
                    {messages.checkout.paymentOnDeliveryTitle}
                  </p>
                  <p className="text-[11px] text-[#4E453D] mt-0.5">
                    {messages.checkout.paymentOnDeliveryDesc}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[46px] rounded-lg bg-[#8A7058] hover:bg-[#78614b] active:scale-[0.99] text-white font-medium text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
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

              <p className="text-center text-[11px] text-[#5E5245]">
                {messages.checkout.submitFootnoteMobile}
              </p>
            </div>
          </form>
        </section>

        {/* RIGHT COLUMN: Sticky Order Summary Card (5 cols on Desktop) */}
        <aside className="hidden lg:block lg:col-span-5 sticky top-28">
          <div className="bg-[#F1E0CE] rounded-xl p-6 shadow-sm space-y-5 border border-[#EADCCC]">
            {/* Card Header */}
            <div className="flex items-baseline justify-between border-b border-[#EADCCC] pb-3">
              <h2 className="font-serif text-lg uppercase text-[#5E5245] tracking-[0.08em] font-normal">
                {messages.checkout.summaryTitle}
              </h2>
              <span className="text-[11px] uppercase tracking-wider bg-white/80 px-2.5 py-0.5 rounded text-[#705841] font-semibold">
                {messages.checkout.itemsBadge(totalItemsCount)}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 bg-white p-3 rounded-lg shadow-xs"
                >
                  <div className="w-16 h-16 rounded bg-[#F7E5D4] overflow-hidden shrink-0">
                    <img
                      src={item.thumbnail || IMAGE_FALLBACKS.product}
                      alt={item.productTitle}
                      onError={handleImgError(IMAGE_FALLBACKS.product)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#231A10] truncate">
                      {item.productTitle}
                    </h3>
                    <p className="text-xs text-[#5E5245]/80 mt-0.5">
                      Taille : <span className="font-medium text-[#231A10]">{item.variantTitle}</span>
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-[#80756C]">Qté : {item.quantity}</span>
                      <span className="text-xs font-semibold text-[#705841]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation Section */}
            <div className="space-y-2 pt-2 border-t border-[#EADCCC]">
              <div className="flex items-baseline justify-between text-xs text-[#4E453D]">
                <span>{messages.checkout.subtotalArticles}</span>
                <span className="font-medium text-[#231A10]">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-sm font-semibold text-[#231A10] block">
                    {messages.checkout.totalArticles}
                  </span>
                  <span className="text-[11px] text-[#5E5245]/70">
                    {messages.checkout.withoutCourierFee}
                  </span>
                </div>
                <span className="text-xl font-semibold text-[#705841]">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            {/* Delivery WhatsApp coordination notice */}
            <div className="bg-[#F7E5D4] p-3.5 rounded-lg flex items-start gap-2.5 shadow-xs">
              <MessageCircle className="w-4 h-4 text-[#5A6151] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-[#231A10]">
                  {messages.checkout.courierNoticeDelivery}
                </p>
                <p className="text-[11px] text-[#4E453D] leading-snug">
                  {messages.checkout.courierNoticeDeliveryDesc}
                </p>
              </div>
            </div>

            {/* Cash / Orange Money on delivery reminder */}
            <div className="bg-[#FFF1E5] p-3 rounded-lg flex items-center justify-between px-3.5 border border-[#EADCCC]/60">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#705841]" />
                <span className="text-xs font-medium text-[#231A10]">
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
                className="w-full rounded min-h-[46px] bg-[#8A7058] hover:bg-[#78614b] text-white text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer group"
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
              <p className="text-center text-[11px] text-[#80756C] mt-2 tracking-wide">
                {messages.checkout.submitFootnoteDesktop}
              </p>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
