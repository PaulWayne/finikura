import { OrderPlacedEmail } from "../emails/order-placed"
import { renderTemplate } from "../templates"

const data = OrderPlacedEmail.PreviewProps

describe("order-placed e-mail", () => {
  it("renders the order details in French with FCFA amounts", async () => {
    const email = await renderTemplate("order-placed", data)
    expect(email.subject).toBe("Nouvelle commande #1042 · Awa Traoré · 25 000 FCFA")
    for (const text of [
      "Nouvelle commande #1042",
      "Awa Traoré",
      "+223 70 12 34 56",
      'href="tel:+22370123456"',
      "Badalabougou",
      "portail vert",
      "Taille 6 ans",
      "Taille 8 ans",
      "12 500 FCFA",
      "25 000 FCFA",
      'href="http://localhost:9000/app/orders/order_preview"',
    ]) {
      expect(email.html).toContain(text)
    }
    expect(email.text).toContain("25 000 FCFA")
  })

  it("leaves out the admin button when no admin URL is configured", async () => {
    const email = await renderTemplate("order-placed", { ...data, adminUrl: null })
    expect(email.html).not.toContain("Voir la commande")
  })

  it("rejects an unknown template", async () => {
    await expect(renderTemplate("unknown", {})).rejects.toThrow("Template d'e-mail inconnu")
  })
})
