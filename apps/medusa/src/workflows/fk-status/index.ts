import type { FkAction } from "../../lib/fk-status"
import { fkConfirmOrderWorkflow } from "./confirm-order"
import { fkDeliverOrderWorkflow } from "./deliver-order"
import { fkRefuseOrderWorkflow } from "./refuse-order"
import { fkShipOrderWorkflow } from "./ship-order"

export const FK_WORKFLOWS: Record<FkAction, typeof fkConfirmOrderWorkflow> = {
  confirm: fkConfirmOrderWorkflow,
  ship: fkShipOrderWorkflow,
  deliver: fkDeliverOrderWorkflow,
  refuse: fkRefuseOrderWorkflow,
}
