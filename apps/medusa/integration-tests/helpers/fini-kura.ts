// Shared setup for the Fini Kura integration tests: the real seed, a publishable
// key, a test admin, and carts filled like the storefront checkout form.
import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createUserAccountWorkflow } from "@medusajs/medusa/core-flows"
import seed from "../../src/scripts/seed"

type Api = {
  get: (url: string, config?: unknown) => Promise<{ status: number; data: any }>
  post: (url: string, body?: unknown, config?: unknown) => Promise<{ status: number; data: any }>
}

export type FiniKuraEnv = {
  store: { headers: Record<string, string> }
  admin: { headers: Record<string, string> }
  regionId: string
  adminEmail: string
}

const PHONE = "+22376123456"

/** Seeds the database like `pnpm seed`, then returns the headers for the Store and Admin APIs. */
export async function setupFiniKura(container: MedusaContainer, api: Api): Promise<FiniKuraEnv> {
  // The seed logs every step; keep the test output readable.
  await seed({ container, args: [] } as any)

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["token"],
    filters: { type: "publishable", revoked_at: null },
  })
  const store = { headers: { "x-publishable-api-key": keys[0].token } }

  // Test admin, created for this run only.
  const email = `admin-${Date.now()}@test.local`
  const password = `pw-${Math.random().toString(36).slice(2)}`
  const register = await api.post("/auth/user/emailpass/register", { email, password })
  const authIdentityId = JSON.parse(
    Buffer.from(register.data.token.split(".")[1], "base64url").toString()
  ).auth_identity_id
  await createUserAccountWorkflow(container).run({ input: { authIdentityId, userData: { email } } })
  const login = await api.post("/auth/user/emailpass", { email, password })
  const admin = { headers: { authorization: `Bearer ${login.data.token}` } }

  const { data: regions } = await query.graph({ entity: "region", fields: ["id"], filters: { name: "Mali" } })
  return { store, admin, regionId: regions[0].id, adminEmail: email }
}

/** Variant of a seeded product, with its sellable quantity. */
export async function getVariant(api: Api, env: FiniKuraEnv, handle: string, title: string) {
  const res = await api.get(
    `/store/products?handle=${handle}&region_id=${env.regionId}&fields=*variants,+variants.inventory_quantity`,
    env.store
  )
  return res.data.products[0].variants.find((v: any) => v.title === title)
}

/** Sets the stocked quantity of a variant at the Bamako location. */
export async function setStock(container: MedusaContainer, variantId: string, quantity: number) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventory = container.resolve(Modules.INVENTORY)
  const { data } = await query.graph({
    entity: "variant",
    fields: ["inventory_items.inventory.location_levels.id", "inventory_items.inventory.location_levels.location_id", "inventory_items.inventory_item_id"],
    filters: { id: variantId },
  })
  const item = data[0].inventory_items![0]!
  const level = item.inventory!.location_levels![0]!
  await inventory.updateInventoryLevels([
    { inventory_item_id: item.inventory_item_id, location_id: level.location_id, stocked_quantity: quantity },
  ])
}

/** A cart ready to be completed, filled like the checkout form (no e-mail). */
export async function prepareCart(api: Api, env: FiniKuraEnv, variantId: string, name: string, phone = PHONE) {
  const s = env.store
  const { data: c } = await api.post("/store/carts", { region_id: env.regionId }, s)
  const cartId = c.cart.id
  await api.post(`/store/carts/${cartId}/line-items`, { variant_id: variantId, quantity: 1 }, s)
  await api.post(
    `/store/carts/${cartId}`,
    {
      shipping_address: {
        first_name: name,
        phone,
        address_1: "Badalabougou",
        address_2: "Près de la pharmacie",
        city: "Bamako",
        country_code: "ml",
      },
    },
    s
  )
  const { data: so } = await api.get(`/store/shipping-options?cart_id=${cartId}`, s)
  const option = so.shipping_options.find((o: any) => o.name === "Livraison à Bamako")
  await api.post(`/store/carts/${cartId}/shipping-methods`, { option_id: option.id }, s)
  const { data: pc } = await api.post("/store/payment-collections", { cart_id: cartId }, s)
  await api.post(
    `/store/payment-collections/${pc.payment_collection.id}/payment-sessions`,
    { provider_id: "pp_system_default" },
    s
  )
  return cartId as string
}

/** Completes a cart and returns the HTTP status and body, without throwing on errors. */
export async function completeCart(api: Api, env: FiniKuraEnv, cartId: string) {
  try {
    const res = await api.post(`/store/carts/${cartId}/complete`, {}, env.store)
    return { status: res.status, data: res.data }
  } catch (e: any) {
    return { status: e.response?.status ?? 500, data: e.response?.data }
  }
}

/** Places an order and returns it. */
export async function placeOrder(api: Api, env: FiniKuraEnv, variantId: string, name: string, phone = PHONE) {
  const cartId = await prepareCart(api, env, variantId, name, phone)
  const res = await completeCart(api, env, cartId)
  if (res.data?.type !== "order") throw new Error(`Order not placed: ${JSON.stringify(res.data)}`)
  return res.data.order
}

/** Stock levels of a variant at the Bamako location. */
export async function stockLevel(api: Api, env: FiniKuraEnv, variantId: string) {
  const res = await api.get(
    `/admin/product-variants?id=${variantId}&fields=inventory_items.inventory.location_levels.*`,
    env.admin
  )
  const l = res.data.variants[0].inventory_items[0].inventory.location_levels[0]
  return { stocked: l.stocked_quantity, reserved: l.reserved_quantity, available: l.available_quantity }
}

/** Calls the « Statut Fini Kura » admin route without throwing on 4xx. */
export async function fkAction(api: Api, env: FiniKuraEnv, orderId: string, action: string) {
  try {
    const res = await api.post(`/admin/orders/${orderId}/fini-kura-status`, { action }, env.admin)
    return { status: res.status, data: res.data }
  } catch (e: any) {
    return { status: e.response?.status ?? 500, data: e.response?.data }
  }
}
