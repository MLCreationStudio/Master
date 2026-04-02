"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./deck.module.css";
import type { ProjectStage, ExpertiseArea } from "@/lib/types";
import { 
  getDiscoveryDeck, 
  handleUserInterest, 
  handleUserPass, 
  getDailyInterestCount 
} from "@/lib/supabase/actions";
import Link from "next/link";

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
    try {
      await handleUserPass(profile.id);
      setCurrentIndex((i) => i + 1);
    } catch (err) {
      console.error("Error passing profile:", err);
    }
  };

  const handleInterest = async () => {
    if (!profile || interestsToday >= MAX_INTERESTS) return;
    
    try {
      const result = await handleUserInterest(profile.id);
      setInterestsToday((c) => c + 1);
      
      if (result?.match) {
        setMatchData(result);
      } else {
        setCurrentIndex((i) => i + 1);
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
          <p className={styles.emptyDesc}>Carregando perfis...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.deckPage}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎯</div>
          <h3 className={styles.emptyTitle}>Sem perfis novos por agora</h3>
          <p className={styles.emptyDesc}>
            Volte mais tarde — novos perfis aparecem conforme são aprovados.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={fetchDeck} style={{ marginTop: "var(--space-md)" }}>
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  const stage = (profile.project_stage as ProjectStage) || "exploration";

  return (
    <div className={styles.deckPage}>
      <div className={styles.deckHeader}>
        <h1 className={styles.deckTitle}>Deck</h1>
        <p className={styles.deckSubtitle}>
          Perfis compatíveis selecionados para você
        </p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardAvatar}>
            {profile.role === "founder" ? "🚀" : "⚡"}
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
            {profile.problem_statement}
          </p>

          <div className={styles.cardDetails}>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>📊</span>
              <span>Estágio: </span>
              <span className={`tag ${STAGE_TAG_CLASS[stage]}`}>
                {STAGE_LABELS[stage]}
              </span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.cardDetailIcon}>🔍</span>
              <span>{profile.contribution_summary}</span>
            </div>
            {profile.project_name && (
              <div className={styles.cardDetail}>
                <span className={styles.cardDetailIcon}>✓</span>
                <span>Projeto: <strong>{profile.project_name}</strong></span>
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
               area === "data-ai" ? "Dados/IA" : "Operações"}
            </span>
          ))}
          <span className="tag tag-accent">
            {profile.financial_expectation === "equity-only" ? "Equity puro" :
             profile.financial_expectation === "equity-pro-labore" ? "Equity + pró-labore" :
             profile.financial_expectation === "equity-market" ? "Equity + mercado" : "Definindo"}
          </span>
        </div>

        <div className={styles.cardActions}>
          <button className={`${styles.actionBtn} ${styles.passBtn}`} onClick={handlePass} id="btn-pass">
            Passar
          </button>
          <button className={`${styles.actionBtn} ${styles.viewBtn}`} id="btn-view-profile">
            Ver perfil
          </button>
          <button
            className={`${styles.actionBtn} ${styles.interestBtn}`}
            onClick={handleInterest}
            disabled={interestsToday >= MAX_INTERESTS}
            id="btn-interest"
          >
            🔥 Interesse
          </button>
        </div>
      </div>

      <div className={styles.interestCounter}>
        <span className={styles.interestCounterBold}>{interestsToday}</span> / {MAX_INTERESTS} interesses hoje
      </div>

      {/* Match Modal */}
      {matchData?.match && (
        <div className={styles.matchOverlay}>
          <div className={`${styles.matchModal} animate-fade-in-up`}>
            <div className={styles.matchTaco}>🔥</div>
            <h2 className={styles.matchTitle}>É um Match!</h2>
            <p className={styles.matchDesc}>
              Você e <strong>{profile.name}</strong> demonstraram interesse mútuo.
              Uma nova conversa foi aberta para vocês.
            </p>
            <div className={styles.matchActions}>
              <Link href={`/chat?id=${matchData.conversation_id}`} className="btn btn-primary w-full">
                Ir para o Chat →
              </Link>
              <button className="btn btn-ghost w-full" onClick={closeMatchModal}>
                Continuar no Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
