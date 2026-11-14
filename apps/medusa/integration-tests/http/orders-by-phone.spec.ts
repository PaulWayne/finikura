import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { FiniKuraEnv, getVariant, placeOrder, setStock, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv
    const byPhone = async (phone: string) => {
      try {
        const res = await api.get(`/admin/fini-kura/orders-by-phone?phone=${encodeURIComponent(phone)}`, env.admin)
        return { status: res.status, data: res.data }
      } catch (e: any) {
        return { status: e.response?.status ?? 500, data: e.response?.data }
      }
    }

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
      const variant = await getVariant(api, env, "robe-terracotta-brodee", "7-8 ans")
      await setStock(getContainer(), variant.id, 5)
      await placeOrder(api, env, variant.id, "Awa", "+22370112233")
      await placeOrder(api, env, variant.id, "Awa", "+22370112233")
      await placeOrder(api, env, variant.id, "Autre", "+22379998877")
    })

    it("finds the same orders whatever the way the number is typed", async () => {
      const results = await Promise.all(["70 11 22 33", "+22370112233", "0022370112233"].map(byPhone))
      results.forEach((r) => expect(r.status).toBe(200))
      const ids = results.map((r) => r.data.orders.map((o: any) => o.id).sort())
      expect(ids[0]).toHaveLength(2)
      expect(ids[1]).toEqual(ids[0])
      expect(ids[2]).toEqual(ids[0])
      expect(results[0].data.orders[0]).toMatchObject({ name: "Awa", status: "new", currency_code: "xof" })
    })

    it("lists the latest orders with name and phone, newest first", async () => {
      const res = await api.get("/admin/fini-kura/recent-orders", env.admin)
      expect(res.status).toBe(200)
      const [latest, previous] = res.data.orders
      expect(latest).toMatchObject({ name: "Autre", status: "new" })
      expect(latest.phone).toContain("79998877")
      expect(new Date(latest.created_at) >= new Date(previous.created_at)).toBe(true)
    })

    it("rejects an invalid number with a 400", async () => {
      expect((await byPhone("12 34")).status).toBe(400)
    })
  },
})
