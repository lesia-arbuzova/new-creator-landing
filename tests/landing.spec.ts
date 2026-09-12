import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the Ukrainian page at /uk without horizontal overflow", async ({ page }) => {
  const isMobile = test.info().project.name === "mobile";
  const startLine = page.getByText("НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ.", { exact: true });
  await page.goto("/uk");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI-КОНТЕНТ");
  await expect(page.getByRole("link", { name: "ЗАБРОНЮВАТИ МІСЦЕ" })).toHaveAttribute("href", /instagram\.com\/rita_visualdesigns/);
  // за мокапом рядок старту є на десктопі й прихований на телефоні/планшеті
  if (isMobile) {
    await expect(startLine).toBeHidden();
  } else {
    await expect(startLine).toBeVisible();
  }
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/uk\/?$/);

  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport);
});

test("renders the English page at /en with its own metadata", async ({ page }) => {
  const isMobile = test.info().project.name === "mobile";
  const startLine = page.getByText("THE NEXT NEW CREATOR COHORT STARTS ON THE 7TH OF EVERY MONTH.");
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI CONTENT");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/NEW CREATOR — a hands-on AI content course/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/?$/);
  if (isMobile) {
    await expect(startLine).toBeHidden();
  } else {
    await expect(startLine).toBeVisible();
  }
});

test("the language switcher navigates between locale routes", async ({ page }) => {
  await page.goto("/uk");
  await page.getByRole("link", { name: "Змінити мову на англійську" }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI CONTENT");

  await page.getByRole("link", { name: "Switch the language to Ukrainian" }).click();
  await expect(page).toHaveURL(/\/uk\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI-КОНТЕНТ");
});

test("a showreel video opens fullscreen from the strip and closes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/uk");
  // стрічка анімована — для стабільного кліка вимикаємо анімацію стилями
  await page.addStyleTag({ content: ".strip-track{animation:none!important}" });
  await page.locator(".strip-item").first().click();
  const dialog = page.locator(".works-strip-holder dialog.strip-dialog");
  await expect(dialog).toHaveAttribute("open", "");
  await expect(dialog.locator("video")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open");
});

for (const locale of ["uk", "en"]) {
  test(`has no automatically detectable serious accessibility violations on /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    // миготіння акцентів фіксуємо на читабельній фазі для скану контрасту
    await page.addStyleTag({ content: ".hero-start em{animation:none!important}" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
