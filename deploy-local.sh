#!/usr/bin/env bash
# ==============================================================================
# AutoBox74 - Скрипт локальной сборки и передачи образа на VPS (Bash / macOS / Linux)
# ==============================================================================
# Использование:
#   chmod +x deploy-local.sh
#   ./deploy-local.sh
# ==============================================================================

set -euo pipefail

SERVER="${1:-159.194.213.100}"
USER="${2:-deployer}"
REMOTE_DIR="${3:-/home/deployer/autobox.ru}"
IMAGE_NAME="autobox74-app:latest"

echo "🚀 [1/4] Локальная сборка Docker-образа ($IMAGE_NAME) под linux/amd64..."
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

echo "📤 [2/4] Передача сжатого потока через SSH прямо в docker load на сервере..."
# Прямой потоковый пайплайн: без сохранения на диск
docker save "$IMAGE_NAME" | gzip -c | ssh "${USER}@${SERVER}" "gunzip -c | docker load"

echo "🔄 [3/4] Резервное копирование и перезапуск контейнера на сервере..."
ssh "${USER}@${SERVER}" bash -s <<EOF
cd "$REMOTE_DIR"
docker tag "$IMAGE_NAME" autobox74-app:previous 2>/dev/null || true
docker compose -f docker-compose.prod.yml up -d --no-deps app
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload 2>/dev/null || docker compose -f docker-compose.prod.yml restart nginx
docker image prune -f
docker compose -f docker-compose.prod.yml ps
EOF

echo "✅ [4/4] Готово! Приложение обновлено. Проверка https://autobox74.ru"
