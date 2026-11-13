#!/bin/sh
# One-time (idempotent) setup of the Garage media bucket.
#   Local:      sh infra/garage/init.sh finikura-garage localhost
#   Production: sh infra/garage/init.sh finikura-garage media.<domain>
# Prints the access key to copy into S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY (shown once, store it in .env or Dokploy).
set -eu
CONTAINER="${1:-finikura-garage}"
PUBLIC_HOST="${2:-localhost}"
BUCKET=media
KEY=finikura
g() { docker exec "$CONTAINER" /garage "$@"; }

# 1. Layout: give the single node a role (only the first time).
if g status | grep -q "NO ROLE ASSIGNED"; then
  NODE=$(g node id -q | cut -d@ -f1)
  g layout assign -z dc1 -c 20G "$NODE"
  g layout apply --version 1
fi

# 2. Bucket, served publicly as a website under PUBLIC_HOST.
g bucket info "$BUCKET" >/dev/null 2>&1 || g bucket create "$BUCKET"
g bucket website --allow "$BUCKET"
g bucket info "$PUBLIC_HOST" >/dev/null 2>&1 || g bucket alias "$BUCKET" "$PUBLIC_HOST"

# 3. Application key (Medusa and Strapi), read and write on the bucket only.
if ! g key info "$KEY" >/dev/null 2>&1; then
  g key create "$KEY"
  g bucket allow --read --write "$BUCKET" --key "$KEY"
  echo
  echo ">>> Copy the Key ID and Secret key above into S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY."
else
  echo "Key \"$KEY\" already exists (secret: docker exec $CONTAINER /garage key info $KEY --show-secret)."
fi
echo "Bucket \"$BUCKET\" served at http(s)://$PUBLIC_HOST (port 3902 locally)."
