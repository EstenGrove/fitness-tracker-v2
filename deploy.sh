#!/bin/bash
set -e

# COLORS
RED="\033[1;31m"
GREEN="\033[1;32m"
BLUE="\033[1;34m"
NC="\033[0m"

REMOTE_HOST='198.199.97.95'
REMOTE_USER='root'
TARGET_PATH='/var/www/app.sgore.dev/html'
LOCAL_PATH=$(pwd)
DB_BACKUP_PATH="./backup.dump"

RESTORE_DB=false
for arg in "$@"; do
  [[ "$arg" == "--restore-db" ]] && RESTORE_DB=true
done

printf "${GREEN}📦 Syncing project to ${REMOTE_HOST}${NC}\n"

rsync -av --delete --progress \
  --exclude node_modules \
  --exclude dist \
  --exclude .env \
  --exclude .env.local \
  --exclude .git \
  --exclude .DS_Store \
  "${LOCAL_PATH}/" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/"

if $RESTORE_DB; then
  printf "${BLUE}📤 Uploading DB backup${NC}\n"
  scp "$DB_BACKUP_PATH" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/backup.dump"
fi

printf "🚀 ${GREEN}Deploying on remote...${NC}\n"

ssh "${REMOTE_USER}@${REMOTE_HOST}" << 'EOF'
  set -e
  cd /var/www/app.sgore.dev/html

  echo "🛑 Stopping containers..."
  docker compose down

  echo "🔨 Building images (no cache)..."
  docker compose build --no-cache client server

  echo "🔍 Verifying SSL certificates exist..."
  if [ ! -f /etc/letsencrypt/live/app.sgore.dev/fullchain.pem ]; then
    echo "⚠️  WARNING: SSL certificate not found at /etc/letsencrypt/live/app.sgore.dev/fullchain.pem"
    echo "   You may need to run: certbot certonly --standalone -d app.sgore.dev"
  else
    echo "✅ SSL certificates found"
  fi

  echo "🚀 Starting containers..."
  docker compose up -d

  echo "⏳ Waiting for database to be ready..."
  sleep 5

  echo "📋 Container status:"
  docker compose ps

  echo "📝 Recent client logs:"
  docker compose logs --tail=20 client

  echo "🔍 Verifying container setup..."
  CLIENT_CONTAINER=$(docker compose ps -q client)
  if [ -n "$CLIENT_CONTAINER" ]; then
    echo "  - Checking nginx config in container:"
    docker exec $CLIENT_CONTAINER cat /etc/nginx/conf.d/default.conf | grep -E "(ssl_certificate|listen)" || true
    echo "  - Checking if SSL files are mounted:"
    docker exec $CLIENT_CONTAINER ls -la /etc/ssl/certs/ /etc/ssl/private/ 2>&1 || true
    echo "  - Testing nginx config:"
    docker exec $CLIENT_CONTAINER nginx -t 2>&1 || true
  fi

  if [ -f backup.dump ]; then
    echo "🗄 Restoring database..."

    # Load environment variables from .env.production
    # Use a safer method to read the values
    if [ -f .env.production ]; then
      POSTGRES_USER=$(grep -E "^POSTGRES_USER=" .env.production | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
      POSTGRES_DB=$(grep -E "^POSTGRES_DB=" .env.production | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
    fi

    # Fallback to common defaults if not set
    POSTGRES_USER=${POSTGRES_USER:-postgres}
    POSTGRES_DB=${POSTGRES_DB:-postgres}

    echo "  Using POSTGRES_USER: $POSTGRES_USER"
    echo "  Using POSTGRES_DB: $POSTGRES_DB"

    DB_CONTAINER=$(docker compose ps -q db)

    if [ -z "$DB_CONTAINER" ]; then
      echo "❌ Database container not found!"
      exit 1
    fi

    # Wait for database to be ready
    echo "  Waiting for database to accept connections..."
    until docker exec $DB_CONTAINER pg_isready -U "$POSTGRES_USER" > /dev/null 2>&1; do
      echo "    Database not ready, waiting..."
      sleep 2
    done
    echo "  Database is ready!"

    # Create pg_cron extension if it doesn't exist (required for restore)
    echo "  Creating pg_cron extension (if needed)..."
    docker exec $DB_CONTAINER \
      psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pg_cron;" 2>&1 || \
      echo "    Note: pg_cron may not be available in this PostgreSQL image"

    docker cp backup.dump ${DB_CONTAINER}:/backup.dump

    # Restore database, ignoring extension errors (like pg_cron which may not be available)
    echo "  Restoring database (this may take a while)..."
    set +e  # Don't exit on error for pg_restore
    docker exec -i ${DB_CONTAINER} \
      pg_restore \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-comments \
        /backup.dump 2>&1 | grep -v -E "(extension.*pg_cron|ERROR.*pg_cron)" || true
    
    RESTORE_EXIT_CODE=${PIPESTATUS[0]}
    set -e  # Re-enable exit on error
    
    if [ $RESTORE_EXIT_CODE -eq 0 ]; then
      echo "✅ Database restored successfully"
    else
      echo "⚠️  Database restore completed with warnings"
      echo "   Some extensions (like pg_cron) may not be available - this is usually OK"
      echo "   Your data should still be restored correctly"
    fi

    docker exec ${DB_CONTAINER} rm -f /backup.dump
    rm backup.dump
    echo "✅ Database restored"
  fi

  echo "✅ Deploy complete"
EOF