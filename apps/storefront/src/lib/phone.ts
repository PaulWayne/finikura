// Phone field of the checkout: the +223 prefix is shown outside the input,
// so the customer only types the 8 digits of a Malian number.

/** Keeps the 8 national digits, as "76 12 34 56". A pasted +223 / 00223 prefix is dropped. */
export function formatPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 8) digits = digits.replace(/^(00)?223/, "");
  return digits.slice(0, 8).replace(/(\d{2})(?=\d)/g, "$1 ");
}
