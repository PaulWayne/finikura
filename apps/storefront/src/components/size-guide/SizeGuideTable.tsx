import React from "react";
import { SizeGuide } from "@/lib/content/types";
import { messages } from "@/messages/fr";

const t = messages.sizeGuidePage;

/** One Strapi size guide (girls or boys): measurements table and measuring tips. */
export function SizeGuideTable({ guide }: { guide: SizeGuide }) {
  return (
    <section id={guide.categoryHandle} aria-labelledby={`guide-${guide.categoryHandle}`}>
      <h2 id={`guide-${guide.categoryHandle}`} className="font-serif text-2xl text-brand-text mb-4">
        {guide.title || t.guideFor(guide.categoryHandle)}
      </h2>
      <div className="overflow-x-auto rounded-md border border-brand-text/15">
        <table className="w-full min-w-[520px] text-left text-sm text-brand-text">
          <thead className="bg-brand-surface">
            <tr>
              <th scope="col" className="py-3 px-4 font-semibold">{t.colAge}</th>
              <th scope="col" className="py-3 px-4 font-semibold">{t.colHeight}</th>
              <th scope="col" className="py-3 px-4 font-semibold">{t.colChest}</th>
              <th scope="col" className="py-3 px-4 font-semibold">{t.colWaist}</th>
              <th scope="col" className="py-3 px-4 font-semibold">{t.colHips}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-text/10 bg-brand-bg">
            {guide.rows.map((row) => (
              <tr key={row.age}>
                <th scope="row" className="py-3 px-4 font-medium">{row.age}</th>
                <td className="py-3 px-4">{row.heightCm}</td>
                <td className="py-3 px-4">{row.chestCm}</td>
                <td className="py-3 px-4">{row.waistCm}</td>
                <td className="py-3 px-4">{row.hipsCm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {guide.measuringTips.length > 0 && (
        <ul className="mt-4 list-disc pl-5 space-y-1 text-base text-brand-text">
          {guide.measuringTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
