# Статичний лендінг: збірка Next.js export → роздача через serve.
# EXPORT_MODE=1 вмикає output:"export"; NEXT_PUBLIC_BASE_PATH= (порожній)
# обовʼязковий, інакше build-pages підставить шлях від GitHub Pages.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Домен у canonical/sitemap/OG. Якщо зʼявиться кастомний домен — оновити тут.
ARG NEXT_PUBLIC_SITE_URL=https://web-production-59fc1.up.railway.app
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN EXPORT_MODE=1 NEXT_PUBLIC_BASE_PATH= node scripts/build-pages.mjs

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve@14.2.6
COPY --from=build /app/out ./out
CMD ["sh", "-c", "serve out -l ${PORT:-8080}"]
