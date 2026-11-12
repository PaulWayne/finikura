import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  allowedActions,
  FkOrder,
  FK_ORDER_FIELDS,
  FK_STATUS_LABELS,
  getFkStatus,
} from "../../../../../lib/fk-status"
import { FK_WORKFLOWS } from "../../../../../workflows/fk-status"
import type { FkStatusBody } from "../../../../middlewares"

async function readStatus(req: AuthenticatedMedusaRequest, orderId: string) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph(
    { entity: "order", fields: FK_ORDER_FIELDS, filters: { id: orderId } },
    { throwIfKeyNotFound: true }
  )
  const status = getFkStatus(data[0] as unknown as FkOrder)
  return { status, label: FK_STATUS_LABELS[status], actions: allowedActions(status) }
}

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  res.json(await readStatus(req, req.params.id))
}

export async function POST(req: AuthenticatedMedusaRequest<FkStatusBody>, res: MedusaResponse) {
  await FK_WORKFLOWS[req.validatedBody.action](req.scope).run({
    input: { order_id: req.params.id, user_id: req.auth_context.actor_id },
  })
  res.json(await readStatus(req, req.params.id))
}
