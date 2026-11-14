import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { STOCK_HISTORY_MODULE } from "../../modules/stock-history"
import type StockHistoryModuleService from "../../modules/stock-history/service"
import type { StockCause } from "../../modules/stock-history/models/stock-change"

export type NoteStockCausesInput = {
  cause: StockCause
  /** The sizes concerned; or else the order, whose sizes are read. */
  inventory_item_ids?: string[]
  order_id?: string
  /** Admin account who acted (manual correction, Fini Kura actions). */
  actor_id?: string
}

/**
 * FK-42: notes why the stock of these sizes is about to change, with their stock now.
 * Recording only: nothing is changed in Medusa. If the action fails, its stock does not
 * change, no event follows, and the note is removed by the compensation or expires.
 */
export const noteStockCausesStep = createStep(
  "note-stock-causes",
  async (input: NoteStockCausesInput, { container }) => {
    // The history must never block shipping, a refusal or a correction: on any error
    // (table missing before db:migrate, database hiccup) the action goes on without a note.
    try {
      const ids = await noteCauses(input, container)
      return new StepResponse(ids, ids)
    } catch (err) {
      container.resolve(ContainerRegistrationKeys.LOGGER).warn(`Cause du changement de stock non notée : ${(err as Error).message}`)
      return new StepResponse([] as string[], [] as string[])
    }
  },
  async (ids, { container }) => {
    if (!ids?.length) return
    await container.resolve<StockHistoryModuleService>(STOCK_HISTORY_MODULE).deleteStockCauses(ids)
  }
)

async function noteCauses(input: NoteStockCausesInput, container: MedusaContainer): Promise<string[]> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventory = container.resolve(Modules.INVENTORY)
  const history = container.resolve<StockHistoryModuleService>(STOCK_HISTORY_MODULE)

  let itemIds = input.inventory_item_ids ?? []
  let orderDisplayId: number | null = null
  if (input.order_id) {
    const { data } = await query.graph({
      entity: "order",
      fields: ["display_id", "items.variant.inventory_items.inventory_item_id"],
      filters: { id: input.order_id },
    })
    const order = data[0]
    orderDisplayId = order?.display_id != null ? Number(order.display_id) : null
    if (!itemIds.length) {
      itemIds = (order?.items ?? []).flatMap((i) =>
        (i?.variant?.inventory_items ?? []).map((ii) => ii?.inventory_item_id).filter((id): id is string => !!id)
      )
    }
  }
  if (!itemIds.length) return []

  let actorName: string | null = null
  if (input.actor_id) {
    const { data } = await query.graph({
      entity: "user",
      fields: ["first_name", "last_name", "email"],
      filters: { id: input.actor_id },
    })
    const user = data[0]
    actorName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || null
  }

  const levels = await inventory.listInventoryLevels({ inventory_item_id: [...new Set(itemIds)] })
  const created = await history.createStockCauses(
    levels.map((level) => ({
      inventory_item_id: level.inventory_item_id,
      location_id: level.location_id,
      previous_quantity: Number(level.stocked_quantity),
      cause: input.cause,
      order_id: input.order_id ?? null,
      order_display_id: orderDisplayId,
      actor_name: actorName,
    }))
  )
  return created.map((c) => c.id)
}

export const noteStockCausesWorkflow = createWorkflow(
  "note-stock-causes",
  function (input: NoteStockCausesInput) {
    const ids = noteStockCausesStep(input)
    return new WorkflowResponse(ids)
  }
)
