// Manual end-to-end checks against a running Medusa (Store API only).
// Usage: MEDUSA_PK=pk_... node integration-tests/manual/checkout-checks.mjs
// Checks: order without e-mail, phone in shipping address, XOF amounts,
// and that two simultaneous checkouts on the last piece let only one through.

const BASE = process.env.MEDUSA_URL ?? "http://localhost:9000"
const PK = process.env.MEDUSA_PK
if (!PK) throw new Error("MEDUSA_PK is required")

async function api(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", "x-publishable-api-key": PK },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  return { status: res.status, json }
}

async function regionId() {
  const { json } = await api("/store/regions")
  return json.regions.find((r) => r.name === "Mali").id
}

async function variantByTitle(handle, title, region) {
  const { json } = await api(
    `/store/products?handle=${handle}&region_id=${region}&fields=*variants.calculated_price,+variants.inventory_quantity`
  )
  return json.products[0].variants.find((v) => v.title === title)
}

async function prepareCart(region, variantId, name) {
  const { json: c } = await api("/store/carts", { region_id: region })
  const cartId = c.cart.id
  await api(`/store/carts/${cartId}/line-items`, { variant_id: variantId, quantity: 1 })
  await api(`/store/carts/${cartId}`, {
    shipping_address: {
      first_name: name,
      phone: "+22376123456",
      address_1: "Badalabougou",
      address_2: "Près de la pharmacie",
      city: "Bamako",
      country_code: "ml",
    },
  })
  const { json: so } = await api(`/store/shipping-options?cart_id=${cartId}`)
  const option = so.shipping_options.find((o) => o.name === "Livraison à Bamako")
  await api(`/store/carts/${cartId}/shipping-methods`, { option_id: option.id })
  const { json: pc } = await api("/store/payment-collections", { cart_id: cartId })
  await api(`/store/payment-collections/${pc.payment_collection.id}/payment-sessions`, {
    provider_id: "pp_system_default",
  })
  return cartId
}

const region = await regionId()

// 1) Single order without e-mail
const v1 = await variantByTitle("robe-terracotta-brodee", "3-4 ans", region)
const cart1 = await prepareCart(region, v1.id, "Test Sans Email")
const done1 = await api(`/store/carts/${cart1}/complete`, {})
const order = done1.json.order
console.log("1) Commande sans e-mail :", done1.json.type, "| e-mail :", order?.email ?? null)
console.log("   Téléphone (adresse) :", order?.shipping_address?.phone, "| total :", order?.total, order?.currency_code)
const after1 = await variantByTitle("robe-terracotta-brodee", "3-4 ans", region)
console.log("   Stock disponible avant/après :", v1.inventory_quantity, "->", after1.inventory_quantity)

// 2) Two simultaneous checkouts on the last piece (quantity 1)
const last = await variantByTitle("robe-terracotta-brodee", "11-12 ans", region)
console.log("2) Dernière pièce, stock :", last.inventory_quantity)
const [a, b] = await Promise.all([
  prepareCart(region, last.id, "Cliente A"),
  prepareCart(region, last.id, "Cliente B"),
])
const results = await Promise.all([
  api(`/store/carts/${a}/complete`, {}),
  api(`/store/carts/${b}/complete`, {}),
])
results.forEach((r, i) =>
  console.log(
    `   Cliente ${"AB"[i]} :`,
    r.status,
    r.json.type ?? "",
    r.json.order?.display_id ?? r.json.error?.message ?? r.json.message ?? ""
  )
)
console.log("ORDER_ID=" + order?.id)
