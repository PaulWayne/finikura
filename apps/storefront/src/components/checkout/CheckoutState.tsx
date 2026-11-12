"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { messages } from "@/messages/fr";

export const CHECKOUT_FORM_ID = "checkout-form";

type CheckoutState = { isSubmitting: boolean; setIsSubmitting: (value: boolean) => void };
const CheckoutContext = createContext<CheckoutState>({ isSubmitting: false, setIsSubmitting: () => {} });

/** Shares the submitting state between the form and the submit buttons placed outside it. */
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <CheckoutContext.Provider value={{ isSubmitting, setIsSubmitting }}>{children}</CheckoutContext.Provider>
  );
}

export const useCheckoutState = () => useContext(CheckoutContext);

/** Submit button tied to the checkout form by its id, so it can live in the summary card. */
export function CheckoutSubmitButton({ variant }: { variant: "mobile" | "desktop" }) {
  const { isSubmitting } = useCheckoutState();
  const mobile = variant === "mobile";
  return (
    <button
      type="submit"
      form={CHECKOUT_FORM_ID}
      disabled={isSubmitting}
      className={
        mobile
          ? "w-full min-h-[46px] rounded-lg bg-brand-primary hover:bg-brand-text active:scale-[0.99] text-brand-white font-medium text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
          : "w-full rounded min-h-[46px] bg-brand-primary hover:bg-brand-text text-brand-white text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer group"
      }
    >
      {isSubmitting ? (
        <span>{messages.checkout.submittingCta}</span>
      ) : mobile ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>{messages.checkout.submitCta}</span>
        </>
      ) : (
        <>
          <span>{messages.checkout.submitCta}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
