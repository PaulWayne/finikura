"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle2, User, Phone, HelpCircle, MessageSquare } from "lucide-react";
import { messages } from "@/messages/fr";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: messages.validation.nameRequired }),
  phone: z
    .string()
    .min(8, { message: messages.validation.phoneRequired })
    .regex(/^[0-9\s]{8,12}$/, { message: messages.validation.phoneInvalid }),
  subject: z.string().min(1, { message: "Veuillez choisir un sujet" }),
  message: z
    .string()
    .min(5, { message: "Veuillez préciser votre demande (au moins 5 caractères)" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = messages.contactPage.form;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      subject: "sizes",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate swift serverless dispatch
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(94,82,69,0.05)] border border-[#EADCCC]/70">
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#5A6151] block">
          {t.eyebrow}
        </span>
        <h2 className="font-serif text-xl sm:text-2xl lg:text-[26px] uppercase font-normal text-[#5E5245] tracking-[0.08em] mt-1">
          <span className="hidden sm:inline">{t.title}</span>
          <span className="sm:hidden">{t.titleMobile}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#5E5245]/80 mt-2 leading-relaxed">
          <span className="hidden sm:inline">{t.desc}</span>
          <span className="sm:hidden">{t.descMobile}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6" noValidate>
        {/* Nom complet */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-full-name"
            className="block text-xs sm:text-[13px] font-medium text-[#231A10]"
          >
            {t.nameLabel} <span className="text-[#92452C]">*</span>
          </label>
          <div className="relative">
            <input
              id="contact-full-name"
              type="text"
              placeholder={t.namePlaceholder}
              {...register("fullName")}
              className={`w-full h-11 sm:h-12 px-4 rounded-xl bg-[#FFF8F4] text-[#231A10] text-sm placeholder:text-[#80756C]/50 border transition-all focus:outline-none focus:ring-2 focus:ring-[#8A7058]/30 ${
                errors.fullName ? "border-[#BA1A1A]" : "border-[#EADCCC] focus:border-[#8A7058]"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-[#BA1A1A] mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Numéro WhatsApp */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-phone"
            className="block text-xs sm:text-[13px] font-medium text-[#231A10]"
          >
            {t.phoneLabel} <span className="text-[#92452C]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm font-medium text-[#231A10] pointer-events-none select-none">
              +223
            </span>
            <input
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              placeholder={t.phonePlaceholder}
              {...register("phone")}
              className={`w-full h-11 sm:h-12 pl-16 pr-4 rounded-xl bg-[#FFF8F4] text-[#231A10] text-sm placeholder:text-[#80756C]/50 border transition-all focus:outline-none focus:ring-2 focus:ring-[#8A7058]/30 ${
                errors.phone ? "border-[#BA1A1A]" : "border-[#EADCCC] focus:border-[#8A7058]"
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="text-[11px] text-[#BA1A1A] mt-1">{errors.phone.message}</p>
          ) : (
            <p className="text-[11px] text-[#80756C] mt-0.5">{t.phoneHint}</p>
          )}
        </div>

        {/* Sujet de la démarche */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-subject"
            className="block text-xs sm:text-[13px] font-medium text-[#231A10]"
          >
            {t.subjectLabel} <span className="text-[#92452C]">*</span>
          </label>
          <div className="relative">
            <select
              id="contact-subject"
              {...register("subject")}
              className="w-full h-11 sm:h-12 px-4 pr-10 rounded-xl bg-[#FFF8F4] text-[#231A10] text-sm border border-[#EADCCC] focus:border-[#8A7058] focus:outline-none focus:ring-2 focus:ring-[#8A7058]/30 appearance-none cursor-pointer"
            >
              <option value="sizes">{t.subjectOptions.sizes}</option>
              <option value="delivery">{t.subjectOptions.delivery}</option>
              <option value="special">{t.subjectOptions.special}</option>
              <option value="other">{t.subjectOptions.other}</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756C]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block text-xs sm:text-[13px] font-medium text-[#231A10]"
          >
            {t.messageLabel} <span className="text-[#92452C]">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder={t.messagePlaceholder}
            {...register("message")}
            className={`w-full p-4 rounded-xl bg-[#FFF8F4] text-[#231A10] text-sm placeholder:text-[#80756C]/50 border transition-all resize-none focus:outline-none focus:ring-2 focus:ring-[#8A7058]/30 ${
              errors.message ? "border-[#BA1A1A]" : "border-[#EADCCC] focus:border-[#8A7058]"
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-[#BA1A1A] mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Bouton d'envoi & Feedback */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] h-12 rounded-xl text-white bg-[#8A7058] hover:bg-[#725A43] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.15em] shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>{t.submitting}</span>
            ) : (
              <>
                <span>{t.submitCta}</span>
                <Send className="w-4 h-4 stroke-[2]" />
              </>
            )}
          </button>

          {isSubmitted && (
            <div className="mt-4 p-4 rounded-xl bg-[#DEE5D1] text-[#171D11] text-xs sm:text-sm text-center font-medium border border-[#C2C9B6] animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5A6151] shrink-0" />
              <span>
                <span className="hidden sm:inline">{t.successMessage}</span>
                <span className="sm:hidden">{t.successMessageMobile}</span>
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
