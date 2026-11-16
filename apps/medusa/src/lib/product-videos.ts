import { spawn } from "node:child_process"
import { createWriteStream } from "node:fs"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pipeline } from "node:stream/promises"
import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"
import { deleteFilesWorkflow, uploadFilesWorkflow } from "@medusajs/medusa/core-flows"

/**
 * FK-38: the short clips of a product. The manager drops the video of her phone on the product
 * page of the admin; the server cuts it to 10 s, removes the sound and stores a light AV1 file,
 * an H.264 fallback and a still image in the media storage. The list lives in the product
 * metadata, as a JSON string: the metadata editor of the admin only keeps plain strings safely.
 */
export const PRODUCT_VIDEOS_KEY = "fk_videos"
export const PRODUCT_VIDEO_UPLOADED = "fini-kura.product-video.uploaded"
export const MAX_PRODUCT_VIDEOS = 4
/** A clip still « in preparation » after this long was interrupted (server restarted). */
const STALE_AFTER_MS = 15 * 60 * 1000
const CLIP_SECONDS = "10"
const CLIP_WIDTH = "scale=480:-2"

export type ProductVideo = {
  id: string
  status: "processing" | "ready" | "failed"
  created_at: string
  caption?: string
  /** The file as sent by the manager, deleted once the clip is ready or has failed. */
  source_file_id?: string
  av1_url?: string
  mp4_url?: string
  poster_url?: string
  /** Files of the ready clip, deleted with it. */
  file_ids?: string[]
}

export function parseProductVideos(metadata: Record<string, unknown> | null | undefined): ProductVideo[] {
  const raw = metadata?.[PRODUCT_VIDEOS_KEY]
  if (typeof raw !== "string" || !raw.trim()) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is ProductVideo => !!v && typeof v.id === "string") : []
  } catch {
    return []
  }
}

/** What the admin shows: an interrupted preparation reads as failed, so it can be removed. */
export function withStaleAsFailed(videos: ProductVideo[], now = Date.now()): ProductVideo[] {
  return videos.map((v) =>
    v.status === "processing" && now - new Date(v.created_at).getTime() > STALE_AFTER_MS ? { ...v, status: "failed" } : v
  )
}

export async function listProductVideos(container: MedusaContainer, productId: string): Promise<ProductVideo[]> {
  const product = await container.resolve(Modules.PRODUCT).retrieveProduct(productId, { select: ["id", "metadata"] })
  return parseProductVideos(product.metadata)
}

/**
 * Reads the list, applies the change and writes it back, one writer at a time per product:
 * the preparation ends in the background while the manager may be editing a caption.
 */
export async function changeProductVideos(
  container: MedusaContainer,
  productId: string,
  change: (videos: ProductVideo[]) => ProductVideo[]
): Promise<ProductVideo[]> {
  const products = container.resolve(Modules.PRODUCT)
  return container.resolve(Modules.LOCKING).execute(`fk-product-videos:${productId}`, async () => {
    const product = await products.retrieveProduct(productId, { select: ["id", "metadata"] })
    const next = change(parseProductVideos(product.metadata))
    await products.updateProducts(productId, {
      metadata: { ...(product.metadata ?? {}), [PRODUCT_VIDEOS_KEY]: JSON.stringify(next) },
    })
    return next
  })
}

/** Deletes stored files; a file already gone must not block the removal of a clip. */
export async function deleteStoredFiles(container: MedusaContainer, ids: (string | undefined)[]): Promise<void> {
  const present = ids.filter((id): id is string => !!id)
  if (!present.length) return
  try {
    await deleteFilesWorkflow(container).run({ input: { ids: present } })
  } catch (err) {
    container.resolve(ContainerRegistrationKeys.LOGGER).warn(`Fichiers vidéo non supprimés : ${(err as Error).message}`)
  }
}

function ffmpeg(args: string[]): Promise<void> {
  // One core and a low priority: the server shares its machine with other sites.
  const binary = process.env.FFMPEG_PATH || "ffmpeg"
  return new Promise((resolve, reject) => {
    const child = spawn("nice", ["-n", "10", binary, "-nostdin", "-y", "-loglevel", "error", ...args], {
      stdio: ["ignore", "ignore", "pipe"],
    })
    let stderr = ""
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + String(chunk)).slice(-2000)
    })
    child.on("error", reject)
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr.trim() || `ffmpeg a échoué (${code})`))))
  })
}

