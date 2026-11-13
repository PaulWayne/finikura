import { Button, Heading, Section, Text } from "@react-email/components"
import type { PasswordResetData } from "../types"
import { buttonStyle, EmailLayout, h1, paragraph, small } from "./theme"

export const passwordResetSubject = "Choisir un nouveau mot de passe · Fini Kura"

/** Password reset for the Medusa admin. The token lasts 15 minutes (generate-reset-password-token, core-flows 2.22.6). */
export function PasswordResetEmail(data: PasswordResetData) {
  return (
    <EmailLayout preview={passwordResetSubject}>
      <Heading as="h1" style={h1}>
        Nouveau mot de passe
      </Heading>
      <Text style={paragraph}>
        Une demande de nouveau mot de passe a été faite pour l'accès {data.email} à l'administration Fini Kura.
      </Text>
      <Section style={{ textAlign: "center", margin: "8px 0 8px" }}>
        <Button href={data.resetUrl} style={buttonStyle}>
          Choisir un nouveau mot de passe
        </Button>
      </Section>
      <Text style={small}>
        Ce lien est valable 15 minutes. Si vous n'avez rien demandé, ignorez cet e-mail : votre mot de passe actuel
        reste valable.
      </Text>
    </EmailLayout>
  )
}

PasswordResetEmail.PreviewProps = {
  email: "gerante@example.com",
  resetUrl: "http://localhost:9000/app/reset-password?token=preview&email=gerante%40example.com",
} satisfies PasswordResetData

export default PasswordResetEmail
