import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import WorkStrip from "./WorkStrip";
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
            <p className="hero-note">{t.heroNote}</p>
            <h1>{t.title.map((line, index) => <span key={line} className={index === t.title.length - 1 ? "accent-line" : ""}>{line}</span>)}</h1>
            <p className="hero-sub">{t.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.cta}<span aria-hidden="true">↗</span></a>
              <a className="button button-ghost" href="#formats">{t.secondary}<span aria-hidden="true">↓</span></a>
            </div>
            <p className="payment-note">{t.payment}</p>
            <dl className="hero-stats">
              {t.stats.map(([value, label]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </div>
          <div className="hero-media">
            <Image
              src={asset("/rita-hero.jpg")}
              alt={t.creatorAlt}
              width={1400}
              height={2086}
              priority
              sizes="(max-width: 760px) 100vw, 45vw"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            <div className="start-sticker"><span>{t.start}</span></div>
          </div>
        </section>

        <section className="section works-section" id="works">
          <div className="section-heading works-heading">
            <p className="kicker">{t.strip.kicker}</p>
            <h2>{t.strip.title}</h2>
            <div className="works-note">
              <p className="lead">{t.strip.hint}</p>
              <p className="strip-disclaimer"><strong>{t.strip.disclaimer}</strong> {t.strip.disclaimerNote}</p>
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
          <ul className="format-list">
            {t.formats.items.map(([title, text]) => (
              <li key={title}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ul>
          <p className="tools-note">{t.formats.tools}</p>
          <div className="for-who">
            <p className="kicker">{t.formats.forWhoKicker}</p>
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
          <div className="mentor-number" aria-hidden="true">12</div>
          <div className="mentor-copy">
            <p className="kicker">{t.mentor.kicker}</p>
            <h2>{t.mentor.title}</h2>
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
            <div className="mentor-review-cards">
              {t.mentor.reviewImages.map((number, index) => (
                <Image key={number} src={asset(`/review-${number}.jpg`)} alt={t.mentor.reviewsAlt} width={941} height={1672} sizes="(max-width: 760px) 38vw, 15vw" style={{ width: "100%", height: "auto" }} />
              ))}
            </div>
            <p className="reviews-note">{t.mentor.reviewsNote}</p>
          </div>
        </section>

        <section className="section faq-section">
          <div className="faq-heading"><p className="kicker">{t.faq.kicker}</p><h2>{t.faq.title}</h2></div>
          <div className="faq-list">{t.faq.items.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span><strong>{question}</strong><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="section price-section" id="price">
          <div className="price-main">
            <p className="kicker">{t.price.kicker}</p>
            <h2>{t.price.title}</h2>
            <div className="price-value">{t.price.full}</div>
            <p>{t.price.fullLabel}</p>
            <p className="price-final-note">{t.price.final.note}</p>
          </div>
          <div className="price-options">
            {t.price.options.map(([value, label], index) => <div key={value}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
            <p className="price-note">{t.price.note}</p>
            <a className="button button-dark" href={instagram} target="_blank" rel="noreferrer">{t.price.button}<span aria-hidden="true">↗</span></a>
            <a className="telegram-link" href={telegram} target="_blank" rel="noreferrer">{t.price.alt}<span aria-hidden="true">↗</span></a>
          </div>
          <div className="price-final">
            <p>{t.price.final.title}</p>
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
