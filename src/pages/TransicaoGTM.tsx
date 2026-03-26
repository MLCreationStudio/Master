import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingDots } from '../components/ui';
import './TransicaoGTM.css';

export default function TransicaoGTM() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const state = location.state as any;
  const diagnosticoId = state?.diagnosticoId; // We need to pass this from /processando -> /resultado -> here
  const score = state?.score;
  const respostas = state?.respostas; // Fallback mock support

  const handleChoice = async (clientesPagando: boolean) => {
    setLoading(true);

    try {
      if (diagnosticoId) {
        // Modo Produção: Call Edge Function
        const { data, error } = await supabase.functions.invoke('gerar-plano-gtm', {
          body: { diagnostico_id: diagnosticoId, clientes_pagando: clientesPagando }
        });

        if (error) throw error;

        navigate('/plano-gtm', { state: { planData: data, score, respostas } });
      } else {
        // Modo MVP Fallback Locall: Se diagnosticoId nao foi achado, usa mock local
        const mockData = {
          bloqueado: false,
          canais: [
            { id: 'meta', nome: 'Meta Ads', status: clientesPagando ? 'aprovado' : 'bloqueado', motivo_bloqueio: clientesPagando ? undefined : 'Sem clientes pagando.' },
            { id: 'outbound', nome: 'Outbound', status: 'aprovado', justificativa_aprovacao: 'Ticket B2B compatível com esforço humano.' }
          ],
          plano_90_dias: Array.from({length: 12}, (_, i) => ({ semana: i+1, foco: 'Validação', metricas_meta: { leads: 10, vendas: 1, investimento_semana: 250 } }))
        };
        setTimeout(() => navigate('/plano-gtm', { state: { planData: mockData, score, respostas } }), 1000);
      }
    } catch (err) {
      console.error('Erro ao gerar plano:', err);
      // Fallback fallback
      navigate('/resultado');
    }
  };

  if (loading) {
    return (
      <div className="transicao-page loading-state">
        <LoadingDots />
        <p className="loading-text">Processando regras do AEE e gerando matriz de canais...</p>
      </div>
    );
  }

  return (
    <div className="transicao-page">
      <div className="transicao-content fade-in-up">
        <h2>Antes de desenharmos o mapa...</h2>
        <p className="transicao-desc">O seu Score de Viabilidade foi aprovado. Para montarmos os canais exatos e o fluxo de caixa dos próximos 90 dias, precisamos alinhar o momento do produto.</p>
        
        <div className="transicao-pergunta">
          <h3>Você já tem clientes ativamente pagando pelo seu produto hoje?</h3>
          <div className="transicao-options">
            <button className="lastro-btn lastro-btn-primary" onClick={() => handleChoice(true)}>
              Sim, já possuo clientes pagando
            </button>
            <button className="lastro-btn lastro-btn-secondary" onClick={() => handleChoice(false)}>
              Ainda não, estamos começando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
