/** Formats an XOF amount as whole francs, e.g. "12 500 FCFA" (same output as the storefront's formatPrice). */
export function formatXof(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${formatted} FCFA`
}
