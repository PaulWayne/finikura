import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { STOCK_HISTORY_MODULE } from "../../../../modules/stock-history"
import type StockHistoryModuleService from "../../../../modules/stock-history/service"

const PAGE = 20

// FK-42: the stock history of one size, latest first, and how many pieces are reserved now.
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const itemId = String(req.query.inventory_item_id ?? "")
  if (!itemId) throw new MedusaError(MedusaError.Types.INVALID_DATA, "inventory_item_id manquant")
  const offset = Math.max(0, Number(req.query.offset) || 0)

  const history = req.scope.resolve<StockHistoryModuleService>(STOCK_HISTORY_MODULE)
  const inventory = req.scope.resolve(Modules.INVENTORY)
  const [[changes, count], levels] = await Promise.all([
    history.listAndCountStockChanges(
      { inventory_item_id: itemId },
      { order: { created_at: "DESC" }, skip: offset, take: PAGE }
    ),
    inventory.listInventoryLevels({ inventory_item_id: itemId }),
  ])

  res.json({
    changes,
    count,
    offset,
    limit: PAGE,
    reserved: levels.reduce((sum, l) => sum + Number(l.reserved_quantity), 0),
  })
}
