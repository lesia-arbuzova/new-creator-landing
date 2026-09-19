import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(() => {
  test.skip(test.info().project.name !== "mobile", "mobile and tablet navigation");
});

for (const locale of ["uk", "en"]) {
  const openLabel = locale === "uk" ? "Відкрити меню" : "Open menu";
  const closeLabel = locale === "uk" ? "Закрити меню" : "Close menu";
  const menuLabel = locale === "uk" ? "Меню" : "Menu";

  test(`menu stays compact and reachable on phones and tablets in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}#formats`);
    const trigger = page.getByRole("button", { name: openLabel, exact: true });
    const menu = page.getByRole("dialog", { name: menuLabel, exact: true });

    for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [844, 390], [1080, 768]]) {
      await page.setViewportSize({ width, height });
      const before = await page.evaluate(() => ({
        y: scrollY,
        width: document.body.getBoundingClientRect().width,
        sectionTop: document.querySelector("#formats")!.getBoundingClientRect().top,
      }));
      await trigger.tap();
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const layout = await menu.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return {
          width: box.width, height: box.height, left: box.left, right: box.right, top: box.top, bottom: box.bottom,
          headerBottom: document.querySelector(".topbar")!.getBoundingClientRect().bottom,
          pageWidth: document.body.getBoundingClientRect().width,
          sectionTop: document.querySelector("#formats")!.getBoundingClientRect().top,
          y: scrollY,
        };
      });
      expect(layout.width).toBeLessThanOrEqual(432);
      expect(layout.height).toBeLessThanOrEqual(360);
      expect(layout.left).toBeGreaterThanOrEqual(8);
      expect(layout.right).toBeLessThanOrEqual(width - 8);
      expect(layout.top).toBeGreaterThanOrEqual(layout.headerBottom);
      expect(layout.bottom).toBeLessThanOrEqual(height - 8);
      expect(layout.pageWidth).toBe(before.width);
      expect(layout.y).toBe(before.y);
      expect(layout.sectionTop).toBe(before.sectionTop);
      await menu.getByRole("link").last().scrollIntoViewIfNeeded();
      await expect(menu.getByRole("link").last()).toBeInViewport();
      await page.getByRole("button", { name: closeLabel, exact: true }).tap();
      await expect(menu).toBeHidden();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBe(before.y);
    }
  });

  test(`all menu links close the panel and reach their section in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const trigger = page.getByRole("button", { name: openLabel, exact: true });
    const menu = page.getByRole("dialog", { name: menuLabel, exact: true });

    for (const section of ["works", "formats", "mentor", "price"]) {
      await trigger.tap();
      await menu.locator(`a[href$="#${section}"]`).tap();
      await expect(menu).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`/${locale}#${section}$`));
      await expect(page.locator(`#${section} h2`)).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
    }

    await trigger.tap();
    await expect(menu.locator('a[href$="#price"]')).toHaveAttribute("aria-current", "location");
  });
}

test("menu traps focus, closes with Escape or the backdrop, and unlocks after desktop resize", async ({ page }) => {
  await page.goto("/uk#mentor");
  const trigger = page.getByRole("button", { name: "Відкрити меню", exact: true });
  const menu = page.getByRole("dialog", { name: "Меню", exact: true });
  const close = menu.getByRole("button", { name: "Закрити меню", exact: true });
  const initialY = await page.evaluate(() => scrollY);

  await trigger.click();
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(initialY);

  await trigger.click();
  await page.mouse.click(5, 800);
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(initialY);

  await trigger.click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
});
