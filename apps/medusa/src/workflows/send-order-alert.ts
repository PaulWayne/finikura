import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep, useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { ORDER_PLACED_TEMPLATE, type OrderAlertData } from "../modules/smtp-notification/types"

type Input = { orderId: string }

type AlertOrder = {
  id: string
  display_id: number
  created_at: string | Date
  total: number
  items: { product_title: string | null; variant_title: string | null; quantity: number; total: number }[]
  shipping_address: { first_name: string | null; phone: string | null; address_1: string | null; address_2: string | null } | null
}

/** Builds the "order-placed" template data from an order. */
export function toOrderAlertData(order: AlertOrder, adminBaseUrl?: string): OrderAlertData {
  const address = order.shipping_address
  return {
    orderId: order.id,
    displayId: order.display_id,
    createdAt: new Date(order.created_at).toISOString(),
    customer: {
      name: address?.first_name ?? "",
      phone: address?.phone ?? "",
      neighborhood: address?.address_1 ?? "",
      landmarks: address?.address_2 ?? "",
    },
    items: order.items.map((item) => ({
      title: item.product_title ?? "",
      size: item.variant_title ?? "",
      quantity: Number(item.quantity),
      total: Number(item.total),
    })),
    total: Number(order.total),
    adminUrl: adminBaseUrl ? `${adminBaseUrl.replace(/\/$/, "")}/orders/${order.id}` : null,
  }
}

/** Sends the new-order e-mail to every admin user (one notification each). */
export const sendOrderAlertWorkflow = createWorkflow("send-order-alert", function (input: Input) {
  const { data: orders } = useQueryGraphStep({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "created_at",
      "total",
      "items.product_title",
      "items.variant_title",
      "items.quantity",
      "items.total",
      "shipping_address.first_name",
      "shipping_address.phone",
      "shipping_address.address_1",
      "shipping_address.address_2",
    ],
    filters: { id: input.orderId },
    options: { throwIfKeyNotFound: true },
  })

  const { data: users } = useQueryGraphStep({
    entity: "user",
    fields: ["id", "email"],
  }).config({ name: "fk-load-admin-users" })

  const notifications = transform({ orders, users }, ({ orders, users }) => {
    const order = orders[0] as unknown as AlertOrder
    const data = toOrderAlertData(order, process.env.MEDUSA_ADMIN_URL)
    return (users as { id: string; email: string }[])
      .filter((u) => u.email)
      .map((u) => ({
        to: u.email,
        channel: "email",
        template: ORDER_PLACED_TEMPLATE,
        data,
        trigger_type: "order.placed",
        resource_id: order.id,
        resource_type: "order",
        receiver_id: u.id,
        idempotency_key: `fk-order-alert-${order.id}-${u.id}`,
      }))
  })

  const sent = sendNotificationsStep(notifications)
  return new WorkflowResponse(sent)
})
