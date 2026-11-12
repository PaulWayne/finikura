import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Label, StatusBadge, Table, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router-dom"
import type { FkStatus } from "../../../lib/fk-status"
import { FK_BADGE } from "../../lib/fk-badge"
import { sdk } from "../../lib/sdk"

type PhoneOrder = {
  id: string
  display_id: number
  created_at: string
  total: number
  currency_code: string
  name: string
  status: FkStatus
  label: string
}
type OrdersByPhoneResponse = { phone: string; orders: PhoneOrder[] }


const OrdersByPhonePage = () => {
  const { t, i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" })
  const formatXof = (n: number) => `${new Intl.NumberFormat(i18n.language).format(n)} FCFA`
  const [params, setParams] = useSearchParams()
  const phone = params.get("phone") ?? ""
  const [input, setInput] = useState(phone)

  const { data, error, isFetching } = useQuery({
    queryKey: ["orders-by-phone", phone],
    queryFn: () =>
      sdk.client.fetch<OrdersByPhoneResponse>("/admin/fini-kura/orders-by-phone", { query: { phone } }),
    enabled: phone.trim().length > 0,
    retry: false,
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setParams(input.trim() ? { phone: input.trim() } : {})
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">{t("fk.phoneOrders.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("fk.phoneOrders.intro")}
        </Text>
      </div>
      <form onSubmit={submit} className="flex items-end gap-2 px-6 py-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fk-phone">{t("fk.phoneOrders.phone")}</Label>
          <Input id="fk-phone" type="tel" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <Button type="submit" variant="secondary" isLoading={isFetching}>
          {t("fk.phoneOrders.search")}
        </Button>
      </form>

      {error && (
        <div className="px-6 py-4">
          <Text className="text-ui-fg-error">{t("fk.phoneOrders.invalid")}</Text>
        </div>
      )}

      {data && data.orders.length === 0 && (
        <div className="px-6 py-4">
          <Text>{t("fk.phoneOrders.empty", { phone: data.phone })}</Text>
        </div>
      )}

      {data && data.orders.length > 0 && (
        <div>
          <div className="px-6 py-3">
            <Text size="small" className="text-ui-fg-subtle">
              {t("fk.phoneOrders.count", { count: data.orders.length, phone: data.phone })}
            </Text>
          </div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t("fk.phoneOrders.date")}</Table.HeaderCell>
                <Table.HeaderCell>{t("fk.phoneOrders.order")}</Table.HeaderCell>
                <Table.HeaderCell>{t("fk.phoneOrders.name")}</Table.HeaderCell>
                <Table.HeaderCell>{t("fk.phoneOrders.total")}</Table.HeaderCell>
                <Table.HeaderCell>{t("fk.status.title")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.orders.map((o) => (
                <Table.Row key={o.id}>
                  <Table.Cell>{dateFormat.format(new Date(o.created_at))}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/orders/${o.id}`} className="text-ui-fg-interactive hover:underline">
                      #{o.display_id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{o.name}</Table.Cell>
                  <Table.Cell>{formatXof(o.total)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={FK_BADGE[o.status]}>{t(`fk.status.${o.status}`)}</StatusBadge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "fk.phoneOrders.menu",
  translationNs: "translation",
  // Listed under "Orders" in the sidebar.
  nested: "/orders",
})

export default OrdersByPhonePage
