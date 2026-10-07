-- ============================================================
-- SQL СХЕМА ДЛЯ СУПАБЕЙС (SUPABASE) ДЛЯ САЙТА AUTOBOX74.RU
-- ============================================================
-- Инструкция по установке:
-- 1. Зайдите в панель Supabase -> SQL Editor
-- 2. Вставьте весь этот код и нажмите "Run"
-- ============================================================

-- Включаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Таблица сессий посетителей сайта
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_token TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    client_phone TEXT,
    client_car TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'lead_captured', 'closed', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс по client_token и status для мгновенного поиска активной сессии пользователя
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token_status ON public.chat_sessions(client_token, status);

-- 2. Таблица сообщений чата
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'system')),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для выборки последних N сообщений в сессии (для скользящего окна 10 сообщений)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_time 
ON public.chat_messages(session_id, created_at DESC);

-- 3. Функция получения скользящего контекста (по умолчанию 8 сообщений + 1 системное + 1 новое = 10)
CREATE OR REPLACE FUNCTION get_session_context(p_session_token TEXT, p_limit INT DEFAULT 8)
RETURNS TABLE (
    sender TEXT,
    text TEXT,
    created_at TIMESTAMPTZ
) LANGUAGE sql STABLE AS $$
    SELECT m.sender, m.text, m.created_at
    FROM public.chat_messages m
    JOIN public.chat_sessions s ON s.id = m.session_id
    WHERE s.client_token = p_session_token
    ORDER BY m.created_at DESC
    LIMIT p_limit;
$$;

-- 4. Политики безопасности RLS (Row Level Security) для анонимного веб-доступа
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow anon update sessions" ON public.chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow anon insert messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select messages" ON public.chat_messages FOR SELECT USING (true);

-- 5. Таблица лидов и заявок на запись (с поддержкой Telegram для автобота)
CREATE TABLE IF NOT EXISTS public.service_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
    client_token TEXT,
    client_name TEXT,
    phone TEXT,
    telegram TEXT,
    car TEXT,
    service_requested TEXT,
    preferred_time TEXT,
    notes TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'pending_tg_bot', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_leads_phone ON public.service_leads(phone);
CREATE INDEX IF NOT EXISTS idx_service_leads_tg ON public.service_leads(telegram);
CREATE INDEX IF NOT EXISTS idx_service_leads_status ON public.service_leads(status);
CREATE INDEX IF NOT EXISTS idx_service_leads_created ON public.service_leads(created_at DESC);

ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert leads" ON public.service_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select leads" ON public.service_leads FOR SELECT USING (true);
CREATE POLICY "Allow anon update leads" ON public.service_leads FOR UPDATE USING (true);

-- 6. Таблица согласий на обработку ПДн, оферту и cookies (152-ФЗ РФ и ст. 437 ГК РФ)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_token TEXT,
    ip_address TEXT,
    user_agent TEXT,
    consent_pdan BOOLEAN NOT NULL DEFAULT false,
    consent_oferta BOOLEAN NOT NULL DEFAULT false,
    consent_cookies BOOLEAN NOT NULL DEFAULT false,
    consent_source TEXT NOT NULL, -- 'cookie_banner', 'ai_consultant', 'contacts_matrix', 'consent_page', 'direct_form'
    client_phone TEXT,
    client_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_consents_token ON public.user_consents(client_token);
CREATE INDEX IF NOT EXISTS idx_user_consents_phone ON public.user_consents(client_phone);
CREATE INDEX IF NOT EXISTS idx_user_consents_created ON public.user_consents(created_at DESC);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert consents" ON public.user_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select consents" ON public.user_consents FOR SELECT USING (true);

