import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import WorkStrip from "./WorkStrip";
import ReviewCards from "./ReviewCards";
import MobileMenu from "./MobileMenu";
import copy, { getCopy, instagram, locales, telegram, type Locale } from "../content";

// basePath для сирих src (OG-картинки): next/image префіксує сам, метадані - ні.
const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getCopy(locale);

  return {
    title: t.meta.title,
    description: t.meta.description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    alternates: {
      canonical: asset(`/${locale}`),
      languages: { uk: asset("/uk"), en: asset("/en"), "x-default": asset("/uk") },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: asset(`/${locale}`),
      type: "website",
      locale: locale === "en" ? "en_US" : "uk_UA",
      images: [{ url: asset(`/og-cover-${locale}.png`), width: 1200, height: 630, alt: t.meta.title }],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Фірмові штуки Ріти: зірочка і рукописне підкреслення
function StarDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 3 V37 M3 20 H37 M7 7 L33 33 M33 7 L7 33" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

// Розмітка акцентів у рядку заголовка:
// ** = початок зеленого акцента (статичний, без блимання),
// *  = початок синього акцента (на мобайлі блимає) - обидва до кінця рядка
function AccentText({ line }: { line: string }) {
  const green = line.indexOf("**");
  if (green !== -1) {
    const text = line.slice(green + 2);
    return (
      <>
        {line.slice(0, green)}
        <span className="accent-green">{text}</span>
      </>
    );
  }
  const star = line.indexOf("*");
  if (star === -1) return <>{line}</>;
  return (
    <>
      {line.slice(0, star)}
      <span className="accent-line">{line.slice(star + 1)}</span>
    </>
  );
}

function UnderlineDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 230 28" fill="none" aria-hidden="true">
      <path d="M6 15 C64 7 158 7 224 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M14 24 C70 18 160 16 200 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 320 64" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M8 50 C96 44 204 30 302 16" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      <path d="M270 6 L306 14 L280 38" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Підсвічує в рядку фрази з accents кислотним кольором, зберігаючи текст як є.
function highlight(line: string, accents: ReadonlyArray<string>) {
  const pattern = new RegExp(`(${accents.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return line.split(pattern).filter(Boolean).map((part, index) =>
    accents.includes(part) ? <em key={index}>{part}</em> : <span key={index}>{part}</span>,
  );
}


// Не залишаємо короткі українські прийменники та сполучники в кінці рядка.
// Нерозривний пробіл зберігає слово разом із наступним без ручних <br />.
function preventHangingWords(text: string, locale: Locale) {
  if (locale !== "uk") return text;
  return text.replace(
    /(^|[\s(«])((?:[УуВвІіЙйЗз]|[Дд]о|[Нн]а|[Зз]а|[Пп]о|[Пп]ід|[Пп]ро|[Дд]ля|[Бб]ез|[Мм]іж|[Чч]и|[Аа]бо|[Тт]а))\s+/g,
    "$1$2\u00a0",
  );
}

export default async function Home({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  if (!(locales as readonly string[]).includes(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const t = copy[locale];
  const other: Locale = locale === "uk" ? "en" : "uk";

  return (
    <main className="site-shell">
      <a className="skip-link" href="#main-content">{t.skip}</a>
      <header className="topbar">
        <a className="wordmark" href={`${asset(`/${locale}`)}#top`} aria-label="New Creator - home">
          <Image className="header-logo" src={asset("/logo-header.webp")} alt="" width={800} height={533} sizes="(max-width: 760px) 180px, 20vw" />
        </a>
        <p className="topbar-eyebrow">{t.eyebrow}</p>
        <nav className="desktop-nav" aria-label={locale === "uk" ? "Головна навігація" : "Main navigation"}>
          {t.nav.map(([label, href]) => <a key={href} href={`${asset(`/${locale}`)}${href}`}>{label}</a>)}
        </nav>
        <a
          className="language-switch"
          href={asset(`/${other}`)}
          hrefLang={other}
          aria-label={locale === "uk" ? "Змінити мову на англійську" : "Switch the language to Ukrainian"}
        >
          <span className={locale === "uk" ? "is-active" : ""}>UA</span><span aria-hidden="true">/</span><span className={locale === "en" ? "is-active" : ""}>EN</span>
        </a>
        <MobileMenu
          links={t.nav.map(([label, href]) => [label, `${asset(`/${locale}`)}${href}`] as const)}
          openLabel={locale === "uk" ? "Відкрити меню" : "Open menu"}
          closeLabel={locale === "uk" ? "Закрити меню" : "Close menu"}
        />
      </header>

      <div id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1 aria-label={t.title.map((line) => line.replace("**", "").replace("*", "")).join(" ")}>
              <span className="hero-title-visual" aria-hidden="true">
                <span className="hero-title-desktop">
                  {t.title.map((line) => (
                    <span key={`${line}-d`} className="line-desktop"><AccentText line={line} /></span>
                  ))}
                </span>
                <span className="hero-title-mobile">
                  {t.titleMobile.map((line) => (
                    <span key={`${line}-m`} className="line-mobile"><AccentText line={line} /></span>
                  ))}
                </span>
              </span>
            </h1>
            <ArrowDoodle className="doodle doodle-swoosh" />
            <p className="hero-sub hero-sub-desktop">{t.description}</p>
            <p className="hero-sub hero-sub-mobile" aria-label={t.descriptionMobile}>
              {t.descriptionMobileLines.map((line) => <span key={line}>{line}</span>)}
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.cta}<span aria-hidden="true">→</span></a>
              <a className="button button-ghost" href="#formats">{t.secondary}</a>
            </div>
            <p className="payment-note">{t.payment}</p>
          </div>

          <div
            className="hero-bg"
            style={{
              "--hero-bg-desktop": `url("${asset("/hero-bg.webp")}")`,
              "--hero-bg-mobile": `url("${asset("/mobile-hero.webp")}")`,
            } as React.CSSProperties}
            aria-hidden="true"
          />
          <p className="hero-practice" aria-hidden="true">
            {t.heroNote}
            <UnderlineDoodle className="doodle doodle-practice" />
          </p>
          <ArrowDoodle className="hero-arrow" aria-hidden="true" />
          <p className="hero-impact" aria-hidden="true">
            {t.impact.map((line, i) => (
              <span key={i}>{line}{i < t.impact.length - 1 && <br />}</span>
            ))}
            <UnderlineDoodle className="doodle doodle-impact" />
          </p>
          <p className="hero-more" aria-hidden="true">
            More<br />Than<br />Content
            <svg className="doodle doodle-more-crown" viewBox="0 0 202 130" fill="none" aria-hidden="true">
              <path d="M10 112 L34 40 L74 88 L102 8 L132 86 L172 30 L192 108" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 122 C70 116 130 116 178 120" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
            </svg>
          </p>

          <p className="hero-start">
            <svg className="hero-start-icon" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9 H21 M8 3 V7 M16 3 V7" />
              <path d="M7 13 H10 M7 16 H10 M13 13 H16 M13 16 H16" strokeWidth="1.6" />
            </svg>
            <span className="hero-start-sep" aria-hidden="true" />
            <span className="hero-start-text">
              {t.startLines.map((line, index) => (
                <span key={line} className="hero-start-line">
                  {highlight(line, t.startAccents)}
                  {index < t.startLines.length - 1 && " "}
                </span>
              ))}
            </span>
          </p>

          <dl className="hero-stats">
            {t.stats.map(([value, label], index) => (
              <div key={label}>
                {index === 0 && (
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2.5" />
                    <path d="M3 10 H21 M8 3 V7 M16 3 V7" />
                    <path d="M7.5 13.5 H10 M7.5 16.5 H10 M14 13.5 H16.5 M14 16.5 H16.5" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3 L21 7.8 L12 12.6 L3 7.8 Z" />
                    <path d="M3 12.2 L12 17 L21 12.2" strokeLinecap="round" />
                    <path d="M3 16.4 L12 21.2 L21 16.4" strokeLinecap="round" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M10 2.5 C10.7 6.3 12.7 8.3 16.5 9 C12.7 9.7 10.7 11.7 10 15.5 C9.3 11.7 7.3 9.7 3.5 9 C7.3 8.3 9.3 6.3 10 2.5 Z" />
                    <path d="M18 13.5 C18.4 15.6 19.4 16.6 21.5 17 C19.4 17.4 18.4 18.4 18 20.5 C17.6 18.4 16.6 17.4 14.5 17 C16.6 16.6 17.6 15.6 18 13.5 Z" />
                  </svg>
                )}
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="section works-section" id="works">
          <div className="section-heading works-heading">
            <p className="kicker">{t.strip.kicker}</p>
            <h2>{t.strip.title}</h2>
            <div className="works-note">
              <StarDoodle className="doodle doodle-works" />
              <p className="lead">{t.strip.hint}</p>
              <ArrowDoodle className="doodle doodle-works-arrow" />
            </div>
          </div>
          <div className="works-strip-holder">
            <WorkStrip
              items={t.strip.items.map((item) => ({ ...item, src: asset(item.src), poster: asset(item.poster) }))}
              openLabel={t.strip.openLabel}
              closeLabel={t.strip.closeLabel}
            />
          </div>
        </section>

        <section className="section formats-section" id="formats">
          <div className="section-heading">
            <p className="kicker">{t.formats.kicker}</p>
            <h2>{t.formats.title}</h2>
            <p className="lead">{preventHangingWords(t.formats.intro, locale)}</p>
          </div>
          <UnderlineDoodle className="doodle doodle-formats-underline" />
          <ul className="format-list">
            {t.formats.items.map(([title, text], index) => (
              <li key={title}>
                <span
                  className="format-media"
                  style={{ "--format-poster": `url("${asset(t.formats.itemPosters[index])}")` } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <Image
                    src={asset(t.formats.itemPosters[index])}
                    alt=""
                    fill
                    sizes="(max-width: 1080px) 0px, 24vw"
                  />
                </span>
                <h3>{title}</h3>
                <p>{preventHangingWords(text, locale)}</p>
                <ul className="format-tools">
                  {t.formats.itemTools[index].map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </li>
            ))}
          </ul>
          <div className="tools-note">
            <span>{t.formats.toolsLabel}</span>
            <ul aria-label={t.formats.toolsLabel}>
              {t.formats.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
        </section>

        <section className="section audience-section" id="audience">
          <div className="for-who">
            <div>
              <StarDoodle className="doodle doodle-formats" />
              <h2 className="audience-title">{t.formats.forWhoKicker}</h2>
            </div>
            <ul>
              {t.formats.forWho.map((item) => <li key={item}>{preventHangingWords(item, locale)}<span aria-hidden="true">✓</span></li>)}
            </ul>
          </div>
          <details className="program-details">
            <summary><span>{t.formats.programLabel}</span><i aria-hidden="true">+</i></summary>
            <div className="program-body">
              <h3>{t.formats.program.title}</h3>
              <ol className="program-list">
                {t.formats.program.modules.map(([title, description], index) => (
                  <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{preventHangingWords(description, locale)}</p></div></li>
                ))}
              </ol>
              <p className="program-bonus">{t.formats.program.bonus}</p>
            </div>
          </details>
        </section>

        <section className="section mentor-section" id="mentor">
          <div className="mentor-copy">
            <p className="kicker">{t.mentor.kicker}</p>
            <h2>{t.mentor.title}</h2>
            <UnderlineDoodle className="doodle doodle-mentor" />
            {t.mentor.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="mentor-steps-title">{t.mentor.stepsTitle}</p>
            <ol className="mentor-steps">
              {t.mentor.steps.map((step, index) => (
                <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}{index < t.mentor.steps.length - 1 && <i aria-hidden="true">→</i>}</li>
              ))}
            </ol>
            <p className="mentor-sign">{t.mentor.sign}</p>
          </div>
          <div className="mentor-reviews">
            <h3>{t.mentor.reviewsTitle}</h3>
            <ReviewCards
              items={t.mentor.reviewImages.map((number) => ({ src: asset(`/review-${number}.jpg`), alt: t.mentor.reviewsAlt }))}
              openLabel={t.mentor.openReview}
              closeLabel={t.mentor.closeReview}
            />
            <p className="reviews-note">{t.mentor.reviewsNote}</p>
          </div>
        </section>

        <section className="section faq-section">
          <div className="faq-heading"><p className="kicker">{t.faq.kicker}</p><h2>{t.faq.title}</h2></div>
          <ol className="faq-list">
            {t.faq.items.map(([question, answer], index) => (
              <li key={question}><span>0{index + 1}</span><div><h3>{question}</h3><p>{answer}</p></div></li>
            ))}
          </ol>
          <div className="faq-ask">
            <div className="faq-ask-title">
              <StarDoodle className="doodle doodle-faq" />
              <p>{t.faq.askTitle}</p>
            </div>
            <div className="faq-ask-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.faq.askInstagram}<span aria-hidden="true">↗</span></a>
              <a className="button button-telegram" href={telegram} target="_blank" rel="noreferrer">{t.faq.askTelegram}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="section price-section" id="price">
          <div className="price-main">
            <p className="kicker">{t.price.kicker}</p>
            <h2>{t.price.title}</h2>
            <div className="price-value">{t.price.full}</div>
            <p>{t.price.fullLabel}</p>
          </div>
          <div className="price-options">
            {t.price.options.map(([value, label], index) => (
              <div key={value} className={index === 1 ? "is-featured" : undefined}>
                <span>0{index + 1}</span><strong>{value}</strong><p>{label}</p>
              </div>
            ))}
            <p className="price-note">{t.price.note}</p>
            <div className="price-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.price.button}<span aria-hidden="true">↗</span></a>
              <a className="button button-telegram" href={telegram} target="_blank" rel="noreferrer">{t.price.alt}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <a className="footer-wordmark" href={`${asset(`/${locale}`)}#top`} aria-label="New Creator - home">
          <Image className="footer-logo" src={asset("/logo-white.webp")} alt="" width={800} height={533} sizes="8rem" />
        </a>
        <div><a href={instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href={telegram} target="_blank" rel="noreferrer">TELEGRAM ↗</a></div>
        <p>© {new Date().getFullYear()} NEW CREATOR</p>
      </footer>
    </main>
  );
}
