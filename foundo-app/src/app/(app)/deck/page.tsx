"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./deck.module.css";
import type { ProjectStage, ExpertiseArea } from "@/lib/types";
import { 
  getDiscoveryDeck, 
  handleUserInterest, 
  handleUserPass, 
  getDailyInterestCount 
} from "@/lib/supabase/actions";
import Link from "next/link";
import { 
  Target, 
  Rocket, 
  Zap, 
  CheckCircle2, 
  Flame, 
  BarChart3, 
  Search, 
  ArrowRight,
  Info
} from "lucide-react";

const STAGE_LABELS: Record<ProjectStage, string> = {
  exploration: "Exploração",
  building: "Construção",
  traction: "Tração",
  expansion: "Expansão",
};

const STAGE_TAG_CLASS: Record<ProjectStage, string> = {
  exploration: "tag-stage-exploration",
  building: "tag-stage-building",
  traction: "tag-stage-traction",
  expansion: "tag-stage-expansion",
};

export default function DeckPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interestsToday, setInterestsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<{ match: boolean; conversation_id?: string } | null>(null);
  
  // Controle direcional para a animação de saída: -1 passe, 1 interesse
  const [exitDirection, setExitDirection] = useState<number>(0);
  
  const MAX_INTERESTS = 10;

  const fetchDeck = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDiscoveryDeck(20);
      setProfiles(data || []);
      
      const count = await getDailyInterestCount();
      setInterestsToday(count);
    } catch (err) {
      console.error("Error loading deck:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  const profile = profiles[currentIndex];

  const handlePass = async () => {
    if (!profile) return;
    setExitDirection(-1);
    try {
      await handleUserPass(profile.id);
      setTimeout(() => setCurrentIndex((i) => i + 1), 200); // Wait for animation
    } catch (err) {
      console.error("Error passing profile:", err);
    }
  };

  const handleInterest = async () => {
    if (!profile || interestsToday >= MAX_INTERESTS) return;
    
    setExitDirection(1);
    try {
      const result = await handleUserInterest(profile.id);
      setInterestsToday((c) => c + 1);
      
      if (result?.match) {
        setMatchData(result);
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 200);
      }
    } catch (err: any) {
      console.error("Error expressing interest:", err);
      alert(err.message || "Erro ao processar interesse.");
    }
  };

  const closeMatchModal = () => {
    setMatchData(null);
    setCurrentIndex((i) => i + 1);
  };

  if (loading && profiles.length === 0) {
    return (
      <div className={styles.deckPage}>
        <div className={styles.emptyState}>
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={styles.emptyDesc}
          >
            Carregando inteligência de mercado...
          </motion.div>
        </div>
      </div>
    );
  }

  if (!profile && !matchData?.match) {
    return (
      <div className={styles.deckPage}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyIcon}><Target size={48} className="text-tertiary" /></div>
          <h3 className={styles.emptyTitle}>Deck Vazio</h3>
          <p className={styles.emptyDesc}>
            Você esgotou os perfis qualificados na sua área. O radar está buscando novas conexões de elite.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={fetchDeck} style={{ marginTop: "var(--space-md)" }}>
            Sondar Radar Novamente
          </button>
        </motion.div>
      </div>
    );
  }

  const stage = profile ? (profile.project_stage as ProjectStage) || "exploration" : "exploration";

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    enter: { scale: 1, opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } },
    exit: (direction: number) => ({
      x: direction * 200,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" as const }
    })
  };

  const generateIcebreakers = async () => {
    const btn = document.getElementById("ai-icebreaker-btn") as HTMLButtonElement;
    const box = document.getElementById("ai-icebreaker-box");
    if (!profile || !btn) return;
    
    btn.disabled = true;
    btn.innerHTML = "Gerando sinapses...";
    box!.style.display = "flex";
    box!.innerHTML = "<div style='font-size:12px; color:var(--text-tertiary); text-align:center;'>Analisando cruzamento de dados...</div>";

    try {
      const res = await fetch("/api/ai/icebreaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentUser: { name: "Você", role: "founder", skills: "Gestão" },
          matchUser: { name: profile.name, role: profile.role, project: profile.project_name || profile.problem_statement, seeking: profile.contribution_summary }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const suggestionsHtml = data.icebreakers.map((msg: string) => 
        `<div style="background:var(--bg-tertiary); padding:10px; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:8px; font-size:13px; color:var(--text-primary); text-align:left; cursor:pointer;" onclick="navigator.clipboard.writeText(this.innerText); this.style.borderColor='var(--accent-primary)';"><div style="font-size:10px; color:var(--accent-primary); margin-bottom:4px; font-weight:bold;">Tática ${data.icebreakers.indexOf(msg) + 1} (Clique para copiar)</div>${msg}</div>`
      ).join("");
      
      box!.innerHTML = `<div style="display:flex; flex-direction:column; gap:8px;">${suggestionsHtml}</div>`;
      btn.style.display = "none";
    } catch (err: any) {
      box!.innerHTML = `<span style="color:red; font-size:12px;">Erro: Coloque a OPENAI_API_KEY no servidor local para gerar match inteligência. (${err.message})</span>`;
      btn.disabled = false;
      btn.innerHTML = "Tentar Inteligência Novamente";
    }
  };

  return (
    <div className={styles.deckPage}>
      <div className={styles.deckHeader}>
        <h1 className={styles.deckTitle}>Discovery</h1>
        <p className={styles.deckSubtitle}>
          Talentos mapeados e selecionados por autoridade técnica.
        </p>
      </div>

      <AnimatePresence mode="popLayout" custom={exitDirection}>
        {profile && !matchData?.match && (
          <motion.div 
            key={profile.id}
            custom={exitDirection}
            variants={cardVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={`${styles.profileCard} glass`}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardAvatar} glass`}>
                {profile.role === "founder" ? <Rocket size={24} /> : <Zap size={24} />}
              </div>
              <div>
                <h2 className={styles.cardName}>{profile.name}</h2>
                <div className={styles.cardMeta}>
                  <span>{profile.city}</span>
                  <span>·</span>
                  <span className={`tag ${profile.role === "founder" ? "tag-role-founder" : "tag-role-builder"}`}>
                    {profile.role === "founder" ? "Founder" : "Builder"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardProblem}>
                "{profile.problem_statement}"
              </p>

              <div className={styles.cardDetails}>
                <div className={styles.cardDetail}>
                  <div className={styles.cardDetailIcon}><BarChart3 size={14} /></div>
                  <div style={{ flex: 1 }}>Estágio: <span className={`tag ${STAGE_TAG_CLASS[stage]}`}>{STAGE_LABELS[stage]}</span></div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.cardDetailIcon}><Search size={14} /></div>
                  <div style={{ flex: 1 }}>Busca: <strong>{profile.contribution_summary}</strong></div>
                </div>
                {profile.project_name && (
                  <div className={styles.cardDetail}>
                    <div className={styles.cardDetailIcon}><CheckCircle2 size={14} /></div>
                    <div style={{ flex: 1 }}>Projeto: <strong>{profile.project_name}</strong></div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardTags}>
              {(profile.expertise_areas as string[] || []).map((area) => (
                <span key={area} className="tag tag-accent">
                  {area === "engineering" ? "Engenharia" :
                   area === "design" ? "Design" :
                   area === "growth" ? "Growth" :
                   area === "sales" ? "Vendas" :
                   area === "data-ai" ? "Dados & IA" : "Operações"}
                </span>
              ))}
              <span className="tag tag-accent" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                {profile.financial_expectation === "equity-only" ? "Equity" :
                 profile.financial_expectation === "equity-pro-labore" ? "Equity + Base" :
                 profile.financial_expectation === "equity-market" ? "Mercado" : "Definindo"}
              </span>
            </div>

            <div className={styles.cardActions}>
              <button className={`${styles.actionBtn} ${styles.passBtn}`} onClick={handlePass} id="btn-pass">
                Passar
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.viewBtn}`} 
                id="btn-view-profile"
              >
                Detalhes
              </button>
              <button
                className={`${styles.actionBtn} ${styles.interestBtn}`}
                onClick={handleInterest}
                disabled={interestsToday >= MAX_INTERESTS}
                id="btn-interest"
              >
                <Flame size={18} /> Interesse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.interestCounter}>
        <span className={styles.interestCounterBold}>{interestsToday}</span> / {MAX_INTERESTS} sinais radar
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {matchData?.match && (
          <div className={styles.matchOverlay}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`${styles.matchModal} glass`}
              style={{ maxHeight: "90vh", overflowY: "auto", width: "90%", maxWidth: "450px" }}
            >
              <motion.div 
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className={styles.matchTaco}
              >
                <Flame size={48} className="text-accent" />
              </motion.div>
              <h2 className={styles.matchTitle}>Conexão Estabelecida</h2>
              <p className={styles.matchDesc}>
                O sinal foi correspondido. <strong>{profile?.name}</strong> também tem interesse em conectar. O radar abriu um canal seguro.
              </p>
              
              {/* IA ICEBREAKER ENGINE */}
              <div style={{ marginTop: "16px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                 <button 
                   id="ai-icebreaker-btn"
                   className="btn glass w-full"
                   style={{ border: "1px solid var(--accent-primary)", color: "var(--accent-primary)" }}
                   onClick={generateIcebreakers}
                 >
                   ✨ Gerar Quebra-Gelos (Otimizados por IA)
                 </button>
                 <div id="ai-icebreaker-box" style={{ display: "none", flexDirection: "column" }}>
                    {/* Rendered HTML will go here via DOM manipulation in generateIcebreakers */}
                 </div>
              </div>

              <div className={styles.matchActions}>
                <Link href={`/chat?id=${matchData.conversation_id}`} className="btn btn-primary w-full">
                  Abrir Canal <ArrowRight size={18} />
                </Link>
                <button className="btn btn-ghost w-full" onClick={closeMatchModal}>
                  Voltar ao Discovery
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
