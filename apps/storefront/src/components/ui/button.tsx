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
          "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-xs font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8A7058] disabled:pointer-events-none disabled:opacity-50 min-touch-btn tracking-[0.15em]",
          {
            "bg-[#8A7058] text-white hover:bg-[#725a43] shadow-sm":
              variant === "default",
            "border border-[#8A7058] bg-transparent text-[#5E5245] hover:bg-[#EADCCC]/40 hover:text-[#5E5245]":
              variant === "outline",
            "bg-[#EADCCC] text-[#5E5245] hover:bg-[#ded2c2]":
              variant === "secondary",
            "hover:bg-[#EADCCC]/30 text-[#5E5245]": variant === "ghost",
            "text-[#5E5245] underline-offset-4 hover:underline":
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
