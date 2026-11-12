// Manual checks of the Fini Kura status flow against a running Medusa (Admin API).
// Usage: DEV_ADMIN_EMAIL=... DEV_ADMIN_PASSWORD=... node integration-tests/manual/cancel-checks.mjs <order_id>
// 1) "En livraison": create a fulfillment (not shipped) -> stock leaves the shelf
// 2) "Refusée": cancel the fulfillment, then cancel the order -> stock restored

const BASE = process.env.MEDUSA_URL ?? "http://localhost:9000"
const orderId = process.argv[2]
if (!orderId) throw new Error("order id required")

const { token } = await (
  await fetch(`${BASE}/auth/user/emailpass`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: process.env.DEV_ADMIN_EMAIL, password: process.env.DEV_ADMIN_PASSWORD }),
  })
).json()

async function admin(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, json: await res.json() }
}

async function levels(order) {
  const variantId = order.items[0].variant_id
  const { json } = await admin(
    `/admin/product-variants?id=${variantId}&fields=title,inventory_items.inventory.location_levels.*`
  )
  const lvl = json.variants[0].inventory_items[0].inventory.location_levels[0]
  return `stocké=${lvl.stocked_quantity} réservé=${lvl.reserved_quantity} dispo=${lvl.available_quantity}`
}

const getOrder = async () =>
  (await admin(`/admin/orders/${orderId}?fields=*items,status,fulfillment_status,payment_status`)).json.order

let order = await getOrder()
console.log("Départ :", order.status, order.fulfillment_status, "|", await levels(order))

if (order.fulfillment_status === "not_fulfilled") {
  const ful = await admin(`/admin/orders/${orderId}/fulfillments`, {
    items: order.items.map((i) => ({ id: i.id, quantity: i.quantity })),
  })
  order = await getOrder()
  console.log("Après préparation :", ful.status, order.fulfillment_status, "|", await levels(order))
}

const fulfillmentId = (
  await admin(`/admin/orders/${orderId}?fields=fulfillments.id,fulfillments.canceled_at`)
).json.order.fulfillments.find((f) => !f.canceled_at)?.id
const cancelFul = await admin(`/admin/orders/${orderId}/fulfillments/${fulfillmentId}/cancel`, {})
order = await getOrder()
console.log("Après annulation préparation :", cancelFul.status, cancelFul.status >= 400 ? JSON.stringify(cancelFul.json) : "", order.fulfillment_status, "|", await levels(order))

const cancel = await admin(`/admin/orders/${orderId}/cancel`, {})
order = await getOrder()
console.log("Après annulation commande :", cancel.status, order.status, "|", await levels(order))
if (cancel.status >= 400) console.log(cancel.json)
