import React from "react";
import { commerceService } from "@/src/lib/commerce";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Finaliser votre commande | Fini Kura Bamako",
  description:
    "Finalisez votre commande Fini Kura en quelques instants à Bamako. Paiement en espèces ou Orange Money à la réception en main propre.",
};

export default async function CommandePage() {
  const cart = await commerceService.getCart("cart_client_session");

  return (
    <main className="min-h-screen bg-[#FFF8F4] pt-24 md:pt-32 pb-16">
      <CheckoutForm cart={cart} />
    </main>
  );
}
