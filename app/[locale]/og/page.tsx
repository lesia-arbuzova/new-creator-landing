import type { Metadata } from "next";
import { getCopy } from "../../content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ locale: string }> };

export default async function OgCard({ params }: PageProps) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <main className="og-card">
      <p className="og-wordmark" aria-hidden="true"><span>NEW</span><span>CREATOR</span></p>
      <p className="og-title">
        <span>{t.title[0]} {t.title[1]}</span>
        <span className="og-accent">{t.title[2]} {t.title[3]}</span>
      </p>
      <p className="og-meta">{t.start}</p>
    </main>
  );
}
