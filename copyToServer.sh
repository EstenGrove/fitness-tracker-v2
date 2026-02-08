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

# ----------------------
# 1️⃣ Copy files
# ----------------------
echo -e "${BLUE}Copying files to droplet...${NC}"
rsync -av --delete --progress \
  --exclude node_modules \
  --exclude build \
  --exclude .env \
  --exclude .env.local \
  --exclude .git \
  --exclude .DS_Store \
  "${LOCAL_PATH}/" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/"

echo -e "${GREEN}Files copied successfully.${NC}"

# ----------------------
# 2️⃣ Rebuild & restart Docker
# ----------------------
echo -e "${BLUE}Rebuilding Docker containers on droplet...${NC}"

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -c "'
cd ${TARGET_PATH}
docker compose build --no-cache client server
docker compose up -d
'"

echo "🚀 ${GREEN}Deployment complete!${NC}"