import "server-only";
import { ContentService } from "./types";
import { mockContentService } from "./mock";
import { liveContentService } from "./live";

const contentSource = process.env.CONTENT_SOURCE || "mock";

export const contentService: ContentService =
  contentSource === "live" ? liveContentService : mockContentService;

export * from "./types";
