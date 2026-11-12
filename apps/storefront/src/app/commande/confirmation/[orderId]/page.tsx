import React, { Suspense } from "react";
import Link from "next/link";
import { PageFallback } from "@/components/layout/PageFallback";
import { commerceService } from "@/lib/commerce";
import { contentService } from "@/lib/content";
import { messages } from "@/messages/fr";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

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

  const [order, settings] = await Promise.all([
    commerceService.getOrderById(orderId),
    contentService.getGlobalSettings(),
  ]);

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-16 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-2xl text-brand-text uppercase mb-3">
          Commande introuvable
        </h1>
        <p className="text-sm text-brand-text mb-6">
          Nous n&apos;avons pas pu trouver de commande correspondant à cette référence.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          Retourner à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-16 flex items-center justify-center">
      <OrderConfirmation order={order} whatsappUrl={settings?.whatsappUrl} />
    </div>
  );
}

export default function OrderConfirmationPage(props: OrderConfirmationPageProps) {
  return (
    <Suspense fallback={<PageFallback />}>
      <OrderConfirmationContent {...props} />
    </Suspense>
  );
}
