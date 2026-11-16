import { randomUUID } from "node:crypto"
import { MedusaError } from "@medusajs/framework/utils"
import { createStep, createWorkflow, StepResponse, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  assertVideoExists,
  changeProductVideos,
  deleteStoredFiles,
  listProductVideos,
  MAX_PRODUCT_VIDEOS,
  PRODUCT_VIDEO_UPLOADED,
  type ProductVideo,
} from "../../lib/product-videos"

export type AddProductVideoInput = { product_id: string; file_id: string }

/**
 * FK-38: adds the clip « in preparation » to the product. The file is not checked here: the storage
 * answers for any id, so a wrong one shows up in the preparation, which ends as failed.
 */
const addVideoEntryStep = createStep(
  "add-video-entry",
  async (input: AddProductVideoInput, { container }) => {
    const video: ProductVideo = {
      id: `vid_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
      status: "processing",
      created_at: new Date().toISOString(),
      source_file_id: input.file_id,
    }
    await changeProductVideos(container, input.product_id, (videos) => {
      if (videos.length >= MAX_PRODUCT_VIDEOS) {
        throw new MedusaError(MedusaError.Types.NOT_ALLOWED, `Pas plus de ${MAX_PRODUCT_VIDEOS} vidéos par produit`)
      }
      return [...videos, video]
    })
    return new StepResponse(video, { product_id: input.product_id, video_id: video.id })
  },
  async (added, { container }) => {
    if (!added) return
    await changeProductVideos(container, added.product_id, (videos) => videos.filter((v) => v.id !== added.video_id))
  }
)

export const addProductVideoWorkflow = createWorkflow("add-product-video", function (input: AddProductVideoInput) {
  const video = addVideoEntryStep(input)
  const eventData = transform({ input, video }, (data) => ({ product_id: data.input.product_id, video_id: data.video.id }))
  // The preparation runs after the answer: the manager does not wait in front of the page.
  emitEventStep({ eventName: PRODUCT_VIDEO_UPLOADED, data: eventData })
  return new WorkflowResponse(video)
})

export type UpdateProductVideoInput = { product_id: string; video_id: string; caption?: string; move?: "up" | "down" }

const updateVideoEntryStep = createStep(
  "update-video-entry",
  async (input: UpdateProductVideoInput, { container }) => {
    const before = await listProductVideos(container, input.product_id)
    assertVideoExists(before, input.video_id)
    const after = await changeProductVideos(container, input.product_id, (videos) => {
      const index = videos.findIndex((v) => v.id === input.video_id)
      if (index < 0) return videos
      const next = videos.map((v) => ({ ...v }))
      if (input.caption !== undefined) {
        const caption = input.caption.trim()
        if (caption) next[index].caption = caption
        else delete next[index].caption
      }
      const target = input.move === "up" ? index - 1 : input.move === "down" ? index + 1 : index
      if (target !== index && target >= 0 && target < next.length) {
        ;[next[index], next[target]] = [next[target], next[index]]
      }
      return next
    })
    return new StepResponse(after, { product_id: input.product_id, before })
  },
  async (previous, { container }) => {
    if (!previous) return
    // Captions and order only: the clips prepared meanwhile keep their own state.
    await changeProductVideos(container, previous.product_id, (videos) => {
      const byId = new Map(videos.map((v) => [v.id, v]))
      return previous.before.filter((v) => byId.has(v.id)).map((v) => ({ ...byId.get(v.id)!, caption: v.caption }))
    })
  }
)

export const updateProductVideoWorkflow = createWorkflow("update-product-video", function (input: UpdateProductVideoInput) {
  return new WorkflowResponse(updateVideoEntryStep(input))
})

export type RemoveProductVideoInput = { product_id: string; video_id: string }

const removeVideoEntryStep = createStep("remove-video-entry", async (input: RemoveProductVideoInput, { container }) => {
  const video = assertVideoExists(await listProductVideos(container, input.product_id), input.video_id)
  const after = await changeProductVideos(container, input.product_id, (videos) => videos.filter((v) => v.id !== input.video_id))
  // Files go after the list: a clip the site no longer shows may lose its files, never the reverse.
  await deleteStoredFiles(container, [...(video.file_ids ?? []), video.source_file_id])
  return new StepResponse(after)
})

export const removeProductVideoWorkflow = createWorkflow("remove-product-video", function (input: RemoveProductVideoInput) {
  return new WorkflowResponse(removeVideoEntryStep(input))
})
