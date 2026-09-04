import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["uk", "en"].map((locale) => ({
    url: `${origin}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "uk" ? 1 : 0.9,
    alternates: {
      languages: {
        uk: `${origin}/uk`,
        en: `${origin}/en`,
      },
    },
  }));
}
