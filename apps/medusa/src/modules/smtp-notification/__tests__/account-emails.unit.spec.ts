import { PasswordResetEmail } from "../emails/password-reset"
import { UserInviteEmail } from "../emails/user-invite"
import { renderTemplate } from "../templates"

describe("account e-mails", () => {
  it("renders the invite with its link and validity", async () => {
    const email = await renderTemplate("user-invite", UserInviteEmail.PreviewProps)
    expect(email.subject).toBe("Votre accès à l'administration Fini Kura")
    expect(email.html).toContain('href="http://localhost:9000/app/invite?token=preview"')
    expect(email.html).toContain("Créer mon accès")
    expect(email.html).toContain("24 heures")
    expect(email.html).toContain("soeur@example.com")
  })

  it("renders the password reset with its link and validity", async () => {
    const email = await renderTemplate("password-reset", PasswordResetEmail.PreviewProps)
    expect(email.subject).toBe("Choisir un nouveau mot de passe · Fini Kura")
    expect(email.html).toContain(
      'href="http://localhost:9000/app/reset-password?token=preview&amp;email=gerante%40example.com"'
    )
    expect(email.html).toContain("15 minutes")
    expect(email.text).toContain("ignorez cet e-mail")
  })
})
