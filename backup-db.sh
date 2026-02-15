#!/usr/bin/env bash
set -e  # Exit on error

# Ensure we're running with bash (not sh)
# This check helps catch cases where the script is run with sh explicitly
if [ -z "$BASH_VERSION" ]; then
    # Try to find and use bash
    if command -v bash > /dev/null 2>&1; then
        exec bash "$0" "$@"
    else
        echo "❌ ERROR: This script must be run with bash, not sh"
        echo "   bash was not found on this system"
        exit 1
    fi
fi

# -------------------------
# CONFIG
# -------------------------
# Find project root (directory containing docker-compose.yml)
# Works whether script is in project root or in a scripts/ subdirectory
# Use $0 instead of BASH_SOURCE for better compatibility
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# If APP_DIR is not set, search for docker-compose.yml
if [ -z "$APP_DIR" ]; then
    # Start from script directory and walk up to find docker-compose.yml
    SEARCH_DIR="$SCRIPT_DIR"
    while [ "$SEARCH_DIR" != "/" ]; do
        if [ -f "$SEARCH_DIR/docker-compose.yml" ]; then
            APP_DIR="$SEARCH_DIR"
            break
        fi
        SEARCH_DIR="$(dirname "$SEARCH_DIR")"
    done
    
    # If not found, default to script directory
    if [ -z "$APP_DIR" ]; then
        APP_DIR="$SCRIPT_DIR"
    fi
fi

# For production, you can also explicitly set: APP_DIR="/var/www/app.sgore.dev/html"
SERVICE_NAME="db"  # Service name from docker-compose.yml

# Database configuration - matches dbConfig.ts defaults
# Can be overridden by environment variables from .env.production
DB_NAME="${DB_NAME:-${POSTGRES_DB:-FitnessTracker-v2}}"
DB_USER="${DB_USER:-${POSTGRES_USER:-postgres}}"

# Backup directory on HOST filesystem (outside Docker volumes)
# This ensures backups survive container rebuilds
# Using a directory that's clearly on the host, not in any volume
BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgres}"

DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DB_NAME}_${DATE}.dump"

# -------------------------
# SAFETY CHECKS
# -------------------------
# Verify we're on the host, not inside a container
if [ -f "/.dockerenv" ]; then
    echo "❌ ERROR: This script must run on the HOST, not inside a container"
    exit 1
fi

# Verify backup directory is not inside a Docker volume
# Docker volumes are typically at /var/lib/docker/volumes or /var/lib/postgresql
case "${BACKUP_DIR}" in
    /var/lib/docker/volumes/*|/var/lib/postgresql/*)
        echo "❌ ERROR: Backup directory cannot be inside a Docker volume"
        echo "   Current path: ${BACKUP_DIR}"
        exit 1
        ;;
esac

# Verify backup directory is not the same as the database volume mount point
case "${BACKUP_DIR}" in
    */postgres_data/*|*/var/lib/postgresql/data*)
        echo "❌ ERROR: Backup directory cannot be in the database data directory"
        exit 1
        ;;
esac

# -------------------------
# ENSURE BACKUP DIRECTORY EXISTS
# -------------------------
# Create directory with proper permissions (may need sudo in production)
if [ ! -d "$BACKUP_DIR" ]; then
    echo "📁 Creating backup directory: $BACKUP_DIR"
    # Try without sudo first (for local dev), then with sudo if needed
    mkdir -p "$BACKUP_DIR" 2>/dev/null || sudo mkdir -p "$BACKUP_DIR"
    # Ensure it's writable
    chmod 755 "$BACKUP_DIR" 2>/dev/null || sudo chmod 755 "$BACKUP_DIR"
fi

# Verify directory is writable
if [ ! -w "$BACKUP_DIR" ]; then
    echo "⚠️  Warning: Backup directory is not writable, attempting to fix permissions..."
    sudo chmod 755 "$BACKUP_DIR" 2>/dev/null || {
        echo "❌ ERROR: Cannot write to backup directory: $BACKUP_DIR"
        exit 1
    }
fi

