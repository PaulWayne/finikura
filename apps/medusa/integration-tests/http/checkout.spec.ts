import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { completeCart, FiniKuraEnv, getVariant, placeOrder, prepareCart, setStock, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(120 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
    })

    it("places an order without e-mail, with the phone and the Bamako address, in whole XOF", async () => {
      const variant = await getVariant(api, env, "robe-terracotta-brodee", "3-4 ans")
      const order = await placeOrder(api, env, variant.id, "Test Sans Email")

      expect(order.email ?? null).toBeNull()
      expect(order.currency_code).toBe("xof")
      expect(Number.isInteger(order.total)).toBe(true)
      expect(order.shipping_address).toMatchObject({
        first_name: "Test Sans Email",
        phone: "+22376123456",
        address_1: "Badalabougou",
        address_2: "Près de la pharmacie",
        city: "Bamako",
        country_code: "ml",
      })
      expect(order.shipping_address.postal_code ?? null).toBeNull()
    })

    it("lets only one of two simultaneous checkouts take the last piece", async () => {
      const variant = await getVariant(api, env, "robe-terracotta-brodee", "11-12 ans")
      await setStock(getContainer(), variant.id, 1)

      const [a, b] = await Promise.all([
        prepareCart(api, env, variant.id, "Cliente A"),
        prepareCart(api, env, variant.id, "Cliente B"),
      ])
      const results = await Promise.all([completeCart(api, env, a), completeCart(api, env, b)])

      const orders = results.filter((r) => r.data?.type === "order")
      expect(orders).toHaveLength(1)
      const after = await getVariant(api, env, "robe-terracotta-brodee", "11-12 ans")
      expect(after.inventory_quantity).toBe(0)
    })

    it("lets the admin edit the address without postal code, keeping phone, city and country", async () => {
      const variant = await getVariant(api, env, "robe-terracotta-brodee", "3-4 ans")
      const order = await placeOrder(api, env, variant.id, "Test Adresse")

      await api.post(
        `/admin/orders/${order.id}`,
        { shipping_address: { address_1: "Hamdallaye ACI 2000", address_2: "Derrière la mosquée", postal_code: "" } },
        env.admin
      )
      const res = await api.get(`/admin/orders/${order.id}?fields=total,items.unit_price,shipping_address.*`, env.admin)
      const { shipping_address: a, total, items } = res.data.order
      expect(a).toMatchObject({
        address_1: "Hamdallaye ACI 2000",
        address_2: "Derrière la mosquée",
        phone: "+22376123456",
        city: "Bamako",
        country_code: "ml",
      })
      expect(a.postal_code || null).toBeNull()
      expect(Number.isInteger(total)).toBe(true)
      items.forEach((i: any) => expect(Number.isInteger(i.unit_price)).toBe(true))
    })
  },
})
