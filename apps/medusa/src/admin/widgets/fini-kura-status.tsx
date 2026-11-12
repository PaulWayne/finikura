import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, StatusBadge, Text, toast, usePrompt } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { FK_ACTIONS, type FkAction, type FkStatus } from "../../lib/fk-status"
import { FK_BADGE } from "../lib/fk-badge"
import { sdk } from "../lib/sdk"

type FkStatusResponse = { status: FkStatus; label: string; actions: FkAction[] }

const FiniKuraStatusWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const { t } = useTranslation()
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
      toast.success(t("fk.status.updated", { label: t(`fk.status.${res.status}`) }))
      // Refresh the native order page (fulfillments, payment, status).
      queryClient.invalidateQueries()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const run = async (action: FkAction) => {
    if (action === "refuse") {
      const ok = await prompt({
        title: t("fk.refusePrompt.title"),
        description: t("fk.refusePrompt.description"),
        confirmText: t("fk.refusePrompt.confirm"),
        cancelText: t("fk.refusePrompt.cancel"),
      })
      if (!ok) return
    }
    mutation.mutate(action)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("fk.status.title")}</Heading>
        {data && <StatusBadge color={FK_BADGE[data.status]}>{t(`fk.status.${data.status}`)}</StatusBadge>}
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
            {t(`fk.actions.${action}`)}
          </Button>
        ))}
      </div>
      {order.shipping_address?.phone && (
        <div className="px-6 py-3">
          <Link
            to={`/commandes-telephone?phone=${encodeURIComponent(order.shipping_address.phone)}`}
            className="text-ui-fg-interactive txt-compact-small hover:underline"
          >
            {t("fk.phoneOrders.otherOrders")}
          </Link>
        </div>
      )}
      <div className="px-6 py-3">
        <Text size="xsmall" className="text-ui-fg-subtle">
          {t("fk.status.medusa", { order: order.status, fulfillment: order.fulfillment_status, payment: order.payment_status })}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default FiniKuraStatusWidget
