import { Body, Container, Head, Hr, Html, Preview, Text } from "@react-email/components"
import type { ReactNode } from "react"

// Brand palette (copied from the storefront tokens). No navy or black; pink is reserved for the logo.
export const C = {
  bg: "#FDF7F2",
  surface: "#EADCCC",
  text: "#5E5245",
  primary: "#8A7058",
  white: "#FFFFFF",
}
export const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
export const SANS = "Poppins, Arial, Helvetica, sans-serif"

export const buttonStyle = {
  backgroundColor: C.primary,
  color: C.white,
  borderRadius: "8px",
  padding: "14px 24px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
}
export const paragraph = { margin: "0 0 16px", fontSize: "15px", lineHeight: "1.6", color: C.text }
export const small = { margin: "16px 0 0", fontSize: "13px", lineHeight: "1.5", color: C.text }
export const h1 = { margin: "0 0 16px", fontFamily: SERIF, fontSize: "24px", fontWeight: 600, color: C.text }

/** Common frame of every Fini Kura e-mail: brand name, separator, white card. */
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "24px 12px", backgroundColor: C.bg, fontFamily: SANS, color: C.text }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: C.white, borderRadius: "12px", padding: "28px 24px" }}>
          <Text style={{ margin: 0, fontFamily: SERIF, fontSize: "22px", fontWeight: 600, color: C.text }}>Fini Kura</Text>
          <Hr style={{ borderColor: C.surface, margin: "16px 0 20px" }} />
          {children}
        </Container>
      </Body>
    </Html>
  )
}
