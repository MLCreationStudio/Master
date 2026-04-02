import Link from "next/link";
import styles from "../page.module.css";

export default function RejectedPage() {
  return (
    <div className={styles.landing}>
      <div className="container container-narrow">
        <div style={{
          padding: "var(--space-3xl)",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          marginTop: "var(--space-4xl)",
          textAlign: "center",
          animation: "fadeInUp 0.5s ease forwards"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "var(--space-xl)" }}>🤝</div>
          <h1 className={styles.heroTitle} style={{ fontSize: "var(--font-size-2xl)" }}>
            Obrigado pelo seu interesse
          </h1>
          <p className={styles.heroSubtitle} style={{ margin: "0 auto var(--space-2xl)" }}>
            No momento, o Foundo está mantendo um grupo muito restrito de builders e founders para garantir a qualidade dos matches.
            <br /><br />
            Seu perfil não foi aprovado para esta fase inicial, mas manteremos seus dados para futuras janelas de admissão.
          </p>

          <Link href="/" className="btn btn-secondary">
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
