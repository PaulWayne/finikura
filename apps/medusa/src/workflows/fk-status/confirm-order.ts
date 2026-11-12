import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateOrderWorkflow } from "@medusajs/medusa/core-flows"
import { loadFkOrder } from "./load-order"
import { validateFkActionStep } from "./steps"

export type FkWorkflowInput = { order_id: string; user_id?: string }

/** « Confirmée sur WhatsApp » : sets metadata.confirmed_at, stock stays reserved. */
export const fkConfirmOrderWorkflow = createWorkflow(
  "fk-confirm-order",
  function (input: FkWorkflowInput) {
    const order = loadFkOrder(input.order_id)
    validateFkActionStep({ order, action: "confirm" })
    const update = transform({ order, input }, ({ order, input }) => ({
      id: order.id,
      user_id: input.user_id ?? "",
      metadata: { ...(order.metadata ?? {}), confirmed_at: new Date().toISOString() },
    }))
    updateOrderWorkflow.runAsStep({ input: update })
    return new WorkflowResponse({ order_id: input.order_id })
  }
)
