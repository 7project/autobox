# 🚀 Руководство по развертыванию AutoBox74 на VPS (Docker, Nginx, SSL Let's Encrypt)

Данное руководство содержит полную инструкцию по переносу и запуску проекта **AutoBox74 (`autobox74.ru`)** на собственном виртуальном сервере (VPS/VDS на Ubuntu 22.04 / 24.04 LTS).

В стек входят:
- **Next.js 16 (App Router)** в изолированном контейнере без root-прав.
- **Nginx Reverse Proxy** с поддержкой HTTP/2, SSL TLS 1.2/1.3, заголовками безопасности и аппаратным **Rate Limiting** для защиты AI-чата.
- **Certbot** с автоматическим выпуском и продлением бесплатных SSL-сертификатов Let's Encrypt.
- **Supabase & OpenRouter** — защищенные переменные окружения, лидогенерация и защита от спама токенов.

> [!IMPORTANT]
> **У вас сервер с 512 МБ – 1 ГБ RAM?**
> Сборка Next.js прямо на сервере требует от 1.5 до 2 ГБ памяти и на слабом тарифе завершится ошибкой `Out of Memory (exit code 137)`.
> В этом случае используйте специализированное руководство: **[VPS_LOCAL_BUILD_DEPLOY_GUIDE.md](VPS_LOCAL_BUILD_DEPLOY_GUIDE.md)** (локальная сборка на ПК и передача сжатого образа по SSH — потребление на сервере всего ~60 МБ RAM).

---

## ⚡ КРАТКИЙ ПОШАГОВЫЙ ПЛАН (Шпаргалка быстрого деплоя)

Для опытных администраторов — последовательность команд для запуска сайта за 10–15 минут:

```bash
# 1. Подключение и обновление VPS
ssh root@IP_СЕРВЕРА
apt update && apt upgrade -y
adduser deployer && usermod -aG sudo deployer

# 2. Настройка фаервола и Fail2Ban
apt install ufw fail2ban -y
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
systemctl enable --now fail2ban

# 3. Установка Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
usermod -aG docker deployer
su - deployer

# 4. Перенос проекта и папок
git clone https://github.com/ВАШ_АККАУНТ/autobox.ru.git /home/deployer/autobox.ru
cd /home/deployer/autobox.ru
mkdir -p certbot/conf certbot/www

# 5. Создание боевого .env.local
cp .env.example .env.local
nano .env.local  # вставьте реальные ключи OpenRouter, Supabase, SMTP и лимиты чата

# 6. Получение первичного SSL-сертификата (DNS уже должен указывать на IP сервера!)
docker run -it --rm -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d autobox74.ru -d www.autobox74.ru \
  --email info@autobox74.ru \
  --agree-tos --no-eff-email

# 7. Запуск всех сервисов в Docker
docker compose up -d --build

# 8. Проверка работы
docker compose ps
curl -I https://autobox74.ru
```

---

## 📖 ПОДРОБНОЕ ПОШАГОВОЕ РУКОВОДСТВО

---

### Шаг 1. Первичная настройка и защита VPS (Server Hardening)

При первом подключении к чистому серверу под `root` настройте базовую безопасность:

#### 1.1. Обновление ОС
```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2. Создание непривилегированного пользователя `deployer`
Никогда не выполняйте постоянные операции под `root`:
```bash
adduser deployer
usermod -aG sudo deployer
```

#### 1.3. Настройка входа по SSH-ключам (без паролей)
На вашем локальном компьютере сгенерируйте SSH-ключ (если еще не создан):
```bash
ssh-keygen -t ed25519 -C "deployer@autobox74.ru"
```
Скопируйте публичный ключ на VPS:
```bash
ssh-copy-id deployer@IP_ВАШЕГО_СЕРВЕРА
```

Отключите авторизацию по паролю и прямой вход `root` в файле `/etc/ssh/sshd_config`:
```bash
sudo nano /etc/ssh/sshd_config
```
Установите директивы:
```ini
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
```
Перезапустите SSH-демон:
```bash
sudo systemctl restart ssh
```

#### 1.4. Настройка фаервола UFW
Закройте все неиспользуемые порты:
```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Let's Encrypt и редирект)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status verbose
```

#### 1.5. Установка и запуск Fail2Ban (защита от брутфорса)
```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

### Шаг 2. Настройка DNS-записей для домена autobox74.ru

В панели управления регистратора домена (Reg.ru, Beget, Timeweb, Cloudflare и др.) добавьте две **A-записи**:

| Тип | Имя / Хост | Значение (IP адрес) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (или пусто) | `IP_ВАШЕГО_СЕРВЕРА` | 300 / 3600 |
| **A** | `www` | `IP_ВАШЕГО_СЕРВЕРА` | 300 / 3600 |

> ⏳ *Делегирование и обновление DNS занимает от 10 минут до 2 часов. Проверьте готовность перед переходом к шагу 5:*
> ```bash
> ping autobox74.ru
> ```

---

### Шаг 3. Установка Docker и Docker Compose

Выполните установку современного Docker Engine на Ubuntu:

```bash
# Установка вспомогательных утилит
sudo apt install ca-certificates curl gnupg lsb-release -y

# Добавление GPG-ключа и официального репозитория Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker и Compose v2
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Разрешаем запуск Docker пользователю deployer
sudo usermod -aG docker deployer
newgrp docker
```

---

### Шаг 4. Перенос проекта и конфигурация переменных окружения

#### 4.1. Подготовка директории
Войдите под пользователем `deployer`:
```bash
mkdir -p /home/deployer/autobox.ru
cd /home/deployer/autobox.ru
```

