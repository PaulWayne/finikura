// Mali phone numbers: +223 followed by 8 digits. Shared by the admin route and the admin UI.

/** Returns the 8 local digits of a Mali number typed in any usual form, or null. */
export function normalizeMaliPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "")
  if (digits.startsWith("00223")) digits = digits.slice(5)
  else if (digits.startsWith("223") && digits.length === 11) digits = digits.slice(3)
  return /^\d{8}$/.test(digits) ? digits : null
}

/** Stored forms of a number: the checkout saves +223XXXXXXXX, older orders may hold the bare digits. */
export function phoneVariants(local: string): string[] {
  return [`+223${local}`, local]
}
