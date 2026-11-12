import Medusa from "@medusajs/js-sdk"

// The admin is served by Medusa itself (/app), so the API is on the same origin.
export const sdk = new Medusa({
  baseUrl: "/",
  auth: { type: "session" },
})
