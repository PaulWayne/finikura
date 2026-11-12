"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MapPin, Phone, User } from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { checkoutSchema, CheckoutFormData } from "@/lib/validation/checkout";
import { placeOrderAction } from "@/app/actions/cart";
import { messages } from "@/messages/fr";
import { triggerCartUpdated, triggerCartToast } from "@/lib/cart-events";
import { loadContact, saveContact } from "@/lib/saved-contact";
import { CheckoutField, FieldLabel } from "./CheckoutField";
import { CHECKOUT_FORM_ID, useCheckoutState } from "./CheckoutState";

interface CheckoutFormProps {
  cart: Cart;
  /** Mobile-only notices and submit button, rendered at the end of the form. */
  children?: ReactNode;
}

const ICON = "w-4 h-4";

export function CheckoutForm({ cart, children }: CheckoutFormProps) {
  const router = useRouter();
  const { setIsSubmitting } = useCheckoutState();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", phone: "", neighborhood: "", deliveryLandmarks: "" },
    mode: "onTouched",
  });

  // Pre-fill with the details saved on this phone after a previous order.
  useEffect(() => {
    const saved = loadContact();
    if (saved) reset(saved);
  }, [reset]);

  const submittingRef = useRef(false);

  const onSubmit = async (data: CheckoutFormData) => {
    if (submittingRef.current) return; // guard against double tap
    submittingRef.current = true;
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await placeOrderAction(data);
      if (res.success && res.order) {
        saveContact(data);
        triggerCartUpdated({ ...cart, items: [], subtotal: 0, total: 0 });
        triggerCartToast(messages.checkout.orderPlacedToast(res.order.orderNumber));
        router.push(`/commande/confirmation/${res.order.id}`);
      } else {
        setServerError(res.error || messages.errors.placeOrder);
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : messages.errors.placeOrder);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const landmarksError = errors.deliveryLandmarks?.message;

  return (
    <form
      id={CHECKOUT_FORM_ID}
      method="post"
      onSubmit={(e) => handleSubmit(onSubmit)(e)}
      className="space-y-4 pt-1"
      noValidate
    >
      <CheckoutField
        id="fullName"
        label={messages.checkout.nameLabel}
        hint={messages.checkout.nameRequiredBadge}
        placeholder={messages.checkout.namePlaceholder}
        icon={<User className={ICON} />}
        registration={register("fullName")}
        error={errors.fullName?.message}
        autoComplete="name"
      />
      <CheckoutField
        id="phone"
        type="tel"
        label={messages.checkout.phoneLabel}
        hint={messages.checkout.phoneHelp}
        placeholder={messages.checkout.phonePlaceholder}
        icon={<Phone className={ICON} />}
        registration={register("phone")}
        error={errors.phone?.message}
        autoComplete="tel"
        className="tracking-wide"
      />
      <CheckoutField
        id="neighborhood"
        label={messages.checkout.neighborhoodLabel}
        hint={messages.checkout.neighborhoodHelp}
        placeholder={messages.checkout.neighborhoodPlaceholder}
        icon={<MapPin className={ICON} />}
        registration={register("neighborhood")}
        error={errors.neighborhood?.message}
        autoComplete="address-line1"
      />

      {/* Delivery landmarks: required, with a terracotta alert */}
      <div className="flex flex-col space-y-1.5">
        <FieldLabel
          htmlFor="deliveryLandmarks"
          label={messages.checkout.landmarksLabel}
          hint={messages.checkout.landmarksRequiredBadge}
        />
        <div className="relative">
          <textarea
            id="deliveryLandmarks"
            rows={2}
            {...register("deliveryLandmarks")}
            autoComplete="address-line2"
            aria-invalid={landmarksError ? true : undefined}
            aria-describedby={landmarksError ? "deliveryLandmarks-error" : undefined}
            placeholder={messages.checkout.landmarksPlaceholder}
            className={`w-full p-3.5 pr-10 rounded bg-brand-white text-brand-text text-sm shadow-xs border transition-all placeholder:text-brand-text/90 resize-none ${
              landmarksError
                ? "border-brand-terracotta bg-brand-terracotta/20 focus:ring-1 focus:ring-brand-terracotta"
                : "border-brand-surface focus:border-brand-primary"
            }`}
          />
          <AlertCircle
            className={`w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none ${
              landmarksError ? "text-brand-terracotta" : "text-brand-text"
            }`}
          />
        </div>
        {landmarksError ? (
          <div className="flex items-center gap-1.5 pt-0.5 text-brand-text">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-brand-terracotta" />
            <p id="deliveryLandmarks-error" role="alert" className="text-xs font-medium leading-tight">
              {landmarksError}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pt-0.5 text-brand-text">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <p className="text-[11px] leading-tight">{messages.checkout.landmarksHint}</p>
          </div>
        )}
      </div>

      {serverError && (
        <div className="p-3.5 rounded-lg bg-brand-terracotta/15 text-brand-text text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {children}
    </form>
  );
}
