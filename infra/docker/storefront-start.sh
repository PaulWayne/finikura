#!/bin/sh
# Builds the storefront against the live backends, then serves it.
# Waits for Medusa and Strapi first, so prerendered pages contain real data.
set -e
cd /app/apps/storefront

# A restart of the same container keeps its build: the site is back in seconds, and Medusa and
# Strapi refresh its cache through /api/revalidate. A redeploy creates a new container, so it builds.
if [ -f .next/BUILD_ID ] && [ -z "$FORCE_REBUILD" ]; then
  echo "Build found, serving it (set FORCE_REBUILD=1 to rebuild)"
else
  for url in "$MEDUSA_BACKEND_URL/health" "$STRAPI_URL/_health"; do
    echo "Waiting for $url"
    tries=0
    until node -e "fetch('$url').then(r=>process.exit(r.ok||r.status===204?0:1)).catch(()=>process.exit(1))"; do
      tries=$((tries + 1))
      # 10 minutes: past that, stop with an error so the logs say why and Docker starts over.
      if [ "$tries" -ge 200 ]; then echo "$url still unreachable after 10 minutes" >&2; exit 1; fi
      sleep 3
    done
  done
  NODE_ENV=production pnpm build
fi
exec env NODE_ENV=production pnpm exec next start -p 3100
