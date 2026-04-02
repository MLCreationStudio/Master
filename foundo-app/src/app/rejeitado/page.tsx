import Link from "next/link";
import { ThumbsUp, ArrowLeft } from "lucide-react";
import styles from "../page.module.css";

export default function RejectedPage() {
  return (
    <div className={styles.landing}>
      <div className="container container-narrow">
        <div className="glass" style={{
          padding: "var(--space-3xl)",
          borderRadius: "var(--radius-xl)",
          marginTop: "var(--space-4xl)",
          textAlign: "center",
          animation: "fadeInUp 0.5s ease forwards"
        }}>
          <div style={{ 
            display: "flex",
            justifyContent: "center",
            marginBottom: "var(--space-xl)",
            color: "var(--accent-primary)"
          }}>
            <ThumbsUp size={64} />
          </div>
          
          <h1 className={styles.heroTitle} style={{ fontSize: "var(--font-size-2xl)" }}>
            Obrigado pelo seu interesse
          </h1>
          <p className={styles.heroSubtitle} style={{ margin: "0 auto var(--space-2xl)" }}>
            No momento, o Clip está mantendo um grupo muito restrito de builders e founders para garantir a qualidade dos matches.
            <br /><br />
            Seu perfil não foi aprovado para esta fase inicial, mas manteremos seus dados para futuras janelas de admissão.
          </p>

          <Link href="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
