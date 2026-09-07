import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import WorkStrip from "./WorkStrip";
import ReviewCards from "./ReviewCards";
import copy, { getCopy, instagram, locales, telegram, type Locale } from "../content";

// basePath для сирих src (OG-картинки): next/image префіксує сам, метадані — ні.
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
    <svg className={className} viewBox="0 0 320 64" fill="none" aria-hidden="true">
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
        <a className="wordmark" href={`/${locale}#top`} aria-label="New Creator - home"><span>NEW</span><span>CREATOR</span></a>
        <p className="topbar-eyebrow">{t.eyebrow}</p>
        <nav className="desktop-nav" aria-label={locale === "uk" ? "Головна навігація" : "Main navigation"}>
          {t.nav.map(([label, href]) => <a key={href} href={`/${locale}${href}`}>{label}</a>)}
        </nav>
        <a
          className="language-switch"
          href={`/${other}`}
          hrefLang={other}
          aria-label={locale === "uk" ? "Змінити мову на англійську" : "Switch the language to Ukrainian"}
        >
          <span className={locale === "uk" ? "is-active" : ""}>UA</span><span aria-hidden="true">/</span><span className={locale === "en" ? "is-active" : ""}>EN</span>
        </a>
      </header>

      <div id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1>{t.title.map((line, index) => <span key={line} className={index === t.title.length - 1 ? "accent-line" : ""}>{line}</span>)}</h1>
            <p className="hero-sub">{t.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.cta}<span aria-hidden="true">↗</span></a>
              <a className="button button-ghost" href="#formats">{t.secondary}<span aria-hidden="true">↓</span></a>
            </div>
            <p className="payment-note">{t.payment}</p>
          </div>

          <div className="hero-middle">
            <div className="hero-quote">
              <p>твій новий рівень</p>
              <p className="quote-accent">починається тут.</p>
            </div>
          </div>

          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-photo-img"
              src={asset("/rita-cutout.webp")}
              alt={t.creatorAlt}
            />
          </div>

          <p className="hero-start">
            {t.startLines.map((line, index) => (
              <span key={line} className="hero-start-line">
                {highlight(line, t.startAccents)}
                {index < t.startLines.length - 1 && " "}
              </span>
            ))}
          </p>

          <dl className="hero-stats">
            {t.stats.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
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
        </section>
        <div className="works-strip-holder">
          <WorkStrip items={t.strip.items} openLabel={t.strip.openLabel} closeLabel={t.strip.closeLabel} />
        </div>

        <section className="section formats-section" id="formats">
          <div className="section-heading">
            <p className="kicker">{t.formats.kicker}</p>
            <h2>{t.formats.title}</h2>
            <p className="lead">{t.formats.intro}</p>
          </div>
          <UnderlineDoodle className="doodle doodle-formats-underline" />
          <ul className="format-list">
            {t.formats.items.map(([title, text]) => (
              <li key={title}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ul>
          <p className="tools-note">{t.formats.tools}</p>
          <div className="for-who">
            <div>
              <StarDoodle className="doodle doodle-formats" />
              <p className="kicker">{t.formats.forWhoKicker}</p>
            </div>
            <ul>
              {t.formats.forWho.map((item) => <li key={item}>{item}<span aria-hidden="true">→</span></li>)}
            </ul>
          </div>
          <details className="program-details">
            <summary><span>{t.formats.programLabel}</span><i aria-hidden="true">+</i></summary>
            <div className="program-body">
              <h3>{t.formats.program.title}</h3>
              <ol className="program-list">
                {t.formats.program.modules.map(([title, description], index) => (
                  <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{description}</p></div></li>
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
          <div className="faq-body">
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
            {t.price.options.map(([value, label], index) => <div key={value}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
            <p className="price-note">{t.price.note}</p>
            <div className="price-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.price.button}<span aria-hidden="true">↗</span></a>
              <a className="button button-telegram" href={telegram} target="_blank" rel="noreferrer">{t.price.alt}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="price-final">
            <div>
              <p>{t.price.final.title}</p>
              <p className="price-final-note">{t.price.final.note}</p>
            </div>
            <Image
              className="final-lockup-logo"
              src={asset("/logo-final.webp")}
              alt=""
              width={1400}
              height={934}
              sizes="(max-width: 760px) 80vw, 40vw"
              style={{ width: "clamp(20rem, 30vw, 34rem)", height: "auto" }}
            />
          </div>
        </section>
      </div>

      <footer>
        <a className="wordmark" href={`/${locale}#top`} aria-label="New Creator - home"><span>NEW</span><span>CREATOR</span></a>
        <div><a href={instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href={telegram} target="_blank" rel="noreferrer">TELEGRAM ↗</a></div>
        <p>© {new Date().getFullYear()} NEW CREATOR</p>
      </footer>
    </main>
  );
}
