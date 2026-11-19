import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components"
import type { ReactNode } from "react"

// Brand palette (copied from the storefront tokens). No navy or black; pink is reserved for the logo.
// Terracotta is an accent only (dots, thin lines), never a text colour.
export const C = {
  bg: "#FDF7F2",
  surface: "#EADCCC",
  text: "#5E5245",
  primary: "#8A7058",
  terracotta: "#CA7154",
  white: "#FFFFFF",
}
export const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
export const SANS = "Poppins, Arial, Helvetica, sans-serif"

// Same button as the storefront: taupe, square corners, small spaced capitals.
export const buttonStyle = {
  backgroundColor: C.primary,
  color: C.white,
  borderRadius: "4px",
  padding: "15px 28px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
}
export const paragraph = { margin: "0 0 16px", fontSize: "15px", lineHeight: "1.65", color: C.text }
export const small = { margin: "16px 0 0", fontSize: "13px", lineHeight: "1.55", color: C.text }
export const h1 = {
  margin: "0 0 16px",
  fontFamily: SERIF,
  fontSize: "26px",
  lineHeight: "1.25",
  fontWeight: 400,
  color: C.text,
}
/** A fact set apart from the text (the account, the order): cream panel with a taupe edge. */
export const panel = {
  margin: "0 0 20px",
  padding: "14px 16px",
  backgroundColor: C.bg,
  borderLeft: `3px solid ${C.primary}`,
  borderRadius: "4px",
}
export const link = { color: C.primary, textDecoration: "underline", wordBreak: "break-all" as const }

/** The pill above a title, as on the home page of the site: cream surface, terracotta dot. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text style={{ margin: "0 0 14px" }}>
      <span
        style={{
          display: "inline-block",
          padding: "6px 14px",
          backgroundColor: C.surface,
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 500,
          color: C.text,
        }}
      >
        <span style={{ color: C.terracotta }}>●</span>&nbsp;&nbsp;{children}
      </span>
    </Text>
  )
}

/** Common frame of every Fini Kura e-mail: brand header, white card, signature of the shop. */
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "32px 12px", backgroundColor: C.bg, fontFamily: SANS, color: C.text }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section style={{ textAlign: "center", padding: "0 0 22px" }}>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: "28px", lineHeight: "1.2", color: C.text }}>
              Fini Kura
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: C.text }}>
              Habits pour enfants
            </Text>
          </Section>
          <Section
            style={{
              backgroundColor: C.white,
              border: `1px solid ${C.surface}`,
              borderTop: `3px solid ${C.primary}`,
              borderRadius: "8px",
              padding: "32px 28px",
            }}
          >
            {children}
          </Section>
          <Section style={{ textAlign: "center", padding: "20px 16px 0" }}>
            <Text style={{ margin: 0, fontSize: "12px", lineHeight: "1.6", color: C.text }}>
              Fini Kura, boutique en ligne de vêtements pour enfants, livrés à domicile à Bamako.
            </Text>
            <Text style={{ margin: "6px 0 0", fontSize: "12px", lineHeight: "1.6", color: C.text }}>
              Message envoyé automatiquement par l'administration de la boutique.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
