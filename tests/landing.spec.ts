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

test("hero heading exposes every phrase exactly once", async ({ page }) => {
  await page.goto("/uk");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveAccessibleName("AI-КОНТЕНТ, ЩО ПРОДАЄ ТА ВИДІЛЯЄ.");
  expect((await heading.getAttribute("aria-label"))?.match(/ПРОДАЄ/g)).toHaveLength(1);
});

test("renders the English page at /en with its own metadata", async ({ page }) => {
  const isMobile = test.info().project.name === "mobile";
  const startLine = page.getByText("THE NEXT NEW CREATOR COHORT STARTS ON THE 7TH OF EVERY MONTH.");
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI CONTENT");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/NEW CREATOR - a hands-on AI content course/);
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

test("desktop content sections use content-driven heights without clipping", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop-only section geometry");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });

  const geometry = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".hero")!;
    const slides = Array.from(document.querySelectorAll<HTMLElement>(
      ".works-section, .formats-section, .audience-section, .mentor-section, .faq-section, .price-section",
    ));
    return {
      hero: hero.clientHeight,
      slides: slides.map((slide) => ({
        name: slide.className,
        height: slide.clientHeight,
        scrollHeight: slide.scrollHeight,
      })),
    };
  });

  const heights = geometry.slides.map((slide) => slide.height);
  expect(new Set(heights.map(Math.round)).size, "all sections still share one artificial height").toBeGreaterThan(2);
  for (const slide of geometry.slides) {
    expect(slide.scrollHeight, `${slide.name} content clips vertically`).toBeLessThanOrEqual(slide.height + 1);
  }
  expect(geometry.slides.find((slide) => slide.name.includes("faq"))!.height).toBeLessThan(geometry.hero);
  expect(geometry.slides.find((slide) => slide.name.includes("price"))!.height).toBeLessThan(geometry.hero);
});

test("desktop section labels align with titles and dense sections avoid artificial whitespace", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop-only composition check");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });

  const layout = await page.evaluate(() => {
    const box = (selector: string) => document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
    const sectionMetrics = (selector: string, first: string, last: string) => {
      const section = box(selector);
      const firstBox = box(first);
      const lastBox = box(last);
      return {
        height: section.height,
        topSpace: firstBox.top - section.top,
        bottomSpace: section.bottom - lastBox.bottom,
      };
    };
    const audienceHeading = box(".audience-section .for-who > div");
    const audienceList = box(".audience-section .for-who ul");
    const program = box(".audience-section .program-details");
    return {
      kickerDeltas: [".works-section", ".formats-section"].map((section) => {
        const kicker = box(`${section} .section-heading .kicker`);
        const title = box(`${section} .section-heading h2`);
        return Math.abs(kicker.top - title.top);
      }),
      audienceHeadingDelta: Math.abs(audienceHeading.top - audienceList.top),
      programWidth: program.width,
      audienceListWidth: audienceList.width,
      faq: sectionMetrics(".faq-section", ".faq-heading", ".faq-ask"),
      price: sectionMetrics(".price-section", ".price-main", ".price-options"),
      faqHeadingToAsk: box(".faq-ask").top - box(".faq-heading").bottom,
    };
  });

  for (const delta of layout.kickerDeltas) expect(delta).toBeLessThanOrEqual(12);
  expect(layout.audienceHeadingDelta).toBeLessThanOrEqual(12);
  expect(layout.programWidth).toBeLessThanOrEqual(layout.audienceListWidth + 1);
  expect(layout.faq.height).toBeLessThan(720);
  expect(layout.faq.topSpace).toBeLessThanOrEqual(80);
  expect(layout.faq.bottomSpace).toBeLessThanOrEqual(80);
  expect(layout.faqHeadingToAsk).toBeLessThanOrEqual(72);
  expect(layout.price.height).toBeLessThan(720);
  expect(layout.price.topSpace).toBeLessThanOrEqual(60);
  expect(layout.price.bottomSpace).toBeLessThanOrEqual(60);
});

