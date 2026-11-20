import { z } from 'zod';
import { messages } from '@/messages/fr';

/**
 * Checkout schema shared between client form (react-hook-form) and server action/mutation.
 * Clean 8-digit Malian phone number validation without email or online payment fields.
 */
/** Longest text each field accepts. The same numbers cap the inputs of the form. */
export const CHECKOUT_LIMITS = { fullName: 100, phone: 20, neighborhood: 100, deliveryLandmarks: 250 } as const;

// A name, a neighbourhood or a landmark never needs markup or control characters (a line break in
// the landmark is fine): refusing them
// keeps what reaches the admin, the e-mails and the WhatsApp message plain text.
const plainText = (value: string) => !/[<>{}\\\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
const tooLong = { message: messages.validation.tooLong };
const notPlain = { message: messages.validation.plainTextOnly };

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: messages.validation.nameRequired })
    .max(CHECKOUT_LIMITS.fullName, tooLong)
    .refine(plainText, notPlain),
  phone: z
    .string()
    .max(CHECKOUT_LIMITS.phone, { message: messages.validation.phoneInvalid })
    .transform((val) => val.replace(/[\s.-]+/g, ''))
    .transform((val) => val.replace(/^(\+223|00223)/, ''))
    .refine((val) => /^[0-9]{8}$/.test(val), { message: messages.validation.phoneInvalid })
    // Malian numbers start with 2 (landline) or 5 to 9 (mobile).
    .refine((val) => /^[25-9]/.test(val), { message: messages.validation.phoneNotMalian })
    // Stored in one format everywhere: +223 followed by 8 digits.
    .transform((val) => `+223${val.slice(-8)}`),
  neighborhood: z
    .string()
    .trim()
    .min(2, { message: messages.validation.neighborhoodRequired })
    .max(CHECKOUT_LIMITS.neighborhood, tooLong)
    .refine(plainText, notPlain),
  deliveryLandmarks: z
    .string()
    .trim()
    .min(3, { message: messages.validation.landmarksRequired })
    .max(CHECKOUT_LIMITS.deliveryLandmarks, tooLong)
    .refine(plainText, notPlain),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
