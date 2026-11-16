# Fini Kura production image, one target per app:
#   docker build --target storefront|medusa|strapi -t finikura-<app> .
# Node and pnpm versions match .nvmrc and package.json "packageManager".

FROM node:22.23.4-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1 MEDUSA_DISABLE_TELEMETRY=true STRAPI_TELEMETRY_DISABLED=true
RUN corepack enable && corepack prepare pnpm@12.8.1 --activate
WORKDIR /app

# Install the whole workspace once (shared lockfile).
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/storefront/package.json apps/storefront/
COPY apps/medusa/package.json apps/medusa/
COPY apps/strapi/package.json apps/strapi/
RUN pnpm install --frozen-lockfile

FROM deps AS source
COPY . .

# --- Medusa: build server + admin, run from .medusa/server --------------------
FROM source AS medusa
ENV NODE_ENV=production
# ffmpeg prepares the product clips sent from the admin (FK-38).
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
RUN pnpm --filter medusa build
WORKDIR /app/apps/medusa/.medusa/server
COPY infra/docker/medusa-start.sh /usr/local/bin/medusa-start
EXPOSE 9000
CMD ["medusa-start"]

# --- Strapi: build the admin panel -------------------------------------------
FROM source AS strapi
ENV NODE_ENV=production
RUN pnpm --filter strapi build
WORKDIR /app/apps/strapi
EXPOSE 1337
CMD ["pnpm", "start"]

# --- Storefront: built at container start --------------------------------------
# Cache Components prerender pages with live Medusa/Strapi data, which are not
# reachable while the image is built. The build therefore runs when the
# container starts, once the backends are up (see storefront-start.sh).
FROM source AS storefront
WORKDIR /app/apps/storefront
COPY infra/docker/storefront-start.sh /usr/local/bin/storefront-start
EXPOSE 3100
CMD ["storefront-start"]