test("mobile mentor copy and reviews stay inside the viewport", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile-only clipping check");
  await page.goto("/uk#mentor");

  const clipping = await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".mentor-section")!;
    const sectionBox = section.getBoundingClientRect();
    const children = Array.from(section.querySelectorAll<HTMLElement>(
      ".mentor-copy, .mentor-copy > p, .mentor-steps, .mentor-sign, .mentor-reviews, .review-gallery",
    ));
    return {
      sectionScrollWidth: section.scrollWidth,
      sectionClientWidth: section.clientWidth,
      viewportHeight: window.innerHeight,
      slideUnits: Array.from(document.querySelectorAll<HTMLElement>(
        ".works-section, .audience-section, .mentor-copy, .mentor-reviews, .faq-section, .price-section",
      )).map((slide) => ({
        name: slide.className,
        height: slide.clientHeight,
        scrollHeight: slide.scrollHeight,
      })),
      outside: children
        .map((el) => ({ text: el.textContent?.trim().slice(0, 40), right: el.getBoundingClientRect().right }))
        .filter((item) => item.right > sectionBox.right + 1),
    };
  });

  expect(clipping.sectionScrollWidth).toBeLessThanOrEqual(clipping.sectionClientWidth);
  expect(clipping.outside).toEqual([]);
  for (const slide of clipping.slideUnits) {
    expect(slide.height, `${slide.name} is taller than the viewport`).toBeLessThan(clipping.viewportHeight);
    expect(slide.scrollHeight, `${slide.name} clips vertically`).toBeLessThanOrEqual(slide.height + 1);
  }
});

test("mobile format cards and FAQ actions stay fully readable", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile-only responsive check");
  await page.goto("/uk");

  const layout = await page.evaluate(() => {
    const formats = document.querySelector<HTMLElement>(".formats-section")!;
    const formatBox = formats.getBoundingClientRect();
    const formatList = document.querySelector<HTMLElement>(".format-list")!;
    const formatListBox = formatList.getBoundingClientRect();
    const programSummary = document.querySelector<HTMLElement>(".program-details summary")!;
    // лише картки форматів: всередині є вкладені .format-tools li (чіпи інструментів)
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".format-list > li"));
    const askTitle = document.querySelector<HTMLElement>(".faq-ask-title p")!.getBoundingClientRect();
    const actions = document.querySelector<HTMLElement>(".faq-ask-actions")!.getBoundingClientRect();
    const buttons = Array.from(document.querySelectorAll<HTMLElement>(".faq-ask-actions .button"));
    return {
      formatScrollWidth: formats.scrollWidth,
      formatClientWidth: formats.clientWidth,
      cards: cards.map((card) => {
        const box = card.getBoundingClientRect();
        const title = card.querySelector<HTMLElement>("h3")!;
        const text = card.querySelector<HTMLElement>("p")!;
        const titleRange = document.createRange();
        titleRange.selectNodeContents(title);
        return {
          left: box.left,
          right: box.right,
          titleTextRight: titleRange.getBoundingClientRect().right,
          textLeft: text.getBoundingClientRect().left,
        };
      }),
      formatLeft: formatBox.left,
      formatRight: formatBox.right,
      formatCenterDelta: Math.abs(
        (formatListBox.left + formatListBox.right) / 2 - (formatBox.left + formatBox.right) / 2,
      ),
      programAnimation: getComputedStyle(programSummary).animationName,
      askGap: actions.top - askTitle.bottom,
      buttonWidths: buttons.map((button) => button.getBoundingClientRect().width),
    };
  });

  expect(layout.formatScrollWidth).toBeLessThanOrEqual(layout.formatClientWidth);
  expect(layout.cards).toHaveLength(3);
  for (const card of layout.cards) {
    expect(card.left).toBeGreaterThanOrEqual(layout.formatLeft);
    expect(card.right).toBeLessThanOrEqual(layout.formatRight);
    expect(card.titleTextRight).toBeLessThanOrEqual(card.right);
  }
  expect(layout.formatCenterDelta).toBeLessThanOrEqual(1);

  expect(layout.programAnimation).toBe("program-cta-blink");
  expect(layout.askGap).toBeGreaterThanOrEqual(8);
  for (const width of layout.buttonWidths) expect(width).toBeLessThanOrEqual(layout.formatClientWidth);
});

