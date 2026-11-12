// Fini Kura order status, derived from the native Medusa state.
// Shared by the admin route, the workflows and the admin widget.

export type FkStatus = "new" | "confirmed" | "shipping" | "delivered" | "refused"
export type FkAction = "confirm" | "ship" | "deliver" | "refuse"

export const FK_ACTIONS: FkAction[] = ["confirm", "ship", "deliver", "refuse"]

export const FK_STATUS_LABELS: Record<FkStatus, string> = {
  new: "Nouvelle",
  confirmed: "Confirmée sur WhatsApp",
  shipping: "En livraison",
  delivered: "Livrée et payée",
  refused: "Refusée ou annulée",
}

export const FK_ACTION_LABELS: Record<FkAction, string> = {
  confirm: "Confirmée sur WhatsApp",
  ship: "Partie en livraison",
  deliver: "Livrée et payée",
  refuse: "Refusée",
}

/** Fields the status needs, for query.graph. */
export const FK_ORDER_FIELDS = [
  "id",
  "status",
  "metadata",
  "items.id",
  "items.quantity",
  "fulfillments.id",
  "fulfillments.canceled_at",
  "fulfillments.shipped_at",
  "fulfillments.delivered_at",
  "fulfillments.items.line_item_id",
  "fulfillments.items.quantity",
  "payment_collections.payments.id",
  "payment_collections.payments.captured_at",
  "payment_collections.payments.canceled_at",
]

type Nullable<T> = T | null | undefined

export type FkOrder = {
  id: string
  status: string
  metadata?: Nullable<Record<string, unknown>>
  items?: Nullable<Nullable<{ id: string; quantity: unknown }>[]>
  fulfillments?: Nullable<
    Nullable<{
      id: string
      canceled_at?: Nullable<unknown>
      shipped_at?: Nullable<unknown>
      delivered_at?: Nullable<unknown>
      items?: Nullable<Nullable<{ line_item_id?: Nullable<string>; quantity: unknown }>[]>
    }>[]
  >
  payment_collections?: Nullable<
    Nullable<{
      payments?: Nullable<
        Nullable<{ id: string; captured_at?: Nullable<unknown>; canceled_at?: Nullable<unknown> }>[]
      >
    }>[]
  >
}

export function activeFulfillment(order: FkOrder) {
  return (order.fulfillments ?? []).find((f) => f && !f.canceled_at) ?? undefined
}

export function payments(order: FkOrder) {
  return (order.payment_collections ?? []).flatMap((c) => c?.payments ?? []).filter((p) => !!p)
}

export function getFkStatus(order: FkOrder): FkStatus {
  if (order.status === "canceled") return "refused"
  const ful = activeFulfillment(order)
  const pays = payments(order)
  const captured = pays.length > 0 && pays.every((p) => p!.captured_at || p!.canceled_at)
  if (order.status === "completed" || (ful?.delivered_at && captured)) return "delivered"
  if (ful) return "shipping"
  if (order.metadata?.confirmed_at) return "confirmed"
  return "new"
}

const ALLOWED: Record<FkStatus, FkAction[]> = {
  new: ["confirm", "refuse"],
  confirmed: ["ship", "refuse"],
  shipping: ["deliver", "refuse"],
  delivered: [],
  refused: [],
}

export function allowedActions(status: FkStatus): FkAction[] {
  return ALLOWED[status]
}
