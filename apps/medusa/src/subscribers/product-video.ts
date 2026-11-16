import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { PRODUCT_VIDEO_UPLOADED, prepareProductVideo } from "../lib/product-videos"

// FK-38: prepares the clip sent from the product page, in the background.
export default async function prepareUploadedProductVideo({
  event,
  container,
}: SubscriberArgs<{ product_id: string; video_id: string }>) {
  await prepareProductVideo(container, event.data.product_id, event.data.video_id)
}

export const config: SubscriberConfig = { event: PRODUCT_VIDEO_UPLOADED }
