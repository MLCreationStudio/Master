"use client";

import { useState, useEffect } from "react";
import { getPendingApplications, updateUserStatus } from "@/lib/supabase/actions";
import styles from "./admin.module.css";
import type { UserStatus } from "@/lib/types";

type Tab = "queue" | "matches" | "activity" | "metrics";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [pendingApps, setPendingApps] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getPendingApplications();
      setPendingApps(data || []);
    } catch (err) {
      console.error("Error fetching pending apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "queue") {
      fetchApps();
    }
  }, [activeTab]);

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatus(userId, status);
      // Remove from local state
      setPendingApps((prev) => prev.filter((p) => p.id !== userId));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erro ao atualizar status.");
    }
  };



  return (
    <div className={styles.adminPage}>
      <h1 className={styles.adminTitle}>Painel Admin</h1>

      {/* Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>--</div>
          <div className={styles.metricLabel}>Usuários aprovados</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>--</div>
          <div className={styles.metricLabel}>Matches realizados</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>--</div>
          <div className={styles.metricLabel}>Conversas iniciadas</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>--</div>
          <div className={styles.metricLabel}>Histórias de sucesso</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {([
          ["queue", `Fila de Admissão (${pendingApps.length})`],
          ["matches", "Mapa de Matches"],
          ["activity", "Radar de Atividade"],
          ["metrics", "Métricas"],
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
                <div className={styles.queueAvatar}>
                  {item.role === "founder" ? "🚀" : "⚡"}
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
                        <a href={item.linkedin_url} target="_blank" className="text-accent">LinkedIn ↗</a>
                    )}
                    {item.github_url && (
                        <a href={item.github_url} target="_blank" className="text-accent">GitHub ↗</a>
                    )}
                  </div>
                </div>
                <div className={styles.queueActions}>
                  <button
                    className={`${styles.queueBtn} ${styles.approveBtn}`}
                    onClick={() => handleStatusUpdate(item.id, "active")}
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    className={`${styles.queueBtn} ${styles.rejectBtn}`}
                    onClick={() => handleStatusUpdate(item.id, "rejected")}
                  >
                    ✕ Reprovar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div className={styles.matchMap}>
            <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
                Mapa de matches em tempo real será implementado na Fase 5.
            </p>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className={styles.queueList}>
          <p style={{ textAlign: "center", padding: "40px", color: "var(--text-tertiary)" }}>
            Radar de atividade em tempo real será implementado na Fase 5.
          </p>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === "metrics" && (
        <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)" }}>
          <p>📊 Dashboard de métricas core em construção.</p>
        </div>
      )}
    </div>
  );
}
