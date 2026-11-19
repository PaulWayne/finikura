#!/bin/sh
# Nightly backup of Fini Kura: PostgreSQL databases "medusa", "strapi" and "umami", media storage (Garage)
# and the Strapi local uploads volume (only while it still holds files not yet moved to Garage).
# Run on the VPS as root (cron), e.g. every night at 3:00:
#   0 3 * * * root /usr/local/bin/finikura-backup.sh >> /var/log/finikura-backup.log 2>&1
#
# Volumes are found through the containers that mount them: Dokploy names them after its own
# project (fini-kura-apps-xxxx_finikura-garage), not after the compose file.
#
# Variables (all optional):
#   BACKUP_DIR        local folder                 (default /var/backups/finikura)
#   KEEP              number of backups kept       (default 7, one per night)
#   PG_CONTAINER      postgres container           (default finikura-postgres)
#   PG_USER           postgres user                (default finikura)
#   STRAPI_CONTAINER  Strapi container             (default finikura-strapi)
#   GARAGE_CONTAINER  media storage container      (default finikura-garage)
#   RCLONE_REMOTE     off-site copy, e.g. "b2:finikura-backups" (rclone must be configured)
set -eu

BACKUP_DIR=${BACKUP_DIR:-/var/backups/finikura}
KEEP=${KEEP:-7}
PG_CONTAINER=${PG_CONTAINER:-finikura-postgres}
PG_USER=${PG_USER:-finikura}
STRAPI_CONTAINER=${STRAPI_CONTAINER:-finikura-strapi}
GARAGE_CONTAINER=${GARAGE_CONTAINER:-finikura-garage}
STAMP=$(date +%Y-%m-%d_%H%M)
DEST="$BACKUP_DIR/$STAMP"

log() { echo "$(date '+%F %T') $*"; }

# Folder on the host of the volume a container mounts at a given path (empty if none).
volume_dir() {
  docker inspect "$1" --format "{{range .Mounts}}{{if eq .Destination \"$2\"}}{{.Source}}{{end}}{{end}}" 2>/dev/null || true
}

umask 077
mkdir -p "$DEST"

for db in medusa strapi umami; do
  docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$db" --format=custom --no-owner > "$DEST/$db.dump"
  log "dump $db: $(du -h "$DEST/$db.dump" | cut -f1)"
done

# Strapi local uploads: empty once every file lives in Garage, then nothing is archived.
UPLOADS_DIR=$(volume_dir "$STRAPI_CONTAINER" /app/apps/strapi/public/uploads)
if [ -n "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  tar czf "$DEST/uploads.tar.gz" -C "$UPLOADS_DIR" .
  log "uploads: $(du -h "$DEST/uploads.tar.gz" | cut -f1)"
fi

# Media storage (product photos, Strapi media). The live metadata database is replaced by a fresh
# snapshot (meta/snapshots/<date>/db.sqlite), node key and layout included; data blocks are immutable
# files, safe to archive while Garage runs. A missing volume is an error: photos must never be
# skipped in silence.
GARAGE_DIR=$(volume_dir "$GARAGE_CONTAINER" /var/lib/garage)
if [ -z "$GARAGE_DIR" ] || [ ! -d "$GARAGE_DIR" ]; then
  log "ERROR: volume of $GARAGE_CONTAINER not found, photos NOT saved"
  exit 1
fi
docker exec "$GARAGE_CONTAINER" /garage meta snapshot >/dev/null 2>&1
tar czf "$DEST/garage.tar.gz" -C "$GARAGE_DIR" --exclude='meta/db.sqlite*' data meta
log "garage: $(du -h "$DEST/garage.tar.gz" | cut -f1)"

# Local retention: the KEEP most recent folders stay, older ones go. Only folders named like a
# date, directly under BACKUP_DIR, are ever removed.
ls -1d "$BACKUP_DIR"/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_[0-9][0-9][0-9][0-9] 2>/dev/null | sort -r | tail -n +"$((KEEP + 1))" |
  while IFS= read -r old; do
    rm -rf -- "$old"
    log "removed $old"
  done

# Off-site copy (BACKLOG: destination to be set up, the other VPS)
if [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy "$DEST" "$RCLONE_REMOTE/$STAMP"
  log "copied to $RCLONE_REMOTE/$STAMP"
else
  log "WARNING: RCLONE_REMOTE not set, backup kept on this server only"
fi
log "backup OK: $DEST ($(du -sh "$DEST" | cut -f1)), $(ls -1d "$BACKUP_DIR"/20* 2>/dev/null | wc -l | tr -d ' ') kept, $(du -sh "$BACKUP_DIR" | cut -f1) in total"
