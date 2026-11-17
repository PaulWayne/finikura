import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { commerceService } from "@/lib/commerce";
import { CheckoutEmpty } from "@/components/checkout/CheckoutEmpty";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { CheckoutSkeleton } from "@/components/layout/PageSkeletons";

export const metadata = {
  title: "Finaliser votre commande | Fini Kura Bamako",
  description: "Finalisez votre commande Fini Kura en quelques instants. Paiement à la réception à Bamako.",
};

async function CheckoutContent() {
  const cartId = (await cookies()).get("fk_cart_id")?.value ?? null;
  const cart = await commerceService.getCart(cartId);
  return cart.items.length === 0 ? <CheckoutEmpty /> : <CheckoutView cart={cart} />;
}

export default function CommandePage() {
  return (
    <div className="pt-0 md:pt-10 pb-16">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
