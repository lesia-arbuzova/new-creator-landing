import { expect, test } from "@playwright/test";

test.beforeEach(() => {
  test.skip(test.info().project.name !== "desktop", "laptop video compositing regression");
});

for (const [width, height] of [[1366, 768], [1920, 916]]) {
  test(`scrolling past the showreel keeps video frames inside the strip at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/uk#works", { waitUntil: "domcontentloaded" });
    const track = page.locator(".strip-track");
    await track.scrollIntoViewIfNeeded();
    const video = track.locator("video").first();
    const canvas = track.locator("canvas").first();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
    await expect(canvas).toHaveClass(/has-rendered-frame/);
    // Advancing time alone is insufficient: the preview must paint new pixels.
    const firstFrame = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
    await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).not.toBe(firstFrame);
    await expect(video).toHaveCSS("visibility", "hidden");
    const original = await video.elementHandle();
    const positions = await page.evaluate(() => ({
      strip: Math.round(document.querySelector(".strip-track")!.getBoundingClientRect().top + scrollY - 60),
      formats: Math.round(document.querySelector("#formats")!.getBoundingClientRect().top + scrollY - 60),
      formatsDocumentTop: document.querySelector("#formats")!.getBoundingClientRect().top + scrollY,
    }));

    // The heading has no animation. Its pixels must stay identical after
    // scrolling live videos over this area repeatedly in both directions.
    await page.evaluate((top) => window.scrollTo(0, top), positions.formats);
    const heading = page.locator("#formats .section-heading");
    const baseline = await heading.screenshot();
    for (let cycle = 0; cycle < 5; cycle++) {
      await page.evaluate((top) => window.scrollTo(0, top), positions.strip);
      await expect(video).toHaveJSProperty("paused", false);
      await page.mouse.move(width - 20, height - 20);
      await page.mouse.wheel(0, positions.formats - positions.strip);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(positions.formats, 0);
      // No 1.5-second delay with invisible decoders still running.
      await expect.poll(() => track.locator("video").evaluateAll((elements) =>
        (elements as HTMLVideoElement[]).filter((element) => !element.paused).length,
      ), { timeout: 750 }).toBe(0);
      expect(await heading.screenshot()).toEqual(baseline);
      expect(await page.locator("#formats").evaluate((element) => element.getBoundingClientRect().top + scrollY))
        .toBe(positions.formatsDocumentTop);
    }

    await page.evaluate((top) => window.scrollTo(0, top), positions.strip);
    expect(await video.evaluate((element, previous) => element === previous, original)).toBe(true);
    await expect(video).toHaveJSProperty("paused", false);
    const resumedFrame = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
    await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).not.toBe(resumedFrame);
    await expect(track.locator("video.has-playback-error")).toHaveCount(0);
  });
}

test("vertical scrolling suspends horizontal autoplay until the page settles", async ({ page }) => {
  await page.goto("/uk#works", { waitUntil: "domcontentloaded" });
  const track = page.locator(".strip-track");
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const start = await track.evaluate((element) => element.scrollLeft);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(start + 5);

  const movement = await page.evaluate(async () => {
    const element = document.querySelector(".strip-track")!;
    const top = window.scrollY;
    window.scrollTo(0, top + 8);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const before = element.scrollLeft;
    for (let frame = 0; frame < 24; frame++) {
      window.scrollTo(0, top + (frame % 2 ? 8 : 0));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return { before, after: element.scrollLeft };
  });
  expect(Math.abs(movement.after - movement.before)).toBeLessThanOrEqual(2);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(movement.after + 5);
});

test("browsers without video frame callbacks retain native inline playback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLVideoElement.prototype, "requestVideoFrameCallback", { value: undefined, configurable: true });
  });
  await page.goto("/uk#works", { waitUntil: "domcontentloaded" });
  await page.locator(".strip-track").scrollIntoViewIfNeeded();
  const video = page.locator(".strip-frame video").first();
  await expect(video).toHaveCSS("visibility", "visible");
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
});