/**
 * Prepares one clip: AV1 (the light format), H.264 (plays everywhere) and the still image.
 * One clip at a time on the whole server. Whatever happens, the file sent by the manager is
 * deleted and the clip ends « ready » or « failed », never stuck.
 */
export async function prepareProductVideo(container: MedusaContainer, productId: string, videoId: string): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const video = (await listProductVideos(container, productId)).find((v) => v.id === videoId)
  if (!video || video.status !== "processing" || !video.source_file_id) return
  const sourceId = video.source_file_id

  const folder = await mkdtemp(path.join(os.tmpdir(), "fk-video-"))
  const source = path.join(folder, "source")
  const output = { av1: path.join(folder, "av1.mp4"), mp4: path.join(folder, "h264.mp4"), poster: path.join(folder, "poster.jpg") }
  const clip = ["-i", source, "-an", "-t", CLIP_SECONDS, "-vf", CLIP_WIDTH, "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-threads", "1"]

  try {
    await container.resolve(Modules.LOCKING).execute(
      "fk-product-video-preparation",
      async () => {
        await pipeline(await container.resolve(Modules.FILE).getDownloadStream(sourceId), createWriteStream(source))
        await ffmpeg([...clip, "-c:v", "libx264", "-preset", "medium", "-crf", "28", output.mp4])
        await ffmpeg(["-i", source, "-vf", CLIP_WIDTH, "-frames:v", "1", "-q:v", "5", output.poster])
        // AV1 is a bonus: an ffmpeg without this encoder still gives a working clip.
        const hasAv1 = await ffmpeg([...clip, "-c:v", "libsvtav1", "-preset", "8", "-crf", "45", "-svtav1-params", "lp=1", output.av1]).then(
          () => true,
          (err: Error) => {
            logger.warn(`Vidéo ${videoId} : pas de version AV1 (${err.message.split("\n")[0]})`)
            return false
          }
        )

        const files = [
          { key: "mp4_url" as const, file: output.mp4, filename: `${videoId}-h264.mp4`, mimeType: "video/mp4" },
          { key: "poster_url" as const, file: output.poster, filename: `${videoId}-affiche.jpg`, mimeType: "image/jpeg" },
          ...(hasAv1 ? [{ key: "av1_url" as const, file: output.av1, filename: `${videoId}-av1.mp4`, mimeType: "video/mp4" }] : []),
        ]
        const { result } = await uploadFilesWorkflow(container).run({
          input: {
            files: await Promise.all(
              files.map(async (f) => ({
                filename: f.filename,
                mimeType: f.mimeType,
                content: (await readFile(f.file)).toString("base64"),
                access: "public" as const,
              }))
            ),
          },
        })

        let kept = false
        await changeProductVideos(container, productId, (videos) =>
          videos.map((v) => {
            if (v.id !== videoId) return v
            kept = true
            const ready: ProductVideo = { ...v, status: "ready", file_ids: result.map((r) => r.id) }
            delete ready.source_file_id
            files.forEach((f, i) => {
              ready[f.key] = result[i].url
            })
            return ready
          })
        )
        // Removed by the manager while it was being prepared: nothing must stay in the storage.
        if (!kept) await deleteStoredFiles(container, result.map((r) => r.id))
      },
      { timeout: 900 }
    )
  } catch (err) {
    logger.error(`Vidéo ${videoId} du produit ${productId} non préparée : ${(err as Error).message}`)
    await changeProductVideos(container, productId, (videos) =>
      videos.map((v) => {
        if (v.id !== videoId) return v
        const failed: ProductVideo = { ...v, status: "failed" }
        delete failed.source_file_id
        return failed
      })
    )
  } finally {
    await deleteStoredFiles(container, [sourceId])
    await rm(folder, { recursive: true, force: true })
  }
}

export function assertVideoExists(videos: ProductVideo[], videoId: string): ProductVideo {
  const video = videos.find((v) => v.id === videoId)
  if (!video) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Vidéo introuvable")
  return video
}