# -------------------------
# LOAD ENVIRONMENT VARIABLES (if .env.production exists)
# -------------------------
# Load environment variables using the same method as deploy.sh
if [ -f "${APP_DIR}/.env.production" ]; then
    echo "📄 Loading environment variables from .env.production"
    
    # Use grep to extract values (same method as deploy.sh)
    if grep -q "^POSTGRES_USER=" "${APP_DIR}/.env.production"; then
        POSTGRES_USER=$(grep -E "^POSTGRES_USER=" "${APP_DIR}/.env.production" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
        export POSTGRES_USER
    fi
    
    if grep -q "^DB_USER=" "${APP_DIR}/.env.production"; then
        DB_USER=$(grep -E "^DB_USER=" "${APP_DIR}/.env.production" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
        export DB_USER
    fi
    
    if grep -q "^POSTGRES_DB=" "${APP_DIR}/.env.production"; then
        POSTGRES_DB=$(grep -E "^POSTGRES_DB=" "${APP_DIR}/.env.production" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
        export POSTGRES_DB
    fi
    
    if grep -q "^DB_NAME=" "${APP_DIR}/.env.production"; then
        DB_NAME=$(grep -E "^DB_NAME=" "${APP_DIR}/.env.production" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
        export DB_NAME
    fi
fi

# Set final values with fallbacks (matching dbConfig.ts logic)
DB_NAME="${DB_NAME:-${POSTGRES_DB:-FitnessTracker-v2}}"
DB_USER="${DB_USER:-${POSTGRES_USER:-postgres}}"

# -------------------------
# VERIFY CONTAINER IS RUNNING
# -------------------------
cd "$APP_DIR" || {
    echo "❌ ERROR: Cannot change to directory: $APP_DIR"
    exit 1
}

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERROR: docker-compose.yml not found in $APP_DIR"
    echo "   Make sure the script is in the project root or a subdirectory"
    exit 1
fi

# Check if service is running (try both 'docker compose' and 'docker-compose')
if command -v docker > /dev/null 2>&1 && docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ ERROR: docker compose or docker-compose not found"
    exit 1
fi

# Verify service is running
if ! $DOCKER_COMPOSE_CMD ps "$SERVICE_NAME" 2>/dev/null | grep -q "Up"; then
    echo "❌ ERROR: Database service '$SERVICE_NAME' is not running"
    echo "   Start it with: $DOCKER_COMPOSE_CMD up -d $SERVICE_NAME"
    exit 1
fi

echo "✅ Container verification passed"
echo "   Service: $SERVICE_NAME"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""
echo "🔍 Verifying database user exists..."
# Try to list users in the database to verify the user exists
if $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME psql -U postgres -d postgres -c "\du" 2>/dev/null | grep -q "$DB_USER"; then
    echo "   ✅ User '$DB_USER' found in database"
elif $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME psql -U postgres -d postgres -c "\du" 2>/dev/null > /dev/null 2>&1; then
    echo "   ⚠️  Warning: User '$DB_USER' not found, but 'postgres' user exists"
    echo "   Available users:"
    $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME psql -U postgres -d postgres -c "\du" 2>/dev/null | grep -E "^\s+\w+\s" || true
    echo ""
    echo "   💡 Tip: Check your .env.production file for POSTGRES_USER or DB_USER"
else
    echo "   ⚠️  Could not verify users (this is OK if user has different permissions)"
fi

# -------------------------
# RUN pg_dump INSIDE CONTAINER (READ-ONLY OPERATION)
# -------------------------
echo ""
echo "🗄️  Creating backup (READ-ONLY operation - database will NOT be modified)"
echo "   ⚠️  pg_dump only READS data - it cannot write, update, or delete anything"

# Use pg_dump with custom format for compressed, reliable backups
# Flags:
#   -F c    : Custom format (compressed, allows selective restore)
#   -b      : Include blobs
#   -v      : Verbose output
#   --no-password : Prevent password prompts
if ! $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME \
  pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -b -v --no-password \
  -f /tmp/$FILENAME; then
    echo "❌ ERROR: pg_dump failed"
    exit 1
fi

# -------------------------
# COPY FILE OUT OF CONTAINER TO HOST
# -------------------------
CONTAINER_ID=$($DOCKER_COMPOSE_CMD ps -q $SERVICE_NAME)

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ ERROR: Could not find container ID for service '$SERVICE_NAME'"
    # Clean up temp file in container
    $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME rm -f /tmp/$FILENAME 2>/dev/null || true
    exit 1
fi

echo "📥 Copying backup from container to HOST filesystem..."
if ! docker cp "$CONTAINER_ID:/tmp/$FILENAME" "$BACKUP_DIR/$FILENAME"; then
    echo "❌ ERROR: Failed to copy backup file from container"
    # Clean up temp file in container
    $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME rm -f /tmp/$FILENAME 2>/dev/null || true
    exit 1
fi

# Verify backup was copied successfully and has content
if [ ! -f "$BACKUP_DIR/$FILENAME" ]; then
    echo "❌ ERROR: Backup file was not created on host"
    $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME rm -f /tmp/$FILENAME 2>/dev/null || true
    exit 1
fi

if [ ! -s "$BACKUP_DIR/$FILENAME" ]; then
    echo "❌ ERROR: Backup file is empty"
    rm -f "$BACKUP_DIR/$FILENAME"
    $DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME rm -f /tmp/$FILENAME 2>/dev/null || true
    exit 1
fi

# -------------------------
# CLEAN UP TEMP FILE IN CONTAINER
# -------------------------
echo "🧹 Cleaning up temporary file in container..."
$DOCKER_COMPOSE_CMD exec -T $SERVICE_NAME rm -f /tmp/$FILENAME 2>/dev/null || true

# -------------------------
# VERIFY BACKUP SIZE AND LOCATION
# -------------------------
FILE_SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
echo ""
echo "✅ Backup completed successfully!"
echo "   File: $BACKUP_DIR/$FILENAME"
echo "   Size: $FILE_SIZE"
echo "   Location: HOST filesystem (safe from container rebuilds)"
echo "   Database: $DB_NAME (unchanged - backup is read-only)"

# -------------------------
# OPTIONAL: DELETE BACKUPS OLDER THAN 14 DAYS
# -------------------------
echo "🧹 Cleaning up backups older than 14 days..."
DELETED_COUNT=$(find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.dump" -type f -mtime +14 -delete -print | wc -l)
if [ "$DELETED_COUNT" -gt 0 ]; then
    echo "   Deleted $DELETED_COUNT old backup(s)"
else
    echo "   No old backups to clean up"
fi

echo ""
echo "✅ Backup process complete - your database data is safe and unchanged"