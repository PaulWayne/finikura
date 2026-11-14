import { z } from 'zod';
import { messages } from '@/messages/fr';

/**
 * Checkout schema shared between client form (react-hook-form) and server action/mutation.
 * Clean 8-digit Malian phone number validation without email or online payment fields.
 */
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: messages.validation.nameRequired })
    .max(100),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s.-]+/g, ''))
    .refine((val) => /^(\+223|00223)?[5-9][0-9]{7}$/.test(val), {
      message: messages.validation.phoneInvalid,
    })
    // Stored in one format everywhere: +223 followed by 8 digits.
    .transform((val) => `+223${val.slice(-8)}`),
  neighborhood: z
    .string()
    .min(2, { message: messages.validation.neighborhoodRequired })
    .max(100),
  deliveryLandmarks: z
    .string()
    .min(3, { message: messages.validation.landmarksRequired })
    .max(250),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
