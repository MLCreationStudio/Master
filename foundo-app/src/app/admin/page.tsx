"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getPendingApplications, 
  updateUserStatus,
  getAdminMetrics,
  getAdminMatches,
  getAdminActivity
} from "@/lib/supabase/actions";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Zap, 
  Rocket, 
  Activity, 
  TrendingUp,
  ExternalLink
} from "lucide-react";
import styles from "./admin.module.css";
import type { UserStatus } from "@/lib/types";

type Tab = "queue" | "matches" | "activity" | "metrics";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [pendingApps, setPendingApps] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  const [metrics, setMetrics] = useState({
    activeUsers: 0, totalMatches: 0, conversationsStarted: 0, successStories: 0
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "queue") {
        const data = await getPendingApplications();
        setPendingApps(data || []);
      } else if (activeTab === "matches") {
        const data = await getAdminMatches();
        setMatches(data || []);
      } else if (activeTab === "activity") {
        const data = await getAdminActivity();
        setActivity(data || []);
      }
      
      const metricsData = await getAdminMetrics();
      setMetrics(metricsData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Falha ao carregar inteligência do radar. Verifique conexões.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatus(userId, status);
      setPendingApps((prev) => prev.filter((p) => p.id !== userId));
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erro ao aplicar decisão tática.");
    }
  };

  return (
    <div className={styles.adminPage}>
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={styles.adminTitle}
      >
        Command Center
      </motion.h1>

      {error && (
        <div className="input-error-msg" style={{ marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Metrics */}
      <motion.div 
        className={styles.metricsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className={`${styles.metricCard} glass`}>
          <div className={styles.metricLabel}><Users size={16} /> Radar de Usuários</div>
          <div className={styles.metricValue}>{metrics.activeUsers}</div>
        </motion.div>
        <motion.div variants={itemVariants} className={`${styles.metricCard} glass`}>
          <div className={styles.metricLabel}><Flame size={16} /> Sinais de Match</div>
          <div className={styles.metricValue}>{metrics.totalMatches}</div>
        </motion.div>
        <motion.div variants={itemVariants} className={`${styles.metricCard} glass`}>
          <div className={styles.metricLabel}><Activity size={16} />Canais Ativos</div>
          <div className={styles.metricValue}>{metrics.conversationsStarted}</div>
        </motion.div>
        <motion.div variants={itemVariants} className={`${styles.metricCard} glass`}>
          <div className={styles.metricLabel}><TrendingUp size={16} /> Expansão de Rede</div>
          <div className={styles.metricValue}>{metrics.successStories}</div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {([
          ["queue", `Fila de Admissão (${pendingApps.length})`],
          ["matches", "Log de Conexões"],
          ["activity", "Telemetria"],
        ] as [Tab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="adminTabHighlight"
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--accent-primary)",
                  boxShadow: "0 0 10px var(--accent-primary-glow)",
                  borderRadius: "2px"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Queue Tab */}
          {activeTab === "queue" && (
            <div className={styles.queueList}>
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
                  Sondando fila temporal...
                </p>
              ) : pendingApps.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
                  Perímetro seguro. Nenhuma requisição pendente.
                </p>
              ) : (
                pendingApps.map((item) => (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className={styles.queueItem}>
                    <div className={`${styles.queueAvatar} glass`}>
                      {item.role === "founder" ? <Rocket size={20} /> : <Zap size={20} />}
                    </div>
                    <div className={styles.queueInfo}>
                      <div className={styles.queueName}>{item.name}</div>
                      <div className={styles.queueMeta}>
                        <span className={`tag ${item.role === "founder" ? "tag-role-founder" : "tag-role-builder"} tag-sm`}>
                          {item.role === "founder" ? "Founder" : "Builder"}
                        </span>
                        <span>{item.city}</span>
                        <span style={{ color: "var(--border-hover)", fontSize: "20px", lineHeight: "10px" }}>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      {item.projects && item.projects[0] && (
                        <div className={styles.queueProject}>
                          <strong style={{ color: "var(--text-primary)" }}>{item.projects[0].name}</strong>
                          <div style={{ marginTop: "4px" }}>{item.projects[0].problem_statement}</div>
                          {item.seeking?.[0]?.contribution_summary && (
                            <div style={{ marginTop: "8px", fontWeight: 500, color: "var(--accent-secondary)" }}>
                              Busca: {item.seeking[0].contribution_summary}
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{ marginTop: "12px", display: "flex", gap: "12px", fontSize: "12px" }}>
                        {item.linkedin_url && (
                            <a href={item.linkedin_url} target="_blank" className="text-secondary flex items-center gap-1 hover:text-accent">LinkedIn <ExternalLink size={12} /></a>
                        )}
                        {item.github_url && (
                            <a href={item.github_url} target="_blank" className="text-secondary flex items-center gap-1 hover:text-accent">GitHub <ExternalLink size={12} /></a>
                        )}
                      </div>
                    </div>
                    <div className={styles.queueActions}>
                      <button
                        className={`${styles.queueBtn} ${styles.approveBtn}`}
                        onClick={() => handleStatusUpdate(item.id, "active")}
                      >
                        <CheckCircle2 size={16} /> Aprovar Auth
                      </button>
                      <button
                        className={`${styles.queueBtn} ${styles.rejectBtn}`}
                        onClick={() => handleStatusUpdate(item.id, "rejected")}
                      >
                        <XCircle size={16} /> Bloquear
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === "matches" && (
            <div className={styles.queueList}>
              {loading ? (
                 <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Consultando registros...</p>
              ) : matches.length === 0 ? (
                 <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Nenhum match processado na rede.</p>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className={styles.queueItem} style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className={`${styles.queueAvatar} glass`}>
                        {match.user_a.role === 'founder' ? <Rocket size={18} /> : <Zap size={18} />}
                      </div>
                      <div>
                        <div className={styles.queueName}>{match.user_a.name}</div>
                        <div className="text-tertiary" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>{match.user_a.role}</div>
                      </div>
                    </div>

                    <div style={{ color: "var(--accent-primary)", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", margin: "0 auto", padding: "6px 12px", background: "var(--accent-primary-muted)", borderRadius: "var(--radius-full)", fontSize: "12px", letterSpacing: "0.05em" }}>
                      MATCH <Flame size={14} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", textAlign: "right" }}>
                      <div>
                        <div className={styles.queueName}>{match.user_b.name}</div>
                        <div className="text-tertiary" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>{match.user_b.role}</div>
                      </div>
                      <div className={`${styles.queueAvatar} glass`}>
                        {match.user_b.role === 'founder' ? <Rocket size={18} /> : <Zap size={18} />}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className={styles.queueList}>
              {loading ? (
                 <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Carregando telemetria...</p>
              ) : activity.length === 0 ? (
                 <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Radar silencioso.</p>
              ) : (
                activity.map((event) => (
                  <div key={event.id} className={styles.queueItem} style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>
                      <span style={{ color: "var(--accent-primary)", marginRight: "12px", fontSize: "10px" }}>●</span>
                      {event.text}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginLeft: "auto", fontWeight: 500 }}>
                      {new Date(event.time).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
