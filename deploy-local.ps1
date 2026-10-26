# ==============================================================================
# AutoBox74 - Скрипт локальной сборки и деплоя на VPS для Windows (PowerShell)
# ==============================================================================
# Использование:
#   .\deploy-local.ps1 -Server "159.194.213.100" -User "deployer"
# ==============================================================================

param(
    [string]$Server = "159.194.213.100",
    [string]$User = "deployer",
    [string]$RemoteDir = "/home/deployer/autobox.ru",
    [string]$ImageName = "autobox74-app:latest",
    [string]$TarFile = "autobox74-app.tar",
    [switch]$CheckBuild = $false
)

$ErrorActionPreference = "Stop"

if ($CheckBuild) {
    Write-Host "`n🔍 [0/5] Предварительная проверка локальной сборки (TypeScript + SSG)..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Ошибка при предварительной сборке проекта. Исправьте ошибки перед деплоем."
        exit 1
    }
    Write-Host "✅ Предварительная валидация успешно пройдена." -ForegroundColor Green
}

Write-Host "`n🚀 [1/5] Запуск локальной сборки Docker-образа ($ImageName)..." -ForegroundColor Cyan
Write-Host "Платформа целевой сборки: linux/amd64 (для Ubuntu VPS)" -ForegroundColor DarkGray

# 1. Сборка образа под платформу сервера (linux/amd64)
docker build --platform linux/amd64 -t $ImageName .
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Ошибка при локальной сборке Docker-образа."
    exit 1
}
Write-Host "✅ Образ успешно собран локально." -ForegroundColor Green

# 2. Экспорт образа в tar-архив
Write-Host "`n📦 [2/5] Экспорт образа в архив $TarFile..." -ForegroundColor Cyan
if (Test-Path $TarFile) { Remove-Item $TarFile -Force }
docker save $ImageName -o $TarFile
$tarSizeMB = [math]::Round((Get-Item $TarFile).Length / 1MB, 2)
Write-Host "✅ Образ сохранен в $TarFile (Размер: $tarSizeMB MB)." -ForegroundColor Green

# 3. Передача архива на сервер через SCP
Write-Host "`n📤 [3/5] Передача архива на VPS ($User@$Server:$RemoteDir)..." -ForegroundColor Cyan
scp $TarFile "${User}@${Server}:${RemoteDir}/"
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Ошибка при передаче файла через SCP."
    exit 1
}
Write-Host "✅ Архив доставлен на сервер." -ForegroundColor Green

# 4. Загрузка в Docker на сервере и перезапуск приложения
Write-Host "`n🔄 [4/5] Применение образа на сервере и перезапуск контейнера..." -ForegroundColor Cyan
$remoteCommands = @"
cd $RemoteDir

echo '-> Резервное тегирование текущей версии (для возможности отката)...'
docker tag $ImageName autobox74-app:previous 2>/dev/null || true

echo '-> Загрузка нового образа в локальный Docker...'
docker load -i $TarFile
rm -f $TarFile

echo '-> Запуск/обновление контейнера app без сборки...'
docker compose -f docker-compose.prod.yml up -d --no-deps app

echo '-> Мягкая перезагрузка Nginx...'
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload 2>/dev/null || docker compose -f docker-compose.prod.yml restart nginx

echo '-> Очистка старых неиспользуемых слоев...'
docker image prune -f

echo '-> Статус контейнеров:'
docker compose -f docker-compose.prod.yml ps
"@

ssh "${User}@${Server}" $remoteCommands
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Ошибка при выполнении команд на удаленном сервере."
    exit 1
}

# 5. Очистка локального tar-файла
Write-Host "`n🧹 [5/5] Удаление локального временного файла $TarFile..." -ForegroundColor Cyan
if (Test-Path $TarFile) { Remove-Item $TarFile -Force }

Write-Host "`n🎉 [ГОТОВО] Сайт AutoBox74 успешно обновлен на сервере без нагрузки на RAM VPS!" -ForegroundColor Green
Write-Host "Проверьте доступность: https://autobox74.ru" -ForegroundColor Yellow
