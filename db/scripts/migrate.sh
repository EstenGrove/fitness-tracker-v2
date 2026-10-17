#!/usr/bin/env bash
#
# Apply pending SQL migrations (db/migrations/*.sql, in filename order) to the local or prod DB.
#
# - Applied files are recorded in a 'schema_migrations' table (filename + checksum), so each
#   file runs once per database. Nothing is ever dropped or rolled back by this script.
# - Each file runs in ONE transaction together with its 'schema_migrations' row: if anything in
#   the file fails, the whole file is rolled back, it stays pending & the script stops there.
# - Migration files must be safe to re-run (CREATE OR REPLACE / IF NOT EXISTS) and must NOT
#   contain their own BEGIN/COMMIT (this script wraps each file).
# - A file edited after it was applied is reported as CHANGED and is NOT re-run.
#   Put the change in a new migration file instead.
# - Prod: asks for confirmation & takes a full pg_dump on the server first
#   (/var/backups/postgres/pre-migrate-<timestamp>.dump).
#
# Usage:
#   db/scripts/migrate.sh                    # local: apply pending migrations
#   db/scripts/migrate.sh --status           # local: list applied/pending (read-only)
#   db/scripts/migrate.sh --prod --status    # prod:  list applied/pending (read-only)
#   db/scripts/migrate.sh --prod             # prod:  confirm, back up, apply pending
#   db/scripts/migrate.sh --prod --check     # prod:  exit 1 if anything is pending (used by deploy.sh)
#   db/scripts/migrate.sh --baseline         # record ALL files as applied WITHOUT running them
#                                            #   (for a DB that already has them, eg. applied by hand)
#
# Flags:
#   --yes          skip the confirmation prompt
#   --no-backup    prod only: skip the pre-migration pg_dump
#
# Overrides (env vars):
#   PROD_SSH          SSH target for the prod host  (default: root@198.199.97.95)
#   MIGRATE_DB_NAME   Local database name           (default: DB_NAME from server/.env.local)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIGRATIONS_DIR="$ROOT_DIR/db/migrations"
ENV_FILE="$ROOT_DIR/server/.env.local"
PROD_SSH="${PROD_SSH:-root@198.199.97.95}"
PROD_BACKUP_DIR="/var/backups/postgres"
STAMP="$(date +%Y%m%d-%H%M%S)"

# COLORS
RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
NC="\033[0m"

PROD=false
MODE="apply" # apply | status | check | baseline
ASSUME_YES=false
BACKUP=true

for arg in "$@"; do
	case "$arg" in
	--prod) PROD=true ;;
	--status) MODE="status" ;;
	--check) MODE="check" ;;
	--baseline) MODE="baseline" ;;
	--yes) ASSUME_YES=true ;;
	--no-backup) BACKUP=false ;;
	*)
		echo "Unknown option: $arg (see the usage notes at the top of $0)" >&2
		exit 2
		;;
	esac
done

TARGET_LABEL="local"
$PROD && TARGET_LABEL="PROD ($PROD_SSH)"

# ----------------------
# Running SQL on the target
# ----------------------

if ! $PROD; then
	set -a
	# shellcheck disable=SC1090
	. "$ENV_FILE"
	set +a
	export PGHOST="${DB_HOST:-localhost}" PGPORT="${DB_PORT:-5432}" PGDATABASE="${MIGRATE_DB_NAME:-$DB_NAME}" PGUSER="$DB_USER" PGPASSWORD="$DB_USER_PWD"
	TARGET_LABEL="local ($PGDATABASE)"
fi

# Runs a command inside the prod db container (stdin is forwarded). Uses the container's own POSTGRES_* env.
prod_exec() {
	ssh "$PROD_SSH" "C=\$(docker ps -qf label=com.docker.compose.service=db | head -n1); [ -n \"\$C\" ] || { echo 'No running prod db container found. If the stack is down, start the db with: ssh $PROD_SSH \"cd /var/www/app.sgore.dev/html && docker compose up -d db\"' >&2; exit 1; }; docker exec -i \"\$C\" sh -c '$1'"
}

# Runs SQL from stdin on the target; extra psql args (eg. -At) are passed through
run_psql() {
	local args="$*"
	if $PROD; then
		prod_exec "psql -X -q -v ON_ERROR_STOP=1 -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" $args"
	else
		# shellcheck disable=SC2086
		psql -X -q -v ON_ERROR_STOP=1 $args
	fi
}

checksum() {
	if command -v shasum >/dev/null 2>&1; then
		shasum -a 256 "$1" | cut -d ' ' -f1
	else
		sha256sum "$1" | cut -d ' ' -f1
	fi
}

sql_quote() {
	printf "'%s'" "${1//\'/\'\'}"
}

# ----------------------
# 1. What's applied vs pending
# ----------------------

FILES=()
while IFS= read -r file; do
	FILES+=("$file")
done < <(find "$MIGRATIONS_DIR" -maxdepth 1 -name '*.sql' -type f | sort)

