import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep } from "@medusajs/medusa/core-flows"

type Input = {
  to: string
  template: string
  data: Record<string, unknown>
  trigger_type: string
  resource_id?: string
  resource_type?: string
}

/** Sends one account e-mail (admin invite, password reset) on the e-mail channel. */
export const sendAccountEmailWorkflow = createWorkflow("send-account-email", function (input: Input) {
  const notifications = transform({ input }, ({ input }) => [{ ...input, channel: "email" }])
  return new WorkflowResponse(sendNotificationsStep(notifications))
})
