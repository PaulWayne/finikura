// Manual checks of the orders-by-phone admin route (FK-16) against a running Medusa.
// Usage: DEV_ADMIN_EMAIL=... DEV_ADMIN_PASSWORD=... node integration-tests/manual/orders-by-phone-checks.mjs
// A) « 76 12 34 56 », « +22376123456 » and « 0022376123456 » return the same orders, and at least one
// B) an invalid number -> 400

const BASE = process.env.MEDUSA_URL ?? "http://localhost:9000"

async function call(path, body, headers) {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, json: await res.json() }
}

const { token } = (
  await call("/auth/user/emailpass", { email: process.env.DEV_ADMIN_EMAIL, password: process.env.DEV_ADMIN_PASSWORD })
).json
const admin = (p) => call(p, undefined, { authorization: `Bearer ${token}` })
const byPhone = (phone) => admin(`/admin/fini-kura/orders-by-phone?phone=${encodeURIComponent(phone)}`)

let failed = 0
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` (${detail})` : ""}`)
  if (!ok) failed++
}

const results = await Promise.all(["76 12 34 56", "+22376123456", "0022376123456"].map(byPhone))
const ids = results.map((r) => r.json.orders.map((o) => o.id).sort().join(","))
check("A1 three forms answer 200", results.every((r) => r.status === 200))
check("A2 same orders for the three forms", new Set(ids).size === 1, `${results[0].json.orders.length} orders`)
check("A3 at least one order", results[0].json.orders.length > 0)
const first = results[0].json.orders[0]
check("A4 fields", ["display_id", "created_at", "total", "label"].every((k) => first?.[k] !== undefined))

const bad = await byPhone("12 34")
check("B invalid number -> 400", bad.status === 400, bad.json.message)

process.exit(failed ? 1 : 0)
