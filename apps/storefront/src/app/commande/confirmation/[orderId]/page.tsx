import React, { Suspense } from "react";
import Link from "next/link";
import { ConfirmationSkeleton } from "@/components/layout/PageSkeletons";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { OrderConfirmationLimited } from "@/components/checkout/OrderConfirmationLimited";
import { readOrderIds } from "@/lib/order-access";

export const metadata = {
  title: messages.meta.confirmationTitle,
  description: messages.meta.confirmationDescription,
};

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }> | { orderId: string };
}

async function OrderConfirmationContent({
  params,
}: OrderConfirmationPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const orderId = resolvedParams.orderId;

  const [order, settings, ownOrderIds] = await Promise.all([
    commerceService.getOrderById(orderId),
    contentService.getGlobalSettings(),
    readOrderIds(),
  ]);

  if (!order) {
    return (
      <div className="bg-brand-bg pt-8 md:pt-24 pb-16 flex flex-col items-center px-2 text-center">
        <h1 className="font-serif text-2xl text-brand-text mb-3">
          {messages.confirmation.notFoundTitle}
        </h1>
        <p className="text-sm text-brand-text mb-6">
          {messages.confirmation.notFoundDesc}
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center px-6 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          {messages.confirmation.backToHome}
        </Link>
      </div>
    );
  }

  // Full details only on the browser that placed the order (cookie set by placeOrderAction).
  const isOwnOrder = ownOrderIds.includes(order.id);

  return (
    <div className="bg-brand-bg pt-2 md:pt-16 pb-16 flex justify-center">
      {isOwnOrder ? (
        <OrderConfirmation order={order} whatsappUrl={settings?.whatsappUrl} />
      ) : (
        <OrderConfirmationLimited orderNumber={order.orderNumber} />
      )}
    </div>
  );
}

export default function OrderConfirmationPage(props: OrderConfirmationPageProps) {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <OrderConfirmationContent {...props} />
    </Suspense>
  );
}
