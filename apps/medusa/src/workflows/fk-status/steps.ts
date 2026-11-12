import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { allowedActions, FkAction, FkOrder, FK_ACTION_LABELS, FK_STATUS_LABELS, getFkStatus } from "../../lib/fk-status"

/** Re-checks, inside the workflow, that the action is allowed for the current status. */
export const validateFkActionStep = createStep(
  "validate-fk-action",
  async ({ order, action }: { order: FkOrder; action: FkAction }) => {
    const status = getFkStatus(order)
    if (!allowedActions(status).includes(action)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `« ${FK_ACTION_LABELS[action]} » est impossible : la commande est « ${FK_STATUS_LABELS[status]} ».`
      )
    }
    return new StepResponse(status)
  }
)
