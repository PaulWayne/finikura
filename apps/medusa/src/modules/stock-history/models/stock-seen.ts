import { model } from "@medusajs/framework/utils"

/**
 * FK-42: the last stock seen for a size at a location. It tells whether a level update
 * changed the stock (a line) or only the reservations (no line), even before the first line.
 */
export const StockSeen = model.define("fk_stock_seen", {
  id: model.id({ prefix: "fksee" }).primaryKey(),
  inventory_item_id: model.text().index(),
  location_id: model.text(),
  quantity: model.number(),
})
