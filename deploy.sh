#!/bin/bash

# COLORS
RED="\033[1;31m"
GREEN="\033[1;32m"
BLUE="\033[1;34m"
NC="\033[0m"

REMOTE_HOST='198.199.97.95'
REMOTE_USER='root'
TARGET_PATH='/var/www/app.sgore.dev/html'
LOCAL_PATH=$(pwd)
DB_BACKUP_PATH="./backup.dump"  # Custom-format dump file

# Parse flags
RESTORE_DB=false
for arg in "$@"; do
  if [[ "$arg" == "--restore-db" ]]; then
    RESTORE_DB=true
  fi
done

# SYNC CODE
printf "${GREEN}Syncing project to remote host at ${REMOTE_HOST}${NC}\n"
rsync -av --progress \
  --exclude node_modules \
  --exclude dist \
  --exclude .env \
  --exclude .git \
  --exclude .DS_Store \
  "${LOCAL_PATH}/" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/"

# OPTIONAL: Upload DB backup file
if $RESTORE_DB; then
  printf "${BLUE}Uploading DB backup file: ${DB_BACKUP_PATH}${NC}\n"
  scp "$DB_BACKUP_PATH" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/backup.dump"
fi

# REMOTE COMMANDS
printf "🚀 ${GREEN}Deploying project...${NC}\n"
ssh "${REMOTE_USER}@${REMOTE_HOST}" << EOF
  cd ${TARGET_PATH}
  docker compose pull
  docker compose up --build -d

  if $RESTORE_DB; then
    echo "${BLUE}Restoring PostgreSQL database from backup.dump...${NC}"
    docker cp backup.dump \$(docker compose ps -q db):/backup.dump
    docker exec -i \$(docker compose ps -q db) pg_restore -U postgres -d yourdb --clean --if-exists /backup.dump
    echo "${GREEN}✅ Database restore completed.${NC}"
  fi

  echo "${GREEN}✅ Deployment & build were successful!${NC}"
EOF
