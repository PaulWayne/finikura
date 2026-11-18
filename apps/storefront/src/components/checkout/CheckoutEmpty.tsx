import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { messages } from "@/messages/fr";

export function CheckoutEmpty() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-surface/40 flex items-center justify-center mx-auto mb-4 text-brand-primary">
        <ShoppingBag className="w-8 h-8" />
      </div>
      {/* The page title when the cart is empty: the order form, and its own h1, are not shown. */}
      <h1 className="font-serif text-2xl md:text-3xl text-brand-text mb-2">
        {messages.checkout.emptyCartTitle}
      </h1>
      <p className="text-sm text-brand-text mb-6 max-w-md mx-auto">{messages.checkout.emptyCartDesc}</p>
      <Link
        href="/categorie/filles"
        className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary hover:bg-brand-text text-brand-white text-xs font-medium tracking-[0.15em] uppercase rounded shadow-sm transition"
      >
        {messages.checkout.emptyCartCta}
      </Link>
    </div>
  );
}
