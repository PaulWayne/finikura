import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { FkOrder, FK_ORDER_FIELDS, FK_STATUS_LABELS, getFkStatus } from "../../../../lib/fk-status"
import { normalizeMaliPhone, phoneVariants } from "../../../../lib/phone"

// Orders of one customer, found by the phone of the shipping address
// (no e-mail at checkout, so Medusa has no customer record to group them).
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const raw = typeof req.query.phone === "string" ? req.query.phone : ""
  const local = normalizeMaliPhone(raw)
  if (!local) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Numéro invalide : saisissez 8 chiffres, avec ou sans +223."
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: [
      ...FK_ORDER_FIELDS,
      "display_id",
      "created_at",
      "total",
      "currency_code",
      "shipping_address.first_name",
    ],
    filters: { shipping_address: { phone: phoneVariants(local) } },
    pagination: { take: 100, order: { created_at: "DESC" } },
  })

  const orders = data.map((o) => {
    const status = getFkStatus(o as unknown as FkOrder)
    return {
      id: o.id,
      display_id: o.display_id,
      created_at: o.created_at,
      total: o.total,
      currency_code: o.currency_code,
      name: o.shipping_address?.first_name ?? "",
      status,
      label: FK_STATUS_LABELS[status],
    }
  })

  res.json({ phone: `+223${local}`, orders })
}
