#!/bin/sh
# Builds the storefront against the live backends, then serves it.
# Waits for Medusa and Strapi first, so prerendered pages contain real data.
set -e
cd /app/apps/storefront
for url in "$MEDUSA_BACKEND_URL/health" "$STRAPI_URL/_health"; do
  echo "Waiting for $url"
  until node -e "fetch('$url').then(r=>process.exit(r.ok||r.status===204?0:1)).catch(()=>process.exit(1))"; do sleep 3; done
done
NODE_ENV=production pnpm build
exec env NODE_ENV=production pnpm exec next start -p 3100
