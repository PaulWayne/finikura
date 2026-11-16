import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withStaleAsFailed } from "../../../../../../../lib/product-videos"
import { removeProductVideoWorkflow, updateProductVideoWorkflow } from "../../../../../../../workflows/product-videos"
import type { UpdateProductVideoBody } from "../../../../../../middlewares"

// FK-38: caption and place of one clip.
export async function POST(req: AuthenticatedMedusaRequest<UpdateProductVideoBody>, res: MedusaResponse) {
  const { result } = await updateProductVideoWorkflow(req.scope).run({
    input: { product_id: req.params.id, video_id: req.params.videoId, ...req.validatedBody },
  })
  res.json({ videos: withStaleAsFailed(result) })
}

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { result } = await removeProductVideoWorkflow(req.scope).run({
    input: { product_id: req.params.id, video_id: req.params.videoId },
  })
  res.json({ videos: withStaleAsFailed(result) })
}
