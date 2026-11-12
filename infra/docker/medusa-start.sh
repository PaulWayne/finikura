#!/bin/sh
# Runs pending migrations (and link sync), then starts Medusa from the build output.
set -e
cd /app/apps/medusa/.medusa/server
../../node_modules/.bin/medusa db:migrate
exec ../../node_modules/.bin/medusa start
