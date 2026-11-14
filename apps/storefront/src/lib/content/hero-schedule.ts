import type { ContentBlock, HeroBlockData } from "./types";

// FK-39: the home page may hold several heroes, each with an optional display window.
// Only one is shown: the first scheduled hero running now, else the first hero without
// dates (the default one). It takes the place of the first hero block.

const isRunning = (hero: HeroBlockData, now: number) =>
  (!hero.startsAt || Date.parse(hero.startsAt) <= now) && (!hero.endsAt || Date.parse(hero.endsAt) > now);

export function pickHero(
  blocks: ContentBlock[],
  now: number,
  isUsable: (hero: HeroBlockData) => boolean = () => true,
): ContentBlock[] {
  const heroes = blocks.filter((b): b is HeroBlockData => b.type === "hero");
  if (heroes.length === 0) return blocks;
  const usable = heroes.filter((h) => isRunning(h, now) && isUsable(h));
  const chosen = usable.find((h) => h.startsAt || h.endsAt) ?? usable.find((h) => !h.startsAt && !h.endsAt) ?? null;
  const firstHero = blocks.indexOf(heroes[0]);
  return blocks.flatMap<ContentBlock>((b, i) => (b.type !== "hero" ? [b] : i === firstHero && chosen ? [chosen] : []));
}
