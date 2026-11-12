import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Tells the storefront to revalidate its catalogue cache tag when something it
 * displays changes: products, variants, prices, categories, collections, tags,
 * stock levels, and orders (which reserve or release stock).
 * Event names checked in @medusajs/utils 2.22.6 (ProductEvents, PricingEvents, InventoryEvents).
 */
export default async function revalidateStorefront({ event, container }: SubscriberArgs) {
  const url = process.env.STOREFRONT_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) return

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  try {
    const res = await fetch(`${url}?source=medusa`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
    })
    if (!res.ok) logger.warn(`Revalidation du site (${event.name}) : HTTP ${res.status}`)
  } catch (err) {
    logger.warn(`Revalidation du site impossible (${event.name}) : ${(err as Error).message}`)
  }
}

const crud = (entity: string) => ["created", "updated", "deleted"].map((action) => `${entity}.${action}`)

export const config: SubscriberConfig = {
  event: [
    ...crud("product"),
    ...crud("product-variant"),
    ...crud("product-category"),
    ...crud("product-collection"),
    ...crud("product-tag"),
    ...crud("price"),
    ...crud("inventory-level"),
    "order.placed",
    "order.canceled",
  ],
}