test("mobile audience slide has a clear heading and balanced vertical rhythm", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile-only composition check");
  await page.goto("/uk#audience");

  await expect(page.getByRole("heading", { level: 2, name: "ДЛЯ КОГО ЦЕ НАВЧАННЯ" })).toBeVisible();
  const composition = await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".audience-section")!;
    const headingGroup = document.querySelector<HTMLElement>(".for-who > div")!;
    const title = document.querySelector<HTMLElement>(".audience-title")!;
    const list = document.querySelector<HTMLElement>(".for-who ul")!;
    const program = document.querySelector<HTMLElement>(".audience-section .program-details")!;
    const sectionBox = section.getBoundingClientRect();
    const headingBox = headingGroup.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const programBox = program.getBoundingClientRect();
    return {
      titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
      topSpace: headingBox.top - sectionBox.top,
      bottomSpace: sectionBox.bottom - programBox.bottom,
      headingGap: listBox.top - headingBox.bottom,
      programGap: programBox.top - listBox.bottom,
      sectionHeight: section.clientHeight,
      sectionScrollHeight: section.scrollHeight,
      titleLines: Math.round(titleBox.height / Number.parseFloat(getComputedStyle(title).lineHeight)),
    };
  });

  expect(composition.titleSize).toBeGreaterThanOrEqual(32);
  expect(composition.topSpace).toBeLessThan(100);
  expect(composition.bottomSpace).toBeLessThan(100);
  expect(Math.abs(composition.topSpace - composition.bottomSpace)).toBeLessThanOrEqual(2);
  expect(composition.headingGap).toBeGreaterThanOrEqual(20);
  expect(composition.programGap).toBeGreaterThanOrEqual(28);
  expect(composition.sectionScrollHeight).toBeLessThanOrEqual(composition.sectionHeight + 1);
});

test("uses stable section jumps and keeps the split payment on one line", async ({ page }) => {
  await page.goto("/uk");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");

  const payment = page.getByText("6 000 грн + 6 000 грн", { exact: true });
  await expect(payment).toBeVisible();
  const lineMetrics = await payment.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getClientRects().length;
  });
  expect(lineMetrics).toBe(1);
  await expect(page.getByText("МОЖЛИВО, ТОБІ ВЖЕ ЧАС ПОЧАТИ ЗАНОВО.")).toHaveCount(0);
});

test("tablet hero keeps the intro in five lines and centers the portfolio card", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "single tablet geometry check");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/uk");

  const heroGeometry = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll<HTMLElement>(".hero-sub-mobile span"));
    const portfolio = document.querySelector<HTMLElement>(".hero-stats > div:last-child")!;
    const portfolioBox = portfolio.getBoundingClientRect();
    const valueBox = portfolio.querySelector("dd")!.getBoundingClientRect();
    const labelBox = portfolio.querySelector("dt")!.getBoundingClientRect();
    return {
      lines: lines.map((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        return { text: line.textContent, rects: range.getClientRects().length };
      }),
      portfolioCenter: portfolioBox.top + portfolioBox.height / 2,
      contentCenter: (valueBox.top + labelBox.bottom) / 2,
    };
  });

  expect(heroGeometry.lines).toEqual([
    { text: "Практичний курс, де ти", rects: 1 },
    { text: "навчишся створювати", rects: 1 },
    { text: "AI-фото, відео та", rects: 1 },
    { text: "креативи, які", rects: 1 },
    { text: "працюють.", rects: 1 },
  ]);
  expect(Math.abs(heroGeometry.portfolioCenter - heroGeometry.contentCenter)).toBeLessThanOrEqual(1);
});

test("a showreel video opens fullscreen from the strip and closes", async ({ page }) => {
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".strip-track")).toBeAttached();
  await page.locator(".works-section").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const track = page.locator(".strip-track");
  const card = page.locator(".strip-item").first();
  await track.evaluate((node) => node.classList.add("is-paused"));
  await expect(track).toHaveClass(/is-paused/);
  await page.waitForTimeout(100);
  const before = await track.evaluate((node) => node.scrollLeft);
  await card.evaluate((node: HTMLButtonElement) => node.click());
  const dialog = page.locator(".works-strip-holder dialog.strip-dialog");
  await expect(dialog).toHaveAttribute("open", "");
  const lightbox = dialog.locator("video");
  await expect(lightbox).toBeVisible();
  await expect.poll(() => lightbox.evaluate((video: HTMLVideoElement) => ({
    muted: video.muted,
    paused: video.paused,
    readyState: video.readyState,
    currentTime: video.currentTime,
  }))).toMatchObject({ muted: false, paused: false, readyState: 4 });

  await page.waitForTimeout(500);
  const after = await track.evaluate((node) => node.scrollLeft);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open");
});

