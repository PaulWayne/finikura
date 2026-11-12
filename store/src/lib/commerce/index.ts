import "server-only";
import { CommerceService } from "./types";
import { mockCommerceService } from "./mock";
import { liveCommerceService } from "./live";

const commerceSource = process.env.COMMERCE_SOURCE || "mock";

export const commerceService: CommerceService =
  commerceSource === "live" ? liveCommerceService : mockCommerceService;

export * from "./types";
