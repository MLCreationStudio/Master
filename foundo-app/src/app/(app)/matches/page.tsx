"use client";

import styles from "../deck/deck.module.css";

export default function MatchesPage() {
  const demoMatches = [
    { id: "1", name: "Ana Ribeiro", project: "HealthTrack", stage: "Construção", matchedAt: "28 Mar 2026", hasChat: true },
    { id: "2", name: "Mariana Costa", project: "EduConnect", stage: "Tração", matchedAt: "25 Mar 2026", hasChat: true },
  ];

  return (
    <div className={styles.deckPage}>
      <div className={styles.deckHeader}>
        <h1 className={styles.deckTitle}>Matches</h1>
        <p className={styles.deckSubtitle}>Conexões com interesse mútuo confirmado</p>
      </div>

      {demoMatches.map((match) => (
        <div key={match.id} className={styles.profileCard} style={{ marginBottom: "16px" }}>
          <div className={styles.cardHeader}>
            <div className={styles.cardAvatar}>🚀</div>
            <div>
              <h2 className={styles.cardName}>{match.name}</h2>
              <div className={styles.cardMeta}>
                <span>{match.project}</span>
                <span>·</span>
                <span>{match.stage}</span>
                <span>·</span>
                <span>Match em {match.matchedAt}</span>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <a href="/chat" className={`${styles.actionBtn} ${styles.interestBtn}`}>
              💬 Abrir conversa
            </a>
            <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
              Ver perfil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
