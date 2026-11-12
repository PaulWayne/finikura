// FK-14: edit an order's shipping address without postal code (Admin API), and check XOF amounts are integers.
// Usage: MEDUSA_PK=pk_... DEV_ADMIN_EMAIL=... DEV_ADMIN_PASSWORD=... node integration-tests/manual/address-checks.mjs

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

const ok = (cond, label) => console.log(cond ? "OK   " : "ÉCHEC", label)

const id = await newOrder("Test FK14")
const upd = await admin(`/admin/orders/${id}`, {
  shipping_address: { address_1: "Hamdallaye ACI 2000", address_2: "Derrière la mosquée", postal_code: "" },
})
ok(upd.status === 200, `modification sans code postal (HTTP ${upd.status}${upd.status >= 400 ? " " + upd.json.message : ""})`)

const o = (await admin(`/admin/orders/${id}?fields=total,items.unit_price,shipping_address.*`)).json.order
const a = o.shipping_address
ok(a.address_1 === "Hamdallaye ACI 2000" && a.address_2 === "Derrière la mosquée", `adresse à jour : ${a.address_1} / ${a.address_2}`)
ok(a.phone === "+22376123456" && a.city === "Bamako" && a.country_code === "ml", `téléphone, ville, pays conservés : ${a.phone}, ${a.city}, ${a.country_code}`)
ok(!a.postal_code, `code postal vide : ${JSON.stringify(a.postal_code)}`)
ok(Number.isInteger(o.total) && o.items.every((i) => Number.isInteger(i.unit_price)), `montants entiers : total ${o.total}, prix ${o.items.map((i) => i.unit_price)}`)

await admin(`/admin/orders/${id}/fini-kura-status`, { action: "refuse" })
console.log("Commande de test annulée :", id)
