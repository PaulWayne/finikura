// FK-36: suggested size from the child's height, read from the Strapi size guide.
// Nothing is copied or stored: the rows' "98-104 cm" ranges are parsed on the fly.
import type { SizeGuideRow } from "@/lib/content/types";

export type SizeAdvice =
  | { kind: "match"; row: SizeGuideRow }
  /** Between two ranges: the size above, as the guide's own tip says. */
  | { kind: "between"; row: SizeGuideRow }
  | { kind: "too-small" }
  | { kind: "too-tall" };

type Range = { row: SizeGuideRow; min: number; max: number };

export function heightRanges(rows: SizeGuideRow[]): Range[] {
  return rows
    .map((row) => {
      const m = row.heightCm.match(/(\d+)\s*[-–à]\s*(\d+)/);
      return m ? { row, min: Number(m[1]), max: Number(m[2]) } : null;
    })
    .filter((r): r is Range => r !== null)
    .sort((a, b) => a.min - b.min);
}

export function adviseSize(rows: SizeGuideRow[], heightCm: number): SizeAdvice | null {
  const ranges = heightRanges(rows);
  if (!ranges.length || !Number.isFinite(heightCm) || heightCm <= 0) return null;
  if (heightCm < ranges[0].min) return { kind: "too-small" };
  if (heightCm > ranges[ranges.length - 1].max) return { kind: "too-tall" };
  const match = ranges.find((r) => heightCm >= r.min && heightCm <= r.max);
  if (match) return { kind: "match", row: match.row };
  const above = ranges.find((r) => r.min > heightCm)!;
  return { kind: "between", row: above.row };
}

/** "7-8 ans" -> "7-8": the part shared by the guide rows and the Medusa variant titles. */
export const ageKey = (label: string) => label.replace(/\s*ans?\s*$/i, "").trim();
