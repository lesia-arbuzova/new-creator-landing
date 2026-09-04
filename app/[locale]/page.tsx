import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import copy, { getCopy, instagram, locales, telegram, type Locale } from "../content";

const reviewImages = [2, 4, 6, 8, 10, 12, 14, 16] as const;

// basePath для сирих src (відео, OG-картинки): next/image префіксує сам, <video> — ні.
const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const mentorVideos = [
  ["/showcase-ritora.mp4", "/showcase-ritora-poster.jpg"],
  ["/mentor-coffee.mp4", "/mentor-coffee.jpg"],
  ["/mentor-matcha.mp4", "/mentor-matcha.jpg"],
  ["/mentor-pool.mp4", "/mentor-pool.jpg"],
] as const;

const studentVideos = [
  ["/student-pets.mp4", "/student-pets.jpg"],
  ["/student-gelato.mp4", "/student-gelato.jpg"],
  ["/student-surreal.mp4", "/student-surreal.jpg"],
  ["/student-portrait.mp4", "/student-portrait.jpg"],
] as const;

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
          {t.nav.map((item, index) => <a key={item} href={`/${locale}${["#about", "#program", "#work", "#reviews"][index]}`}>{item}</a>)}
        </nav>
        <a
          className="language-switch"
          href={`/${other}`}
          hrefLang={other}
          aria-label={t.languageLabel}
        >
          <span className={locale === "uk" ? "is-active" : ""}>UA</span><span aria-hidden="true">/</span><span className={locale === "en" ? "is-active" : ""}>EN</span>
        </a>
      </header>

      <div id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="hero-note">{t.practice}</p>
            <h1>{t.title.map((line, index) => <span key={line} className={index > 1 ? "accent-line" : ""}>{line}</span>)}</h1>
            <div className="hero-bottom">
              <div className="hero-intro">
                <p>{t.description}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href={instagram} target="_blank" rel="noreferrer">{t.cta}<span aria-hidden="true">↗</span></a>
                  <a className="button button-ghost" href="#about">{t.secondary}<span aria-hidden="true">↓</span></a>
                </div>
                <p className="payment-note">{t.payment}</p>
              </div>
              <div className="start-sticker"><span>{t.start}</span></div>
            </div>
          </div>
          <div className="hero-media">
            <video className="hero-video" autoPlay muted loop playsInline poster={asset("/showcase-ritora-poster.jpg")} aria-label={t.workLabel}><source src={asset("/showcase-ritora.mp4")} type="video/mp4" /></video>
            <div className="media-caption"><span>{t.workLabel}</span></div>
            <div className="handwritten-badge" aria-hidden="true">CREATE<br />PRACTICE<br />PORTFOLIO</div>
          </div>
        </section>

        <section className="proof-strip" aria-label={locale === "uk" ? "Ключові факти" : "Key facts"}>
          {t.proof.map((item, index) => <div key={item} className="proof-item"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
          <a href={telegram} target="_blank" rel="noreferrer">TELEGRAM <span aria-hidden="true">↗</span></a>
        </section>

        <section className="section about-section" id="about">
          <div className="section-heading"><p className="kicker">{t.about.kicker}</p><h2>{t.about.title}</h2></div>
          <div className="about-layout">
            <div className="about-copy">
              <p className="lead">{t.about.body}</p>
              <div className="question-stack">{t.about.questions.map((question, index) => <p key={question}><span>0{index + 1}</span>{question}</p>)}</div>
              <p className="handwritten-note">{t.about.note}</p>
            </div>
            <div className="brand-art" aria-hidden="true">
              <div className="brand-lockup">
                <svg className="brand-crown" viewBox="0 0 202 130" fill="none">
                  <path d="M10 112 L34 40 L74 88 L102 8 L132 86 L172 30 L192 108" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 122 C70 116 130 116 178 120" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                </svg>
                <span className="brand-lockup-word"><span>NEW</span><span>CREATOR</span></span>
                <svg className="brand-arrow" viewBox="0 0 320 64" fill="none">
                  <path d="M8 50 C96 44 204 30 302 16" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
                  <path d="M270 6 L306 14 L280 38" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="section audience-section">
          <div className="section-heading narrow-heading"><p className="kicker">{t.audience.kicker}</p><h2>{t.audience.title}</h2></div>
          <div className="audience-grid">
            {t.audience.items.map((item, index) => <article key={item} className={`audience-card accent-${index % 4}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}
            <aside className="audience-aside">{t.audience.aside}</aside>
          </div>
        </section>

        <section className="section outcome-section">
          <div className="outcome-head"><p className="kicker">{t.outcome.kicker}</p><h2>{t.outcome.title}</h2><p className="lead">{t.outcome.lead}</p></div>
          <ol className="outcome-list">{t.outcome.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>
          <blockquote>{t.outcome.honesty}</blockquote>
        </section>

        <section className="section program-section" id="program">
          <div className="program-intro"><p className="kicker">{t.program.kicker}</p><h2>{t.program.title}</h2><p className="lead">{t.program.intro}</p></div>
          <div className="program-list">
            {t.program.modules.map(([title, description], index) => <details key={title} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><i aria-hidden="true">+</i></summary><p>{description}</p></details>)}
            <p className="program-bonus">{t.program.bonus}</p>
          </div>
        </section>

        <section className="section process-section">
          <div className="process-heading"><p className="kicker">{t.process.kicker}</p><h2>{t.process.title}</h2><p className="handwritten-quote">{t.process.quote}</p></div>
          <div className="process-track" role="region" tabIndex={0} aria-label={locale === "uk" ? "Етапи навчання, горизонтальна прокрутка" : "Course stages, horizontal scroll"}>{t.process.steps.map((step, index) => <div key={step} className="process-step"><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < t.process.steps.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>
          <p className="process-extra">{t.process.extra}</p>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading work-heading"><p className="kicker">{t.work.kicker}</p><h2>{t.work.title}</h2><p className="lead">{t.work.intro}</p></div>
          <div className="video-grid mentor-grid">{mentorVideos.map(([src, poster], index) => <figure key={src}><video controls muted playsInline preload="metadata" poster={asset(poster)} aria-label={t.work.pieces[index]}><source src={asset(src)} type="video/mp4" /></video><figcaption><span>0{index + 1}</span>{t.work.pieces[index]}</figcaption></figure>)}</div>
          <div className="student-heading"><p className="kicker">{t.work.studentsKicker}</p><h3>{t.work.studentsTitle}</h3><p>{t.work.studentsIntro}</p></div>
          <div className="video-grid student-grid">{studentVideos.map(([src, poster], index) => <figure key={src}><video controls muted playsInline preload="metadata" poster={asset(poster)} aria-label={t.work.students[index]}><source src={asset(src)} type="video/mp4" /></video><figcaption><span>0{index + 1}</span>{t.work.students[index]}</figcaption></figure>)}</div>
        </section>

        <section className="section reviews-section" id="reviews">
          <div className="section-heading reviews-heading"><p className="kicker">{t.reviews.kicker}</p><h2>{t.reviews.title}</h2><p className="lead">{t.reviews.intro}</p><p className="original-note">{t.reviews.original}</p></div>
          <div className="reviews-grid" role="region" tabIndex={0} aria-label={locale === "uk" ? "Відгуки, горизонтальна прокрутка" : "Reviews, horizontal scroll"}>{reviewImages.map((number, index) => <figure key={number} className={index % 2 ? "review-offset" : ""}><Image src={`/review-${number}.jpg`} alt={`${t.reviews.title} - ${index + 1}`} width={941} height={1672} sizes="(max-width: 760px) 82vw, (max-width: 1080px) 45vw, 23vw" style={{ width: "100%", height: "auto" }} /></figure>)}</div>
        </section>

        <section className="section mentor-section">
          <div className="mentor-number" aria-hidden="true">12</div>
          <div className="mentor-copy"><p className="kicker">{t.mentor.kicker}</p><h2>{t.mentor.title}</h2>{t.mentor.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="mentor-sign">{t.mentor.sign}</p></div>
        </section>

        <section className="section faq-section">
          <div className="faq-heading"><p className="kicker">{t.faq.kicker}</p><h2>{t.faq.title}</h2></div>
          <div className="faq-list">{t.faq.items.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span><strong>{question}</strong><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="section price-section" id="price">
          <div className="price-main"><p className="kicker">{t.price.kicker}</p><h2>{t.price.title}</h2><div className="price-value">{t.price.full}</div><p>{t.price.fullLabel}</p></div>
          <div className="price-options">
            {t.price.options.map(([value, label], index) => <div key={value}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
            <p className="price-note">{t.price.note}</p>
            <a className="button button-dark" href={instagram} target="_blank" rel="noreferrer">{t.price.button}<span aria-hidden="true">↗</span></a>
            <a className="telegram-link" href={telegram} target="_blank" rel="noreferrer">{t.price.alt}<span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="final-section">
          <p className="kicker">{t.final.line}</p><h2>{t.final.title}</h2><p className="final-note">{t.final.note}</p>
          <a className="button final-button" href={instagram} target="_blank" rel="noreferrer">{t.final.cta}<span aria-hidden="true">↗</span></a>
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
