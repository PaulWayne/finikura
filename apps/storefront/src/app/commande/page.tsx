import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { commerceService } from "@/lib/commerce";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PageFallback } from "@/components/layout/PageFallback";

export const metadata = {
  title: "Finaliser votre commande | Fini Kura Bamako",
  description: "Finalisez votre commande Fini Kura en quelques instants. Paiement à la réception à Bamako.",
};

async function CheckoutContent() {
  const cartId = (await cookies()).get("fk_cart_id")?.value ?? null;
  const cart = await commerceService.getCart(cartId);
  return <CheckoutForm cart={cart} />;
}

export default function CommandePage() {
  return (
    <div className="pt-6 md:pt-10 pb-16">
      <Suspense fallback={<PageFallback />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
