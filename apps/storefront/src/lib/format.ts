/**
 * Helper to format price in XOF without decimals.
 * Follows the strict rule: "8 500 FCFA"
 */
export function formatPrice(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}
