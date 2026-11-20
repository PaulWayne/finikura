import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";

const LABEL = "text-xs uppercase tracking-wider text-brand-text font-medium flex items-center justify-between";

/** Label with the required star and a short hint on the right. */
export function FieldLabel({ htmlFor, label, hint }: { htmlFor: string; label: string; hint: string }) {
  return (
    <label htmlFor={htmlFor} className={LABEL}>
      <span>
        {label} <span className="text-brand-text">*</span>
      </span>
      <span className="text-brand-text normal-case tracking-normal text-[11px]">{hint}</span>
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="text-xs text-brand-error font-medium flex items-center gap-1 pt-0.5">
      <AlertCircle aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-brand-error" />
      <span>{message}</span>
    </p>
  );
}

interface CheckoutFieldProps {
  id: string;
  label: string;
  hint: string;
  placeholder: string;
  icon: ReactNode;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: "text" | "tel";
  autoComplete: string;
  /** Longest text the field accepts: the browser stops the typing there. */
  maxLength: number;
  className?: string;
  /** Fixed text before the input, for example the +223 country code. */
  prefix?: string;
}

/** One-line text field of the checkout form. */
export function CheckoutField({
  id,
  label,
  hint,
  placeholder,
  icon,
  registration,
  error,
  type = "text",
  autoComplete,
  maxLength,
  className = "",
  prefix,
}: CheckoutFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col space-y-1.5">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <div className="relative flex items-center">
        {prefix && (
          <span aria-hidden="true" className="absolute left-4 text-base text-brand-text font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          inputMode={type === "tel" ? "tel" : undefined}
          {...registration}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={placeholder}
          className={`w-full h-12 ${prefix ? "pl-16" : "pl-4"} pr-10 rounded bg-brand-white text-brand-text text-base shadow-xs border transition-all placeholder:text-brand-text/90 ${className} ${
            error
              ? "border-brand-error focus:ring-1 focus:ring-brand-error"
              : "border-brand-surface focus:border-brand-primary"
          }`}
        />
        <span className="absolute right-3.5 top-4 flex pointer-events-none text-brand-text">{icon}</span>
      </div>
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}
