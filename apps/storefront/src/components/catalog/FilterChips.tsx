import Link from "next/link";
import React from "react";
import { messages } from "@/messages/fr";
import { OCCASION_VALUES } from "@/lib/catalog-filters";

interface FilterChipsProps {
  categoryHandle: string;
  /** Sizes of the category, from the Medusa variants (FK-19). */
  ages: string[];
  selectedAge?: string;
  selectedOccasion?: string;
}

const OCCASION_LABELS: Record<(typeof OCCASION_VALUES)[number], string> = {
  "tous-les-jours": messages.catalog.occasions.everyday,
  fete: messages.catalog.occasions.party,
  ceremonie: messages.catalog.occasions.ceremony,
};

const OCCASION_OPTIONS = [
  { label: messages.catalog.filterAllOccasions, value: "" },
  ...OCCASION_VALUES.map((value) => ({ label: OCCASION_LABELS[value], value })),
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
  ages,
  selectedAge = "",
  selectedOccasion = "",
}: FilterChipsProps) {
  const basePath = `/categorie/${categoryHandle}`;
  const ageOptions = [
    { label: messages.catalog.filterAllAges, value: "" },
    ...ages.map((age) => ({ label: age, value: age })),
  ];

  return (
    <div className="w-full flex flex-col items-center gap-2 my-2 md:my-6">
      {/* Age Filters Row */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-2 md:px-0">
          {ageOptions.map((opt) => {
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
                className={`min-h-11 min-w-11 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-normal transition border select-none ${
                  isActive
                    ? "bg-brand-primary text-brand-white border-brand-primary"
                    : "bg-brand-bg text-brand-text border-brand-text/30 hover:border-brand-primary"
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
                className={`min-h-11 min-w-11 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-normal transition border select-none ${
                  isActive
                    ? "bg-brand-primary text-brand-white border-brand-primary"
                    : "bg-brand-bg text-brand-text border-brand-text/30 hover:border-brand-primary"
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
