#!/usr/bin/env bash
# Does the database actually have the tables and columns the code expects?
#
# This is the check that would have caught the September 2026 outage: the
# LatelyItem table had been dropped from the shared Neon DB while main's
# homepage still queried it, so only `/` returned HTTP 500.
#
# Compares the LIVE database (read from the datasource in prisma/schema.prisma,
# i.e. whatever DATABASE_URL points at) against the models in a schema file.
#
#   ./scripts/check-drift.sh                      # working tree's schema
#   ./scripts/check-drift.sh origin/main          # a git ref's schema
#
# Exit 0 = no drift. Exit 1 = drift (the SQL printed is what the DB is MISSING
# relative to that schema). Read the SQL before you act on it: CREATE TABLE means
# the DB is behind the code, DROP TABLE means the DB is ahead of it.
set -uo pipefail
cd "$(dirname "$0")/.."

REF="${1:-}"
if [ -n "$REF" ]; then
  TARGET="$(mktemp -t schema.XXXXXX).prisma"
  trap 'rm -f "$TARGET"' EXIT
  git show "$REF:prisma/schema.prisma" > "$TARGET" || { echo "cannot read $REF:prisma/schema.prisma"; exit 2; }
  echo "Comparing live DB  ->  schema at $REF"
else
  TARGET="prisma/schema.prisma"
  echo "Comparing live DB  ->  schema in working tree"
fi

# --from is the live DB, --to is the desired models, so the SQL printed is what
# you would have to run on the DB to satisfy the code.
OUT="$(npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel "$TARGET" \
  --script 2>&1)"

if printf '%s' "$OUT" | grep -qi "empty migration"; then
  echo "OK: no drift. Every model the code expects exists in the database."
  exit 0
fi

echo
echo "DRIFT: the database does not match that schema."
echo "-------------------------------------------------------------"
printf '%s\n' "$OUT"
echo "-------------------------------------------------------------"
echo "If this lists CREATE TABLE/ADD COLUMN, the deployed code that queries it"
echo "will throw at runtime (Postgres 42P01 / 42703) on the pages that use it."
exit 1
