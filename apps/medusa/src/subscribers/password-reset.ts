import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { adminBaseUrl, PASSWORD_RESET_TEMPLATE } from "../modules/smtp-notification/types"
import { sendAccountEmailWorkflow } from "../workflows/send-account-email"

type ResetEvent = { entity_id: string; token: string; actor_type: string }

/** E-mails the reset link to an admin user who asked for a new password. Customers have no accounts. */
export default async function passwordReset({ event, container }: SubscriberArgs<ResetEvent>) {
  const { entity_id: email, token, actor_type } = event.data
  if (actor_type !== "user") return

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  try {
    const resetUrl = `${adminBaseUrl()}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
    await sendAccountEmailWorkflow(container).run({
      input: {
        to: email,
        template: PASSWORD_RESET_TEMPLATE,
        data: { email, resetUrl },
        trigger_type: event.name,
      },
    })
  } catch (err) {
    // No token in the logs.
    logger.error(`E-mail de nouveau mot de passe non envoyé : ${(err as Error).message}`)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
