import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createOrderFulfillmentWorkflow } from "@medusajs/medusa/core-flows"
import { loadFkOrder } from "./load-order"
import { validateFkActionStep } from "./steps"
import type { FkWorkflowInput } from "./confirm-order"

/** « Partie en livraison » : creates the fulfillment (stock leaves the shelf), NOT marked as shipped. */
export const fkShipOrderWorkflow = createWorkflow(
  "fk-ship-order",
  function (input: FkWorkflowInput) {
    const order = loadFkOrder(input.order_id)
    validateFkActionStep({ order, action: "ship" })
    const fulfillment = transform({ order, input }, ({ order, input }) => ({
      order_id: order.id,
      created_by: input.user_id,
      items: (order.items ?? []).filter((i) => !!i).map((i) => ({ id: i!.id, quantity: Number(i!.quantity) })),
    }))
    createOrderFulfillmentWorkflow.runAsStep({ input: fulfillment })
    return new WorkflowResponse({ order_id: input.order_id })
  }
)
