// Dev only: puts the stock back to the seed values before a test campaign.
// Usage: pnpm --filter medusa stock:reset
// 1. Cancels every pending order (test orders), which releases its reservations.
// 2. Removes any reservation left (orders that could not be cancelled, e.g. already shipped).
// 3. Sets each variant's stock at Bamako to the fixture quantity (matched by SKU).
// 4. Asks the storefront to refresh its catalogue cache.
// Orders are kept (cancelled), so the admin history stays readable.
import fs from "node:fs"
import path from "node:path"
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"
import { cancelOrderWorkflow, deleteReservationsWorkflow, updateInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"
import { noteStockCausesWorkflow } from "../workflows/stock-history/note-stock-causes"

type FixtureProduct = { handle: string; variants: { sku: string; inventory_quantity: number }[] }

export default async function resetStock({ container }: ExecArgs) {
  if (process.env.NODE_ENV === "production") {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "stock:reset is for development only")
  }
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventory = container.resolve(Modules.INVENTORY)

  const fixtures = path.resolve(process.cwd(), "../storefront/src/mocks/medusa/products.json")
  const raw = JSON.parse(fs.readFileSync(fixtures, "utf-8"))
  const products: FixtureProduct[] = Array.isArray(raw) ? raw : raw.products
  const quantityBySku = new Map(products.flatMap((p) => p.variants.map((v) => [v.sku, v.inventory_quantity] as const)))

  // 1. Pending orders.
  const { data: orders } = await query.graph({ entity: "order", fields: ["id", "display_id"], filters: { status: "pending" } })
  let cancelled = 0
  for (const order of orders) {
    try {
      await cancelOrderWorkflow(container).run({ input: { order_id: order.id } })
      cancelled++
    } catch (e) {
      logger.warn(`Order #${order.display_id} not cancelled (${(e as Error).message}); its reservations are removed below.`)
    }
  }

  // 2. Leftover reservations.
  const reservations = await inventory.listReservationItems({}, { select: ["id"] })
  if (reservations.length) {
    await deleteReservationsWorkflow(container).run({ input: { ids: reservations.map((r) => r.id) } })
  }

  // 3. Stock levels.
  const { data: items } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "location_levels.location_id"],
    filters: { sku: [...quantityBySku.keys()] },
  })
  const updates = items.flatMap((item) =>
    (item.location_levels ?? []).map((level) => ({
      inventory_item_id: item.id,
      location_id: level!.location_id,
      stocked_quantity: quantityBySku.get(item.sku as string) ?? 0,
    }))
  )
  if (updates.length) {
    // FK-42: the stock history says « remise à zéro de test ».
    await noteStockCausesWorkflow(container).run({
      input: { cause: "reset", inventory_item_ids: [...new Set(updates.map((u) => u.inventory_item_id))] },
    })
    await updateInventoryLevelsWorkflow(container).run({ input: { updates } })
  }

  // 4. Storefront catalogue cache (same call as the revalidate-storefront subscriber).
  const url = process.env.STOREFRONT_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (url && secret) {
    const res = await fetch(`${url}?source=medusa`, { method: "POST", headers: { "x-revalidate-secret": secret } }).catch(() => null)
    if (!res?.ok) logger.warn("Storefront not revalidated: reload it after restarting, or run this with the storefront up.")
  }

  logger.info(
    `Stock reset: ${cancelled}/${orders.length} pending orders cancelled, ${reservations.length} reservations removed, ${updates.length} stock levels set to the seed values.`
  )
}
