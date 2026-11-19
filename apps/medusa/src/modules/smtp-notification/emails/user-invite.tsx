import { Button, Heading, Link, Section, Text } from "@react-email/components"
import type { UserInviteData } from "../types"
import { buttonStyle, C, EmailLayout, Eyebrow, h1, link, panel, paragraph, small } from "./theme"

export const userInviteSubject = "Votre accès à l'administration Fini Kura"

/** Invitation to join the Medusa admin. Medusa invites are valid for 24 hours (default in @medusajs/user 2.22.6). */
export function UserInviteEmail(data: UserInviteData) {
  return (
    <EmailLayout preview="Choisissez votre mot de passe pour gérer la boutique. Le lien est valable 24 heures.">
      <Eyebrow>Administration de la boutique</Eyebrow>
      <Heading as="h1" style={h1}>
        Votre accès est prêt
      </Heading>
      <Text style={paragraph}>
        Un accès à l'administration de Fini Kura a été créé pour vous. Vous y suivrez les commandes, les produits et le
        stock.
      </Text>
      <Section style={panel}>
        <Text style={{ margin: 0, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: C.text }}>
          Votre identifiant
        </Text>
        <Text style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: 600, color: C.text }}>{data.email}</Text>
      </Section>
      <Text style={paragraph}>Il ne vous reste qu'à choisir votre mot de passe.</Text>
      <Section style={{ textAlign: "center", margin: "8px 0 20px" }}>
        <Button href={data.inviteUrl} style={buttonStyle}>
          Créer mon accès
        </Button>
      </Section>
      <Text style={small}>
        Le bouton ne s'ouvre pas ? Copiez ce lien dans votre navigateur :
        <br />
        <Link href={data.inviteUrl} style={link}>
          {data.inviteUrl}
        </Link>
      </Text>
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
