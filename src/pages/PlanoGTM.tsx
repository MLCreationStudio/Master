import { useLocation, useNavigate } from 'react-router-dom';
import './PlanoGTM.css';

export default function PlanoGTM() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  const planData = state?.planData;

  if (!planData) {
    return (
      <div className="plano-gtm-page">
        <div className="plano-gtm-content">
          <h2>Erro ao carregar o plano</h2>
          <button className="lastro-btn lastro-btn-primary" onClick={() => navigate('/')}>Voltar ao Início</button>
        </div>
      </div>
    );
  }

  const canaisAprovados = planData.canais.filter((c: any) => c.status === 'aprovado');
  const canaisBloqueados = planData.canais.filter((c: any) => c.status === 'bloqueado');

  return (
    <div className="plano-gtm-page">
      <div className="plano-gtm-content fade-in-up">
        <header className="plano-header">
          <h2>Seu Mapa de Go-To-Market</h2>
          <p>Baseado nos filtros do AEE (Avaliador de Eficiência Estratégica), este é o seu campo de batalha pros próximos 90 dias.</p>
        </header>

        {/* Canais */}
        <section className="plano-section canais-section fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="canais-column aprovados">
            <h3>Canais Aprovados & Prioritários</h3>
            {canaisAprovados.map((canal: any) => (
              <div key={canal.id} className="canal-card aprovado">
                <div className="canal-header">
                  <span className="status-dot green"></span>
                  <h4>{canal.nome}</h4>
                </div>
                <p>{canal.justificativa_aprovacao}</p>
              </div>
            ))}
            {canaisAprovados.length === 0 && <p className="empty-state">Nenhum canal aprovado. Você precisa reestruturar sua oferta fundacional.</p>}
          </div>

          <div className="canais-column bloqueados">
            <h3>Canais Bloqueados (Hard Gates)</h3>
            {canaisBloqueados.map((canal: any) => (
              <div key={canal.id} className="canal-card bloqueado">
                <div className="canal-header">
                  <span className="status-dot red"></span>
                  <h4>{canal.nome}</h4>
                </div>
                <p>{canal.motivo_bloqueio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Plano 90 Dias */}
        <section className="plano-section roadmap-section fade-in-up" style={{animationDelay: '0.4s'}}>
          <h3>Plano de Ação: 12 Semanas (90 Dias)</h3>
          <div className="table-responsive">
            <table className="roadmap-table">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Foco Principal</th>
                  <th>Invest. (S)</th>
                  <th>Meta Leads</th>
                  <th>Meta Vendas</th>
                </tr>
              </thead>
              <tbody>
                  {planData.plano_90_dias.map((semana: any) => (
                    <tr key={semana.semana}>
                      <td className="w-semana">S{semana.semana}</td>
                      <td className="w-foco">
                        <strong>{semana.foco}</strong>
                        <div className="w-fase" style={{fontSize: '0.8rem', opacity: 0.7}}>{semana.fase}</div>
                        <ul className="w-acoes" style={{fontSize: '0.85rem', marginTop: '4px', textAlign: 'left', paddingLeft: '1rem'}}>
                          {semana.acoes?.map((acao: string, idx: number) => (
                            <li key={idx}>{acao}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="w-num">R$ {semana.metricas_meta.investimento_semana}</td>
                      <td className="w-num">{semana.metricas_meta.leads}</td>
                      <td className="w-num fw-bold">{semana.metricas_meta.vendas}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Módulo 3 CTA */}
        <footer className="plano-footer fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="cta-box">
            <h3>O plano está desenhado. Como garantir que ele aconteça?</h3>
            <p>O Módulo 3 é o seu Tracker de Resultados. Atualize seus leads gastos por semana e nosso algoritmo audita seus desvios em tempo real.</p>
            <button 
              className="lastro-btn lastro-btn-primary" 
              onClick={() => navigate('/tracker', { state: { diagnosticoId: state?.diagnosticoId || planData?.diagnostico_id, planData, score: state?.score } })}
            >
              Ir para Tracker de Resultado (M3)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