#### 4.2. Перенос исходного кода
**Вариант А: через Git (Рекомендуется):**
```bash
git clone https://github.com/ВАШ_АККАУНТ/autobox.ru.git .
```

**Вариант Б: через SCP с локального компьютера (PowerShell):**
```powershell
scp -r C:\Users\user\ProjectIT\autobox.ru\* deployer@IP_ВАШЕГО_СЕРВЕРА:/home/deployer/autobox.ru/
```

#### 4.3. Создание необходимых директорий
```bash
mkdir -p certbot/conf certbot/www nginx
```

#### 4.4. Создание боевого файла `.env.local`
Создайте `.env.local` в корне `/home/deployer/autobox.ru/.env.local`:
```bash
nano .env.local
```

Вставьте ваши актуальные значения (все лимиты защиты токенов активны):

```ini
# ==========================================
# 1. OPENROUTER AI
# ==========================================
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ_здесь

# ==========================================
# 2. SUPABASE DATABASE
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key_здесь
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key_здесь

# ==========================================
# 3. УВЕДОМЛЕНИЯ О ЛИДАХ (EMAIL / SMTP)
# ==========================================
NOTIFICATION_EMAIL=info@autobox74.ru
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш_ящик@mail.ru
SMTP_PASS=пароль_для_внешних_приложений
SMTP_FROM="AutoBox74 Автосервис" <ваш_ящик@mail.ru>

# ==========================================
# 4. AI CHAT ANTI-SPAM & TOKEN PROTECTION
# ==========================================
CHAT_COOLDOWN_SECONDS=5
CHAT_MAX_MESSAGE_LENGTH=600
CHAT_DAILY_PAID_LIMIT=100
CHAT_PAID_SESSIONS_PER_DAY=2
CHAT_IP_MAX_REQUESTS_PER_MINUTE=6
CHAT_IP_MAX_REQUESTS_PER_HOUR=40
```

> [!NOTE]
> `docker-compose.yml` автоматически передает переменные из `.env.local` в контейнер `app` благодаря директиве `env_file: .env.local`.

---

### Шаг 5. Получение бесплатного SSL-сертификата (Let's Encrypt)

До первого запуска Nginx выполните одноразовый выпуск сертификатов через standalone-сервер Certbot:

```bash
docker run -it --rm -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d autobox74.ru -d www.autobox74.ru \
  --email info@autobox74.ru \
  --agree-tos --no-eff-email
```

После успешного выполнения проверьте наличие ключей:
```bash
ls -la certbot/conf/live/autobox74.ru/
# Должны присутствовать: fullchain.pem и privkey.pem
```

---

### Шаг 6. Запуск проекта в Docker Compose

Все сервисы оркестрируются через [`docker-compose.yml`](docker-compose.yml):
- `app`: сборка Next.js 16 (Turbopack/Production) под пользователем `nextjs:1001`, порт 3000 изолирован внутри сети `app-network`.
- `nginx`: шлюз с портами `80` и `443`, сертификатами SSL, HTTP/2 и защитным Rate Limiting на `/api/chat`.
- `certbot`: фоновый демон, выполняющий проверку и продление сертификатов каждые 12 часов.

Запустите проект:
```bash
docker compose up -d --build
```

#### Проверка статуса контейнеров:
```bash
docker compose ps
```
Должно отображаться:
- `autobox-app` — `Up` (port 3000/tcp)
- `autobox-nginx` — `Up` (0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp)
- `autobox-certbot` — `Up`

#### Просмотр логов:
```bash
# Логи веб-сервера Nginx
docker compose logs -f nginx

# Логи приложения Next.js
docker compose logs -f app
```

Проверьте доступность сайта:
👉 **`https://autobox74.ru`**  
👉 **`https://www.autobox74.ru`**

---

### Шаг 7. Проверка безопасности и Rate Limiting

Проверьте работу защитного шлюза Nginx и лимитера AI-чата:

```bash
# 1. Проверка защитных HTTP-заголовков
curl -I https://autobox74.ru
# В ответе должны присутствовать:
# Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options

# 2. Проверка Rate Limiting на эндпоинте чата
curl -X POST https://autobox74.ru/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

При частых повторных запросах сервер возвращает `HTTP 429 Too Many Requests`, защищая ваш баланс OpenRouter.

---

### Шаг 8. Обновление проекта (Скрипт быстрого деплоя)

Для последующих обновлений сайта создайте скрипт `deploy.sh` в корне проекта:

```bash
nano deploy.sh
```

Вставьте содержимое:
```bash
#!/bin/bash
set -e

echo "🚀 Начинаем обновление AutoBox74..."
git pull origin main

echo "📦 Сборка и перезапуск контейнеров..."
docker compose build app
docker compose up -d --no-deps app

echo "🔄 Перезагрузка Nginx..."
docker compose exec nginx nginx -s reload

echo "🧹 Удаление старых неиспользуемых образов..."
docker image prune -f

echo "✅ Сайт успешно обновлен!"
```

Сделайте файл исполняемым:
```bash
chmod +x deploy.sh
```

Теперь любое обновление сайта выполняется одной командой:
```bash
./deploy.sh
```

---

### Шаг 9. Резервное копирование и надежность

Настройте автоматическое создание ночного резервного архива конфигурации и сертификатов в `crontab`:

```bash
crontab -e
```
Добавьте строку:
```bash
0 4 * * * tar -czf /home/deployer/backup_autobox_$(date +\%F).tar.gz -C /home/deployer autobox.ru/certbot autobox.ru/.env.local autobox.ru/nginx
```

Архив будет создаваться каждую ночь в 04:00.
