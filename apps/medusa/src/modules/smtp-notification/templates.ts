import { MedusaError } from "@medusajs/framework/utils"
import { render } from "@react-email/render"
import type { ReactElement } from "react"
import { OrderPlacedEmail, orderPlacedSubject } from "./emails/order-placed"
import { PasswordResetEmail, passwordResetSubject } from "./emails/password-reset"
import { UserInviteEmail, userInviteSubject } from "./emails/user-invite"
import {
  ORDER_PLACED_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  USER_INVITE_TEMPLATE,
  type OrderAlertData,
  type PasswordResetData,
  type UserInviteData,
} from "./types"

export type RenderedEmail = { subject: string; html: string; text: string }

function build(template: string, data: Record<string, unknown>): { subject: string; element: ReactElement } {
  switch (template) {
    case ORDER_PLACED_TEMPLATE: {
      const d = data as unknown as OrderAlertData
      return { subject: orderPlacedSubject(d), element: OrderPlacedEmail(d) }
    }
    case USER_INVITE_TEMPLATE:
      return { subject: userInviteSubject, element: UserInviteEmail(data as unknown as UserInviteData) }
    case PASSWORD_RESET_TEMPLATE:
      return { subject: passwordResetSubject, element: PasswordResetEmail(data as unknown as PasswordResetData) }
    default:
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Template d'e-mail inconnu : ${template}`)
  }
}

/** Renders a known template to subject, HTML and plain text. Throws on an unknown template. */
export async function renderTemplate(template: string, data: Record<string, unknown>): Promise<RenderedEmail> {
  const { subject, element } = build(template, data)
  return { subject, html: await render(element), text: await render(element, { plainText: true }) }
}
