"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

/**
 * Mobile: the submit button stays fixed at the bottom of the screen, with the total.
 * It hides while the on-screen keyboard takes up the screen (the visual viewport shrinks),
 * so it never covers the field being typed in.
 */
export function MobileCheckoutBar({ totalLabel }: { totalLabel: string }) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => setIsKeyboardOpen(viewport.height < window.innerHeight * 0.75);
    viewport.addEventListener("resize", update);
    return () => viewport.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md border-t border-brand-surface px-4 pt-3 pb-safe shadow-[0_-4px_20px_rgba(63,55,47,0.08)] transition-transform duration-200 motion-reduce:transition-none ${
        isKeyboardOpen ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-[480px] mx-auto pb-2 space-y-1.5">
        <p className="flex items-baseline justify-between text-xs text-brand-text">
          <span>{messages.checkout.totalArticles}</span>
          <span className="text-base font-semibold">{totalLabel}</span>
        </p>
        <CheckoutSubmitButton variant="mobile" />
      </div>
    </div>
  );
}