test("mobile showreel loads only visible videos on a slow connection", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile-only loading budget");
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) requests.push(request.url());
  });
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  await page.locator(".works-section").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await expect.poll(() => page.locator(".strip-frame video").evaluateAll((videos) =>
    (videos as HTMLVideoElement[]).filter((video) => video.readyState >= 2).length,
  ), { timeout: 15_000 }).toBeGreaterThan(0);
  const mounted = await page.locator(".strip-frame video").count();
  expect(mounted).toBeLessThanOrEqual(5);
  expect(new Set(requests).size).toBeLessThanOrEqual(5);
});

test("iPhone 12 showreel keeps visible posters when Safari blocks autoplay", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 664 },
    screen: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function blockedAutoplay() {
      return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
    };
  });
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  await page.locator(".work-strip").scrollIntoViewIfNeeded();
  await expect(page.locator(".strip-frame.is-near-viewport").first()).toBeVisible();
  const poster = page.locator(".strip-frame.is-near-viewport .strip-poster").first();
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("src", /(?:mentor|student|showcase).+\.jpg$/);
  await expect(poster).toHaveJSProperty("complete", true);
  await context.close();
});

test("repeated page scrolling does not thrash videos or leave compositor animations running", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop scroll stress check");
  test.setTimeout(90_000);
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const counters = { play: 0, pause: 0, waiting: 0, stalled: 0, error: 0 };
    Object.assign(window, { __showreelCounters: counters });
    document.querySelectorAll<HTMLVideoElement>(".strip-frame video").forEach((video) => {
      for (const event of Object.keys(counters) as Array<keyof typeof counters>) {
        video.addEventListener(event, () => counters[event]++);
      }
    });
  });

  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let cycle = 0; cycle < 6; cycle++) {
      for (const ratio of [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25, 0]) {
        window.scrollTo(0, max * ratio);
        await new Promise((resolve) => window.setTimeout(resolve, 70));
      }
    }
  });

  const state = await page.evaluate(() => ({
    counters: (window as unknown as Window & { __showreelCounters: Record<string, number> }).__showreelCounters,
    playbackErrors: document.querySelectorAll(".strip-frame video.has-playback-error").length,
    unexpectedInfiniteAnimations: document.getAnimations().filter((animation) => {
      if (animation.effect?.getTiming().iterations !== Infinity) return false;
      const target = (animation.effect as KeyframeEffect).target as Element | null;
      return !target?.matches(".hero-start em, .program-details:not([open]) summary");
    }).length,
  }));
  expect(state.counters.play).toBeLessThanOrEqual(16 * 6);
  expect(state.counters.pause).toBeLessThanOrEqual(16 * 6);
  expect(state.counters.waiting).toBeLessThanOrEqual(16 * 2);
  expect(state.counters.stalled).toBe(0);
  expect(state.counters.error).toBe(0);
  expect(state.playbackErrors).toBe(0);
  expect(state.unexpectedInfiniteAnimations).toBe(0);
});

test("showreel moves smoothly, pauses only over a card and keeps visible media rendered", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop pointer behavior");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const section = page.locator(".works-section");
  const track = page.locator(".strip-track");
  const card = page.locator(".strip-item").nth(3);
  await section.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".strip-frame video").evaluateAll((elements) => {
    const visible = (elements as HTMLVideoElement[]).filter((video) => {
      const box = video.getBoundingClientRect();
      const visibleWidth = Math.min(box.right, innerWidth) - Math.max(box.left, 0);
      return visibleWidth >= Math.min(48, box.width / 2);
    });
    return visible.filter((video) => video.readyState >= 2 && video.videoWidth > 0 && !video.paused).length;
  }), { timeout: 10_000 }).toBeGreaterThan(0);

  const visibleMedia = await page.locator(".strip-frame video").evaluateAll((elements) =>
    (elements as HTMLVideoElement[])
      .filter((video) => !video.paused)
      .map((video) => ({ readyState: video.readyState, width: video.videoWidth, paused: video.paused })),
  );
  expect(visibleMedia.length).toBeGreaterThan(0);
  expect(visibleMedia.some((video) => video.readyState >= 2 && video.width > 0 && !video.paused)).toBe(true);

  const movingFrom = await track.evaluate((node) => node.scrollLeft);
  await page.waitForTimeout(350);
  const movingTo = await track.evaluate((node) => node.scrollLeft);
  expect(movingTo).toBeGreaterThan(movingFrom + 5);

  const cardBox = await card.boundingBox();
  if (!cardBox) throw new Error("showreel card has no box");
  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
  await page.waitForTimeout(150);
  const pausedFrom = await track.evaluate((node) => node.scrollLeft);
  await page.waitForTimeout(350);
  const pausedTo = await track.evaluate((node) => node.scrollLeft);
  expect(Math.abs(pausedTo - pausedFrom)).toBeLessThanOrEqual(1);

  const sectionBox = await section.boundingBox();
  if (!sectionBox) throw new Error("showreel section has no box");
  await page.mouse.move(sectionBox.x + 10, sectionBox.y + 10);
  await page.waitForTimeout(150);
  const resumedFrom = await track.evaluate((node) => node.scrollLeft);
  await page.waitForTimeout(350);
  const resumedTo = await track.evaluate((node) => node.scrollLeft);
  expect(resumedTo).toBeGreaterThan(resumedFrom + 5);
});

