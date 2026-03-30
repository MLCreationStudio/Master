import { ArrowRight, Zap, Target, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing-container">
      {/* Header / Nav */}
      <nav className="nav-container glass-card">
        <div className="nav-logo">BuilderMind</div>
        <div className="nav-links">
          <a href="#how">Como funciona</a>
          <a href="#pricing">Preço</a>
          <button className="cta-button">Entrar no Mastermind</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge glass-card">Matchmaking Cirúrgico para Founders</span>
          <h1 className="premium-gradient">A cura para a solidão empreendedora.</h1>
          <p className="hero-description text-secondary">
            Masterminds curados por faturamento e accountability nativo para construtores operarem no seu máximo. Sem barulho, sem feeds. Apenas execução.
          </p>
          <div className="hero-actions">
            <button className="cta-button highlight-cta">
              Garantir meu lugar — R$ 29
            </button>
            <p className="subtext">Pagamento único. Setup fee de qualidade.</p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="problems-section glass-card" id="how">
        <div className="section-header">
          <h2>Por que o BuilderMind?</h2>
          <p>As redes sociais são feitas para barulho. Nós somos feitos para clareza.</p>
        </div>
        <div className="grid-container">
          <div className="feature-card">
            <Zap className="accent-icon" />
            <h3>Método Anti-WhatsApp</h3>
            <p>Grupos morrem sem pauta. Nós embutimos Hot Seats e Check-ins obrigatórios na interface.</p>
          </div>
          <div className="feature-card">
            <Target className="accent-icon" />
            <h3>Match por Receita (MRR)</h3>
            <p>Pare de falar com iniciantes. Esteja em grupos com pessoas no mesmo estágio de faturamento que você.</p>
          </div>
          <div className="feature-card">
            <Users className="accent-icon" />
            <h3>Elite da Execução</h3>
            <p>Filtramos curiosos com um paywall de entrada. Só entra quem tem skin in the game.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="cta-footer">
        <h2>Pronto para escalar com o seu grupo?</h2>
        <button className="cta-button highlight-cta flex items-center gap-2">
          Iniciar Onboarding <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}
