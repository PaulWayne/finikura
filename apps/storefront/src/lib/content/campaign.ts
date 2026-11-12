import type { Campaign } from "./types";

/** Today's date in Bamako (UTC+0, no daylight saving), as YYYY-MM-DD. */
export function todayInBamako(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** A campaign is visible from its start date to its end date, both inclusive. */
export function isCampaignActive(
  campaign: Pick<Campaign, "startDate" | "endDate">,
  today: string,
): boolean {
  return campaign.startDate <= today && today <= campaign.endDate;
}
