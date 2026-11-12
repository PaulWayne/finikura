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
          "bg-brand-terracotta text-brand-white": variant === "terracotta",
          "bg-brand-blue text-brand-white": variant === "blue",
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
