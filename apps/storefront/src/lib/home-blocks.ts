import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { commerceService } from "@/lib/commerce";
import { contentService, type ContentBlock, type HeroBlockData } from "@/lib/content";
import { isCampaignActive, todayInBamako } from "@/lib/content/campaign";
import { messages } from "@/messages/fr";

// FK-39: during its dates, a campaign marked « mettre en avant sur l'accueil » takes the
// place of the default hero (the « Grande image » block of the home page). The front
// assembles Strapi (campaign) and Medusa (its collection): a campaign whose collection has
// no product is not featured, like its own page.

function campaignHero(campaign: Awaited<ReturnType<typeof contentService.getFeaturedCampaigns>>[number]): HeroBlockData {
  return {
    type: "hero",
    id: `campagne-${campaign.slug}`,
    name: campaign.title,
    eyebrow: campaign.title,
    title: campaign.texts.headline || campaign.title,
    subtitle: campaign.texts.description,
    ctaText: campaign.heroCtaText || messages.home.campaignHeroCta,
    ctaLink: `/campagne/${campaign.slug}`,
    imageUrl: campaign.visuals.bannerUrl,
    imageAlt: campaign.visuals.bannerAlt,
  };
}

export async function getHomeBlocks(): Promise<ContentBlock[]> {
  "use cache";
  cacheTag(CACHE_TAGS.content, CACHE_TAGS.catalog);
  // Hourly. A cache length computed from the clock would make the page dynamic (Next 16),
  // so the hero only features a campaign still open one hour from now: it never links
  // to a campaign page that closed at midnight in Bamako.
  cacheLife("hours");
  const now = new Date();

  const [home, featured] = await Promise.all([contentService.getHomePage(), contentService.getFeaturedCampaigns()]);
  const today = todayInBamako(now);
  const inOneHour = todayInBamako(new Date(now.getTime() + 3600_000));
  const running = featured
    .filter((c) => isCampaignActive(c, today) && isCampaignActive(c, inOneHour))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  let hero: HeroBlockData | null = null;
  for (const campaign of running) {
    const products = await commerceService.getCollectionProducts(campaign.collectionHandle, 1);
    if (products.length > 0) {
      hero = campaignHero(campaign);
      break;
    }
  }
  if (!hero) return home.blocks;

  const index = home.blocks.findIndex((b) => b.type === "hero");
  return index === -1 ? [hero, ...home.blocks] : home.blocks.map((b, i) => (i === index ? hero : b));
}
