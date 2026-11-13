import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { fkAction, FiniKuraEnv, getVariant, placeOrder, setStock, setupFiniKura, stockLevel } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv
    let variantId: string

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
      variantId = (await getVariant(api, env, "robe-terracotta-brodee", "5-6 ans")).id
      await setStock(getContainer(), variantId, 5)
    })

    const nativeState = async (orderId: string) => {
      const res = await api.get(
        `/admin/orders/${orderId}?fields=status,payment_status,fulfillments.shipped_at,fulfillments.delivered_at,fulfillments.canceled_at`,
        env.admin
      )
      return res.data.order
    }

    it("confirm -> ship -> deliver: stock leaves on ship, order completed and payment captured", async () => {
      const order = await placeOrder(api, env, variantId, "Cliente Livrée")
      expect((await api.get(`/admin/orders/${order.id}/fini-kura-status`, env.admin)).data.status).toBe("new")

      expect((await fkAction(api, env, order.id, "confirm")).data.status).toBe("confirmed")
      const beforeShip = await stockLevel(api, env, variantId)
      expect((await fkAction(api, env, order.id, "ship")).data.status).toBe("shipping")
      const afterShip = await stockLevel(api, env, variantId)
      expect(afterShip.stocked).toBe(beforeShip.stocked - 1)

      // Nothing is marked shipped before the delivery.
      const shipping = await nativeState(order.id)
      expect(shipping.fulfillments.find((f: any) => !f.canceled_at).shipped_at).toBeNull()

      expect((await fkAction(api, env, order.id, "deliver")).data.status).toBe("delivered")
      const done = await nativeState(order.id)
      expect(done.status).toBe("completed")
      expect(done.payment_status).toBe("captured")
    })

    it("refused at the door puts the piece back in stock", async () => {
      const start = await stockLevel(api, env, variantId)
      const order = await placeOrder(api, env, variantId, "Cliente Refus")
      await fkAction(api, env, order.id, "confirm")
      await fkAction(api, env, order.id, "ship")
      expect((await stockLevel(api, env, variantId)).stocked).toBe(start.stocked - 1)

      expect((await fkAction(api, env, order.id, "refuse")).data.status).toBe("refused")
      const end = await stockLevel(api, env, variantId)
      expect(end.stocked).toBe(start.stocked)
      expect(end.available).toBe(start.available)
      expect((await nativeState(order.id)).status).toBe("canceled")
    })

    it("refuses a forbidden action with a 400", async () => {
      const order = await placeOrder(api, env, variantId, "Cliente Interdite")
      const res = await fkAction(api, env, order.id, "deliver")
      expect(res.status).toBe(400)
    })
  },
})
