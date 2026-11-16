import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, Input, StatusBadge, Text, toast, usePrompt } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { sdk } from "../lib/sdk"

type ProductVideo = {
  id: string
  status: "processing" | "ready" | "failed"
  caption?: string
  av1_url?: string
  mp4_url?: string
  poster_url?: string
}
type VideosResponse = { videos: ProductVideo[]; max: number }

// A phone video of 15 s is 20 to 40 Mo; beyond this it is a long film, not a clip.
const MAX_UPLOAD_MB = 80

// FK-38: on a product, the manager drops the video of her phone; the server prepares the clip.
const FiniKuraProductVideosWidget = ({ data: product }: DetailWidgetProps<{ id: string }>) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const client = useQueryClient()
  const picker = useRef<HTMLInputElement>(null)
  const queryKey = ["fini-kura-product-videos", product.id]
  const base = `/admin/fini-kura/products/${product.id}/videos`

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => sdk.client.fetch<VideosResponse>(base),
    // While a clip is being prepared, the list is read again until it is online or failed.
    refetchInterval: (query) => (query.state.data?.videos.some((v) => v.status === "processing") ? 2500 : false),
  })
  const videos = data?.videos ?? []
  const max = data?.max ?? 4
  const refresh = () => client.invalidateQueries({ queryKey })
  const failed = () => toast.error(t("fk.productVideos.error"))

  const send = useMutation({
    mutationFn: async (file: File) => {
      const { files } = await sdk.admin.upload.create({ files: [file] })
      return sdk.client.fetch(base, { method: "POST", body: { file_id: files[0].id } })
    },
    onSuccess: () => {
      toast.success(t("fk.productVideos.sent"))
      refresh()
    },
    onError: failed,
  })

  const change = useMutation({
    mutationFn: ({ id, ...body }: { id: string; caption?: string; move?: "up" | "down" }) =>
      sdk.client.fetch(`${base}/${id}`, { method: "POST", body }),
    onSuccess: refresh,
    onError: failed,
  })

  const remove = useMutation({
    mutationFn: (id: string) => sdk.client.fetch(`${base}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success(t("fk.productVideos.removed"))
      refresh()
    },
    onError: failed,
  })

  const onPick = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("video/")) return toast.error(t("fk.productVideos.notVideo"))
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return toast.error(t("fk.productVideos.tooBig", { max: MAX_UPLOAD_MB }))
    send.mutate(file)
  }

  const askRemove = async (id: string) => {
    const confirmed = await prompt({
      title: t("fk.productVideos.remove"),
      description: t("fk.productVideos.removeConfirm"),
      confirmText: t("fk.productVideos.remove"),
      cancelText: t("actions.cancel"),
    })
    if (confirmed) remove.mutate(id)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-start justify-between gap-4 px-6 py-4">
        <div>
          <Heading level="h2">{t("fk.productVideos.title")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("fk.productVideos.intro")}
          </Text>
        </div>
        <input
          ref={picker}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            onPick(e.target.files?.[0])
            e.target.value = ""
          }}
        />
        <Button
          variant="secondary"
          size="small"
          className="shrink-0"
          isLoading={send.isPending}
          disabled={videos.length >= max}
          onClick={() => picker.current?.click()}
        >
          {send.isPending ? t("fk.productVideos.sending") : t("fk.productVideos.add")}
        </Button>
      </div>

      {videos.length >= max && (
        <div className="px-6 py-3">
          <Text size="small">{t("fk.productVideos.limit", { max })}</Text>
        </div>
      )}
      {!isLoading && videos.length === 0 && (
        <div className="px-6 py-4">
          <Text>{t("fk.productVideos.empty")}</Text>
        </div>
      )}

      {videos.map((video, index) => (
        <VideoRow
          key={video.id}
          video={video}
          isFirst={index === 0}
          isLast={index === videos.length - 1}
          isBusy={change.isPending || remove.isPending}
          onCaption={(caption) =>
            change.mutate({ id: video.id, caption }, { onSuccess: () => toast.success(t("fk.productVideos.captionSaved")) })
          }
          onMove={(move) => change.mutate({ id: video.id, move })}
          onRemove={() => askRemove(video.id)}
        />
      ))}
    </Container>
  )
}

function VideoRow(props: {
  video: ProductVideo
  isFirst: boolean
  isLast: boolean
  isBusy: boolean
  onCaption: (caption: string) => void
  onMove: (move: "up" | "down") => void
  onRemove: () => void
}) {
  const { t } = useTranslation()
  const { video } = props
  const [caption, setCaption] = useState(video.caption ?? "")
  const color = video.status === "ready" ? "green" : video.status === "failed" ? "red" : "orange"

  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row">
      <div className="bg-ui-bg-subtle h-40 w-28 shrink-0 overflow-hidden rounded-md">
        {video.status === "ready" && (
          <video
            aria-label={t("fk.productVideos.preview")}
            poster={video.poster_url}
            controls
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover"
          >
            {video.av1_url && <source src={video.av1_url} type='video/mp4; codecs="av01.0.04M.08"' />}
            {video.mp4_url && <source src={video.mp4_url} type="video/mp4" />}
          </video>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <StatusBadge color={color} className="self-start">
          {t(`fk.productVideos.${video.status}`)}
        </StatusBadge>
        {video.status === "failed" && <Text size="small">{t("fk.productVideos.failedHelp")}</Text>}

        {video.status === "ready" && (
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              props.onCaption(caption)
            }}
          >
            <label className="flex min-w-0 flex-1 flex-col gap-1">
              <Text size="small" weight="plus">
                {t("fk.productVideos.captionLabel")}
              </Text>
              <Input
                size="small"
                maxLength={120}
                value={caption}
                placeholder={t("fk.productVideos.captionPlaceholder")}
                onChange={(e) => setCaption(e.target.value)}
              />
            </label>
            <Button type="submit" variant="secondary" size="small" disabled={props.isBusy || caption === (video.caption ?? "")}>
              {t("fk.productVideos.saveCaption")}
            </Button>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {video.status === "ready" && !props.isFirst && (
            <Button variant="transparent" size="small" disabled={props.isBusy} onClick={() => props.onMove("up")}>
              {t("fk.productVideos.moveUp")}
            </Button>
          )}
          {video.status === "ready" && !props.isLast && (
            <Button variant="transparent" size="small" disabled={props.isBusy} onClick={() => props.onMove("down")}>
              {t("fk.productVideos.moveDown")}
            </Button>
          )}
          <Button variant="transparent" size="small" disabled={props.isBusy} onClick={props.onRemove}>
            {t("fk.productVideos.remove")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default FiniKuraProductVideosWidget
