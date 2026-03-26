import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDiagnosticMock } from '../utils/engine-mock';

export default function Diagnostico() {
  const navigate = useNavigate();
  
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const processingSteps = [
    "Iniciando varredura na URL...",
    "Acionando LLM-Router para extração de ICP...",
    "Mapeando diferenciais de mercado...",
    "Aplicando ACSD (Impostos BR 2026 e Sazonalidade)...",
    "Cruzando dados com o Lastro-Engine v4.0...",
    "Gerando Parecer Técnico Final..."
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setLoadingStep((prev: number) => {
          if (prev < processingSteps.length - 1) return prev + 1;
          clearInterval(interval);
          const mockData = generateDiagnosticMock(urlInput);
          setTimeout(() => navigate('/resultado', { state: mockData }), 1000);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isProcessing, navigate, urlInput, processingSteps.length]);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
  };

  return (
    <div className="diagnostico-page terminal-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden scan-effect">
      <div className="diagnostico-container container max-w-1000 mx-auto min-h-screen flex items-center justify-center px-6 relative z-10">
        
        {!isProcessing ? (
          <div className="input-phase w-full text-center stack gap-16 flex flex-col items-center fade-in-up">
            <div className="fade-in">
               <span className="font-mono text-xs tracking-widest-plus text-white/20 uppercase border-b border-white/5 pb-4">
                  MODULO_01 // PARAMETRIC_AUDIT
               </span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-display leading-[0.9] text-white tracking-tighter">
              A verdade sobre <br />
              <span className="text-emerald-500 italic-serif text-glow-emerald">o seu negócio.</span>
            </h1>
            
            <p className="text-white/20 text-sm font-mono tracking-widest text-white/30 max-w-500 mx-auto mb-12 uppercase leading-loose">
              Acione o motor de extração termográfica <br /> inserindo a URL alvo abaixo.
            </p>

            <form onSubmit={handleStartAnalysis} className="diagnostico-form stack gap-12 w-full max-w-500 mx-auto flex flex-col items-center">
              <div className="input-group relative w-full group">
                <div className="absolute -inset-1 bg-emerald-500/5 rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 font-mono text-lg">&gt;</span>
                <input 
                  type="url" 
                  placeholder="DIGITE_A_URL_AQUI..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="lastro-input-v2 !pl-16 font-mono text-sm !bg-black/80 border-white/10 focus:border-emerald-500 transition-all h-[80px] w-full tracking-widest"
                  required
                />
              </div>
              <button type="submit" className="lastro-btn w-full justify-center group font-mono h-[88px] !bg-white !text-black hover:!bg-emerald-500 transition-all duration-500">
                <span className="tracking-[0.4em] font-bold">[INICIAR_VARREDURA_PARAMETRICA]</span>
                <span className="ml-4 opacity-50 group-hover:translate-x-3 transition-transform">_</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="processing-terminal w-full max-w-800 glass-cockpit p-12 rounded-sm relative fade-in-up">
            <div className="terminal-header flex justify-between items-center mb-10 border-b border-white/5 pb-6">
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-800" />
                  <div className="w-2 h-2 rounded-full bg-yellow-800" />
                  <div className="w-2 h-2 rounded-full bg-emerald-800" />
               </div>
               <div className="font-mono text-xs text-white/30 tracking-widest">
                  TERMINAL_STATUS: ACTIVE_SCAN
               </div>
            </div>
            
            <div className="terminal-body font-mono text-sm space-y-4">
              <div className="flex gap-4">
                <span className="text-emerald-500 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-white/80">{processingSteps[loadingStep]}</span>
              </div>
              <div className="w-full bg-white/5 h-1 mt-8 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${(loadingStep + 1) * 16.6}%` }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
