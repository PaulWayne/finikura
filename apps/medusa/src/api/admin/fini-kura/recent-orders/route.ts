import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { FkOrder, FK_ORDER_FIELDS, FK_STATUS_LABELS, getFkStatus } from "../../../../lib/fk-status"

const LIMIT = 10

// Latest orders with the customer's name and phone, shown above Medusa's order list:
// without an e-mail there is no customer record, so the native « Customer » column stays empty.
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: [
      ...FK_ORDER_FIELDS,
      "display_id",
      "created_at",
      "total",
      "shipping_address.first_name",
      "shipping_address.phone",
      "shipping_address.address_1",
    ],
    pagination: { take: LIMIT, order: { created_at: "DESC" } },
  })

  const orders = data.map((o) => {
    const status = getFkStatus(o as unknown as FkOrder)
    return {
      id: o.id,
      display_id: o.display_id,
      created_at: o.created_at,
      total: o.total,
      name: o.shipping_address?.first_name ?? "",
      phone: o.shipping_address?.phone ?? "",
      district: o.shipping_address?.address_1 ?? "",
      status,
      label: FK_STATUS_LABELS[status],
    }
  })

  res.json({ orders })
}
