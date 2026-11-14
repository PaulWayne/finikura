import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, StatusBadge, Table, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { FkStatus } from "../../lib/fk-status"
import { FK_BADGE } from "../lib/fk-badge"
import { sdk } from "../lib/sdk"

type RecentOrder = {
  id: string
  display_id: number
  created_at: string
  total: number
  name: string
  phone: string
  district: string
  status: FkStatus
}

// Above the order list: the 10 latest orders with name, phone and Fini Kura status.
const FiniKuraRecentOrdersWidget = () => {
  const { t, i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" })
  const formatXof = (n: number) => `${new Intl.NumberFormat(i18n.language).format(n)} FCFA`

  const { data, isLoading } = useQuery({
    queryKey: ["fini-kura-recent-orders"],
    queryFn: () => sdk.client.fetch<{ orders: RecentOrder[] }>("/admin/fini-kura/recent-orders"),
    refetchInterval: 60_000,
  })

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("fk.recentOrders.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("fk.recentOrders.intro")}
        </Text>
      </div>
      {!isLoading && data?.orders.length === 0 && (
        <div className="px-6 py-4">
          <Text>{t("fk.recentOrders.empty")}</Text>
        </div>
      )}
      {data && data.orders.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("fk.phoneOrders.order")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.phoneOrders.date")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.phoneOrders.name")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.phoneOrders.phone")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.recentOrders.district")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.phoneOrders.total")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.status.title")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.orders.map((o) => (
              <Table.Row key={o.id}>
                <Table.Cell>
                  <Link to={`/orders/${o.id}`} className="text-ui-fg-interactive hover:underline">
                    #{o.display_id}
                  </Link>
                </Table.Cell>
                <Table.Cell>{dateFormat.format(new Date(o.created_at))}</Table.Cell>
                <Table.Cell>{o.name}</Table.Cell>
                <Table.Cell>
                  {o.phone ? (
                    <Link
                      to={`/commandes-telephone?phone=${encodeURIComponent(o.phone)}`}
                      className="text-ui-fg-interactive hover:underline"
                    >
                      {o.phone}
                    </Link>
                  ) : null}
                </Table.Cell>
                <Table.Cell>{o.district}</Table.Cell>
                <Table.Cell>{formatXof(o.total)}</Table.Cell>
                <Table.Cell>
                  <StatusBadge color={FK_BADGE[o.status]}>{t(`fk.status.${o.status}`)}</StatusBadge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default FiniKuraRecentOrdersWidget
