"use client";

import { motion } from "framer-motion";
import styles from "./perfil.module.css";
import { 
  User, 
  Briefcase, 
  Search, 
  Check, 
  Eye, 
  Users,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/supabase/actions";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 }
  }
};

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getUserProfile();
      setProfile(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.profilePage} style={{ textAlign: "center", padding: "100px" }}>
        <p className="text-tertiary">Decodificando Passport...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <p>Perfil não localizado na rede.</p>
      </div>
    );
  }

  const project = profile.projects?.[0];
  const seeking = profile.seeking?.[0];

  return (
    <div className={styles.profilePage}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className={styles.title}>Passport</h1>
          <p className={styles.subtitle}>Sua credencial de autoridade no ecossistema Clip.</p>
        </div>
      </motion.div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Identidade Card */}
        <motion.div variants={itemVariants} className={`${styles.moduleCard} glass-card`}>
          <div className={styles.moduleHeader}>
            <div className={styles.moduleIcon}><User size={20} /></div>
            <h2 className={styles.moduleTitle}>Identidade & Skillset</h2>
          </div>

          <div className={styles.identityGrid}>
            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Membro</span>
              <span className={styles.identityValue} style={{ fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{profile.name}</span>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Base Operacional</span>
              <span className={styles.identityValue}>{profile.city}</span>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Papel Primário</span>
              <div><span className={`tag ${profile.role === 'founder' ? 'tag-role-founder' : 'tag-role-builder'}`}>
                {profile.role === 'founder' ? 'Founder' : 'Builder'}
              </span></div>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Oferta (O que você traz)</span>
              <span className={styles.identityValue}>
                {seeking?.contribution_summary || "Habilidades em fase de preenchimento."}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Business & Status Card */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          
          <div className={`${styles.moduleCard} glass-card`}>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}><Briefcase size={20} /></div>
              <h2 className={styles.moduleTitle}>Status do Projeto</h2>
            </div>

            <div className={styles.identityGrid}>
              <div className={styles.identityRow}>
                <span className={styles.identityLabel}>Projeto Atual</span>
                <span className={styles.identityValue}>
                  {project ? (
                    <><strong>{project.name}</strong> — {project.problem_statement}</>
                  ) : (
                    "Sem projeto matriz registrado (Fase de sondagem)."
                  )}
                </span>
              </div>

              <div className={styles.identityRow}>
                <span className={styles.identityLabel}>Radar de Prontidão</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span className="tag tag-stage-exploration">{project?.stage || "Exploração"}</span>
                  {seeking?.expertise_areas && seeking.expertise_areas.length > 0 && (
                     <span className="tag tag-accent">Áreas: {seeking.expertise_areas.join(', ')}</span>
                  )}
                </div>
              </div>

              {/* AI REFINER MODULE */}
              <div className="p-4 mt-2 rounded-lg border border-accent/20" style={{ background: "var(--bg-tertiary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                   <span className={styles.identityLabel} style={{ color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                     ✨ Clip AI: Otimizador de Pitch
                   </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.4 }}>
                  Testando: Descreva seu projeto cru e veja a OpenAI reescrevê-lo com linguagem de alta conversão.
                </div>
                <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                  <textarea 
                    className="input glass w-full" 
                    placeholder="Cole seu briefing amador aqui..."
                    style={{ minHeight: "80px", resize: "none" }}
                    id="ai-pitch-input"
                    defaultValue={project?.problem_statement || ""}
                  ></textarea>
                  <button 
                    className="btn btn-primary btn-sm w-full"
                    onClick={async () => {
                      const input = document.getElementById("ai-pitch-input") as HTMLTextAreaElement;
                      const output = document.getElementById("ai-pitch-output");
                      if(!input.value) return;
                      
                      input.disabled = true;
                      output!.innerText = "Gerando sinapses via OpenAI...";
                      
                      try {
                        const res = await fetch("/api/ai/pitch-refiner", {
                           method: "POST",
                           headers: { "Content-Type": "application/json" },
                           body: JSON.stringify({ rawPitch: input.value, role: profile.role, projectStage: project?.stage || "exploração" })
                        });
                        const data = await res.json();
                        if (data.error) throw new Error(data.error);
                        output!.innerText = data.refinedPitch;
                      } catch (err: any) {
                        output!.innerText = `Erro API: ${err.message}`;
                      } finally {
                        input.disabled = false;
                      }
                    }}
                  >
                    🚀 Refinar como Elite (AI)
                  </button>
                  <div id="ai-pitch-output" style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-primary)", padding: "12px", borderLeft: "2px solid var(--accent-primary)", background: "var(--bg-card)" }}>
                    <em>Resultado da Inteligência aparecerá aqui...</em>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className={`${styles.moduleCard} glass-card`}>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}><Search size={20} /></div>
              <h2 className={styles.moduleTitle}>Log de Autoridade</h2>
            </div>
            
            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>O que você tem feito ultimamente?</span>
              <div className={styles.updateBox}>
                <input
                  type="text"
                  className={styles.updateInput}
                  placeholder="Ex: Refatorando o backend, conversando com clientes..."
                  defaultValue="Pesquisando integrações com ERPs nacionais"
                />
                <button className="btn btn-primary btn-sm">Postar</button>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <Clock size={12} /> Atualizado há 3 dias
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}
