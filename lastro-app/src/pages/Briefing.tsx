import { useLocation, useNavigate } from 'react-router-dom';

export default function Briefing() {
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
    <div className="briefing-page bg-white min-h-screen flex flex-col items-center pt-20 pb-32 px-6 text-black selection:bg-black selection:text-white">
      <div className="briefing-doc max-w-800 w-full animate-fade-in">
        
        {/* Header Rail (Print Style) */}
        <div className="flex justify-between items-start border-b-2 border-black pb-12 mb-16">
           <div className="font-display text-4xl uppercase tracking-tighter">Lastro.</div>
           <div className="text-right font-mono text-[10px] leading-tight opacity-50 uppercase">
              Doc Type: Technical_Strategic_Briefing <br />
              Ref: {url} <br />
              Status: Verified_ACSD_V4.0
           </div>
        </div>

        <div className="doc-content space-y-16">
           <section>
              <h1 className="font-display text-6xl leading-[0.9] mb-8">Parecer de Defesa <br /> <span className="italic">Matemática.</span></h1>
              <p className="font-mono text-sm leading-relaxed border-l-4 border-black pl-8 mb-12">
                 Este documento serve como a base analítica para a tomada de decisão estratégica do CMO. 
                 Abaixo estão os parâmetros de viabilidade auditados pelo motor Lastro.
              </p>
           </section>

           <section className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
              <div>
                 <p className="font-mono text-[10px] uppercase opacity-40 mb-2">Score de Estabilidade</p>
                 <p className="font-display text-5xl">{scoreData.score}%</p>
              </div>
              <div>
                 <p className="font-mono text-[10px] uppercase opacity-40 mb-2">Impacto ACSD (Impostos 2026)</p>
                 <p className="font-display text-5xl">{(getMetric('tax_impact_2026') * 100).toFixed(0)}%</p>
              </div>
           </section>

           <section className="space-y-8">
              <h3 className="font-display text-[2rem]">Diretrizes de Execução</h3>
              <div className="space-y-6 font-mono text-xs leading-loose">
                 <p>1. O CAC de <strong>R$ {getMetric('cac_predicted').toFixed(2)}</strong> exige uma taxa de conversão mínima de 3.2% no TOFU.</p>
                 <p>2. A margem bruta deve ser protegida contra a volatilidade sazonal mapeada em 12.4% para o nicho detectado.</p>
                 <p>3. Recomendação: Escalar orçamento apenas após validação do ROAS de <strong>{getMetric('roas_target').toFixed(1)}x</strong>.</p>
              </div>
           </section>
        </div>

        <footer className="mt-32 pt-12 border-t border-black/10 flex justify-between items-center no-print">
           <button onClick={() => navigate(-1)} className="font-mono text-xs uppercase hover:underline">
              [CONCLUIR_REVISÃO]
           </button>
           <button onClick={() => window.print()} className="bg-black text-white px-8 py-3 font-mono text-xs uppercase hover:bg-zinc-800 transition-colors">
              GERAR_PDF_DO_BRIEFING
           </button>
        </footer>
      </div>
    </div>
  );
}
