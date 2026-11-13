import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import orderPlacedAlert from "../../src/subscribers/order-placed-alert"
import { FiniKuraEnv, getVariant, placeOrder, setStock, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

/** Waits for the order.placed subscriber, which runs after the order is created. */
async function waitForNotifications(container: MedusaContainer, orderId: string, expected: number) {
  const notification = container.resolve(Modules.NOTIFICATION)
  for (let i = 0; i < 50; i++) {
    const list = await notification.listNotifications({ resource_id: orderId })
    if (list.length >= expected) return list
    await new Promise((r) => setTimeout(r, 200))
  }
  return notification.listNotifications({ resource_id: orderId })
}

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
      // A second admin user: every admin gets the e-mail.
      await getContainer().resolve(Modules.USER).createUsers({ email: "soeur@finikura.test" })
    })

    it("sends one new-order e-mail to every admin user", async () => {
      const container = getContainer()
      const variant = await getVariant(api, env, "robe-terracotta-brodee", "7-8 ans")
      await setStock(container, variant.id, 3)
      const order = await placeOrder(api, env, variant.id, "Awa Traoré", "+22370112233")

      const notifications = await waitForNotifications(container, order.id, 2)
      const users = await container.resolve(Modules.USER).listUsers()
      expect(notifications).toHaveLength(users.length)
      expect(notifications.map((n) => n.to).sort()).toEqual(users.map((u) => u.email).sort())

      for (const n of notifications) {
        expect(n.channel).toBe("email")
        expect(n.template).toBe("order-placed")
        const data = n.data as any
        expect(data.displayId).toBe(order.display_id)
        expect(data.customer).toMatchObject({ name: "Awa Traoré", phone: "+22370112233" })
        expect(data.items[0]).toMatchObject({ size: "7-8 ans", quantity: 1 })
        expect(Number.isInteger(data.total)).toBe(true)
        expect(data.total).toBe(Number(order.total))
      }
    })

    it("logs a failed alert without throwing", async () => {
      const container = getContainer()
      const errors: string[] = []
      const logger = { error: (m: string) => errors.push(m), warn: () => {}, info: () => {} }
      const scoped = {
        resolve: (key: string) => (key === "logger" ? logger : container.resolve(key)),
      } as unknown as MedusaContainer

      await expect(
        orderPlacedAlert({ event: { name: "order.placed", data: { id: "order_missing" } }, container: scoped } as any)
      ).resolves.toBeUndefined()
      expect(errors.some((m) => m.includes("order_missing"))).toBe(true)
    })
  },
})
