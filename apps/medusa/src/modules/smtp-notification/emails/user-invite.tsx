import { Button, Heading, Section, Text } from "@react-email/components"
import type { UserInviteData } from "../types"
import { buttonStyle, EmailLayout, h1, paragraph, small } from "./theme"

export const userInviteSubject = "Votre accès à l'administration Fini Kura"

/** Invitation to join the Medusa admin. Medusa invites are valid for 24 hours (default in @medusajs/user 2.22.6). */
export function UserInviteEmail(data: UserInviteData) {
  return (
    <EmailLayout preview={userInviteSubject}>
      <Heading as="h1" style={h1}>
        Vous êtes invitée à gérer Fini Kura
      </Heading>
      <Text style={paragraph}>
        Un accès à l'administration de la boutique a été créé pour {data.email}. Vous pourrez y suivre les commandes,
        les produits et le stock.
      </Text>
      <Text style={paragraph}>Cliquez sur le bouton, puis choisissez votre mot de passe.</Text>
      <Section style={{ textAlign: "center", margin: "8px 0 8px" }}>
        <Button href={data.inviteUrl} style={buttonStyle}>
          Créer mon accès
        </Button>
      </Section>
      <Text style={small}>
        Ce lien est valable 24 heures. S'il a expiré, demandez une nouvelle invitation. Si vous n'attendiez pas cet
        e-mail, ignorez-le.
      </Text>
    </EmailLayout>
  )
}

UserInviteEmail.PreviewProps = {
  email: "soeur@example.com",
  inviteUrl: "http://localhost:9000/app/invite?token=preview",
} satisfies UserInviteData

export default UserInviteEmail
