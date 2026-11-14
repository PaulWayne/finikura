import { medusaIntegrationTestRunner, TestEventUtils } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import { FiniKuraEnv, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

/** Waits for a subscriber-sent notification (subscribers run after the request returns). */
async function waitFor(container: MedusaContainer, filters: Record<string, unknown>) {
  const notification = container.resolve(Modules.NOTIFICATION)
  for (let i = 0; i < 25; i++) {
    const list = await notification.listNotifications(filters)
    if (list.length) return list
    await new Promise((r) => setTimeout(r, 200))
  }
  return notification.listNotifications(filters)
}

/**
 * Starts waiting for the subscribers of an event before the request that emits it, so the
 * test never polls against a slow event bus (the cause of the old flaky failures).
 */
const subscribersDone = (container: MedusaContainer, eventName: string) =>
  TestEventUtils.waitSubscribersExecution(eventName, container.resolve(Modules.EVENT_BUS))

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
    })

    it("e-mails the invite link to the invited address", async () => {
      const sent = subscribersDone(getContainer(), "invite.created")
      const res = await api.post("/admin/invites", { email: "soeur@test.local" }, env.admin)
      const invite = res.data.invite
      await sent

      const [n] = await waitFor(getContainer(), { template: "user-invite", to: "soeur@test.local" })
      expect(n).toBeDefined()
      expect(n.channel).toBe("email")
      expect(n.resource_id).toBe(invite.id)
      expect((n.data as any).inviteUrl).toMatch(/\/app\/invite\?token=.+/)
      expect((n.data as any).inviteUrl).toContain(invite.token)
    })

    it("e-mails a reset link to an admin who forgot the password", async () => {
      const sent = subscribersDone(getContainer(), "auth.password_reset")
      await api.post("/auth/user/emailpass/reset-password", { identifier: env.adminEmail })
      await sent

      const [n] = await waitFor(getContainer(), { template: "password-reset", to: env.adminEmail })
      expect(n).toBeDefined()
      const url = new URL((n.data as any).resetUrl)
      expect(url.pathname).toBe("/app/reset-password")
      expect(url.searchParams.get("token")).toBeTruthy()
      expect(url.searchParams.get("email")).toBe(env.adminEmail)
    })

    it("sends nothing for an unknown address", async () => {
      await api.post("/auth/user/emailpass/reset-password", { identifier: "inconnue@test.local" })
      const list = await waitFor(getContainer(), { template: "password-reset", to: "inconnue@test.local" })
      expect(list).toHaveLength(0)
    })
  },
})
