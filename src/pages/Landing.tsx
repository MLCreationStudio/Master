import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page terminal-bg select-none min-h-screen flex flex-col">
      <div className="landing-hero container max-w-1000 mx-auto min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center">
        
        {/* Superior Rail: Authority Header */}
        <div className="fixed top-0 left-0 w-full p-12 flex justify-between items-center border-b border-white/5 bg-black/10 backdrop-blur-xl z-50">
           <div className="font-mono text-xs tracking-widest text-white/20 uppercase">
              STRATEGIC_DEFENSE_REPARTITION // CODEX_LASTRO_V3.5
           </div>
           <div className="font-mono text-xs tracking-widest text-emerald-500/40 uppercase flex items-center gap-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              STATUS: SECURE_LINK_ENCRYPTED
           </div>
        </div>

        <div className="manifesto-content stack gap-16 flex flex-col items-center text-center max-w-1000 px-4">
           <div className="fade-in-up">
              <span className="terminal-text px-6 py-2 border border-accent-gold/30 text-accent-gold rounded-sm text-xs font-mono tracking-widest-plus bg-accent-gold/5">
                 [CLASSIFIED: CMO_EYES_ONLY]
              </span>
           </div>

           <h1 className="text-7xl lg:text-9xl font-display leading-[0.9] text-white fade-in-up tracking-tighter">
              A Ciência <br />
              <span className="text-white/20">Contra</span> <br />
              <span className="text-emerald-500 italic-serif text-glow-emerald">a Intuição.</span>
           </h1>

           <p className="text-xl lg:text-3xl font-mono text-white/30 leading-relaxed max-w-800 fade-in-up uppercase tracking-tighter mt-8">
              O Lastro não é marketing. É matemática aplicada. <br />
              <span className="text-xs block mt-6 tracking-[0.6em] opacity-20 uppercase font-mono">High-Performance GTM Intelligence Framework</span>
           </p>

           <div className="w-full max-w-500 mt-20 fade-in-up">
              <button
                className="lastro-btn lastro-btn-primary w-full justify-center group h-[88px] font-mono text-sm border-auth !bg-white !text-black hover:!bg-emerald-500 transition-all duration-700 overflow-hidden relative"
                onClick={() => navigate('/diagnostico')}
              >
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="tracking-[0.4em] font-bold relative z-10">[INICIAR_PROCESSO_DE_DEFESA]</span>
                <span className="ml-4 group-hover:translate-x-3 transition-transform opacity-30 relative z-10">_</span>
              </button>
              <p className="mt-6 text-xs font-mono text-white/10 uppercase tracking-[0.5em]">
                 A matemática não tem sentimentos.
              </p>
           </div>
        </div>

        {/* Bottom Rail: Infrastructure Meta */}
        <div className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-center text-xs font-mono text-white/10 tracking-[0.4em] uppercase">
           <div>DATA_SOVEREIGNTY: VERIFIED</div>
           <div>EST. 2024 // LASTRO_CORE_V3.5</div>
        </div>

      </div>
    </div>
  );
}
