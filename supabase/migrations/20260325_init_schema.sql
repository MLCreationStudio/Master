-- LASTRO ENGINE v1.0 — MIGRATION_001
-- SCHEMA: PUBLIC

-- 1. Tabela de Diagnósticos (Parecer Técnico)
CREATE TABLE IF NOT EXISTS diagnosticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    url TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    level TEXT NOT NULL, -- e.g., 'CRITICAL', 'STABLE', 'SCALABLE'
    status TEXT NOT NULL, -- e.g., 'VIABLE', 'UNVIABLE'
    raw_data JSONB, -- Dados crus da extração
    metadata JSONB -- Inserções de contexto (Sazonalidade, Impostos)
);

-- 2. Tabela de Métricas GTM (ACSD Engine)
CREATE TABLE IF NOT EXISTS gtm_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostico_id UUID REFERENCES diagnosticos(id) ON DELETE CASCADE,
    metric_key TEXT NOT NULL, -- e.g., 'cac_predicted', 'roas_target', 'ltv_model'
    metric_value NUMERIC NOT NULL,
    confidence_score NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Audit Logs (Terminal Vibe Persistence)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostico_id UUID REFERENCES diagnosticos(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'INFO', -- 'INFO', 'WARN', 'ERROR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) - Inicialmente aberto para o MVP
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Público para Diagnósticos" ON diagnosticos FOR SELECT USING (true);
CREATE POLICY "Inserção Pública para Diagnósticos" ON diagnosticos FOR INSERT WITH CHECK (true);

ALTER TABLE gtm_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Público para Métricas" ON gtm_metrics FOR SELECT USING (true);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Público para Logs" ON audit_logs FOR SELECT USING (true);
