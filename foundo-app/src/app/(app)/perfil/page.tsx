"use client";

import styles from "../deck/deck.module.css";

export default function PerfilPage() {
  return (
    <div className={styles.deckPage}>
      <div className={styles.deckHeader}>
        <h1 className={styles.deckTitle}>Seu Perfil</h1>
        <p className={styles.deckSubtitle}>Gerencie suas informações e status</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardAvatar}>👤</div>
          <div>
            <h2 className={styles.cardName}>João Silva</h2>
            <div className={styles.cardMeta}>
              <span>São Paulo</span>
              <span>·</span>
              <span className="tag tag-role-builder">Builder</span>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardDetails}>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>🏢</span>
              <span><strong>Projeto:</strong> DataPipe — Backup automatizado para PMEs</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>📊</span>
              <span><strong>Estágio:</strong> </span>
              <span className="tag tag-stage-exploration">Exploração</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>🔍</span>
              <span><strong>Busca:</strong> Vendas, Operações/Finanças</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>💰</span>
              <span><strong>Expectativa:</strong> Equity puro</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>🛠️</span>
              <span><strong>Oferece:</strong> Full-stack senior, 6 anos em infra cloud, ex-AWS</span>
            </div>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button className="btn btn-secondary w-full">✏️ Editar perfil</button>
        </div>
      </div>

      {/* Status Control */}
      <div style={{ marginTop: "24px" }}>
        <label className="input-label">Seu status atual</label>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button className="btn btn-primary btn-sm">🟢 Buscando ativamente</button>
          <button className="btn btn-secondary btn-sm">👀 Observando</button>
          <button className="btn btn-secondary btn-sm">🤝 Em parceria</button>
        </div>
      </div>

      {/* Status Update */}
      <div style={{ marginTop: "24px" }}>
        <label className="input-label">Status do projeto</label>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="text"
            className="input"
            placeholder="O que mudou no seu projeto?"
            defaultValue="Pesquisando integrações com ERPs nacionais"
          />
          <button className="btn btn-primary btn-sm">Atualizar</button>
        </div>
        <span className="input-hint">Última atualização: há 3 dias</span>
      </div>
    </div>
  );
}