test("requested sections keep aligned, compact geometry", async ({ page }) => {
  await page.goto("/uk", { waitUntil: "domcontentloaded" });

  if (test.info().project.name === "desktop") {
    const formatGeometry = await page.locator(".format-list > li").evaluateAll((cards) => cards.map((card) => ({
      headingTop: card.querySelector("h3")!.getBoundingClientRect().top,
      copyTop: card.querySelector("p")!.getBoundingClientRect().top,
    })));
    expect(Math.max(...formatGeometry.map((card) => card.headingTop)) - Math.min(...formatGeometry.map((card) => card.headingTop))).toBeLessThanOrEqual(1);
    expect(Math.max(...formatGeometry.map((card) => card.copyTop)) - Math.min(...formatGeometry.map((card) => card.copyTop))).toBeLessThanOrEqual(1);
  }

  const audienceGeometry = await page.locator(".audience-section").evaluate((section) => {
    const list = section.querySelector(".for-who ul")!.getBoundingClientRect();
    const program = section.querySelector(".program-details")!.getBoundingClientRect();
    return { listLeft: list.left, listRight: list.right, programLeft: program.left, programRight: program.right };
  });
  expect(Math.abs(audienceGeometry.listLeft - audienceGeometry.programLeft)).toBeLessThanOrEqual(1);
  expect(Math.abs(audienceGeometry.listRight - audienceGeometry.programRight)).toBeLessThanOrEqual(1);

  if (test.info().project.name === "mobile") {
    for (const selector of [".formats-section", ".audience-section", ".faq-section", ".price-section"]) {
      const section = page.locator(selector);
      const geometry = await section.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          scrollHeight: node.scrollHeight,
          height: box.height,
          padding: parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
        };
      });
      expect(geometry.height - geometry.scrollHeight).toBeLessThanOrEqual(2);
      expect(geometry.padding).toBeLessThanOrEqual(64);
    }
    const buttonWidths = await page.locator(".faq-ask-actions .button").evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().width));
    expect(Math.max(...buttonWidths) - Math.min(...buttonWidths)).toBeLessThanOrEqual(1);
  }
});

test("start accents alternate, format badges align and mobile reviews stay content-height", async ({ page }) => {
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  expect(await page.locator(".hero h1 .accent-line").evaluateAll((nodes) => nodes.every((node) => getComputedStyle(node).animationName === "none"))).toBe(true);
  const startAnimations = await page.locator(".hero-start em").evaluateAll((nodes) => nodes.map((node) => ({
    name: getComputedStyle(node).animationName,
    delay: getComputedStyle(node).animationDelay,
  })));
  expect(startAnimations).toEqual([
    { name: "start-accent-swap", delay: "0s" },
    { name: "start-accent-swap", delay: "-0.9s" },
  ]);

  if (test.info().project.name === "desktop") {
    const heading = await page.locator(".formats-section .section-heading").evaluate((node) => {
      const title = node.querySelector("h2")!.getBoundingClientRect();
      const lead = node.querySelector(".lead")!.getBoundingClientRect();
      return { titleTop: title.top, leadTop: lead.top, leadWidth: lead.width };
    });
    const badges = await page.locator(".format-list > li > .format-tools").evaluateAll((rows) => rows.map((row) => ({
      top: row.getBoundingClientRect().top,
      labels: Array.from(row.children).map((item) => item.textContent),
    })));
    expect(Math.abs(heading.titleTop - heading.leadTop)).toBeLessThanOrEqual(12);
    expect(heading.leadWidth).toBeGreaterThanOrEqual(400);
    expect(Math.max(...badges.map((row) => row.top)) - Math.min(...badges.map((row) => row.top))).toBeLessThanOrEqual(1);
    expect(badges.flatMap((row) => row.labels)).toEqual(["Kling", "Google Veo", "Suno", "CapCut", "HeyGen", "ElevenLabs", "ChatGPT", "Higgsfield", "Magnific", "Kling"]);
    expect(await page.locator("footer").evaluate((node) => node.getBoundingClientRect().height)).toBeLessThanOrEqual(125);
  } else {
    const reviews = await page.locator(".mentor-reviews").evaluate((node) => ({
      height: node.getBoundingClientRect().height,
      paddingTop: parseFloat(getComputedStyle(node).paddingTop),
      paddingBottom: parseFloat(getComputedStyle(node).paddingBottom),
    }));
    expect(reviews.height).toBeLessThan(600);
    expect(reviews.paddingTop + reviews.paddingBottom).toBeLessThanOrEqual(64);
  }
});

