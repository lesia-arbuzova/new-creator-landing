import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the Ukrainian page at /uk without horizontal overflow", async ({ page }) => {
  await page.goto("/uk");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("НЕ ПРОСТО");
  await expect(page.getByRole("link", { name: "ХОЧУ НА NEW CREATOR" }).first()).toHaveAttribute("href", /instagram\.com\/rita_visualdesigns/);
  await expect(page.getByText("НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ.", { exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/uk$/);

  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport);
});

test("renders the English page at /en with its own metadata", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("DON'T JUST");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/NEW CREATOR — a hands-on AI content course/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.getByText("THE NEXT NEW CREATOR COHORT STARTS ON THE 7TH OF EVERY MONTH.")).toBeVisible();
});

test("the language switcher navigates between locale routes", async ({ page }) => {
  await page.goto("/uk");
  await page.getByRole("link", { name: "Змінити мову на англійську" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("DON'T JUST");

  await page.getByRole("link", { name: "Switch the language to Ukrainian" }).click();
  await expect(page).toHaveURL(/\/uk$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("НЕ ПРОСТО");
});

for (const locale of ["uk", "en"]) {
  test(`has no automatically detectable serious accessibility violations on /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
