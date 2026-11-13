import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { formatXof } from "../../../lib/format"
import type { OrderAlertData } from "../types"

// Brand palette (copied from the storefront tokens). No navy or black; pink is reserved for the logo.
const C = {
  bg: "#FDF7F2",
  surface: "#EADCCC",
  text: "#5E5245",
  primary: "#8A7058",
  white: "#FFFFFF",
}
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "Poppins, Arial, Helvetica, sans-serif"

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Africa/Bamako",
})

export function orderPlacedSubject(data: OrderAlertData): string {
  return `Nouvelle commande #${data.displayId} · ${data.customer.name} · ${formatXof(data.total)}`
}

const label = { margin: "0", fontSize: "12px", color: C.primary, textTransform: "uppercase" as const, letterSpacing: "0.08em" }
const value = { margin: "2px 0 12px", fontSize: "15px", color: C.text, lineHeight: "1.5" }

export function OrderPlacedEmail(data: OrderAlertData) {
  const { customer } = data
  return (
    <Html lang="fr">
      <Head />
      <Preview>{orderPlacedSubject(data)}</Preview>
      <Body style={{ margin: 0, padding: "24px 12px", backgroundColor: C.bg, fontFamily: SANS, color: C.text }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: C.white, borderRadius: "12px", padding: "28px 24px" }}>
          <Text style={{ margin: 0, fontFamily: SERIF, fontSize: "22px", fontWeight: 600, color: C.text }}>Fini Kura</Text>
          <Hr style={{ borderColor: C.surface, margin: "16px 0 20px" }} />

          <Heading as="h1" style={{ margin: 0, fontFamily: SERIF, fontSize: "24px", fontWeight: 600, color: C.text }}>
            {`Nouvelle commande #${data.displayId}`}
          </Heading>
          <Text style={{ margin: "6px 0 24px", fontSize: "14px", color: C.text }}>
            {dateFormat.format(new Date(data.createdAt))}
          </Text>

          <Section style={{ backgroundColor: C.bg, borderRadius: "8px", padding: "16px 16px 4px" }}>
            <Text style={label}>Cliente</Text>
            <Text style={value}>{customer.name}</Text>
            <Text style={label}>Téléphone</Text>
            <Text style={value}>
              <Link href={`tel:${customer.phone.replace(/\s/g, "")}`} style={{ color: C.primary, fontWeight: 600 }}>
                {customer.phone}
              </Link>
            </Text>
            <Text style={label}>Quartier</Text>
            <Text style={value}>{customer.neighborhood}</Text>
            {customer.landmarks && (
              <>
                <Text style={label}>Repères</Text>
                <Text style={value}>{customer.landmarks}</Text>
              </>
            )}
          </Section>

          <Heading as="h2" style={{ margin: "28px 0 8px", fontFamily: SERIF, fontSize: "18px", fontWeight: 600, color: C.text }}>
            Articles
          </Heading>
          {data.items.map((item, i) => (
            <Row key={i} style={{ borderBottom: `1px solid ${C.surface}` }}>
              <Column style={{ padding: "10px 0", fontSize: "14px", lineHeight: "1.4" }}>
                <strong>{item.title}</strong>
                <br />
                {`Taille ${item.size} · Quantité ${item.quantity}`}
              </Column>
              <Column align="right" style={{ padding: "10px 0", fontSize: "14px", whiteSpace: "nowrap", verticalAlign: "top" }}>
                {formatXof(item.total)}
              </Column>
            </Row>
          ))}
          <Row>
            <Column style={{ padding: "14px 0", fontSize: "16px", fontWeight: 600 }}>Total</Column>
            <Column align="right" style={{ padding: "14px 0", fontSize: "16px", fontWeight: 600, whiteSpace: "nowrap" }}>
              {formatXof(data.total)}
            </Column>
          </Row>

          {data.adminUrl && (
            <Section style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                href={data.adminUrl}
                style={{ backgroundColor: C.primary, color: C.white, borderRadius: "8px", padding: "14px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
              >
                Voir la commande dans l'admin
              </Button>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  )
}

OrderPlacedEmail.PreviewProps = {
  orderId: "order_preview",
  displayId: 1042,
  createdAt: "2026-12-01T10:30:00.000Z",
  customer: { name: "Awa Traoré", phone: "+223 70 12 34 56", neighborhood: "Badalabougou", landmarks: "Près de la pharmacie, portail vert" },
  items: [
    { title: "Robe terracotta brodée", size: "6 ans", quantity: 1, total: 12500 },
    { title: "Chemise lin sable", size: "8 ans", quantity: 1, total: 12500 },
  ],
  total: 25000,
  adminUrl: "http://localhost:9000/app/orders/order_preview",
} satisfies OrderAlertData

export default OrderPlacedEmail
