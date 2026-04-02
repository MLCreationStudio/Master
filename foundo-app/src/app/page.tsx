"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: sbError } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (sbError) {
        if (sbError.code === "23505") {
          setError("Este e-mail já está na lista!");
        } else {
          throw sbError;
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error joining waitlist:", err);
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.landing}>
      <div className="container">
        {/* Nav */}
        <nav className={styles.nav}>
          <div className={styles.logo}>
            found<span className={styles.logoAccent}>o</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login?mode=login" className="btn btn-ghost btn-sm">
              Entrar
            </Link>
            <Link href="/login?mode=signup" className="btn btn-secondary btn-sm">
              Quero participar
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>
            🔥 Matchmaking curado para co-fundação
          </div>

          <h1 className={styles.heroTitle}>
            Onde founders e devs se encontram para{" "}
            <span className="text-accent">construir juntos</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Não é mais um app de networking. É o lugar onde a decisão de
            construir junto acontece — com segurança, contexto e
            intencionalidade desde o primeiro contato.
          </p>

          {!submitted ? (
            <div className="w-full max-auto flex flex-col items-center">
              <form className={styles.waitlistForm} onSubmit={handleSubmit}>
                <input
                  type="email"
                  className={styles.waitlistInput}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="waitlist-email"
                />
                <button
                  type="submit"
                  className={styles.waitlistBtn}
                  disabled={loading}
                  id="waitlist-submit"
                >
                  {loading ? "Enviando..." : "Entrar na lista"}
                </button>
              </form>
              <div style={{ marginTop: "var(--space-md)", textAlign: "center" }}>
                 <p className="text-sm text-tertiary">
                   Já tem conta?{" "}
                   <Link href="/login?mode=login" className="text-accent hover:underline">
                     Entrar aqui
                   </Link>
                 </p>
              </div>
              {error && (
                <p className="input-error-msg" style={{ marginTop: "var(--space-sm)" }}>
                  {error}
                </p>
              )}
            </div>
          ) : (
            <p className={styles.waitlistSuccess}>
              ✓ Você está na lista! Entraremos em contato em breve.
            </p>
          )}

          <div className={styles.socialProof}>
            <div className={styles.avatarStack}>
              <span>👨‍💻</span>
              <span>👩‍💼</span>
              <span>🧑‍🔬</span>
              <span>👨‍🎨</span>
              <span>👩‍💻</span>
            </div>
            <p className={styles.socialText}>
              <span className={styles.socialTextHighlight}>50+ founders e devs</span>{" "}
              já estão na lista de espera
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section className={styles.section}>
          <div className="text-center">
            <span className={styles.sectionLabel}>Como funciona</span>
            <h2 className={styles.sectionTitle}>
              3 passos para encontrar seu co-founder
            </h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Aplique com intenção</h3>
              <p className={styles.stepDesc}>
                Preencha seu perfil com o projeto que está construindo, o que busca
                e o que oferece. Admissão manual — sem ruído.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Explore perfis curados</h3>
              <p className={styles.stepDesc}>
                O deck mostra perfis compatíveis: founders para builders e
                vice-versa. Veja o projeto, o estágio e a expectativa antes de
                demonstrar interesse.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Converse com contexto</h3>
              <p className={styles.stepDesc}>
                Interesse mútuo abre um chat com apresentação automática. A
                conversa começa com contexto — não com &quot;oi, tudo bem?&quot;.
              </p>
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className={styles.section}>
          <div className="text-center">
            <span className={styles.sectionLabel}>Por que Foundo</span>
            <h2 className={styles.sectionTitle}>
              Construído para quem leva a sério
            </h2>
          </div>

          <div className={styles.diffGrid}>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}>🛡️</div>
              <div>
                <h4 className={styles.diffTitle}>Admissão manual</h4>
                <p className={styles.diffDesc}>
                  Cada perfil é revisado pessoalmente. Sem bots, sem golpes, sem
                  fantasmas.
                </p>
              </div>
            </div>

            <div className={styles.diffCard}>
              <div className={styles.diffIcon}>🎯</div>
              <div>
                <h4 className={styles.diffTitle}>Foco exclusivo</h4>
                <p className={styles.diffDesc}>
                  Não é rede social. É matchmaking para co-fundação — e só isso.
                </p>
              </div>
            </div>

            <div className={styles.diffCard}>
              <div className={styles.diffIcon}>🤝</div>
              <div>
                <h4 className={styles.diffTitle}>Match bilateral</h4>
                <p className={styles.diffDesc}>
                  Só conecta quando os dois lados demonstram interesse. Sem spam,
                  sem cold outreach.
                </p>
              </div>
            </div>

            <div className={styles.diffCard}>
              <div className={styles.diffIcon}>💬</div>
              <div>
                <h4 className={styles.diffTitle}>Chat com contexto</h4>
                <p className={styles.diffDesc}>
                  A conversa começa com tudo que importa: projeto, estágio,
                  contribuição e expectativa financeira.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>
            Pronto para encontrar seu co-founder?
          </h2>
          <p className={styles.ctaSubtitle}>
            Entre na lista de espera. Vagas limitadas — priorizamos perfis com
            projetos concretos e contribuição verificável.
          </p>
          <Link href="/login?mode=signup" className="btn btn-primary btn-lg">
            Quero participar →
          </Link>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <p className={styles.footerText}>
              © 2026 Foundo · ML Creation Studio
            </p>
            <div className={styles.footerLinks}>
              <Link href="#">Termos</Link>
              <Link href="#">Privacidade</Link>
              <Link href="#">Contato</Link>
              {/* Secret Admin Link */}
              <Link href="/admin" className="opacity-50 hover:opacity-100 transition-opacity">
                Admin ⚙️
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
