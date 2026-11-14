import { model } from "@medusajs/framework/utils"

export const STOCK_CAUSES = ["shipped", "returned", "manual", "reset", "other"] as const
export type StockCause = (typeof STOCK_CAUSES)[number]

/** FK-42: one line of the stock history of a size (inventory item) at a location. */
export const StockChange = model
  .define("fk_stock_change", {
    id: model.id({ prefix: "fkstk" }).primaryKey(),
    inventory_item_id: model.text().index(),
    location_id: model.text(),
    previous_quantity: model.number().nullable(),
    new_quantity: model.number(),
    cause: model.enum([...STOCK_CAUSES]),
    order_id: model.text().nullable(),
    order_display_id: model.number().nullable(),
    actor_name: model.text().nullable(),
  })
