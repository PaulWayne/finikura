import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, Table, Text } from "@medusajs/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { sdk } from "../lib/sdk"

type StockChange = {
  id: string
  created_at: string
  previous_quantity: number | null
  new_quantity: number
  cause: "shipped" | "returned" | "manual" | "reset" | "other"
  order_id: string | null
  order_display_id: number | null
  actor_name: string | null
}
type StockHistoryPage = { changes: StockChange[]; count: number; offset: number; limit: number; reserved: number }

// FK-42: on a size in Inventaire, every stock change in everyday words, latest first.
const FiniKuraStockHistoryWidget = ({ data: item }: DetailWidgetProps<{ id: string }>) => {
  const { t, i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["fini-kura-stock-history", item.id],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      sdk.client.fetch<StockHistoryPage>("/admin/fini-kura/stock-history", {
        query: { inventory_item_id: item.id, offset: pageParam },
      }),
    getNextPageParam: (last) => (last.offset + last.limit < last.count ? last.offset + last.limit : undefined),
  })

  const changes = data?.pages.flatMap((p) => p.changes) ?? []
  const reserved = data?.pages[0]?.reserved ?? 0

  const describe = (c: StockChange) => {
    const order = c.order_display_id ?? ""
    switch (c.cause) {
      case "shipped":
        return t("fk.stockHistory.shipped", { order })
      case "returned":
        return t("fk.stockHistory.returned", { order })
      case "manual":
        return c.actor_name ? t("fk.stockHistory.manualBy", { name: c.actor_name }) : t("fk.stockHistory.manual")
      case "reset":
        return t("fk.stockHistory.reset")
      default:
        return t("fk.stockHistory.other")
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("fk.stockHistory.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("fk.stockHistory.intro")}
        </Text>
        {reserved > 0 && (
          <Text size="small" className="mt-2">
            {t("fk.stockHistory.reserved", { count: reserved })}
          </Text>
        )}
      </div>
      {!isLoading && changes.length === 0 && (
        <div className="px-6 py-4">
          <Text>{t("fk.stockHistory.empty")}</Text>
        </div>
      )}
      {changes.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("fk.stockHistory.date")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.stockHistory.what")}</Table.HeaderCell>
              <Table.HeaderCell>{t("fk.stockHistory.stock")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {changes.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>{dateFormat.format(new Date(c.created_at))}</Table.Cell>
                <Table.Cell>
                  {c.order_id ? (
                    <Link to={`/orders/${c.order_id}`} className="text-ui-fg-interactive hover:underline">
                      {describe(c)}
                    </Link>
                  ) : (
                    describe(c)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {c.previous_quantity === null ? "" : `${c.previous_quantity} → `}
                  {c.new_quantity}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {hasNextPage && (
        <div className="px-6 py-4">
          <Button variant="secondary" size="small" isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            {t("fk.stockHistory.more")}
          </Button>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "inventory_item.details.after",
})

export default FiniKuraStockHistoryWidget
