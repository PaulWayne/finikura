import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { cancelOrderFulfillmentWorkflow, cancelOrderWorkflow } from "@medusajs/medusa/core-flows"
import { activeFulfillment } from "../../lib/fk-status"
import { loadFkOrder } from "./load-order"
import { validateFkActionStep } from "./steps"
import type { FkWorkflowInput } from "./confirm-order"

/** « Refusée » : cancels the fulfillment if any (stock back), then the order (reservation released). */
export const fkRefuseOrderWorkflow = createWorkflow(
  "fk-refuse-order",
  function (input: FkWorkflowInput) {
    const order = loadFkOrder(input.order_id)
    validateFkActionStep({ order, action: "refuse" })
    const data = transform({ order, input }, ({ order, input }) => ({
      fulfillment_id: activeFulfillment(order)?.id,
      cancelFulfillment: {
        order_id: order.id,
        fulfillment_id: activeFulfillment(order)?.id ?? "",
        canceled_by: input.user_id,
      },
      cancelOrder: { order_id: order.id, canceled_by: input.user_id },
    }))
    when({ data }, ({ data }) => !!data.fulfillment_id).then(() => {
      cancelOrderFulfillmentWorkflow.runAsStep({ input: data.cancelFulfillment })
    })
    cancelOrderWorkflow.runAsStep({ input: data.cancelOrder })
    return new WorkflowResponse({ order_id: input.order_id })
  }
)
