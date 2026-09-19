import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const content = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/[locale]/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/[locale]/layout.tsx", import.meta.url), "utf8");
const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const workStrip = await readFile(new URL("../app/[locale]/WorkStrip.tsx", import.meta.url), "utf8");

test("uses the approved recurring start wording", () => {
  assert.match(content, /НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ/);
  assert.doesNotMatch(content, /7 вересня/i);
});

test("keeps pricing and direct contact destinations accurate", () => {
  // суми з нерозривними пробілами всередині числа (щоб «6 000» не рвалося на два рядки)
  assert.match(content, /2\u00A0000 грн/);
  assert.match(content, /12\u00A0000 грн/);
  assert.match(content, /6\u00A0000\u00A0грн\u00A0\+\u00A06\u00A0000\u00A0грн/);
  assert.doesNotMatch(content, /\d \d{3} грн/);
  assert.match(content, /instagram\.com\/rita_visualdesigns/);
  assert.match(content, /t\.me\/rita_visualdesigns/);
});

test("labels works and mentorship honestly", () => {
  assert.match(content, /tag: "МЕНТОРКА"/);
  assert.match(content, /tag: "СТУДЕНТ"/);
  assert.match(content, /ВІДГУКИ ПРО МОЮ РОБОТУ ЯК МЕНТОРКИ/);
  assert.match(content, /з попередніх менторських потоків/);
});

test("keeps the full 10-module program available", () => {
  assert.match(content, /PROMPT ENGINEERING/);
  assert.match(content, /CAPCUT/);
  assert.match(content, /ELEVENLABS/);
  assert.match(content, /programLabel/);
});

test("ends the landing with the enrolment CTA and footer", () => {
  assert.doesNotMatch(page, /price-final/);
  assert.doesNotMatch(content, /МОЖЛИВО, ТОБІ ВЖЕ ЧАС ПОЧАТИ ЗАНОВО/);
  assert.match(page, /logo-white\.webp/);
});

test("keeps the compact text-only tools list and the svg browser icon", () => {
  assert.doesNotMatch(page, /function ToolLogo/);
  assert.doesNotMatch(page, /className="tool-logo"/);
  assert.match(page, /t\.formats\.tools\.map\(\(tool\) => <li key=\{tool\}>\{tool\}<\/li>\)/);
  assert.match(layout, /icons:\s*\{\s*icon:\s*\[\{\s*url:\s*"\/icon\.svg"/);
});

test("shows complete format artwork instead of cropping it", () => {
  assert.match(css, /\.formats-section \.format-media img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(page, /"--format-poster"/);
  assert.match(css, /\.formats-section \.format-media::before\s*\{[^}]*background-image:\s*var\(--format-poster\)/s);
});

test("keeps the requested blinking accents and one-row footer links", () => {
  assert.doesNotMatch(css, /\.hero h1 \.accent-line\s*\{[^}]*animation:/s);
  assert.match(css, /\.hero-start em\s*\{[^}]*animation:\s*start-accent-swap/s);
  assert.match(css, /\.program-details:not\(\[open\]\) summary\s*\{[^}]*animation:\s*program-cta-blink/s);
  assert.match(css, /footer > div\s*\{[^}]*flex-direction:\s*row/s);
});

test("uses the approved full-frame hero background without cover cropping", () => {
  assert.match(page, /asset\("\/hero-bg\.webp"\)/);
  // hero вміщається у висоту екрана: фото тягнеться у висоту й притискається праворуч, без обрізання
  assert.match(css, /background-size:\s*auto 100%/);
  assert.match(css, /height:\s*min\(56\.25vw,\s*100svh\)/);
  assert.match(page, /startLines/);
});

test("renders each hero accent once in the accessible heading", () => {
  assert.doesNotMatch(page, /className="accent-green" aria-hidden="true"/);
  assert.doesNotMatch(page, /<span className="sr-only">\{text\}<\/span>/);
  assert.match(page, /<span className="accent-green">\{text\}<\/span>/);
});

test("keeps a single lightweight showreel set with explicit autoplay fallbacks", () => {
  assert.doesNotMatch(workStrip, /\[1, 2, 3\]\.map/);
  assert.match(workStrip, /autoPlay/);
  assert.match(workStrip, /muted/);
  assert.match(workStrip, /loop/);
  assert.match(workStrip, /playsInline/);
  assert.match(workStrip, /preload="metadata"/);
  assert.match(workStrip, /root: track/);
  assert.match(workStrip, /\{shouldPlay && \(/);
  assert.match(workStrip, /onPointerEnter=\{pauseStrip\}/);
  assert.match(workStrip, /entry\.intersectionRatio >= 0\.25/);
  assert.match(workStrip, /active=\{stripActive && !dialogActive\}/);
});

test("prefixes internal routes and showreel media for sub-path deployment", () => {
  assert.match(page, /href=\{asset\(`\/\$\{other\}`\)\}/);
  assert.match(page, /src:\s*asset\(item\.src\)/);
  assert.match(page, /poster:\s*asset\(item\.poster\)/);
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
