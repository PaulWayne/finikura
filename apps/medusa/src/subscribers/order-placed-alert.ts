import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendOrderAlertWorkflow } from "../workflows/send-order-alert"

/**
 * E-mails every admin user when an order is placed. The order already exists at this point:
 * a failed send is logged and never affects it.
 */
export default async function orderPlacedAlert({ event, container }: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  try {
    const { result } = await sendOrderAlertWorkflow(container).run({ input: { orderId: event.data.id } })
    if (!result.length) logger.warn(`Alerte de commande ${event.data.id} : aucun admin à prévenir`)
  } catch (err) {
    logger.error(`Alerte e-mail de la commande ${event.data.id} non envoyée : ${(err as Error).message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
