import { useState, useEffect } from 'react';

// ── Glass Panel ──
export function GlassPanel({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`glass-panel fade-in-up ${className}`}>
      {children}
    </div>
  );
}

// ── Atomic Components ──

export function Typewriter({ text, speed = 30, onComplete, className = '' }: { text: string; speed?: number; onComplete?: () => void; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 100);
      }
    }, text.length > 100 ? 10 : speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={`text-mono ${className}`}>
      {displayed}
      {!isDone && <span className="cursor-blink" />}
    </span>
  );
}

export function LoadingDots() {
  return (
    <div className="flex gap-2 items-center px-4 py-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-300" />
    </div>
  );
}

export function ScoreCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <div className="score-value">{current}</div>;
}

export function DimensionBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between text-[0.7rem] uppercase tracking-widest text-white/50">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-[2s] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function Badge({ name, icon, desc }: { name: string; icon: string; desc?: string }) {
  return (
    <div className="glass-card flex items-center gap-3 !p-3 !py-2 rounded-full border-white/5 hover:border-emerald-500/30 group" title={desc}>
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-white/70 group-hover:text-emerald-400">{name}</span>
    </div>
  );
}

export function XPBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min((current/target) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-emerald-500">Maturidade de GTM</span>
        <span className="text-[0.65rem] font-mono text-white/40">{current} / {target} XP</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-[3s] ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-white/5 z-50">
      <div 
        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function TopicIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed bottom-8 right-8 text-[0.6rem] font-black tracking-[0.3em] text-white/20 uppercase">
       Módulo 1 // Query {current} de {total}
    </div>
  );
}
