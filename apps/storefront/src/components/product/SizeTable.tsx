import type { SizeGuideRow } from "@/lib/content/types";
import { messages } from "@/messages/fr";

/** Measurements table of the size guide; the row matching the selected size is highlighted. */
export function SizeTable({ rows, activeSizeTitle }: { rows: SizeGuideRow[]; activeSizeTitle?: string }) {
  const t = messages.sizeGuidePage;
  return (
    <div className="overflow-hidden rounded-xl bg-brand-white border border-brand-surface/70 shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-brand-surface text-brand-text uppercase tracking-wider text-[11px] font-semibold">
            <th className="py-2.5 px-3.5 sm:px-4">{t.colAge}</th>
            <th className="py-2.5 px-3 sm:px-4 text-center">{t.colStature}</th>
            <th className="py-2.5 px-3 sm:px-4 text-center">{t.colChest}</th>
            <th className="py-2.5 px-3.5 sm:px-4 text-right sm:text-center">{t.colWaist}</th>
          </tr>
        </thead>
        <tbody className="divide-y-0 text-xs sm:text-sm">
          {rows.map((row, index) => {
            const isHighlighted =
              activeSizeTitle &&
              (row.age.includes(activeSizeTitle) || activeSizeTitle.includes(row.age.replace(" ans", "")));
            return (
              <tr
                key={row.age}
                className={`transition-colors ${
                  isHighlighted
                    ? "bg-brand-surface/50 font-semibold text-brand-text"
                    : index % 2 === 0
                    ? "bg-brand-white"
                    : "bg-brand-bg/60"
                } hover:bg-brand-surface/40`}
              >
                <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 font-medium text-brand-text">{row.age}</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center text-brand-text">{row.heightCm}</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center text-brand-text">{row.chestCm}</td>
                <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-right sm:text-center text-brand-text">{row.waistCm}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
