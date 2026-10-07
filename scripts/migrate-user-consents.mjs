import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const token = env.SUPABASE_ACCESS_TOKEN;
const projectRef = 'snbmnoxfjylwivfzrted';

const migrationSql = `
DROP TABLE IF EXISTS public.user_consents CASCADE;

CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    consent_pdan BOOLEAN NOT NULL DEFAULT false,
    consent_oferta BOOLEAN NOT NULL DEFAULT false,
    consent_cookies BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'granted' CHECK (status IN ('granted', 'revoked')),
    consent_source TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_consents_session ON public.user_consents(session_id);
CREATE INDEX idx_user_consents_status ON public.user_consents(status);
CREATE INDEX idx_user_consents_created ON public.user_consents(created_at DESC);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon insert consents" ON public.user_consents;
CREATE POLICY "Allow anon insert consents" ON public.user_consents FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon select consents" ON public.user_consents;
CREATE POLICY "Allow anon select consents" ON public.user_consents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon update consents" ON public.user_consents;
CREATE POLICY "Allow anon update consents" ON public.user_consents FOR UPDATE USING (true);
`;

async function run() {
  console.log("🚀 Выполнение миграции user_consents в Supabase...");
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: migrationSql }),
  });

  if (!res.ok) {
    console.error("❌ Ошибка миграции:", await res.text());
    process.exit(1);
  }

  console.log("✅ Таблица public.user_consents успешно пересоздана в Supabase!");
  console.log("Структура: session_id, consent_pdan, consent_oferta, consent_cookies, status, consent_source, ip_address, user_agent, created_at, updated_at");
}

run().catch(console.error);
