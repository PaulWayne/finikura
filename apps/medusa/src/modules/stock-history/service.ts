import { MedusaService } from "@medusajs/framework/utils"
import { StockCause } from "./models/stock-cause"
import { StockChange } from "./models/stock-change"
import { StockSeen } from "./models/stock-seen"

class StockHistoryModuleService extends MedusaService({ StockChange, StockCause, StockSeen }) {}

export default StockHistoryModuleService
