#!/usr/bin/env bash
#
# Pull DATA ONLY from the prod Postgres container and load it into the local DB.
#
# - Schema, functions, triggers, and pg_cron jobs on the local DB are never touched.
#   Only rows in the `public` schema are replaced; the `cron` schema is excluded.
# - Triggers and FK checks are suppressed during load (session_replication_role = replica),
#   so trigger side effects don't run twice and table load order doesn't matter.
# - The load runs in a single transaction: any error rolls back and local data is left as-is.
# - A data-only backup of the local DB is taken first, in db/dumps/.
#
# Usage:
#   db/scripts/sync-prod-data.sh                 # dump prod, then restore locally
#   db/scripts/sync-prod-data.sh path/to.dump    # restore an existing dump (no SSH)
#
# Overrides (env vars):
#   PROD_SSH            SSH target for the prod host       (default: root@198.199.97.95)
#   PROD_DB_CONTAINER   Container name/id of prod Postgres (default: compose service "db")
#   EXCLUDE_TABLES      Space-separated public tables to leave alone locally

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DUMP_DIR="$ROOT_DIR/db/dumps"
ENV_FILE="$ROOT_DIR/server/.env.local"
PROD_SSH="${PROD_SSH:-root@198.199.97.95}"
EXCLUDE_TABLES="${EXCLUDE_TABLES:-}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$DUMP_DIR"

# Local connection settings from server/.env.local
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a
export PGHOST="${DB_HOST:-localhost}" PGPORT="${DB_PORT:-5432}" PGDATABASE="$DB_NAME" PGUSER="$DB_USER" PGPASSWORD="$DB_USER_PWD"

if [[ "$PGHOST" != "localhost" && "$PGHOST" != "127.0.0.1" ]]; then
	echo "Refusing to restore into non-local host '$PGHOST'." >&2
	exit 1
fi

# 1. Get a prod data dump
if [[ $# -ge 1 ]]; then
	DUMP_FILE="$1"
	echo "→ Using existing dump: $DUMP_FILE"
else
	DUMP_FILE="$DUMP_DIR/prod-data-$STAMP.dump"
	echo "→ Dumping prod data over SSH ($PROD_SSH)…"
	# pg_dump runs inside the prod container, using that container's own POSTGRES_* env
	ssh "$PROD_SSH" "
		set -e
		C=\"${PROD_DB_CONTAINER:-}\"
		[ -n \"\$C\" ] || C=\$(docker ps -qf label=com.docker.compose.service=db | head -n1)
		[ -n \"\$C\" ] || { echo 'No prod db container found' >&2; exit 1; }
		docker exec \"\$C\" sh -c 'pg_dump -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" --data-only --schema=public -Fc'
	" > "$DUMP_FILE"
	echo "  saved $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"
fi

# 2. Back up current local data
BACKUP_FILE="$DUMP_DIR/local-data-backup-$STAMP.dump"
echo "→ Backing up local data to $BACKUP_FILE"
pg_dump --data-only --schema=public -Fc -f "$BACKUP_FILE"

# 3. Build a restore list, skipping anything that doesn't exist locally or is excluded
LOCAL_RELS="$(psql -Atc "select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public'")"
TOC_FILE="$(mktemp)"
trap 'rm -f "$TOC_FILE"' EXIT

TABLES=()
SKIPPED=()
while IFS= read -r line; do
	# TOC line: "<id>; <oid> <oid> TABLE DATA public <name> <owner>"
	if [[ "$line" =~ ^[0-9]+\;\ [0-9]+\ [0-9]+\ (TABLE\ DATA|SEQUENCE\ SET|MATERIALIZED\ VIEW\ DATA)\ public\ ([^ ]+)\  ]]; then
		kind="${BASH_REMATCH[1]}"
		name="${BASH_REMATCH[2]}"
		if ! grep -qxF "$name" <<<"$LOCAL_RELS" || [[ " $EXCLUDE_TABLES " == *" $name "* ]]; then
			SKIPPED+=("$name")
			continue
		fi
		[[ "$kind" == "TABLE DATA" ]] && TABLES+=("public.\"$name\"")
	fi
	echo "$line" >>"$TOC_FILE"
done < <(pg_restore -l "$DUMP_FILE")

if [[ ${#TABLES[@]} -eq 0 ]]; then
	echo "No tables to restore." >&2
	exit 1
fi
if [[ ${#SKIPPED[@]} -gt 0 ]]; then
	echo "  skipping (missing locally or excluded): ${SKIPPED[*]}"
fi

# 4. Truncate + load in one transaction with triggers/FK checks off
echo "→ Restoring ${#TABLES[@]} tables into local ${PGDATABASE}…"
{
	echo "SET session_replication_role = replica;"
	echo "TRUNCATE TABLE $(IFS=,; echo "${TABLES[*]}") CASCADE;"
	pg_restore -L "$TOC_FILE" -f - "$DUMP_FILE"
} | psql -q -v ON_ERROR_STOP=1 --single-transaction >/dev/null

echo "✓ Done. Local data now matches $(basename "$DUMP_FILE")."
echo "  Roll back with: db/scripts/sync-prod-data.sh $BACKUP_FILE"