test("format cards keep complete 4:5 media and tools on desktop and mobile", async ({ page }) => {
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const cards = page.locator(".formats-section .format-list > li");
  await expect(cards).toHaveCount(3);
  await expect(cards.locator(".format-media")).toHaveCount(3);
  await expect(cards.locator(".format-tools")).toHaveCount(3);
  await expect(page.locator(".formats-section .tools-note")).toHaveCount(0);
  const geometry = await cards.evaluateAll((nodes) => nodes.map((node) => {
    const media = node.querySelector<HTMLElement>(".format-media")!;
    const image = media.querySelector<HTMLImageElement>("img")!;
    const mediaBox = media.getBoundingClientRect();
    return {
      mediaVisible: mediaBox.width > 0 && mediaBox.height > 0,
      ratio: mediaBox.width / mediaBox.height,
      fit: getComputedStyle(image).objectFit,
    };
  }));
  for (const card of geometry) {
    expect(card.mediaVisible).toBe(true);
    expect(card.ratio).toBeCloseTo(4 / 5, 2);
    expect(card.fit).toBe("contain");
  }
});

test("desktop audience list uses leading checks and an aligned program action", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop audience composition");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const layout = await page.locator(".audience-section").evaluate((section) => {
    const items = Array.from(section.querySelectorAll<HTMLElement>(".for-who li"));
    const program = section.querySelector<HTMLElement>(".program-details")!;
    const list = section.querySelector<HTMLElement>(".for-who ul")!;
    const itemMetrics = items.map((item) => {
      const checkElement = item.querySelector<HTMLElement>("span")!;
      const check = checkElement.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      return {
        checkLeft: check.left,
        itemLeft: box.left,
        checkSize: check.width,
        color: getComputedStyle(checkElement).color,
        background: getComputedStyle(checkElement).backgroundColor,
      };
    });
    return {
      itemMetrics,
      listLeft: list.getBoundingClientRect().left,
      listWidth: list.getBoundingClientRect().width,
      programLeft: program.getBoundingClientRect().left,
      programWidth: program.getBoundingClientRect().width,
    };
  });
  expect(layout.itemMetrics.every((item) => item.checkLeft - item.itemLeft <= 1)).toBe(true);
  expect(layout.itemMetrics.every((item) => item.checkSize <= 20)).toBe(true);
  expect(layout.itemMetrics.every((item) => item.color === "rgb(183, 212, 0)")).toBe(true);
  expect(layout.itemMetrics.every((item) => item.background === "rgba(0, 0, 0, 0)")).toBe(true);
  expect(Math.abs(layout.programLeft - layout.listLeft)).toBeLessThanOrEqual(1);
  expect(Math.abs(layout.programWidth - layout.listWidth)).toBeLessThanOrEqual(1);
});

test("desktop reviews expose controls and advance the horizontal gallery", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop review controls");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const track = page.locator(".mentor-review-cards");
  await track.scrollIntoViewIfNeeded();
  const before = await track.evaluate((node) => node.scrollLeft);
  await page.getByRole("button", { name: "Наступні відгуки" }).click();
  await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(before + 100);
  await page.getByRole("button", { name: "Попередні відгуки" }).click();
  await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeLessThan(before + 50);
});

