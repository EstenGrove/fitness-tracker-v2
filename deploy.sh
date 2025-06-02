#!/bin/bash

# COLORS
RED="\033[1;31m"
GREEN="\033[1;32m"
BLUE="\033[1;34m"
NC="\033[0m"



REMOTE_HOST='198.199.97.95'
REMOTE_USER='root'
REMOTE_USER_PASSWORD='l%Xw}sve.l?t^^Tzf[ONU?h$bHy0?5E*'
# Target folder for project root on the remote server (eg droplet virtual block)
TARGET_PATH='/var/www/app.sgore.dev/html'
LOCAL_PATH=$(pwd)


# DEPLOY CODE #

echo -e "${GREEN} Syncing project to remote host at ${REMOTE_HOST} ${NC}"


rsync -av --progress \
  --exclude node_modules \
  --exclude dist \
  --exclude .env \
  --exclude .git \
  --exclude .DS_STORE \
  "${LOCAL_PATH}/" "${REMOTE_USER}@${REMOTE_HOST}:${TARGET_PATH}/"

echo -e "🚀 ${GREEN} Deploying project...${NC}"

# SSH INTO REMOTE DROPLET AND RUN DOCKER COMMANDS
ssh "${REMOTE_USER}@${REMOTE_HOST}" << EOF
  cd ${TARGET_PATH}
  docker componse pull
  docker compose up --build -d
  echo "✅ ${GREEN} Deployment & build were successful! ${NC}"
EOF