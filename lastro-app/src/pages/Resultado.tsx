import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, scoreData, diagnosticoId } = location.state || { 
    url: 'N/A', 
    scoreData: { score: 84, level: 'HIGH_STABILITY', status: 'VIABLE' },
    diagnosticoId: 'DEV_NULL'
  };

  return (
    <div className="resultado-hud terminal-bg select-none min-h-screen flex flex-col items-center relative overflow-hidden scan-effect">
      <div className="hud-container container max-w-1200 mx-auto pt-32 pb-20 px-6 stack gap-20 flex flex-col items-center fade-in-up">
        
        {/* Top Rail: Authority Meta */}
        <div className="fixed top-0 left-0 w-full p-12 flex justify-between items-center border-b border-white/5 bg-black/10 backdrop-blur-xl z-50">
           <div className="font-mono text-xs tracking-widest text-white/20 uppercase">
              STRATEGIC_PARECER // DIAGNOSTICO_#ID-{diagnosticoId?.slice(0,8) || 'UNIT_01'}
           </div>
           <div className="font-mono text-xs tracking-widest text-accent-gold uppercase text-glow-gold">
              [STATUS: ANALISE_CONFIRMADA]
           </div>
        </div>

        {/* Main Cockpit Section */}
        <div className="hud-main grid grid-cols-12 gap-20 items-center w-full mt-20">
          <div className="lg:col-span-12 flex justify-center">
            <div className="score-cockpit relative w-[300px] h-[300px] flex items-center justify-center">
               <div className="score-value-serif flex flex-col items-center justify-center relative z-10">
                  <span className="text-9xl lg:text-[10rem] font-display leading-none text-accent-gold text-glow-gold">{scoreData.score}</span>
                  <span className="font-mono text-xs tracking-widest-plus text-white/20 mt-4">UNIDADES_DE_LASTRO</span>
               </div>
               <div className="absolute inset-0 border border-white/5 rounded-full animate-pulse-slow pointer-events-none scale-125" />
               <div className="absolute inset-0 border border-accent-gold/10 rounded-full animate-spin-slow pointer-events-none scale-150 border-dashed" />
            </div>
          </div>

          <div className="lg:col-span-12 flex flex-col items-center text-center gap-12">
            <div className="badges-row flex gap-6 flex-wrap justify-center">
               <span className="px-6 py-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-mono text-xs tracking-widest uppercase rounded-sm">
                  ESTABILIDADE: {scoreData.level}
               </span>
               <span className="px-6 py-2 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold font-mono text-xs tracking-widest uppercase rounded-sm">
                  VIABILIDADE: {scoreData.status}
               </span>
            </div>

            <p className="text-white/40 font-mono text-sm tracking-widest uppercase max-w-600 leading-loose">
               A pontuação reflete a robustez da estrutura de margens e a escalabilidade <br /> do funil de aquisição mapeado na URL: <span className="text-white">{url}</span>
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center gap-8 mt-12 pb-20">
           <button 
             onClick={() => navigate('/tracker')}
             className="lastro-btn h-[72px] px-12 !bg-emerald-600 !text-black font-mono font-bold tracking-widest hover:scale-105 transition-transform"
           >
              [ACESSAR_SALA_DE_GUERRA]
           </button>
           <button 
             onClick={() => navigate('/briefing')}
             className="lastro-btn h-[72px] px-12 !bg-white !text-black font-mono font-bold tracking-widest hover:scale-105 transition-transform"
           >
              [GERAR_BRIEFING_TECNICO]
           </button>
        </div>

      </div>
    </div>
  );
}
