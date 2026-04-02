"use client";

import { useState, useEffect, useCallback } from "react";
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
  Search,
  ExternalLink
} from "lucide-react";
import styles from "./admin.module.css";
import type { UserStatus } from "@/lib/types";

type Tab = "queue" | "matches" | "activity" | "metrics";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [pendingApps, setPendingApps] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  // Phase 5 States
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
      
      // Always fetch metrics for the top header
      const metricsData = await getAdminMetrics();
      setMetrics(metricsData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Falha ao carregar dados do painel. Verifique os logs do servidor.");
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
      // Refresh metrics after approval
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.adminTitle}>Painel Admin</h1>

      {error && (
        <div className="input-error-msg" style={{ marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Metrics */}
      <div className={styles.metricsGrid}>
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricValue}>{metrics.activeUsers}</div>
          <div className={styles.metricLabel}><Users size={14} /> Usuários ativos</div>
        </div>
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricValue}>{metrics.totalMatches}</div>
          <div className={styles.metricLabel}><Flame size={14} /> Matches realizados</div>
        </div>
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricValue}>{metrics.conversationsStarted}</div>
          <div className={styles.metricLabel}><Activity size={14} /> Conversas ativas</div>
        </div>
        <div className={`${styles.metricCard} glass`}>
          <div className={styles.metricValue}>{metrics.successStories}</div>
          <div className={styles.metricLabel}><TrendingUp size={14} /> Projetos c/ Tração</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {([
          ["queue", `Fila de Admissão (${pendingApps.length})`],
          ["matches", "Mapa de Matches"],
          ["activity", "Radar de Atividade"],
        ] as [Tab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Queue Tab */}
      {activeTab === "queue" && (
        <div className={styles.queueList}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
              Carregando fila...
            </p>
          ) : pendingApps.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
              Nenhuma admissão pendente.
            </p>
          ) : (
            pendingApps.map((item) => (
              <div key={item.id} className={styles.queueItem}>
                <div className={`${styles.queueAvatar} glass`}>
                  {item.role === "founder" ? <Rocket size={18} /> : <Zap size={18} />}
                </div>
                <div className={styles.queueInfo}>
                  <div className={styles.queueName}>{item.name}</div>
                  <div className={styles.queueMeta}>
                    <span className={`tag ${item.role === "founder" ? "tag-role-founder" : "tag-role-builder"}`}>
                      {item.role === "founder" ? "Founder" : "Builder"}
                    </span>
                    <span>{item.city}</span>
                    <span>·</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  {item.projects && item.projects[0] && (
                    <p className={styles.queueProject}>
                      <strong>{item.projects[0].name}</strong> — {item.projects[0].problem_statement}
                      <br />
                      <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                        {item.seeking?.[0]?.contribution_summary}
                      </span>
                    </p>
                  )}
                  <div style={{ marginTop: "8px", display: "flex", gap: "12px", fontSize: "12px" }}>
                    {item.linkedin_url && (
                        <a href={item.linkedin_url} target="_blank" className="text-accent flex items-center gap-1">LinkedIn <ExternalLink size={12} /></a>
                    )}
                    {item.github_url && (
                        <a href={item.github_url} target="_blank" className="text-accent flex items-center gap-1">GitHub <ExternalLink size={12} /></a>
                    )}
                  </div>
                </div>
                <div className={styles.queueActions}>
                  <button
                    className={`${styles.queueBtn} ${styles.approveBtn}`}
                    onClick={() => handleStatusUpdate(item.id, "active")}
                  >
                    <CheckCircle2 size={16} /> Aprovar
                  </button>
                  <button
                    className={`${styles.queueBtn} ${styles.rejectBtn}`}
                    onClick={() => handleStatusUpdate(item.id, "rejected")}
                  >
                    <XCircle size={16} /> Reprovar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div className={styles.queueList}>
          {loading ? (
             <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Carregando matches...</p>
          ) : matches.length === 0 ? (
             <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Nenhum match realizado ainda.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className={styles.queueItem} style={{ alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className={`${styles.queueAvatar} glass`} style={{ border: "1px solid var(--border-subtle)" }}>
                    {match.user_a.role === 'founder' ? <Rocket size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <div className={styles.queueName}>{match.user_a.name}</div>
                    <div className="text-tertiary" style={{ fontSize: "12px" }}>{match.user_a.role}</div>
                  </div>
                </div>

                <div style={{ color: "var(--accent-primary)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                  MATCH <Flame size={16} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", textAlign: "right" }}>
                  <div>
                    <div className={styles.queueName}>{match.user_b.name}</div>
                    <div className="text-tertiary" style={{ fontSize: "12px" }}>{match.user_b.role}</div>
                  </div>
                  <div className={`${styles.queueAvatar} glass`} style={{ border: "1px solid var(--border-subtle)" }}>
                    {match.user_b.role === 'founder' ? <Rocket size={16} /> : <Zap size={16} />}
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
             <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Carregando radar...</p>
          ) : activity.length === 0 ? (
             <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>Sem atividades recentes.</p>
          ) : (
            activity.map((event) => (
              <div key={event.id} className={styles.queueItem}>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent-primary)", marginRight: "8px" }}>●</span>
                  {event.text}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                  {new Date(event.time).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
