"use client";
import Link from "next/link";

import React from "react";
import {
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Order } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { whatsappLink, orderConfirmationMessage } from "@/lib/whatsapp";
import { messages } from "@/messages/fr";
import { IMAGE_FALLBACKS, handleImgError } from "@/lib/images";

interface OrderConfirmationProps {
  order: Order;
  whatsappUrl?: string | null;
}

export function OrderConfirmation({ order, whatsappUrl }: OrderConfirmationProps) {
  const firstName = order.customer.fullName.split(" ")[0] || order.customer.fullName;
  const totalCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  const whatsappHref = whatsappLink(whatsappUrl, orderConfirmationMessage(order));

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 py-6 sm:py-10">
      {/* Centered Main Card */}
      <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(94,82,69,0.06)] border border-[#EADCCC]/60 p-6 sm:p-10 relative overflow-hidden flex flex-col items-center text-center">
        {/* Status Badge with Gentle Pulse */}
        <div className="inline-flex items-center gap-2 bg-[#DEE5D1] text-[#171D11] px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#5A6151] animate-pulse"></span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#42493A]">
            {messages.confirmation.badgeStatus}
          </span>
        </div>

        {/* Delicate Artisan Icon */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#DEE5D1]/60 rounded-full"></div>
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-xs">
            <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9 text-[#5A6151]" strokeWidth={1.75} />
          </div>
        </div>

        {/* Order Reference */}
        <p className="text-xs uppercase tracking-[0.2em] text-[#5E5245]/70 mb-1 font-medium">
          {messages.confirmation.orderRefLabel}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#231A10] font-normal tracking-[0.03em] mb-3">
          {messages.confirmation.orderNumberPrefix} {order.orderNumber}
        </h1>

        <div className="w-12 h-0.5 bg-[#F1E0CE] rounded-full mb-6"></div>

        {/* Warm Note Card */}
        <div className="w-full bg-[#FDEBDA] rounded-xl p-4 sm:p-6 mb-6 text-center border border-[#EADCCC]/40">
          <h2 className="font-serif text-xl sm:text-2xl text-[#231A10] mb-2 font-normal">
            {messages.confirmation.thankYouName(firstName)}
          </h2>
          <p className="text-xs sm:text-sm text-[#4E453D] leading-relaxed max-w-lg mx-auto">
            {messages.confirmation.messageDesktop}
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="w-full bg-[#FFF1E5] rounded-xl p-4 sm:p-5 mb-6 text-left border border-[#EADCCC]/60 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EADCCC]/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#8A7058]" />
              <span className="text-xs sm:text-sm font-medium text-[#231A10]">
                {messages.confirmation.piecesCount(totalCount)}
              </span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-[#705841]">
              {formatPrice(order.total)}
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-[#CA7154] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-medium text-[#231A10]">
                {messages.confirmation.destinationLabel} {order.shippingAddress.neighborhood}
              </span>
              <span className="text-[11px] text-[#5E5245]/80 mt-0.5">
                {messages.confirmation.deliveryTiming}
              </span>
              {order.shippingAddress.deliveryLandmarks && (
                <span className="text-[11px] text-[#80756C] italic mt-0.5">
                  « {order.shippingAddress.deliveryLandmarks} »
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm pt-1">
            <Banknote className="w-4 h-4 text-[#5A6151] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-medium text-[#231A10]">
                {messages.confirmation.paymentMethodText}
              </span>
              <span className="text-[11px] text-[#5E5245]/80 mt-0.5">
                {messages.confirmation.paymentMethodSubtext}
              </span>
            </div>
          </div>
        </div>

        {/* Artisan Highlight Banner */}
        <div className="w-full flex items-center gap-3.5 bg-[#F1E0CE]/70 rounded-xl p-3 sm:p-3.5 mb-6 text-left border border-[#EADCCC]/60">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-[#EADCCC]">
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80"
              alt="Atelier Fini Kura Bamako"
              onError={handleImgError(IMAGE_FALLBACKS.about)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[11px] uppercase tracking-wider text-[#92452C] font-semibold">
              {messages.confirmation.atelierHighlightTitle}
            </span>
            <p className="text-xs text-[#231A10] leading-snug mt-0.5">
              {messages.confirmation.atelierHighlightDesc}
            </p>
          </div>
        </div>

        {/* WhatsApp CTA Action */}
        {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto min-w-[280px] bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-medium text-xs sm:text-sm tracking-wide py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 group"
        >
          <svg
            className="w-5 h-5 fill-current shrink-0 transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.127-.521-1.615-.67-2.66-2.306-2.74-2.414-.08-.109-.649-.864-.649-1.648 0-.785.41-1.172.556-1.332.146-.16.32-.2.427-.2.106 0 .213.002.307.007.1.005.234-.038.366.28.138.334.472 1.152.513 1.236.041.085.068.184.013.295-.056.11-.083.18-.166.277-.082.098-.173.218-.248.293-.082.083-.169.172-.072.338.097.165.432.712.927 1.152.636.566 1.172.742 1.337.824.165.083.263.072.36-.041.098-.113.418-.487.53-.654.112-.167.225-.138.378-.083.153.055.97.458 1.137.541.167.083.278.125.32.194.041.069.041.402-.103.807zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.966-1.394A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
          <span className="font-semibold uppercase tracking-wider text-xs sm:text-sm">
            {messages.confirmation.whatsAppCta}
          </span>
        </a>
        )}

        <p className="text-[11px] sm:text-xs text-[#5E5245]/80 mt-3 max-w-md leading-relaxed">
          {messages.confirmation.whatsAppNotice}
        </p>

        {/* Separator */}
        <div className="w-full h-px bg-[#EADCCC]/60 my-6"></div>

        {/* Navigation Return Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#5E5245]">
          <Link
            href="/"
            className="hover:text-[#8A7058] transition-colors flex items-center gap-1.5 underline decoration-[#EADCCC] underline-offset-4 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{messages.confirmation.backToStore}</span>
          </Link>
          <span className="hidden sm:inline text-[#EADCCC]">•</span>
          <Link
            href="/categorie/filles"
            className="hover:text-[#8A7058] transition-colors flex items-center gap-1.5 underline decoration-[#EADCCC] underline-offset-4 font-medium"
          >
            <span>{messages.confirmation.discoverOtherCreations}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-[11px] text-[#80756C] mt-6 tracking-wide">
          {messages.confirmation.ethicalTag}
        </p>
      </div>
    </div>
  );
}
