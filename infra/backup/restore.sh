#!/bin/sh
# Restores a Fini Kura backup folder made by backup.sh.
# Usage: restore.sh /var/backups/finikura/2026-11-30_0300 [medusa|strapi|uploads|all]
# Stop medusa, strapi and storefront first: docker stop finikura-medusa finikura-strapi finikura-storefront
# Each database is dropped and recreated empty, then restored.
set -eu

SRC=${1:?backup folder required}
WHAT=${2:-all}
PG_CONTAINER=${PG_CONTAINER:-finikura-postgres}
PG_USER=${PG_USER:-finikura}
UPLOADS_VOLUME=${UPLOADS_VOLUME:-finikura_finikura-strapi-uploads}

restore_db() {
  db=$1
  docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -v ON_ERROR_STOP=1 \
    -c "DROP DATABASE IF EXISTS $db WITH (FORCE);" -c "CREATE DATABASE $db OWNER $PG_USER;"
  docker exec -i "$PG_CONTAINER" pg_restore -U "$PG_USER" -d "$db" --no-owner < "$SRC/$db.dump"
  echo "restored $db"
}

case "$WHAT" in
  medusa|strapi) restore_db "$WHAT" ;;
  uploads) ;;
  all) restore_db medusa; restore_db strapi ;;
  *) echo "unknown target: $WHAT"; exit 1 ;;
esac

if [ "$WHAT" = uploads ] || [ "$WHAT" = all ]; then
  if [ -f "$SRC/uploads.tar.gz" ]; then
    docker run --rm -v "$UPLOADS_VOLUME":/uploads -v "$SRC":/in:ro alpine:3 sh -c "rm -rf /uploads/* && tar xzf /in/uploads.tar.gz -C /uploads"
    echo "restored uploads"
  fi
fi
echo "Done. Restart: docker start finikura-medusa finikura-strapi finikura-storefront"
