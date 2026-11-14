import { model } from "@medusajs/framework/utils"
import { STOCK_CAUSES } from "./stock-change"

/**
 * FK-42: written just before an action that changes the stock (shipping, refusal, manual
 * correction, test reset), with the stock at that moment. The subscriber of
 * « inventory-level.updated » uses it to explain the change, then deletes it.
 */
export const StockCause = model
  .define("fk_stock_cause", {
    id: model.id({ prefix: "fkcau" }).primaryKey(),
    inventory_item_id: model.text().index(),
    location_id: model.text(),
    previous_quantity: model.number(),
    cause: model.enum([...STOCK_CAUSES]),
    order_id: model.text().nullable(),
    order_display_id: model.number().nullable(),
    actor_name: model.text().nullable(),
  })
