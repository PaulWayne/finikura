import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { updateInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"
import { fkAction, FiniKuraEnv, getVariant, placeOrder, setStock, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

// FK-42: the stock history of a size, written by the subscriber after each change.
medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv
    let variantId: string
    let itemId: string
    let locationId: string

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
      variantId = (await getVariant(api, env, "robe-poudree-en-lin", "7-8 ans")).id
      const res = await api.get(
        `/admin/product-variants?id=${variantId}&fields=inventory_items.inventory_item_id,inventory_items.inventory.location_levels.location_id`,
        env.admin
      )
      itemId = res.data.variants[0].inventory_items[0].inventory_item_id
      locationId = res.data.variants[0].inventory_items[0].inventory.location_levels[0].location_id
      await setStock(getContainer(), variantId, 5)
    })

    const history = async () =>
      (await api.get(`/admin/fini-kura/stock-history?inventory_item_id=${itemId}`, env.admin)).data

    /** The subscriber runs after the action: wait for the expected number of lines. */
    const waitForLines = async (count: number) => {
      for (let i = 0; i < 50; i++) {
        const data = await history()
        if (data.count >= count) return data
        await new Promise((r) => setTimeout(r, 200))
      }
      return history()
    }

    it("a delivery then a refusal give two right lines, the reservation none", async () => {
      const before = (await history()).count

      const order = await placeOrder(api, env, variantId, "Cliente Historique")
      await fkAction(api, env, order.id, "confirm")
      // Reserved, not gone: no line, but the box says how many pieces are reserved.
      const reserved = await history()
      expect(reserved.count).toBe(before)
      expect(reserved.reserved).toBe(1)

      await fkAction(api, env, order.id, "ship")
      const shipped = await waitForLines(before + 1)
      expect(shipped.changes[0]).toMatchObject({
        cause: "shipped",
        previous_quantity: 5,
        new_quantity: 4,
        order_id: order.id,
        order_display_id: order.display_id,
        location_id: locationId,
      })

      await fkAction(api, env, order.id, "refuse")
      const refused = await waitForLines(before + 2)
      expect(refused.changes[0]).toMatchObject({ cause: "returned", previous_quantity: 4, new_quantity: 5, order_id: order.id })
      expect(refused.reserved).toBe(0)
    })

    it("a correction made in Inventaire is a manual change with the account", async () => {
      const before = (await history()).count
      await api.post(`/admin/inventory-items/${itemId}/location-levels/${locationId}`, { stocked_quantity: 7 }, env.admin)
      const data = await waitForLines(before + 1)
      expect(data.changes[0]).toMatchObject({ cause: "manual", previous_quantity: 5, new_quantity: 7, actor_name: env.adminEmail })
    })

    it("a change without a known cause is still written, as « other »", async () => {
      // Through a workflow, like any real change, but without a noted cause. The module tables
      // are emptied between tests: the first change only notes the stock (no point of comparison).
      const setLevel = (stocked_quantity: number) =>
        updateInventoryLevelsWorkflow(getContainer()).run({
          input: { updates: [{ inventory_item_id: itemId, location_id: locationId, stocked_quantity }] },
        })
      const before = (await history()).count
      await setLevel(6)
      await new Promise((r) => setTimeout(r, 1000))
      expect((await history()).count).toBe(before)
      await setLevel(4)
      const data = await waitForLines(before + 1)
      expect(data.changes[0]).toMatchObject({ cause: "other", previous_quantity: 6, new_quantity: 4 })
    })
  },
})
