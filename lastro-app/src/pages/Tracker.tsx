import { useLocation, useNavigate } from 'react-router-dom';

export default function Tracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const mockData = location.state as any;
  
  const { url, scoreData, metrics } = mockData || { 
    url: 'N/A', 
    scoreData: { score: 0 },
    metrics: []
  };

  const getMetric = (key: string) => metrics?.find((m: any) => m.key === key)?.value || 0;

  return (
    <div className="tracker-page terminal-bg min-h-screen flex flex-col items-center relative overflow-hidden scan-effect">
      <div className="tracker-container container max-w-1200 mx-auto pt-32 pb-20 px-6 fade-in-up">
        
        {/* Header Rail */}
        <div className="fixed top-0 left-0 w-full p-12 flex justify-between items-center border-b border-white/5 bg-black/10 backdrop-blur-xl z-50">
           <div className="font-mono text-xs tracking-widest text-white/20 uppercase">
              WAR_ROOM // LIVE_TRACKER // {url}
           </div>
           <div className="flex gap-4">
              <button onClick={() => navigate('/resultado', { state: mockData })} className="text-xs font-mono text-white/40 hover:text-white transition-colors tracking-widest uppercase">
                 [VOLTAR_AO_COCKPIT]
              </button>
           </div>
        </div>

        <div className="grid grid-cols-12 gap-12">
           {/* Left Column: Tactical Overview */}
           <div className="lg:col-span-8 flex flex-col gap-12">
              <div className="glass-cockpit p-12 rounded-sm border-emerald-500/20">
                 <h2 className="font-display text-4xl text-white mb-8">Monitoramento de Defesa</h2>
                 <div className="grid grid-cols-2 gap-12">
                    <div className="stat-card p-8 border border-white/5 bg-white/2">
                       <p className="font-mono text-xs text-white/20 uppercase mb-4">ORÇAMENTO_RECOMENDADO</p>
                       <p className="font-display text-5xl text-emerald-500">R$ {(getMetric('cac_predicted') * 100).toLocaleString()}</p>
                       <p className="text-xs font-mono text-white/10 mt-4">BASEADO NO SCORE DE LASTRO: {scoreData.score}</p>
                    </div>
                    <div className="stat-card p-8 border border-white/5 bg-white/2">
                       <p className="font-mono text-xs text-white/20 uppercase mb-4">MARGEM_DE_SOBREVIVÊNCIA</p>
                       <p className="font-display text-5xl text-accent-gold">{((1 - getMetric('tax_impact_2026')) * 100).toFixed(0)}%</p>
                       <p className="text-xs font-mono text-white/10 mt-4">APÓS INCIDÊNCIA ACSD 2026</p>
                    </div>
                 </div>
              </div>

              <div className="glass-cockpit p-12 rounded-sm border-white/5">
                 <h3 className="font-mono text-xs tracking-widest text-white/40 uppercase mb-8">LOGS_DE_OPERAÇÃO_EM_TEMPO_REAL</h3>
                 <div className="terminal-logs font-mono text-sm space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {mockData?.logs?.map((log: any, idx: number) => (
                       <div key={idx} className="flex gap-4 border-b border-white/2 pb-4">
                          <span className="text-emerald-500/30">[{log.step}]</span>
                          <span className="text-white/60">{log.message}</span>
                       </div>
                    ))}
                    <div className="text-emerald-500 animate-pulse">&gt; ESCUTANDO_SINAIS_DE_MERCADO...</div>
                 </div>
              </div>
           </div>

           {/* Right Column: Alerts & Actions */}
           <div className="lg:col-span-4 flex flex-col gap-12">
              <div className="alert-card glass-cockpit p-12 rounded-sm border-red-900/40 bg-red-950/20">
                 <h4 className="text-red-500 font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-4">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    ALERTAS_CRÍTICOS
                 </h4>
                 <ul className="space-y-6">
                    <li className="flex flex-col gap-2">
                       <span className="text-white text-sm font-bold">Inconsistência de CAC</span>
                       <span className="text-white/40 text-xs font-mono">Volume de busca saturando em 84% do nicho.</span>
                    </li>
                    <li className="flex flex-col gap-2">
                       <span className="text-white text-sm font-bold">Risco Tributário Elevado</span>
                       <span className="text-white/40 text-xs font-mono">Projeção ACSD indica quebra de margem em Q3/2026.</span>
                    </li>
                 </ul>
              </div>

              <button className="lastro-btn h-[88px] w-full !bg-white !text-black font-mono font-bold tracking-[0.4em] hover:!bg-emerald-500 transition-all">
                 [EXPORTAR_ORDEM_DE_BATALHA]
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
