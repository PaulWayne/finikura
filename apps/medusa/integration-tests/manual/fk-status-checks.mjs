// Manual checks of the « Statut Fini Kura » admin route (FK-06) against a running Medusa.
// Usage: MEDUSA_PK=pk_... DEV_ADMIN_EMAIL=... DEV_ADMIN_PASSWORD=... node integration-tests/manual/fk-status-checks.mjs
// A) confirm -> ship -> deliver : stock leaves on ship, nothing shipped before deliver, order completed + captured
// B) confirm -> ship -> refuse  : stock back to its starting level
// C) forbidden action (deliver on a new order) -> 400

const BASE = process.env.MEDUSA_URL ?? "http://localhost:9000"
const PK = process.env.MEDUSA_PK
if (!PK) throw new Error("MEDUSA_PK is required")

async function call(path, body, headers) {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, json: await res.json() }
}
const store = (p, b) => call(p, b, { "x-publishable-api-key": PK })

const { token } = (
  await call("/auth/user/emailpass", { email: process.env.DEV_ADMIN_EMAIL, password: process.env.DEV_ADMIN_PASSWORD })
).json
const admin = (p, b) => call(p, b, { authorization: `Bearer ${token}` })

const region = (await store("/store/regions")).json.regions.find((r) => r.name === "Mali").id
const product = (await store(`/store/products?handle=robe-terracotta-brodee&region_id=${region}&fields=*variants`)).json
  .products[0]
const variant = product.variants.find((v) => v.title === "5-6 ans")

async function newOrder(name) {
  const cartId = (await store("/store/carts", { region_id: region })).json.cart.id
  await store(`/store/carts/${cartId}/line-items`, { variant_id: variant.id, quantity: 1 })
  await store(`/store/carts/${cartId}`, {
    shipping_address: { first_name: name, phone: "+22376123456", address_1: "Badalabougou", address_2: "Près de la pharmacie", city: "Bamako", country_code: "ml" },
  })
  const option = (await store(`/store/shipping-options?cart_id=${cartId}`)).json.shipping_options.find(
    (o) => o.name === "Livraison à Bamako"
  )
  await store(`/store/carts/${cartId}/shipping-methods`, { option_id: option.id })
  const pc = (await store("/store/payment-collections", { cart_id: cartId })).json.payment_collection
  await store(`/store/payment-collections/${pc.id}/payment-sessions`, { provider_id: "pp_system_default" })
  return (await store(`/store/carts/${cartId}/complete`, {})).json.order.id
}

async function stock() {
  const { json } = await admin(`/admin/product-variants?id=${variant.id}&fields=inventory_items.inventory.location_levels.*`)
  const l = json.variants[0].inventory_items[0].inventory.location_levels[0]
  return `stocké=${l.stocked_quantity} réservé=${l.reserved_quantity} dispo=${l.available_quantity}`
}

async function native(orderId) {
  const o = (
    await admin(`/admin/orders/${orderId}?fields=status,fulfillment_status,payment_status,fulfillments.shipped_at,fulfillments.delivered_at,fulfillments.canceled_at`)
  ).json.order
  const f = o.fulfillments.find((x) => !x.canceled_at)
  return `${o.status}/${o.fulfillment_status}/${o.payment_status} expédié=${f?.shipped_at ? "oui" : "non"} livré=${f?.delivered_at ? "oui" : "non"}`
}

async function step(orderId, action) {
  const r = await admin(`/admin/orders/${orderId}/fini-kura-status`, { action })
  const label = r.status >= 400 ? `ERREUR ${r.status} ${r.json.message}` : r.json.label
  console.log(`  ${action.padEnd(8)} -> ${label} | ${await native(orderId)} | ${await stock()}`)
}

console.log("Stock de départ :", await stock())

console.log("A) Livrée et payée")
const a = await newOrder("Test FK06 A")
console.log("  nouvelle ->", (await admin(`/admin/orders/${a}/fini-kura-status`)).json.label, "|", await stock())
for (const action of ["confirm", "ship", "deliver"]) await step(a, action)

console.log("B) Refusée à la porte")
const b = await newOrder("Test FK06 B")
for (const action of ["confirm", "ship", "refuse"]) await step(b, action)

console.log("C) Action interdite")
const c = await newOrder("Test FK06 C")
await step(c, "deliver")
await step(c, "refuse")
console.log("Stock final :", await stock())
