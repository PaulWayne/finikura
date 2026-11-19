import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createInvitesWorkflow, refreshInviteTokensWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Invites someone to the admin, by e-mail (FK-08). The person receives the link and chooses the
 * password: nobody else ever knows it. Run it again to send a fresh link (24 hours).
 *
 *   cd /app/apps/medusa && pnpm invite:admin gerante@example.com
 *
 * `medusa user --invite` creates the invite but its process ends before the event leaves, so no
 * e-mail goes out. This script goes through the workflows and waits for the event to reach the
 * running server, whose subscriber sends the e-mail.
 */
export default async function inviteAdmin({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const email = (args ?? []).find((arg) => arg.includes("@"))
  if (!email) throw new Error("Adresse e-mail attendue : pnpm invite:admin gerante@example.com")

  const userModule = container.resolve(Modules.USER)
  const [existingUser] = await userModule.listUsers({ email })
  if (existingUser) {
    logger.info(`${email} a déjà un compte : rien à envoyer. Mot de passe perdu : « Mot de passe oublié » sur la page de connexion.`)
    return
  }

  const [pending] = await userModule.listInvites({ email })
  if (pending) {
    await refreshInviteTokensWorkflow(container).run({ input: { invite_ids: [pending.id] } })
    logger.info(`Invitation renouvelée pour ${email} : un nouveau lien part par e-mail.`)
  } else {
    await createInvitesWorkflow(container).run({ input: { invites: [{ email }] } })
    logger.info(`Invitation créée pour ${email} : le lien part par e-mail.`)
  }
  // Leave time for the event to leave this short-lived process (same wait as the seed).
  await new Promise((resolve) => setTimeout(resolve, 5000))
}
