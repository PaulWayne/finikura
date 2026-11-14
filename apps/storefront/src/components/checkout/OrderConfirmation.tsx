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
} from "lucide-react";
import { Order } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { whatsappLink, orderConfirmationMessage } from "@/lib/whatsapp";
import { messages } from "@/messages/fr";

interface OrderConfirmationProps {
  order: Order;
  whatsappUrl?: string | null;
}

export function OrderConfirmation({ order, whatsappUrl }: OrderConfirmationProps) {
  const firstName = order.customer.fullName.split(" ")[0] || order.customer.fullName;
  const totalCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  const whatsappHref = whatsappLink(whatsappUrl, orderConfirmationMessage(order));

  return (
    <div className="w-full max-w-[680px] mx-auto px-0 sm:px-4 pt-2 pb-6 sm:py-10">
      {/* Centered Main Card */}
      <div className="w-full bg-brand-white rounded-2xl shadow-[0_8px_30px_rgba(94,82,69,0.06)] border border-brand-surface/60 px-4 py-5 sm:p-10 relative overflow-hidden flex flex-col items-center text-center">
        {/* Status Badge with Gentle Pulse */}
        <div className="inline-flex items-center gap-2 bg-brand-announcement/20 text-brand-text px-4 py-1.5 rounded-full mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-text animate-pulse"></span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text">
            {messages.confirmation.badgeStatus}
          </span>
        </div>

        {/* Delicate Artisan Icon */}
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-5 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-announcement/60 rounded-full"></div>
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-white shadow-xs">
            <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9 text-brand-text" strokeWidth={1.75} />
          </div>
        </div>

        {/* Order Reference */}
        <p className="text-xs uppercase tracking-[0.2em] text-brand-text mb-1 font-medium">
          {messages.confirmation.orderRefLabel}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-text font-normal tracking-[0.03em] mb-3">
          {messages.confirmation.orderNumberPrefix} {order.orderNumber}
        </h1>

        <div className="w-12 h-0.5 bg-brand-surface rounded-full mb-4 sm:mb-6"></div>

        {/* Warm Note Card */}
        <div className="w-full bg-brand-surface rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center border border-brand-surface/40">
          <h2 className="font-serif text-xl sm:text-2xl text-brand-text mb-2 font-normal">
            {messages.confirmation.thankYouName(firstName)}
          </h2>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed max-w-lg mx-auto">
            {messages.confirmation.messageDesktop}
          </p>
        </div>

        {/* Order Summary Box */}
        {/* WhatsApp CTA: the last step of the order, placed before the details so it is seen first */}
        {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto min-w-[280px] min-h-14 bg-brand-text hover:bg-brand-primary active:scale-[0.99] text-brand-white font-medium text-sm tracking-wide py-4 px-8 rounded-xl shadow-lg ring-4 ring-brand-whatsapp/30 transition-all flex items-center justify-center gap-3 group"
        >
          <svg
            aria-hidden="true"
            className="w-7 h-7 p-1 rounded-full bg-brand-whatsapp fill-brand-white shrink-0 transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.127-.521-1.615-.67-2.66-2.306-2.74-2.414-.08-.109-.649-.864-.649-1.648 0-.785.41-1.172.556-1.332.146-.16.32-.2.427-.2.106 0 .213.002.307.007.1.005.234-.038.366.28.138.334.472 1.152.513 1.236.041.085.068.184.013.295-.056.11-.083.18-.166.277-.082.098-.173.218-.248.293-.082.083-.169.172-.072.338.097.165.432.712.927 1.152.636.566 1.172.742 1.337.824.165.083.263.072.36-.041.098-.113.418-.487.53-.654.112-.167.225-.138.378-.083.153.055.97.458 1.137.541.167.083.278.125.32.194.041.069.041.402-.103.807zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.966-1.394A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
          <span className="font-semibold uppercase tracking-wider text-sm">
            {messages.confirmation.whatsAppCta}
          </span>
        </a>
        )}

        <p className="text-xs text-brand-text mt-3 mb-5 max-w-md leading-relaxed">
          {messages.confirmation.whatsAppNotice}
        </p>

        <div className="w-full bg-brand-bg rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 text-left border border-brand-surface/60 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-brand-surface/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-brand-primary" />
              <span className="text-xs sm:text-sm font-medium text-brand-text">
                {messages.confirmation.piecesCount(totalCount)}
              </span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-brand-text">
              {formatPrice(order.total)}
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-medium text-brand-text">
                {messages.confirmation.destinationLabel} {order.shippingAddress.neighborhood}
              </span>
              <span className="text-[11px] text-brand-text mt-0.5">
                {messages.checkout.courierNoticeDelivery}
              </span>
              {order.shippingAddress.deliveryLandmarks && (
                <span className="text-[11px] text-brand-text italic mt-0.5">
                  « {order.shippingAddress.deliveryLandmarks} »
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm pt-1">
            <Banknote className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-medium text-brand-text">
                {messages.confirmation.paymentMethodText}
              </span>
            </div>
          </div>
        </div>


        {/* Separator */}
        <div className="w-full h-px bg-brand-surface/60 my-6"></div>

        {/* Navigation Return Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-brand-text">
          <Link
            href="/"
            className="hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 underline decoration-brand-surface underline-offset-4 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{messages.confirmation.backToStore}</span>
          </Link>
          <span className="hidden sm:inline text-brand-surface">•</span>
          <Link
            href="/categorie/filles"
            className="hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 underline decoration-brand-surface underline-offset-4 font-medium"
          >
            <span>{messages.confirmation.discoverOtherCreations}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
