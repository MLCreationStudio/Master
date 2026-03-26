import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Processando.css';

const FRASES = [
  'Analisando o seu mercado...',
  'Cruzando dados de CAC por nicho...',
  'Calculando viabilidade financeira...',
  'Avaliando clareza do ICP...',
  'Verificando alinhamento de prazo...',
  'Medindo maturidade competitiva...',
  'Preparando seu diagnóstico...',
];

export default function Processando() {
  const location = useLocation();
  const navigate = useNavigate();
  const [fraseAtual, setFraseAtual] = useState(0);

  const respostas = (location.state as any)?.respostas || {};

  useEffect(() => {
    let processado = false;

    const executarProcessamento = async () => {
      if (processado) return;
      processado = true;

      try {
        // 1. Salvar na Tabela diagnostico
        // Como M1 é anônimo por enquanto, vamos usar a inserção direta
        // Em um app fully auth, pegaríamos const user = await supabase.auth.getUser()
        const { data: diagData, error: insertError } = await supabase
          .from('diagnostico')
          .insert([
            {
              produto_desc: respostas['produto_desc'],
              icp_desc: respostas['icp_desc'],
              ticket_medio: parseFloat(respostas['ticket_medio'] || '0'),
              modelo_cobranca: respostas['modelo_cobranca'],
              concorrentes_desc: respostas['concorrentes_desc'],
              foco_geografico: respostas['foco_geografico'],
              historico_marketing: respostas['historico_marketing'],
              budget_total: parseFloat(respostas['budget_total'] || '0'),
              meta_clientes: parseInt(respostas['meta_clientes'] || '1'),
              prazo_esperado: parseInt(respostas['prazo_esperado'] || '90'),
            }
          ])
          .select('id')
          .single();

        if (insertError) throw insertError;

        // Opcional no futuro: Chamar processar-respostas-abertas para extrair nicho

        // 2. Chamar Edge Function calcular-score
        const { data: scoreData, error: scoreError } = await supabase.functions.invoke('calcular-score', {
          body: { diagnostico_id: diagData.id }
        });

        if (scoreError) throw scoreError;

        // 3. Redirecionar
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(FRASES.length * 1200); // Wait for animations to finish

        navigate('/resultado', {
          state: {
            respostas,
            score: scoreData, // { score: number, zona: string, dimensoes: {...} }
            diagnosticoId: diagData.id
          },
        });

      } catch (err) {
        console.error('Erro no processamento v2:', err);
        // Fallback gracefully
        navigate('/resultado', {
          state: { respostas, score: calcularScoreLocal(respostas) }
        });
      }
    };

    // Animação de frases (visual apenas)
    const interval = setInterval(() => {
      setFraseAtual(prev => {
        if (prev >= FRASES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    executarProcessamento();

    return () => clearInterval(interval);
  }, [navigate, respostas]);

  return (
    <div className="processando-page">
      <div className="processando-content">
        {FRASES.map((frase, i) => (
          <p
            key={i}
            className={`processando-frase ${i === fraseAtual ? 'active' : ''} ${i < fraseAtual ? 'done' : ''}`}
          >
            {frase}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Score local simplificado (em produção: Edge Function calcular-score) */
function calcularScoreLocal(respostas: Record<string, string>): {
  score: number;
  zona: string;
  dimensoes: { viabilidade: number; icp: number; prazo: number; mercado: number };
} {
  const budget = parseFloat(respostas['budget_total'] || '0');
  const meta = parseInt(respostas['meta_clientes'] || '1');
  const budgetMidia = budget * 0.56;
  const cacEstimado = 300; // Fallback médio

  // Viabilidade (40%)
  const ciclos = budgetMidia / cacEstimado;
  let viabilidade = 0;
  if (ciclos >= meta * 1.5) viabilidade = 100;
  else if (ciclos >= meta) viabilidade = 80;
  else if (ciclos >= meta * 0.5) viabilidade = 50;
  else if (ciclos >= 1) viabilidade = 25;

  // ICP (25%) — simulado sem IA
  const icpTexto = respostas['icp_desc'] || '';
  const icp = Math.min(100, Math.max(20, icpTexto.length * 1.5));

  // Prazo (20%)
  const prazo = parseInt(respostas['prazo_esperado'] || '90');
  let scorePrazo = 60;
  if (prazo >= 180) scorePrazo = 100;
  else if (prazo >= 90) scorePrazo = 80;
  else if (prazo >= 60) scorePrazo = 60;
  else scorePrazo = 30;

  // Mercado (15%) — simulado sem IA
  const difTexto = respostas['concorrentes_desc'] || '';
  const mercado = Math.min(100, Math.max(20, difTexto.length * 1.2));

  const score = Math.round(
    viabilidade * 0.40 +
    icp * 0.25 +
    scorePrazo * 0.20 +
    mercado * 0.15
  );

  const zona = score >= 80 ? 'pronto' : score >= 60 ? 'ressalvas' : score >= 40 ? 'ajuste' : 'critico';

  return {
    score,
    zona,
    dimensoes: {
      viabilidade: Math.round(viabilidade),
      icp: Math.round(icp),
      prazo: Math.round(scorePrazo),
      mercado: Math.round(mercado),
    },
  };
}
