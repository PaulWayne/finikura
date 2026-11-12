import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import {
  capturePaymentWorkflow,
  completeOrderWorkflow,
  createOrderShipmentWorkflow,
  markOrderFulfillmentAsDeliveredWorkflow,
} from "@medusajs/medusa/core-flows"
import { activeFulfillment, payments } from "../../lib/fk-status"
import { loadFkOrder } from "./load-order"
import { validateFkActionStep } from "./steps"
import type { FkWorkflowInput } from "./confirm-order"

/**
 * « Livrée et payée » : shipped, delivered, payment captured, order completed.
 * Capture comes last but one: once captured it cannot be compensated.
 */
export const fkDeliverOrderWorkflow = createWorkflow(
  "fk-deliver-order",
  function (input: FkWorkflowInput) {
    const order = loadFkOrder(input.order_id)
    validateFkActionStep({ order, action: "deliver" })
    const data = transform({ order, input }, ({ order, input }) => {
      const ful = activeFulfillment(order)!
      const payment = payments(order).find((p) => !p!.captured_at && !p!.canceled_at)
      return {
        shipment: {
          order_id: order.id,
          fulfillment_id: ful.id,
          created_by: input.user_id,
          items: (ful.items ?? [])
            .filter((i) => !!i?.line_item_id)
            .map((i) => ({ id: i!.line_item_id!, quantity: Number(i!.quantity) })),
        },
        delivered: { orderId: order.id, fulfillmentId: ful.id },
        capture: { payment_id: payment?.id ?? "", captured_by: input.user_id },
        complete: { orderIds: [order.id] },
      }
    })
    createOrderShipmentWorkflow.runAsStep({ input: data.shipment })
    markOrderFulfillmentAsDeliveredWorkflow.runAsStep({ input: data.delivered })
    capturePaymentWorkflow.runAsStep({ input: data.capture })
    completeOrderWorkflow.runAsStep({ input: data.complete })
    return new WorkflowResponse({ order_id: input.order_id })
  }
)