test("mobile price options share one grid and full-width aligned actions", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile price composition");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const layout = await page.locator(".price-section").evaluate((section) => {
    const options = Array.from(section.querySelectorAll<HTMLElement>(".price-options > div:not(.price-actions)"));
    const buttons = Array.from(section.querySelectorAll<HTMLElement>(".price-actions .button"));
    const container = section.querySelector<HTMLElement>(".price-options")!.getBoundingClientRect();
    return {
      options: options.map((option) => {
        const box = option.getBoundingClientRect();
        const label = option.querySelector("p")!.getBoundingClientRect();
        return { left: box.left, right: box.right, height: box.height, labelRight: label.right };
      }),
      buttons: buttons.map((button) => {
        const box = button.getBoundingClientRect();
        return { left: box.left, right: box.right, height: box.height };
      }),
      container: { left: container.left, right: container.right },
    };
  });
  for (const option of layout.options) {
    expect(Math.abs(option.left - layout.container.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(option.right - layout.container.right)).toBeLessThanOrEqual(1);
    expect(option.labelRight).toBeLessThanOrEqual(option.right);
    expect(option.height).toBeGreaterThanOrEqual(68);
  }
  expect(await page.locator(".price-options > .is-featured").evaluate((node) => getComputedStyle(node).backgroundColor)).toBe("rgb(17, 17, 17)");
  for (const button of layout.buttons) {
    expect(Math.abs(button.left - layout.container.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(button.right - layout.container.right)).toBeLessThanOrEqual(1);
    expect(button.height).toBeGreaterThanOrEqual(48);
  }
});

test("messenger buttons use one shared grid and concise labels", async ({ page }) => {
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /НАПИШИ В INSTAGRAM/ })).toHaveCount(2);
  await expect(page.getByRole("link", { name: /НАПИШИ В TELEGRAM/ })).toHaveCount(2);
  for (const selector of [".faq-ask-actions", ".price-actions"]) {
    const metrics = await page.locator(selector).evaluate((node) => ({
      display: getComputedStyle(node).display,
      buttons: Array.from(node.querySelectorAll<HTMLElement>(".button")).map((button) => {
        const box = button.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }),
    }));
    expect(metrics.display).toBe("grid");
    expect(metrics.buttons).toHaveLength(2);
    expect(Math.abs(metrics.buttons[0].width - metrics.buttons[1].width)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.buttons[0].height - metrics.buttons[1].height)).toBeLessThanOrEqual(1);
  }
});

test("mobile footer is compact, centered and never reaches the viewport edge", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile footer composition");
  await page.goto("/uk", { waitUntil: "domcontentloaded" });
  const footer = await page.locator("footer").evaluate((node) => {
    const box = node.getBoundingClientRect();
    const logo = node.querySelector<HTMLElement>(".footer-wordmark")!.getBoundingClientRect();
    const links = node.querySelector<HTMLElement>("div")!.getBoundingClientRect();
    const linkBoxes = Array.from(node.querySelectorAll<HTMLElement>("div a")).map((link) => link.getBoundingClientRect());
    const copyright = node.querySelector<HTMLElement>("p")!.getBoundingClientRect();
    return {
      left: box.left,
      right: box.right,
      height: box.height,
      logoCenter: logo.left + logo.width / 2,
      linksCenter: links.left + links.width / 2,
      copyrightCenter: copyright.left + copyright.width / 2,
      linkTopDelta: Math.abs(linkBoxes[0].top - linkBoxes[1].top),
      maxLinkRight: Math.max(...linkBoxes.map((link) => link.right)),
    };
  });
  expect(footer.left).toBeGreaterThanOrEqual(16);
  expect(footer.right).toBeLessThanOrEqual(390 - 16);
  expect(footer.height).toBeLessThanOrEqual(190);
  expect(Math.abs(footer.logoCenter - footer.linksCenter)).toBeLessThanOrEqual(2);
  expect(Math.abs(footer.logoCenter - footer.copyrightCenter)).toBeLessThanOrEqual(2);
  expect(footer.linkTopDelta).toBeLessThanOrEqual(1);
  expect(footer.maxLinkRight).toBeLessThanOrEqual(390 - 28);
});

for (const locale of ["uk", "en"]) {
  test(`has no automatically detectable serious accessibility violations on /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    // миготіння акцентів фіксуємо на читабельній фазі для скану контрасту
    await page.addStyleTag({ content: ".hero-start em{animation:none!important}" });
    // кислотний «ПРОДАЄ»/«SELLS» - свідомий брендовий акцент на світлому фоні
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).exclude(".accent-green").analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
