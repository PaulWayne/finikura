"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";

/** Collapsible order summary shown above the form on mobile. The item list comes from the server. */
export function MobileSummaryAccordion({ label, children }: { label: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lg:hidden w-full bg-brand-surface rounded-xl overflow-hidden shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left bg-brand-surface hover:bg-brand-surface transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ShoppingBag className="w-5 h-5 text-brand-primary shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-brand-text truncate">{label}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-brand-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && children}
    </div>
  );
}
