#!/bin/bash
set -e

# COLORS
RED="\033[1;31m"
GREEN="\033[1;32m"
BLUE="\033[1;34m"
NC="\033[0m"

REMOTE_HOST='198.199.97.95'
REMOTE_USER='root'
TARGET_PATH='/opt/app.sgore.dev'
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
  cd /opt/app.sgore.dev

  docker compose build
  docker compose up -d

  if [ -f backup.dump ]; then
    echo "🗄 Restoring database..."

    DB_CONTAINER=$(docker compose ps -q db)

    docker cp backup.dump ${DB_CONTAINER}:/backup.dump

    docker exec -i ${DB_CONTAINER} \
      pg_restore \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --clean \
        --if-exists \
        /backup.dump

    rm backup.dump
    echo "✅ Database restored"
  fi

  echo "✅ Deploy complete"
EOF