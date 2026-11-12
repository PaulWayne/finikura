import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "terracotta" | "blue" | "taupe" | "cream" | "outline";
}

function Badge({
  className,
  variant = "terracotta",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-[10px] font-medium tracking-[0.15em] uppercase shadow-xs select-none transition-colors",
        {
          // Accent colours fail AA as text backgrounds: light fill, brown text, coloured edge.
          "bg-brand-terracotta/15 text-brand-text border-l-2 border-brand-terracotta": variant === "terracotta",
          "bg-brand-blue/20 text-brand-text border-l-2 border-brand-blue": variant === "blue",
          "bg-brand-primary text-brand-white": variant === "taupe",
          "bg-brand-surface text-brand-text": variant === "cream",
          "border border-brand-text/30 text-brand-text bg-transparent":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
