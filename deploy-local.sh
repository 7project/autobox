#!/usr/bin/env bash
# ==============================================================================
# AutoBox74 - Скрипт локальной сборки и передачи образа на VPS (Bash / macOS / Linux)
# ==============================================================================
# Использование:
#   chmod +x deploy-local.sh
#   ./deploy-local.sh
# ==============================================================================

set -euo pipefail

SERVER="${1:-vps_web}"
USER="${2:-webmaster}"
REMOTE_DIR="${3:-/opt/autobox}"
IMAGE_NAME="autobox74-app:latest"

echo "🚀 [1/4] Локальная сборка Docker-образа ($IMAGE_NAME) под linux/amd64..."
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

TARGET_HOST="$SERVER"
if [ "$SERVER" != "vps_web" ]; then
  TARGET_HOST="${USER}@${SERVER}"
fi

echo "📤 [2/4] Передача сжатого потока через SSH прямо в docker load на сервере..."
# Прямой потоковый пайплайн: без сохранения на диск
docker save "$IMAGE_NAME" | gzip -c | ssh "$TARGET_HOST" "gunzip -c | docker load"

echo "🔄 [3/4] Резервное копирование и перезапуск контейнера на сервере..."
ssh "$TARGET_HOST" bash -s <<EOF
cd "$REMOTE_DIR"
docker tag "$IMAGE_NAME" autobox74-app:previous 2>/dev/null || true
docker compose up -d --no-deps app
docker exec nginx_main nginx -s reload 2>/dev/null || docker compose exec nginx nginx -s reload 2>/dev/null || true
docker image prune -f
docker ps --filter "name=autobox"
EOF

echo "✅ [4/4] Готово! Приложение обновлено. Проверка https://autobox74.ru"
