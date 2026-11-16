import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { FiniKuraEnv, setupFiniKura } from "../helpers/fini-kura"

jest.setTimeout(180 * 1000)

type Video = { id: string; status: string; caption?: string; av1_url?: string; mp4_url?: string; poster_url?: string; source_file_id?: string }

// FK-38: the manager sends a phone video on the product page; the server prepares the clip.
// Needs ffmpeg on the machine, like the server.
medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let env: FiniKuraEnv
    let productId: string
    let folder: string

    beforeAll(async () => {
      env = await setupFiniKura(getContainer(), api)
      const res = await api.get("/admin/products?handle=robe-poudree-en-lin&fields=id", env.admin)
      productId = res.data.products[0].id
      folder = mkdtempSync(path.join(os.tmpdir(), "fk-video-test-"))
    })
    afterAll(() => rmSync(folder, { recursive: true, force: true }))

    const videosUrl = () => `/admin/fini-kura/products/${productId}/videos`
    const list = async (): Promise<Video[]> => (await api.get(videosUrl(), env.admin)).data.videos

    const upload = async (file: string, type: string) => {
      const form = new FormData()
      form.append("files", new Blob([readFileSync(file)], { type }), path.basename(file))
      const res = await api.post("/admin/uploads", form, env.admin)
      return res.data.files[0].id as string
    }

    const waitUntilDone = async (id: string) => {
      for (let i = 0; i < 300; i++) {
        const video = (await list()).find((v) => v.id === id)
        if (video && video.status !== "processing") return video
        await new Promise((r) => setTimeout(r, 400))
      }
      throw new Error("la vidéo est restée en préparation")
    }

    it("a phone video becomes a short silent clip, with its still image", async () => {
      // 14 s with sound, wider than the clip: the server must cut, mute and reduce it.
      const phoneVideo = path.join(folder, "telephone.mp4")
      execFileSync("ffmpeg", [
        "-loglevel", "error", "-y",
        "-f", "lavfi", "-i", "testsrc=duration=14:size=720x1280:rate=24",
        "-f", "lavfi", "-i", "sine=frequency=440:duration=14",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", phoneVideo,
      ])

      const added = await api.post(videosUrl(), { file_id: await upload(phoneVideo, "video/mp4") }, env.admin)
      expect(added.status).toBe(201)
      expect(added.data.video.status).toBe("processing")

      const video = await waitUntilDone(added.data.video.id)
      expect(video.status).toBe("ready")
      expect(video.mp4_url).toMatch(/-h264.*\.mp4$/)
      expect(video.poster_url).toMatch(/-affiche.*\.jpg$/)
      // The file sent by the manager is not kept.
      expect(video.source_file_id).toBeUndefined()

      // The site reads the list from the product itself.
      const store = await api.get(`/store/products/${productId}?fields=metadata`, env.store)
      const published = JSON.parse(store.data.product.metadata.fk_videos)
      expect(published).toHaveLength(1)
      expect(published[0]).toMatchObject({ id: video.id, status: "ready", mp4_url: video.mp4_url })

      // A caption, then the removal: the clip and its files leave the product.
      const updated = await api.post(`${videosUrl()}/${video.id}`, { caption: "  Aïcha, 7 ans, porte le 7-8 ans " }, env.admin)
      expect(updated.data.videos[0].caption).toBe("Aïcha, 7 ans, porte le 7-8 ans")

      const removed = await api.delete(`${videosUrl()}/${video.id}`, env.admin)
      expect(removed.data.videos).toHaveLength(0)
      expect(await list()).toHaveLength(0)
    })

    it("a file that is not a video ends as failed, and can be removed", async () => {
      const added = await api.post(videosUrl(), { file_id: await upload(__filename, "video/mp4") }, env.admin)
      const video = await waitUntilDone(added.data.video.id)
      expect(video.status).toBe("failed")
      expect(video.mp4_url).toBeUndefined()

      await api.delete(`${videosUrl()}/${video.id}`, env.admin)
      expect(await list()).toHaveLength(0)
    })

    it("a file the storage does not have ends as failed too", async () => {
      const added = await api.post(videosUrl(), { file_id: "file_inconnu" }, env.admin)
      expect((await waitUntilDone(added.data.video.id)).status).toBe("failed")
    })

    it("a body without a file is refused", async () => {
      const res = await api.post(videosUrl(), {}, env.admin).catch((e) => e.response)
      expect(res.status).toBe(400)
    })
  },
})
