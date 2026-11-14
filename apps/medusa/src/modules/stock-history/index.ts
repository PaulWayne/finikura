import { Module } from "@medusajs/framework/utils"
import StockHistoryModuleService from "./service"

export const STOCK_HISTORY_MODULE = "stockHistory"

export default Module(STOCK_HISTORY_MODULE, { service: StockHistoryModuleService })
