import type { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { STOCK_HISTORY_MODULE } from "../modules/stock-history"
import type StockHistoryModuleService from "../modules/stock-history/service"

/** A cause older than this is ignored: its action did not change the stock. */
export const CAUSE_TTL_MS = 10 * 60 * 1000

/**
 * FK-42: after a stock level changed, writes one history line with the noted cause, or
 * « other » if none. Reservations only change the reserved quantity: no line for them.
 *
 * Called by the subscriber with the module service directly, not through a workflow: a
 * workflow run inside this subscriber stopped the other subscribers of the same order
 * (new-order e-mail), seen in the integration tests. It only writes to our own tables.
 */
export async function recordStockChange(container: MedusaContainer, inventoryLevelId: string): Promise<string | null> {
  const inventory = container.resolve(Modules.INVENTORY)
  const history = container.resolve<StockHistoryModuleService>(STOCK_HISTORY_MODULE)

  const [level] = await inventory.listInventoryLevels({ id: inventoryLevelId })
  if (!level) return null
  const current = Number(level.stocked_quantity)
  const where = { inventory_item_id: level.inventory_item_id, location_id: level.location_id }

  const [seen] = await history.listStockSeens(where, { take: 1 })
  if (seen) await history.updateStockSeens({ id: seen.id, quantity: current })
  else await history.createStockSeens({ ...where, quantity: current })
  const causes = await history.listStockCauses(where, { order: { created_at: "DESC" } })
  const fresh = causes.find((c) => Date.now() - new Date(c.created_at).getTime() < CAUSE_TTL_MS)
  const expired = causes.filter((c) => c !== fresh && Date.now() - new Date(c.created_at).getTime() >= CAUSE_TTL_MS)
  if (expired.length) await history.deleteStockCauses(expired.map((c) => c.id))

  // Without a cause or a stock seen before, there is nothing to compare: the stock is
  // only noted. Same stock as before: a reservation, no line.
  const previous = fresh ? fresh.previous_quantity : seen ? Number(seen.quantity) : null
  if (previous === null || previous === current) {
    if (fresh) await history.deleteStockCauses([fresh.id])
    return null
  }

  const line = await history.createStockChanges({
    ...where,
    previous_quantity: previous,
    new_quantity: current,
    cause: fresh?.cause ?? "other",
    order_id: fresh?.order_id ?? null,
    order_display_id: fresh?.order_display_id ?? null,
    actor_name: fresh?.actor_name ?? null,
  })
  if (fresh) await history.deleteStockCauses([fresh.id])
  return line.id
}
