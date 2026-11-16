import { expect, test } from "@playwright/test";

// FK-38, mock mode: the fixture « robe-terracotta-brodee » has one clip ready and one still in
// preparation in its metadata; only the ready one is shown.
test("la vidéo est une vue de plus de la galerie et ne se charge qu'au toucher", async ({ page }) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/\.mp4(\?|$)/.test(request.url())) videoRequests.push(request.url());
  });

  await page.goto("/produit/robe-terracotta-brodee");
  // Four photos and the clip.
  await expect(page.getByText("1 / 5")).toBeVisible();

  const play = page.getByRole("button", { name: "Voir la tenue en mouvement" }).first();
  await play.scrollIntoViewIfNeeded();
  await expect(page.getByText("5 / 5")).toBeVisible();
  // Nothing of the video has been downloaded yet.
  await expect(page.locator("video")).toHaveCount(0);
  expect(videoRequests).toHaveLength(0);

  await play.click();
  const video = page.locator("video").first();
  await expect(video).toBeVisible();
  // The light format is offered first, H.264 as the fallback; silent, in a loop.
  const sources = await video.locator("source").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("type")));
  expect(sources[0]).toContain("av01");
  expect(sources[1]).toBe("video/mp4");
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop)).toBe(true);
  await expect(page.getByText("Vidéo d'exemple").first()).toBeVisible();
  await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
});
