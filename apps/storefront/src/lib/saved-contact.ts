import { checkoutSchema, type CheckoutFormData } from "@/lib/validation/checkout";

// The customer's details, kept on her phone for the next order.
// Only the four checkout fields are stored. Storage may be unavailable
// (private browsing, blocked site data): every access is guarded.
const KEY = "fk_contact";

export function loadContact(): CheckoutFormData | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = checkoutSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveContact(data: CheckoutFormData): void {
  const { fullName, phone, neighborhood, deliveryLandmarks } = data;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ fullName, phone, neighborhood, deliveryLandmarks }));
  } catch {
    // Nothing to do: the next order simply starts with an empty form.
  }
}
