import type { NextConfig } from "next";

// EXPORT_MODE=1 — збірка статичного експорту для GitHub Pages:
// без серверних redirects/headers, з trailingSlash і неоптимізованими зображеннями.
const isExport = process.env.EXPORT_MODE === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,
  ...(isExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {}),
  async redirects() {
    if (isExport) return [];
    return [
      {
        source: "/",
        destination: "/uk",
        permanent: false,
      },
    ];
  },
  async headers() {
    if (isExport) return [];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
