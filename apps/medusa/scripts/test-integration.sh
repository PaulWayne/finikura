#!/bin/sh
# Medusa integration tests on a throwaway PostgreSQL (FK-29).
# Starts postgres:16-alpine on a free port, runs the HTTP integration tests, then removes the container.
# Needs only Docker: no docker compose, no .env.test (local values win if .env.test exists, except DB_*).
set -eu

NAME="finikura-test-pg-$$"
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

docker run -d --rm --name "$NAME" \
  -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=postgres \
  -p 127.0.0.1::5432 --tmpfs /var/lib/postgresql/data \
  postgres:16-alpine >/dev/null

PORT=$(docker port "$NAME" 5432/tcp | head -1 | sed 's/.*://')
i=0
until docker exec "$NAME" pg_isready -U test -q; do
  i=$((i + 1)); [ "$i" -gt 60 ] && { echo "PostgreSQL did not start" >&2; exit 1; }
  sleep 0.5
done
# pg_isready answers during the init restart: wait for a real query.
until docker exec "$NAME" psql -U test -d postgres -tAc "select 1" >/dev/null 2>&1; do sleep 0.5; done
echo "PostgreSQL de test sur le port $PORT ($NAME)"

# "localhost", not 127.0.0.1: Medusa forces SSL on any other host name.
export DB_HOST=localhost DB_PORT="$PORT" DB_USERNAME=test DB_PASSWORD=test DB_TEMP_NAME=medusa_test
export JWT_SECRET="${JWT_SECRET:-test-only}" COOKIE_SECRET="${COOKIE_SECRET:-test-only}"
export STORE_CORS="${STORE_CORS:-http://localhost:3100}" ADMIN_CORS="${ADMIN_CORS:-http://localhost:9000}"
export AUTH_CORS="${AUTH_CORS:-http://localhost:9000,http://localhost:3100}" LOG_LEVEL="${LOG_LEVEL:-error}"

pnpm run test:integration:http "$@"
