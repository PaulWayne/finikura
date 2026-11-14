import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, InventoryEvents } from "@medusajs/framework/utils"
import { recordStockChange } from "../lib/stock-history"

/**
 * FK-42: each stock change of a size adds a line to its history. Runs after the action is
 * saved, so it never slows down an order or a Fini Kura action.
 */
export default async function stockHistory({ event, container }: SubscriberArgs<{ id: string }>) {
  try {
    await recordStockChange(container, event.data.id)
  } catch (err) {
    container
      .resolve(ContainerRegistrationKeys.LOGGER)
      .warn(`Historique du stock non enregistré (${event.data.id}) : ${(err as Error).message}`)
  }
}

// Medusa 2.22.6 emits both names (checked in its event bus logs): « inventory-level.updated »
// when a level is updated (admin correction, updateInventoryLevelsWorkflow), and
// InventoryEvents.INVENTORY_LEVEL_UPDATED (« inventory.inventory-level.updated ») when the stock
// is adjusted by a fulfillment (shipping, refusal). Listening to one only misses changes.
export const config: SubscriberConfig = {
  // The module event is the only one a fulfillment's stock adjustment emits (tested in
  // integration-tests/http/stock-history.spec.ts): the lint advice does not apply here.
  // eslint-disable-next-line @medusajs/prefer-workflow-event-over-module-event
  event: ["inventory-level.updated", InventoryEvents.INVENTORY_LEVEL_UPDATED],
}
