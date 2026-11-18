# syntax=docker/dockerfile:1.7
# Fini Kura production image, one target per app:
#   docker build --target storefront|medusa|strapi -t finikura-<app> .
# Node and pnpm versions match .nvmrc and package.json "packageManager".
#
# Each app copies its own folder only: a change in the storefront does not rebuild Medusa or
# Strapi, and the other way round. The three images share the same first layers (system,
# dependencies), stored once on the server.

FROM node:22.23.4-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1 MEDUSA_DISABLE_TELEMETRY=true STRAPI_TELEMETRY_DISABLED=true
RUN corepack enable && corepack prepare pnpm@12.8.1 --activate
WORKDIR /app

# Install the whole workspace once (shared lockfile). The pnpm download store lives in a build
# cache, outside the image: it speeds up the next install and weighs nothing at run time.
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/storefront/package.json apps/storefront/
COPY apps/medusa/package.json apps/medusa/
COPY apps/strapi/package.json apps/strapi/
RUN --mount=type=cache,id=finikura-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# The seeds of Medusa and Strapi read the storefront fixtures and their photos, nothing else of it.
FROM deps AS fixtures
COPY apps/storefront/src/mocks apps/storefront/src/mocks
COPY apps/storefront/public/mock-media apps/storefront/public/mock-media

# --- Medusa: build server + admin, run from .medusa/server --------------------
FROM fixtures AS medusa
ENV NODE_ENV=production
# ffmpeg prepares the product clips sent from the admin (FK-38). Before the code, so it is kept.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
COPY apps/medusa apps/medusa
RUN pnpm --filter medusa build
WORKDIR /app/apps/medusa/.medusa/server
COPY infra/docker/medusa-start.sh /usr/local/bin/medusa-start
EXPOSE 9000
CMD ["medusa-start"]

# --- Strapi: build the admin panel -------------------------------------------
FROM fixtures AS strapi
ENV NODE_ENV=production
COPY apps/strapi apps/strapi
RUN pnpm --filter strapi build
WORKDIR /app/apps/strapi
EXPOSE 1337
CMD ["pnpm", "start"]

# --- Storefront: built at container start --------------------------------------
# Cache Components prerender pages with live Medusa/Strapi data, which are not
# reachable while the image is built. The build therefore runs when the
# container starts, once the backends are up (see storefront-start.sh).
FROM deps AS storefront
COPY apps/storefront apps/storefront
WORKDIR /app/apps/storefront
COPY infra/docker/storefront-start.sh /usr/local/bin/storefront-start
EXPOSE 3100
CMD ["storefront-start"]
