"use client";
import { useId, useState } from "react";
import type { SizeGuideRow } from "@/lib/content/types";
import { adviseSize, heightRanges } from "@/lib/size-advice";
import { messages } from "@/messages/fr";

interface HeightAdvisorProps {
  rows: SizeGuideRow[];
  /** Called with the suggested row, so the table can highlight it. */
  onAdvice: (row: SizeGuideRow | null) => void;
  /** Selects the suggested size on the product page; absent on pages without a product. */
  onChoose?: (row: SizeGuideRow) => void;
  /** Whether the product sells this size in stock. */
  isAvailable?: (row: SizeGuideRow) => boolean;
  whatsappHref?: string | null;
}

/** « Mon enfant mesure … cm » (FK-36). Hidden when the guide has no height ranges. */
export function HeightAdvisor({ rows, onAdvice, onChoose, isAvailable, whatsappHref }: HeightAdvisorProps) {
  const id = useId();
  const [value, setValue] = useState("");
  const t = messages.sizeAdvice;
  if (heightRanges(rows).length === 0) return null;

  const advice = value ? adviseSize(rows, Number(value)) : null;
  const ranges = heightRanges(rows);
  const row = advice && (advice.kind === "match" || advice.kind === "between") ? advice.row : null;
  const available = row ? (isAvailable?.(row) ?? true) : false;

  return (
    <div className="rounded-xl border border-brand-surface bg-brand-white p-3.5 space-y-2.5">
      <label htmlFor={id} className="block text-sm font-medium text-brand-text">
        {t.label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          value={value}
          placeholder={t.placeholder}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "").slice(0, 3);
            setValue(next);
            const a = next ? adviseSize(rows, Number(next)) : null;
            onAdvice(a && (a.kind === "match" || a.kind === "between") ? a.row : null);
          }}
          className="w-24 h-11 px-3 rounded-lg border border-brand-surface bg-brand-bg text-base text-brand-text focus:border-brand-primary"
        />
        <span className="text-base text-brand-text">cm</span>
      </div>

      <div aria-live="polite" className="text-sm text-brand-text space-y-2">
        {row && (
          <>
            <p>
              {advice?.kind === "between" ? t.between(row.age) : t.match(row.age)}
              {!available && <span className="block font-medium text-brand-error">{t.soldOut}</span>}
            </p>
            {onChoose && available && (
              <button
                type="button"
                onClick={() => onChoose(row)}
                className="min-h-11 w-full px-4 rounded-lg bg-brand-primary text-brand-white text-xs font-medium uppercase tracking-[0.15em] cursor-pointer"
              >
                {t.choose(row.age)}
              </button>
            )}
          </>
        )}
        {advice && !row && (
          <p>
            {advice.kind === "too-small" ? t.tooSmall(ranges[0].row.age) : t.tooTall(ranges[ranges.length - 1].row.age)}{" "}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
                {messages.product.sizeQuestionCta}
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
