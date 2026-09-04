import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// NEXT_PUBLIC_SITE_URL — тільки домен; basePath додаємо окремо.
const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["uk", "en"].map((locale) => ({
    url: `${origin}${basePath}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "uk" ? 1 : 0.9,
    alternates: {
      languages: {
        uk: `${origin}${basePath}/uk/`,
        en: `${origin}${basePath}/en/`,
      },
    },
  }));
}
