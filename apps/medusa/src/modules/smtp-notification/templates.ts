import { MedusaError } from "@medusajs/framework/utils"
import { render } from "@react-email/render"
import { OrderPlacedEmail, orderPlacedSubject } from "./emails/order-placed"
import { ORDER_PLACED_TEMPLATE, type OrderAlertData } from "./types"

export type RenderedEmail = { subject: string; html: string; text: string }

/** Renders a known template to subject, HTML and plain text. Throws on an unknown template. */
export async function renderTemplate(template: string, data: Record<string, unknown>): Promise<RenderedEmail> {
  switch (template) {
    case ORDER_PLACED_TEMPLATE: {
      const d = data as unknown as OrderAlertData
      const element = OrderPlacedEmail(d)
      return {
        subject: orderPlacedSubject(d),
        html: await render(element),
        text: await render(element, { plainText: true }),
      }
    }
    default:
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Template d'e-mail inconnu : ${template}`)
  }
}
