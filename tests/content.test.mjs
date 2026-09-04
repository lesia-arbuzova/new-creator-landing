import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const content = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/[locale]/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/[locale]/layout.tsx", import.meta.url), "utf8");
const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");

test("uses the approved recurring start wording", () => {
  assert.match(content, /НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ/);
  assert.doesNotMatch(content, /7 вересня/i);
});

test("keeps pricing and direct contact destinations accurate", () => {
  assert.match(content, /2 000 грн/);
  assert.match(content, /12 000 грн/);
  assert.match(content, /6 000 \+ 6 000 грн/);
  assert.match(content, /instagram\.com\/rita_visualdesigns/);
  assert.match(content, /t\.me\/rita_visualdesigns/);
});

test("labels mentorship evidence honestly", () => {
  assert.match(content, /ЦЕ НЕ РОБОТИ ПЕРШОГО ПОТОКУ NEW CREATOR/);
  assert.match(content, /ВІДГУКИ ПРО МОЮ РОБОТУ ЯК МЕНТОРКИ/);
});

test("serves both locales from dedicated routes", () => {
  assert.match(layout, /generateStaticParams/);
  assert.match(layout, /lang=\{locale\}/);
  assert.match(config, /destination:\s*"\/uk"/);
});

test("keeps per-locale canonical, hreflang and OG data", () => {
  assert.match(page, /canonical:\s*asset\(`\/\$\{locale\}`\)/);
  assert.match(page, /languages:\s*\{ uk: asset\("\/uk"\), en: asset\("\/en"\), "x-default": asset\("\/uk"\) \}/);
  assert.match(page, /og-cover-\$\{locale\}\.png/);
  assert.match(sitemap, /alternates/);
});

test("stays noindex before publication approval", () => {
  assert.match(robots, /disallow:\s*"\/"/);
  assert.match(page, /index:\s*false/);
});
