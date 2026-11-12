import * as React from "react";
import { cn } from "@/src/lib/utils";

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
          "bg-[#CA7154] text-white": variant === "terracotta",
          "bg-[#97AFC4] text-white": variant === "blue",
          "bg-[#8A7058] text-white": variant === "taupe",
          "bg-[#EADCCC] text-[#5E5245]": variant === "cream",
          "border border-[#5E5245]/30 text-[#5E5245] bg-transparent":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
