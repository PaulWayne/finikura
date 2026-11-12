#!/bin/sh
# Nightly backup of Fini Kura: PostgreSQL databases "medusa" and "strapi" + Strapi media.
# Run on the VPS (cron or Dokploy schedule), e.g. every night at 3:00:
#   0 3 * * * /opt/finikura/infra/backup/backup.sh >> /var/log/finikura-backup.log 2>&1
#
# Variables (all optional):
#   BACKUP_DIR        local folder              (default /var/backups/finikura)
#   KEEP_DAYS         local retention in days   (default 14)
#   PG_CONTAINER      postgres container        (default finikura-postgres)
#   PG_USER           postgres user             (default finikura)
#   UPLOADS_VOLUME    Strapi media volume       (default finikura_finikura-strapi-uploads)
#   RCLONE_REMOTE     off-site copy, e.g. "b2:finikura-backups" (rclone must be configured)
set -eu

BACKUP_DIR=${BACKUP_DIR:-/var/backups/finikura}
KEEP_DAYS=${KEEP_DAYS:-14}
PG_CONTAINER=${PG_CONTAINER:-finikura-postgres}
PG_USER=${PG_USER:-finikura}
UPLOADS_VOLUME=${UPLOADS_VOLUME:-finikura_finikura-strapi-uploads}
STAMP=$(date +%Y-%m-%d_%H%M)
DEST="$BACKUP_DIR/$STAMP"

mkdir -p "$DEST"
for db in medusa strapi; do
  docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$db" --format=custom --no-owner > "$DEST/$db.dump"
  echo "$(date '+%F %T') dump $db: $(du -h "$DEST/$db.dump" | cut -f1)"
done

if [ -n "$UPLOADS_VOLUME" ] && docker volume inspect "$UPLOADS_VOLUME" >/dev/null 2>&1; then
  docker run --rm -v "$UPLOADS_VOLUME":/uploads:ro -v "$DEST":/out alpine:3 tar czf /out/uploads.tar.gz -C /uploads .
  echo "$(date '+%F %T') uploads: $(du -h "$DEST/uploads.tar.gz" | cut -f1)"
fi

# Local retention
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" -exec rm -rf {} +

# Off-site copy (required for FK-09; destination still to be chosen)
if [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy "$DEST" "$RCLONE_REMOTE/$STAMP"
  echo "$(date '+%F %T') copied to $RCLONE_REMOTE/$STAMP"
else
  echo "$(date '+%F %T') WARNING: RCLONE_REMOTE not set, backup kept on this server only"
fi
echo "$(date '+%F %T') backup OK: $DEST"
