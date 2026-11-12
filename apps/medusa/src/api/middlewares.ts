import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"

export const FkStatusSchema = z.object({
  action: z.enum(["confirm", "ship", "deliver", "refuse"]),
})
export type FkStatusBody = z.infer<typeof FkStatusSchema>

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/orders/:id/fini-kura-status",
      method: "POST",
      middlewares: [validateAndTransformBody(FkStatusSchema)],
    },
  ],
})
