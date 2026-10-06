const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("⚡ AUTOBOX74: АВТОМАТИЧЕСКАЯ НАСТРОЙКА SUPABASE");
  console.log("=================================================\n");

  const envPath = path.join(process.cwd(), ".env.local");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // 1. Поиск Access Token (передан как аргумент или в .env.local)
  const argToken = process.argv[2];
  const envMatch = envContent.match(/SUPABASE_ACCESS_TOKEN=([^\r\n]+)/);
  const token = (argToken || (envMatch ? envMatch[1] : "") || process.env.SUPABASE_ACCESS_TOKEN || "").trim();

  if (!token) {
    console.error("❌ Ошибка: Не найден SUPABASE_ACCESS_TOKEN!");
    console.log("\nКак запустить настройку через один токен:");
    console.log("1. Создайте токен в кабинете Supabase: https://supabase.com/dashboard/account/tokens");
    console.log("   (Нажмите 'Generate new token' и скопируйте токен вида sbp_...)");
    console.log("2. Запустите команду с вашим токеном:");
    console.log("   node scripts/setup-supabase.js sbp_ваш_токен");
    console.log("   ИЛИ добавьте в .env.local строку: SUPABASE_ACCESS_TOKEN=sbp_ваш_токен\n");
    process.exit(1);
  }

  console.log("🔍 Проверка токена через Supabase Management API...");

  // 2. Получение списка проектов
  const projRes = await fetch("https://api.supabase.com/v1/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!projRes.ok) {
    const err = await projRes.text();
    console.error(`❌ Ошибка проверки токена (${projRes.status}):`, err);
    console.log("Убедитесь, что токен скопирован полностью и имеет префикс sbp_");
    process.exit(1);
  }

  const projects = await projRes.json();
  if (!projects || projects.length === 0) {
    console.error("❌ У этого аккаунта Supabase нет активных проектов.");
    console.log("Создайте проект на https://supabase.com/dashboard и повторите попытку.");
    process.exit(1);
  }

  const targetProject = projects[0];
  const projectRef = targetProject.id;
  const projectName = targetProject.name;
  const projectUrl = `https://${projectRef}.supabase.co`;

  console.log(`✅ Найден проект: "${projectName}" (ID: ${projectRef})`);
  console.log(`🌐 URL проекта: ${projectUrl}`);

  // 3. Получение API ключей (anon и service_role)
  console.log("🔑 Получение API ключей проекта...");
  const keysRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!keysRes.ok) {
    console.error("❌ Не удалось получить API ключи:", await keysRes.text());
    process.exit(1);
  }

  const keys = await keysRes.json();
  const anonKey = keys.find((k) => k.name === "anon")?.api_key || "";
  const serviceKey = keys.find((k) => k.name === "service_role")?.api_key || "";

  if (!anonKey) {
    console.error("❌ Ключ 'anon' не найден в ответе API.");
    process.exit(1);
  }

  // 4. Запись в .env.local
  console.log("💾 Обновление файла .env.local...");
  const updates = [
    `# ==========================================`,
    `# SUPABASE (Автоматически настроено через Access Token)`,
    `# ==========================================`,
    `SUPABASE_ACCESS_TOKEN=${token}`,
    `NEXT_PUBLIC_SUPABASE_URL=${projectUrl}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`,
  ].join("\n");

  // Очистка старых записей Supabase, если были
  let newEnv = envContent
    .replace(/# =+\s+# SUPABASE[\s\S]*?(?=(# =+|$))/g, "")
    .replace(/(?:NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ACCESS_TOKEN)=[^\r\n]*\r?\n?/g, "")
    .trim();

  newEnv = newEnv + "\n\n" + updates + "\n";
  fs.writeFileSync(envPath, newEnv, "utf8");
  console.log("✅ Переменные NEXT_PUBLIC_SUPABASE_URL, ANON_KEY и SERVICE_ROLE_KEY сохранены в .env.local!");

  // 5. Автоматическое применение SQL схемы
  console.log("\n📦 Автоматическое создание таблиц в базе Supabase (schema.sql)...");
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, "utf8");

    const sqlRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });

    if (sqlRes.ok) {
      console.log("✅ Таблицы 'chat_sessions', 'chat_messages' и функция контекста успешно созданы в Supabase!");
    } else {
      console.warn("⚠️ Не удалось выполнить SQL запрос автоматически:", await sqlRes.text());
      console.log("Вы можете открыть SQL Editor в кабинете Supabase и вставить supabase/schema.sql вручную.");
    }
  }

  console.log("\n🎉 ГОТОВО! Supabase полностью подключен и готов к работе.");
  console.log("Все сессии пользователей, сообщения и лиды теперь сохраняются в базу данных!");
}

main().catch((err) => {
  console.error("Критическая ошибка:", err);
  process.exit(1);
});
