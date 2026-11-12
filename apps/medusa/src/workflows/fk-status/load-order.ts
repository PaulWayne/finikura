import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { transform } from "@medusajs/framework/workflows-sdk"
import { FkOrder, FK_ORDER_FIELDS } from "../../lib/fk-status"

/** Loads the order with the fields the Fini Kura status needs. */
export function loadFkOrder(orderId: string) {
  const { data } = useQueryGraphStep({
    entity: "order",
    fields: FK_ORDER_FIELDS,
    filters: { id: orderId },
    options: { throwIfKeyNotFound: true },
  })
  return transform({ data }, ({ data }) => data[0] as unknown as FkOrder)
}
