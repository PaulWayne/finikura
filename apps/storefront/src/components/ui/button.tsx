import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-xs font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 tracking-[0.15em]",
          {
            "bg-brand-primary text-brand-white hover:bg-brand-text shadow-sm":
              variant === "default",
            "border border-brand-primary bg-transparent text-brand-text hover:bg-brand-surface/40 hover:text-brand-text":
              variant === "outline",
            "bg-brand-surface text-brand-text hover:bg-brand-surface":
              variant === "secondary",
            "hover:bg-brand-surface/30 text-brand-text": variant === "ghost",
            "text-brand-text underline-offset-4 hover:underline":
              variant === "link",
            "h-11 px-6 py-2.5": size === "default",
            "h-9 rounded-[3px] px-3 text-[11px]": size === "sm",
            "h-12 px-8 text-sm": size === "lg",
            "h-11 w-11 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