if [[ ${#FILES[@]} -eq 0 ]]; then
	echo "No migration files in $MIGRATIONS_DIR"
	exit 0
fi

printf "${BLUE}→ Checking migrations on ${TARGET_LABEL}…${NC}\n"

HAS_TABLE="$(run_psql -At <<<"SELECT to_regclass('public.schema_migrations') IS NOT NULL;")"
APPLIED=""
if [[ "$HAS_TABLE" == "t" ]]; then
	APPLIED="$(run_psql -At <<<"SELECT filename || '|' || checksum FROM schema_migrations;")"
fi

PENDING=()
CHANGED=()
for file in "${FILES[@]}"; do
	name="$(basename "$file")"
	sum="$(checksum "$file")"
	recorded="$(grep -E "^${name//./\\.}\|" <<<"$APPLIED" | cut -d '|' -f2 || true)"

	if [[ -z "$recorded" ]]; then
		PENDING+=("$file")
		printf "  ${YELLOW}pending${NC}   %s\n" "$name"
	elif [[ "$recorded" != "$sum" ]]; then
		CHANGED+=("$name")
		printf "  ${RED}CHANGED${NC}   %s  (edited after it was applied; not re-run)\n" "$name"
	else
		printf "  ${GREEN}applied${NC}   %s\n" "$name"
	fi
done

if [[ ${#CHANGED[@]} -gt 0 ]]; then
	printf "${YELLOW}⚠️  Changed files are never re-run. Put further changes in a new migration file.${NC}\n"
fi

case "$MODE" in
status)
	exit 0
	;;
check)
	if [[ ${#PENDING[@]} -gt 0 ]]; then
		printf "${YELLOW}${#PENDING[@]} pending migration(s) on ${TARGET_LABEL}.${NC}\n"
		exit 1
	fi
	printf "${GREEN}✓ Up to date.${NC}\n"
	exit 0
	;;
esac

if [[ ${#PENDING[@]} -eq 0 ]]; then
	printf "${GREEN}✓ Up to date. Nothing to apply.${NC}\n"
	exit 0
fi

# ----------------------
# 2. Confirm (& back up prod)
# ----------------------

if [[ "$MODE" == "baseline" ]]; then
	ACTION="Record ${#PENDING[@]} migration(s) as applied WITHOUT running them on ${TARGET_LABEL}"
else
	ACTION="Apply ${#PENDING[@]} migration(s) to ${TARGET_LABEL}"
fi

if ! $ASSUME_YES; then
	read -r -p "$ACTION? [y/N] " reply
	[[ "$reply" =~ ^[Yy]$ ]] || {
		echo "Cancelled."
		exit 1
	}
fi

if $PROD && $BACKUP && [[ "$MODE" == "apply" ]]; then
	BACKUP_FILE="$PROD_BACKUP_DIR/pre-migrate-$STAMP.dump"
	printf "${BLUE}→ Backing up prod to ${BACKUP_FILE} (on the server)…${NC}\n"
	ssh "$PROD_SSH" "set -e; mkdir -p $PROD_BACKUP_DIR; C=\$(docker ps -qf label=com.docker.compose.service=db | head -n1); [ -n \"\$C\" ] || { echo 'No running prod db container found. If the stack is down, start the db with: ssh $PROD_SSH \"cd /var/www/app.sgore.dev/html && docker compose up -d db\"' >&2; exit 1; }; docker exec \"\$C\" sh -c 'pg_dump -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -Fc' > $BACKUP_FILE; echo \"  saved (\$(du -h $BACKUP_FILE | cut -f1))\""
fi

# ----------------------
# 3. Apply (or record) each pending file, one transaction per file
# ----------------------

run_psql <<<"SET client_min_messages = warning;
CREATE TABLE IF NOT EXISTS schema_migrations (
	filename   TEXT PRIMARY KEY,
	checksum   TEXT NOT NULL,
	applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);"

for file in "${PENDING[@]}"; do
	name="$(basename "$file")"
	record="INSERT INTO schema_migrations (filename, checksum) VALUES ($(sql_quote "$name"), $(sql_quote "$(checksum "$file")"));"

	if [[ "$MODE" == "baseline" ]]; then
		run_psql <<<"$record"
		printf "  ${GREEN}recorded${NC}  %s\n" "$name"
		continue
	fi

	printf "  applying  %s… " "$name"
	if {
		echo "BEGIN;"
		echo "SET LOCAL client_min_messages = warning;"
		cat "$file"
		echo
		echo "$record"
		echo "COMMIT;"
	} | run_psql; then
		printf "${GREEN}done${NC}\n"
	else
		printf "${RED}FAILED${NC}\n"
		printf "${RED}✗ %s was rolled back and is still pending. Later files were not run.${NC}\n" "$name"
		exit 1
	fi
done

printf "${GREEN}✓ Migrations complete on ${TARGET_LABEL}.${NC}\n"
