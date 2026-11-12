import React from "react";
import { commerceService } from "@/src/lib/commerce";
import { contentService } from "@/src/lib/content";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata = {
  title: "Confirmation de commande | Fini Kura Bamako",
  description:
    "Votre commande a été enregistrée avec succès auprès de notre atelier Fini Kura à Bamako.",
};

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }> | { orderId: string };
}

export default async function OrderConfirmationPage({
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
      <main className="min-h-screen bg-[#FFF8F4] pt-24 md:pt-32 pb-16 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-2xl text-[#5E5245] uppercase mb-3">
          Commande introuvable
        </h1>
        <p className="text-sm text-[#5E5245]/80 mb-6">
          Nous n&apos;avons pas pu trouver de commande correspondant à cette référence.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] bg-[#8A7058] text-white text-xs font-medium uppercase tracking-[0.15em]"
        >
          Retourner à l&apos;accueil
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F4] pt-24 md:pt-32 pb-16 flex items-center justify-center">
      <OrderConfirmation order={order} whatsappUrl={settings?.whatsappUrl} />
    </main>
  );
}
