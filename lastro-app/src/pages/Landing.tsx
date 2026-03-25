import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '../components/ui';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page terminal-bg">
      <div className="landing-hero stack items-center text-center">
        <div className="terminal-header fade-in mb-8">
           <span className="terminal-text px-3 py-1 border border-emerald-500/30 rounded">SYS_STATUS: OPERATIONAL // V2.4.0</span>
        </div>

        <h1 className="hero-logo fade-in-up">
           Lastro<span className="text-emerald-500">.</span>
        </h1>
        
        <div className="hero-tagline fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="tag-line font-mono tracking-[0.6em]">GTM_CORE_ALGORITHM</span>
        </div>

        <GlassPanel className="landing-cta-panel p-12 mt-12 w-full max-w-[620px] terminal-border-glow">
          <div className="stack gap-8 items-center">
            <h2 className="text-2xl font-display text-white">Pronto para a verdade?</h2>
            <p className="text-sm text-white/40 font-mono tracking-wider max-w-[400px]">
              O Módulo 1 (Carga Rápida) está ativo e pronto para analisar seu posicionamento.
            </p>
            
            <button
              className="lastro-btn lastro-btn-primary w-full justify-center group h-[64px] font-mono"
              onClick={() => navigate('/diagnostico')}
            >
              <span className="btn-text uppercase tracking-[0.2em]">Acessar Módulo 1 (ACSD)</span>
              <span className="btn-icon group-hover:translate-x-2 transition-transform ml-4">_</span>
            </button>
          </div>
        </GlassPanel>

        <footer className="landing-footer fade-in" style={{ animationDelay: '1s' }}>
           <p className="text-[0.6rem] text-white/30 font-mono tracking-widest uppercase mb-2">Copyright © 2026 Lastro Engine</p>
           <p className="text-xs text-white/40 italic">"Dados são o novo petróleo. Lastro é o refino."</p>
        </footer>
      </div>
    </div>
  );
}
