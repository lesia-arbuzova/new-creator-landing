import { expect, test } from "@playwright/test";

test.beforeEach(() => {
  test.skip(test.info().project.name !== "mobile", "responsive and touch regressions");
});

for (const locale of ["uk", "en"]) {
  test(`payment rows and section content stay readable across widths in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    for (const [width, height] of [[320, 844], [360, 800], [390, 664], [430, 932], [760, 844], [768, 844], [844, 390], [1024, 768], [1080, 844]]) {
      await page.setViewportSize({ width, height });
      const layout = await page.evaluate(() => {
        const header = document.querySelector<HTMLElement>(".topbar")!;
        const textBox = (element: Element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getBoundingClientRect();
        };
        return {
          headerFits: header.scrollWidth <= header.clientWidth,
          clipped: Array.from(document.querySelectorAll<HTMLElement>("section"))
            .filter((section) => section.scrollHeight > section.clientHeight + 2)
            .map((section) => section.id || section.className),
          escapedImages: Array.from(document.querySelectorAll(".format-media")).filter((frame) => {
            const box = frame.getBoundingClientRect();
            const image = frame.querySelector("img")!.getBoundingClientRect();
            return image.top < box.top - 1 || image.bottom > box.bottom + 1
              || image.left < box.left - 1 || image.right > box.right + 1;
          }).length,
          rows: Array.from(document.querySelectorAll(".price-options > div:not(.price-actions)")).map((row) => {
            const box = row.getBoundingClientRect();
            const number = textBox(row.querySelector("span")!);
            const amount = textBox(row.querySelector("strong")!);
            const label = textBox(row.querySelector("p")!);
            return {
              inset: number.left - box.left,
              amountFits: amount.right <= box.right - 8,
              labelFits: label.right <= box.right - 8,
              labelBelowAmount: label.top >= amount.bottom,
              labelAlignment: Math.abs(label.left - amount.left),
            };
          }),
        };
      });
      expect(layout.headerFits, `${width}px header`).toBe(true);
      expect(layout.clipped, `${width}px clipped sections`).toEqual([]);
      expect(layout.escapedImages, `${width}px images covering section text`).toBe(0);
      for (const row of layout.rows) {
        expect(row.inset, `${width}px number padding`).toBeGreaterThanOrEqual(12);
        expect(row.amountFits, `${width}px payment amount`).toBe(true);
        expect(row.labelFits, `${width}px payment label`).toBe(true);
        expect(row.labelBelowAmount, `${width}px overlapping text`).toBe(true);
        expect(row.labelAlignment, `${width}px label alignment`).toBeLessThanOrEqual(1);
      }
    }
  });
}

test("showreel resumes the same player after scrolling away and back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/uk#works", { waitUntil: "domcontentloaded" });
  const preview = page.locator(".strip-frame video").first();
  await expect.poll(() => preview.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  const original = await preview.elementHandle();

  await page.locator("#price").scrollIntoViewIfNeeded();
  await expect(preview).toHaveJSProperty("paused", true);
  await page.locator(".strip-track").scrollIntoViewIfNeeded();
  expect(await preview.evaluate((video, previous) => video === previous, original)).toBe(true);
  await expect(preview).toHaveJSProperty("paused", false);
  const resumedAt = await preview.evaluate((video: HTMLVideoElement) => video.currentTime);
  await expect.poll(() => preview.evaluate((video: HTMLVideoElement) => video.currentTime)).not.toBe(resumedAt);
  await expect(preview).not.toHaveClass(/has-playback-error/);
});

test("blocked inline autoplay retains a poster and allows playback after a tap", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.closest(".strip-frame")) {
        return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
      }
      return play.call(this);
    };
  });
  await page.goto("/uk#works", { waitUntil: "domcontentloaded" });
  const first = page.locator(".strip-item").first();
  await expect(first.locator("video")).toHaveClass(/has-playback-error/);
  await expect(first.locator(".strip-poster")).toHaveJSProperty("complete", true);
  expect(await first.locator(".strip-poster").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await first.tap();
  const dialog = page.locator(".strip-dialog[open]");
  await expect(dialog).toBeVisible();
  const video = dialog.locator("video");
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveJSProperty("muted", false);
  await page.getByRole("button", { name: "Закрити відео" }).tap();
  await expect(dialog).toHaveCount(0);
});
