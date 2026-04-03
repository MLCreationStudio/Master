"use client";

import { motion } from "framer-motion";
import styles from "./perfil.module.css";
import { 
  User, 
  Building, 
  BarChart3, 
  Search, 
  DollarSign, 
  Hammer, 
  Edit3, 
  Check, 
  Eye, 
  Users,
  Clock,
  Briefcase
} from "lucide-react";

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
        <button className="btn btn-secondary btn-sm hide-mobile">
          <Edit3 size={16} /> Editar Informações
        </button>
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
              <span className={styles.identityLabel}>Fundador</span>
              <span className={styles.identityValue} style={{ fontSize: "var(--font-size-xl)", fontWeight: 700 }}>João Silva</span>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Base Operacional</span>
              <span className={styles.identityValue}>São Paulo, SP</span>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>Papel Primário</span>
              <div><span className="tag tag-role-builder">Builder</span></div>
            </div>

            <div className={styles.identityRow}>
              <span className={styles.identityLabel}>O que você oferece</span>
              <span className={styles.identityValue}>
                Desenvolvimento Full-Stack, Arquitetura Cloud (ex-AWS). Capacidade de construir MVPs escaláveis.
              </span>
            </div>
            
            <div className={styles.editAction}>
              <button className="btn btn-ghost w-full">Configurações de Identidade</button>
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
                <span className={styles.identityValue}><strong>DataPipe</strong> — Backup automatizado para PMEs</span>
              </div>

              <div className={styles.identityRow}>
                <span className={styles.identityLabel}>Radar de Prontidão</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span className="tag tag-stage-exploration">Exploração</span>
                  <span className="tag tag-accent">Busca: Vendas, Operações</span>
                </div>
              </div>

              <div className={styles.identityRow}>
                <span className={styles.identityLabel}>Radar / Status de Busca</span>
                <div className={styles.statusContainer}>
                  <button className={`${styles.statusBtn} ${styles.active}`}>
                    <Check size={16} /> Ativo
                  </button>
                  <button className={styles.statusBtn}>
                    <Eye size={16} /> Passivo
                  </button>
                  <button className={styles.statusBtn}>
                    <Users size={16} /> Fechado
                  </button>
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
