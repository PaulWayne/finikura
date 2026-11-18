import "server-only";
import { todayInBamako } from "@/lib/content/campaign";
import { listPublicPaths } from "@/lib/site-paths";
import { SITE_URL, absoluteUrl } from "@/lib/site";

// IndexNow (indexnow.org): tells Bing, and through it ChatGPT and Copilot, that pages of the
// shop changed, instead of waiting for its robot to come back. Also read by Yandex, Seznam, Naver.
//
// Triggered by /api/revalidate, so by every publication in Strapi and every change in Medusa.
// A seed or an admin session sends many changes in a row: the list goes out once, a minute after
// the last one, and at most every ten minutes. Off unless INDEXNOW_KEY is set and the site is in
// HTTPS (production): a local or test address is never sent.

const ENDPOINT = "https://api.indexnow.org/indexnow";
const QUIET_MS = 60_000;
const MIN_INTERVAL_MS = 10 * 60_000;
/** The revalidated cache refreshes in the background: the second read sees the change. */
const REFRESH_WAIT_MS = 5_000;

/** The key, also served at /indexnow-key.txt so the engines can check the site is ours. */
export function indexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && /^[A-Za-z0-9-]{8,128}$/.test(key) ? key : null;
}

function isEnabled(): boolean {
  // Never while the site is closed for its preview (src/proxy.ts).
  return indexNowKey() !== null && SITE_URL.startsWith("https://") && !process.env.PREVIEW_PASSWORD?.trim();
}

let timer: ReturnType<typeof setTimeout> | null = null;
let lastSent = 0;

async function submit(): Promise<void> {
  const key = indexNowKey();
  if (!key) return;
  const today = () => todayInBamako(new Date());
  await listPublicPaths(today());
  await new Promise((resolve) => setTimeout(resolve, REFRESH_WAIT_MS));
  const urlList = (await listPublicPaths(today())).map(absoluteUrl);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key,
      keyLocation: absoluteUrl("/indexnow-key.txt"),
      urlList,
    }),
  });
  lastSent = Date.now();
  // 200 and 202 mean received; anything else is logged, never shown to anyone.
  if (res.ok) console.info(`[indexnow] ${urlList.length} pages signalées (${res.status})`);
  else console.warn(`[indexnow] refusé : ${res.status}`);
}

/** Asks for the page list to be sent, once the changes have stopped for a minute. */
export function scheduleIndexNow(): void {
  if (!isEnabled()) return;
  if (timer) clearTimeout(timer);
  const wait = Math.max(QUIET_MS, lastSent + MIN_INTERVAL_MS - Date.now());
  timer = setTimeout(() => {
    timer = null;
    submit().catch((err) => console.warn("[indexnow] envoi impossible", err));
  }, wait);
}
