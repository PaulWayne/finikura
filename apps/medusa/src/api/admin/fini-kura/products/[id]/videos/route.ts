import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listProductVideos, MAX_PRODUCT_VIDEOS, withStaleAsFailed } from "../../../../../../lib/product-videos"
import { addProductVideoWorkflow } from "../../../../../../workflows/product-videos"
import type { AddProductVideoBody } from "../../../../../middlewares"

// FK-38: the clips of a product, in the order of the gallery.
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const videos = withStaleAsFailed(await listProductVideos(req.scope, req.params.id))
  res.json({ videos, max: MAX_PRODUCT_VIDEOS })
}

// A file already sent to the storage (/admin/uploads) becomes a clip « in preparation ».
export async function POST(req: AuthenticatedMedusaRequest<AddProductVideoBody>, res: MedusaResponse) {
  const { result } = await addProductVideoWorkflow(req.scope).run({
    input: { product_id: req.params.id, file_id: req.validatedBody.file_id },
  })
  res.status(201).json({ video: result })
}
