#!/bin/bash

# LASTRO AUTO-SYNC AGENT
# Sincroniza Local -> GitHub -> Supabase

MESSAGE=${1:-"auto-sync: updates from lastro engine"}
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "🚀 Iniciando Sincronização Total [Lastro v2] - $TIMESTAMP"

# 1. GitHub Sync
echo "📦 Sincronizando GitHub..."
git add .
git commit -m "$MESSAGE ($TIMESTAMP)"
git push origin main

# 2. Supabase Sync (Functions & Database)
# Nota: Requer que o Supabase CLI esteja logado e linkado
if command -v supabase &> /dev/null
then
    echo "⚡ Sincronizando Supabase..."
    # Descomente as linhas abaixo após o 'supabase link' inicial
    # supabase db push
    # supabase functions deploy --all
else
    echo "⚠️  Supabase CLI não encontrado ou não configurado."
fi

echo "✅ Sincronização concluída com sucesso!"
