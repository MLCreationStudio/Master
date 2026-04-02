-- ── Realtime Setup ─────────────────────────────────────────────

-- Ativa a replicação para a tabela de mensagens para que a UI receba 
-- atualizações em tempo real (Supabase WebSockets)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
