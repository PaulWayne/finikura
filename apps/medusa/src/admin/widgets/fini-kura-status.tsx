import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, StatusBadge, Text, toast, usePrompt } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FK_ACTIONS, FK_ACTION_LABELS, type FkAction, type FkStatus } from "../../lib/fk-status"
import { sdk } from "../lib/sdk"

type FkStatusResponse = { status: FkStatus; label: string; actions: FkAction[] }

const BADGE: Record<FkStatus, "grey" | "blue" | "orange" | "green" | "red"> = {
  new: "grey",
  confirmed: "blue",
  shipping: "orange",
  delivered: "green",
  refused: "red",
}

const FiniKuraStatusWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const queryClient = useQueryClient()
  const prompt = usePrompt()
  const path = `/admin/orders/${order.id}/fini-kura-status`

  const { data, isLoading } = useQuery({
    queryKey: ["fini-kura-status", order.id],
    queryFn: () => sdk.client.fetch<FkStatusResponse>(path),
  })

  const mutation = useMutation({
    mutationFn: (action: FkAction) =>
      sdk.client.fetch<FkStatusResponse>(path, { method: "POST", body: { action } }),
    onSuccess: (res) => {
      toast.success(`Statut : ${res.label}`)
      // Refresh the native order page (fulfillments, payment, status).
      queryClient.invalidateQueries()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const run = async (action: FkAction) => {
    if (action === "refuse") {
      const ok = await prompt({
        title: "Refuser la commande ?",
        description: "La commande est annulée et les articles reviennent en stock. Ce n'est pas réversible.",
        confirmText: "Refuser",
        cancelText: "Retour",
      })
      if (!ok) return
    }
    mutation.mutate(action)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Statut Fini Kura</Heading>
        {data && <StatusBadge color={BADGE[data.status]}>{data.label}</StatusBadge>}
      </div>
      <div className="flex flex-wrap gap-2 px-6 py-4">
        {FK_ACTIONS.map((action) => (
          <Button
            key={action}
            size="small"
            variant={action === "refuse" ? "danger" : "secondary"}
            disabled={isLoading || mutation.isPending || !data?.actions.includes(action)}
            isLoading={mutation.isPending && mutation.variables === action}
            onClick={() => run(action)}
          >
            {FK_ACTION_LABELS[action]}
          </Button>
        ))}
      </div>
      <div className="px-6 py-3">
        <Text size="xsmall" className="text-ui-fg-subtle">
          Statut Medusa : commande {order.status}, préparation {order.fulfillment_status}, paiement{" "}
          {order.payment_status}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default FiniKuraStatusWidget
