import {
  defineMiddlewares,
  validateAndTransformBody,
  type AuthenticatedMedusaRequest,
  type MedusaRequest,
  type MedusaNextFunction,
  type MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { noteStockCausesWorkflow } from "../workflows/stock-history/note-stock-causes"

export const FkStatusSchema = z.object({
  action: z.enum(["confirm", "ship", "deliver", "refuse"]),
})
export type FkStatusBody = z.infer<typeof FkStatusSchema>

// FK-38: clips of a product.
export const AddProductVideoSchema = z.object({ file_id: z.string().min(1) })
export type AddProductVideoBody = z.infer<typeof AddProductVideoSchema>
export const UpdateProductVideoSchema = z.object({
  caption: z.string().max(120).optional(),
  move: z.enum(["up", "down"]).optional(),
})
export type UpdateProductVideoBody = z.infer<typeof UpdateProductVideoSchema>

type StockBody = { updates?: { inventory_item_id?: string }[]; update?: { inventory_item_id?: string }[]; create?: unknown[] }

/**
 * FK-42: before a stock change made by hand in the admin (Inventaire), notes « correction
 * manuelle » with the account name. Recording only: if it fails, the change goes on.
 */
async function noteManualStockChange(request: MedusaRequest, _res: MedusaResponse, next: MedusaNextFunction) {
  // Admin routes are authenticated by Medusa before the project middlewares.
  const req = request as AuthenticatedMedusaRequest
  try {
    const body = (req.body ?? {}) as StockBody
    const ids = new Set<string>()
    if (req.params.id) ids.add(req.params.id)
    for (const u of [...(body.updates ?? []), ...(body.update ?? [])]) {
      if (u?.inventory_item_id) ids.add(u.inventory_item_id)
    }
    if (ids.size) {
      await noteStockCausesWorkflow(req.scope).run({
        input: { cause: "manual", inventory_item_ids: [...ids], actor_id: req.auth_context?.actor_id },
      })
    }
  } catch (err) {
    req.scope.resolve(ContainerRegistrationKeys.LOGGER).warn(`Cause du changement de stock non notée : ${(err as Error).message}`)
  }
  next()
}

export default defineMiddlewares({
  routes: [
    // Stock changed by hand: one size at a location, one size at several, or several sizes.
    { matcher: "/admin/inventory-items/:id/location-levels/:location_id", method: "POST", middlewares: [noteManualStockChange] },
    { matcher: "/admin/inventory-items/:id/location-levels/batch", method: "POST", middlewares: [noteManualStockChange] },
    { matcher: "/admin/inventory-items/location-levels/batch", method: "POST", middlewares: [noteManualStockChange] },
    {
      matcher: "/admin/fini-kura/products/:id/videos",
      method: "POST",
      middlewares: [validateAndTransformBody(AddProductVideoSchema)],
    },
    {
      matcher: "/admin/fini-kura/products/:id/videos/:videoId",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateProductVideoSchema)],
    },
    {
      matcher: "/admin/orders/:id/fini-kura-status",
      method: "POST",
      middlewares: [validateAndTransformBody(FkStatusSchema)],
    },
  ],
})
