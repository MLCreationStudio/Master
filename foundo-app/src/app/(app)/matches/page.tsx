"use client";

import { motion } from "framer-motion";
import styles from "./matches.module.css";
import { Rocket, Zap, MessageSquare, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function MatchesPage() {
  const demoMatches = [
    { id: "1", name: "Ana Ribeiro", project: "HealthTrack", stage: "Construção", matchedAt: "Hoje", hasChat: true, role: 'builder' },
    { id: "2", name: "Mariana Costa", project: "EduConnect", stage: "Tração", matchedAt: "Ontem", hasChat: true, role: 'founder' },
    { id: "3", name: "Felipe Alves", project: "Sem projeto", stage: "Exploração", matchedAt: "24 Mar", hasChat: false, role: 'builder' },
  ];

  return (
    <div className={styles.matchesPage}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Conexões Abertas</h1>
        <p className={styles.subtitle}>Sinais mútuos confirmados. O canal está livre para aproximação.</p>
      </motion.div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {demoMatches.map((match) => (
          <motion.div key={match.id} variants={itemVariants} className={`${styles.matchCard} glass-card`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {match.role === 'founder' ? <Rocket size={20} /> : <Zap size={20} />}
              </div>
              <div className={styles.info}>
                <h2 className={styles.name}>{match.name}</h2>
                <div className={styles.meta}>
                  <span className={`tag ${match.role === "founder" ? "tag-role-founder" : "tag-role-builder"} tag-sm`}>
                    {match.role === "founder" ? "Founder" : "Builder"}
                  </span>
                  <span>·</span>
                  <span>{match.matchedAt}</span>
                </div>
              </div>
            </div>

            <div className={styles.meta} style={{ marginTop: "var(--space-xs)" }}>
              <strong>Projeto:</strong> {match.project} ({match.stage})
            </div>

            <div className={styles.cardFooter}>
              <Link href="/chat" className={`${styles.actionBtn} ${styles.chatBtn}`}>
                <MessageSquare size={16} /> Canal Direto
              </Link>
              <button className={`${styles.actionBtn} ${styles.profileBtn}`}>
                <User size={16} /> <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
