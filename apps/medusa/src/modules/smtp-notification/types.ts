/** Data the "order-placed" e-mail template expects (built by the send-order-alert workflow). */
export type OrderAlertData = {
  orderId: string
  displayId: number
  /** ISO date of the order. */
  createdAt: string
  customer: {
    name: string
    phone: string
    neighborhood: string
    landmarks: string
  }
  items: { title: string; size: string; quantity: number; total: number }[]
  total: number
  /** Link to the order in the Medusa admin, or null when MEDUSA_ADMIN_URL is not set. */
  adminUrl: string | null
}

export const ORDER_PLACED_TEMPLATE = "order-placed"

export type UserInviteData = { email: string; inviteUrl: string }
export type PasswordResetData = { email: string; resetUrl: string }

export const USER_INVITE_TEMPLATE = "user-invite"
export const PASSWORD_RESET_TEMPLATE = "password-reset"

/** Base URL of the Medusa admin (e.g. https://api.example.com/app), without trailing slash. */
export function adminBaseUrl(): string {
  return (process.env.MEDUSA_ADMIN_URL || "http://localhost:9000/app").replace(/\/$/, "")
}
