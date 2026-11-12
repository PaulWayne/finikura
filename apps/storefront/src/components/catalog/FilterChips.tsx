import Link from "next/link";
import React from "react";
import { messages } from "@/messages/fr";

interface FilterChipsProps {
  categoryHandle: string;
  selectedAge?: string;
  selectedOccasion?: string;
  onFilterChange?: (age?: string, occasion?: string) => void;
}

const AGE_OPTIONS = [
  { label: messages.catalog.filterAllAges, value: "" },
  { label: "3-4 ans", value: "3-4" },
  { label: "5-6 ans", value: "5-6" },
  { label: "7-8 ans", value: "7-8" },
  { label: "9-10 ans", value: "9-10" },
  { label: "11-12 ans", value: "11-12" },
  { label: "13-14 ans", value: "13-14" },
];

const OCCASION_OPTIONS = [
  { label: messages.catalog.filterAllOccasions, value: "" },
  { label: "Tous les jours", value: "tous-les-jours" },
  { label: "Fête", value: "fete" },
  { label: "Cérémonie", value: "ceremonie" },
];

function buildQuery(basePath: string, age?: string, occasion?: string): string {
  const params = new URLSearchParams();
  if (age) params.set("age", age);
  if (occasion) params.set("occasion", occasion);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function FilterChips({
  categoryHandle,
  selectedAge = "",
  selectedOccasion = "",
  onFilterChange,
}: FilterChipsProps) {
  const basePath = `/categorie/${categoryHandle}`;


  return (
    <div className="w-full flex flex-col items-center gap-2.5 my-6">
      {/* Age Filters Row */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-2 md:px-0">
          {AGE_OPTIONS.map((opt) => {
            const isActive =
              opt.value === "" ? !selectedAge : selectedAge === opt.value;
            const targetUrl = buildQuery(
              basePath,
              opt.value || undefined,
              selectedOccasion || undefined
            );

            return (
              <Link
                key={opt.label}
                href={targetUrl}
                scroll={false}
                className={`min-touch-btn inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-normal tracking-wide transition border shadow-xs select-none ${
                  isActive
                    ? "bg-brand-primary text-brand-white border-brand-primary"
                    : "bg-brand-bg text-brand-text border-brand-surface hover:border-brand-primary/50 hover:bg-brand-surface/30"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Occasion Filters Row */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-2 md:px-0">
          {OCCASION_OPTIONS.map((opt) => {
            const isActive =
              opt.value === ""
                ? !selectedOccasion
                : selectedOccasion === opt.value;
            const targetUrl = buildQuery(
              basePath,
              selectedAge || undefined,
              opt.value || undefined
            );

            return (
              <Link
                key={opt.label}
                href={targetUrl}
                scroll={false}
                className={`min-touch-btn inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-normal tracking-wide transition border shadow-xs select-none ${
                  isActive
                    ? "bg-brand-primary text-brand-white border-brand-primary"
                    : "bg-brand-bg text-brand-text border-brand-surface hover:border-brand-primary/50 hover:bg-brand-surface/30"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
