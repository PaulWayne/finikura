import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { adminBaseUrl, USER_INVITE_TEMPLATE } from "../modules/smtp-notification/types"
import { sendAccountEmailWorkflow } from "../workflows/send-account-email"

/** E-mails the invite link when an admin invites someone (or resends the invite). */
export default async function userInvite({ event, container }: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  try {
    const { data } = await query.graph({
      entity: "invite",
      fields: ["id", "email", "token"],
      filters: { id: event.data.id },
    })
    const invite = data[0]
    if (!invite) return logger.warn(`Invitation ${event.data.id} introuvable : e-mail non envoyé`)

    await sendAccountEmailWorkflow(container).run({
      input: {
        to: invite.email,
        template: USER_INVITE_TEMPLATE,
        data: { email: invite.email, inviteUrl: `${adminBaseUrl()}/invite?token=${invite.token}` },
        trigger_type: event.name,
        resource_id: invite.id,
        resource_type: "invite",
      },
    })
  } catch (err) {
    logger.error(`E-mail d'invitation ${event.data.id} non envoyé : ${(err as Error).message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
}
