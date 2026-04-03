import styles from "./matches.module.css";
import { Rocket, Zap, MessageSquare, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getConversations } from "@/lib/supabase/actions";

// Removendo "use client" e motion.div porque componentes Async do Servidor 
// não suportam framer-motion diretament sem um wrapper "use client" separado.
// Para manter elegância na demo, utilizaremos renderização nativa de backend.

export default async function MatchesPage() {
  const conversations = await getConversations();

  return (
    <div className={styles.matchesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conexões Abertas</h1>
        <p className={styles.subtitle}>Sinais mútuos confirmados. O canal está livre para aproximação.</p>
      </div>

      {conversations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-tertiary)" }}>
          <p>Seu radar ainda não identificou sinais recíprocos.</p>
          <Link href="/deck" className="btn btn-secondary btn-sm" style={{ marginTop: "16px" }}>
            Voltar ao Discovery Deck
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {conversations.map((match) => (
            <div key={match.id} className={`${styles.matchCard} glass-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {match.otherUser?.role === 'founder' ? <Rocket size={20} /> : <Zap size={20} />}
                </div>
                <div className={styles.info}>
                  <h2 className={styles.name}>{match.otherUser?.name || "Usuário Sigiloso"}</h2>
                  <div className={styles.meta}>
                    <span className={`tag ${match.otherUser?.role === "founder" ? "tag-role-founder" : "tag-role-builder"} tag-sm`}>
                      {match.otherUser?.role === "founder" ? "Founder" : "Builder"}
                    </span>
                    <span>·</span>
                    <span>{new Date(match.time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link href={`/chat?id=${match.id}`} className={`${styles.actionBtn} ${styles.chatBtn}`}>
                  <MessageSquare size={16} /> Canal Direto
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

