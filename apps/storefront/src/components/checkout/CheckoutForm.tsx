"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MapPin, Phone, User } from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { CHECKOUT_LIMITS, checkoutSchema, CheckoutFormData } from "@/lib/validation/checkout";
import { placeOrderAction } from "@/app/actions/cart";
import { formatPhoneInput } from "@/lib/phone";
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
  const serverErrorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!serverError) return;
    serverErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    serverErrorRef.current?.focus({ preventScroll: true });
  }, [serverError]);

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
    // The +223 prefix is shown outside the field: only the 8 digits go in.
    if (saved) reset({ ...saved, phone: formatPhoneInput(saved.phone.slice(-8)) });
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
        trackEvent(ANALYTICS_EVENTS.orderPlaced);
        saveContact(data);
        triggerCartUpdated({ ...cart, items: [], subtotal: 0, total: 0 });
        triggerCartToast(messages.checkout.orderPlacedToast(res.order.orderNumber));
        router.push(`/commande/confirmation/${res.order.id}`);
      } else {
        setServerError(res.error || messages.errors.placeOrder);
      }
    } catch (err: unknown) {
      // The action could not be reached (network): never show the browser's technical message.
      console.error(err);
      setServerError(messages.errors.placeOrder);
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
      {/* Refusal from the shop (for example the last piece just sold): shown at the top
          of the form and brought into view, so it cannot be missed below the button. */}
      {serverError && (
        <div
          ref={serverErrorRef}
          role="alert"
          tabIndex={-1}
          className="scroll-mt-24 p-4 rounded-xl bg-brand-error text-brand-white flex items-start gap-3 shadow-md outline-none focus-visible:ring-4 focus-visible:ring-brand-error/40"
        >
          <AlertCircle aria-hidden="true" className="w-6 h-6 shrink-0" />
          <div className="space-y-1">
            <p className="text-base font-semibold">{messages.checkout.orderRefusedTitle}</p>
            <p className="text-sm">{serverError}</p>
          </div>
        </div>
      )}
      <CheckoutField
        id="fullName"
        label={messages.checkout.nameLabel}
        hint={messages.checkout.nameRequiredBadge}
        placeholder={messages.checkout.namePlaceholder}
        icon={<User className={ICON} />}
        registration={register("fullName")}
        error={errors.fullName?.message}
        autoComplete="name"
        maxLength={CHECKOUT_LIMITS.fullName}
      />
      <CheckoutField
        id="phone"
        type="tel"
        label={messages.checkout.phoneLabel}
        hint={messages.checkout.phoneHelp}
        placeholder={messages.checkout.phonePlaceholder}
        icon={<Phone className={ICON} />}
        registration={register("phone", {
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            e.target.value = formatPhoneInput(e.target.value);
          },
        })}
        error={errors.phone?.message}
        autoComplete="tel-national"
        maxLength={CHECKOUT_LIMITS.phone}
        prefix="+223"
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
        maxLength={CHECKOUT_LIMITS.neighborhood}
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
            maxLength={CHECKOUT_LIMITS.deliveryLandmarks}
            aria-invalid={landmarksError ? true : undefined}
            aria-describedby={landmarksError ? "deliveryLandmarks-error" : undefined}
            placeholder={messages.checkout.landmarksPlaceholder}
            className={`w-full p-3.5 pr-10 rounded bg-brand-white text-brand-text text-base shadow-xs border transition-all placeholder:text-brand-text/90 resize-none ${
              landmarksError
                ? "border-brand-error focus:ring-1 focus:ring-brand-error"
                : "border-brand-surface focus:border-brand-primary"
            }`}
          />
          <AlertCircle
            className={`w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none ${
              landmarksError ? "text-brand-error" : "text-brand-text"
            }`}
          />
        </div>
        {landmarksError ? (
          <div className="flex items-center gap-1.5 pt-0.5 text-brand-text">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-brand-error" />
            <p id="deliveryLandmarks-error" role="alert" className="text-xs text-brand-error font-medium leading-tight">
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

      {children}
    </form>
  );
}
