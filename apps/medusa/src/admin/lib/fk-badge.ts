import type { FkStatus } from "../../lib/fk-status"

export const FK_BADGE: Record<FkStatus, "grey" | "blue" | "orange" | "green" | "red"> = {
  new: "grey",
  confirmed: "blue",
  shipping: "orange",
  delivered: "green",
  refused: "red",
}
