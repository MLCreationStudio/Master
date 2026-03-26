import { useNavigate } from 'react-router-dom';
import './Manifesto.css';

export default function Manifesto() {
  const navigate = useNavigate();

  return (
    <div className="manifesto-page fade-in">
      <div className="manifesto-container">
        <header className="manifesto-header">
          <span className="manifesto-tag">DOCUMENTO DE DEFESA ESTRATÉGICA</span>
          <h1>Manifesto Lastro</h1>
          <p className="manifesto-subtitle">A Ciência Contra a Intuição no Go-To-Market</p>
        </header>

        <section className="manifesto-section">
          <h2>1. O Fim da Intuição Desgovernada</h2>
          <p>
            No Brasil, 80% das empresas morrem em 5 anos porque seus fundadores confundem "vontade de crescer" 
            com "lastro para crescer". O marketing intuitivo é o maior ralo de caixa do país. 
            O Lastro nasceu para ser o <strong>escudo matemático</strong> do empreendedor.
          </p>
        </section>

        <section className="manifesto-section highlight">
          <h2>2. O que é o LASTRO?</h2>
          <p>
            O Lastro não é uma ferramenta de marketing; é um <strong>framework de defesa financeira</strong>. 
            Ele valida se a sua estratégia de Go-To-Market (GTM) tem fundamento real ou se você está apenas 
            "sangrando caixa" tentando forçar um canal que não comporta o seu ticket médio.
          </p>
        </section>

        <section className="manifesto-section">
          <h2>3. Os Algoritmos de Inteligência</h2>
          <div className="algoritmo-grid">
            <div className="algoritmo-card">
              <h3>Lastro Score</h3>
              <p>Média ponderada baseada em 20 pilares de GTM, filtrados por 4 dimensões críticas: Viabilidade, ICP, Prazo e Mercado.</p>
            </div>
            <div className="algoritmo-card">
              <h3>ACSD</h3>
              <p>Ajuste de Contexto, Sazonalidade e Desvio. Cálculo automático de impostos (12.15% Meta) e benchmarks dinâmicos.</p>
            </div>
            <div className="algoritmo-card">
              <h3>LLM-Router</h3>
              <p>Orquestração multi-provedor (OpenAI, Anthropic, Gemini) que escolhe o modelo ideal para cada nível estratégico.</p>
            </div>
          </div>
        </section>

        <section className="manifesto-section">
          <h2>4. Gamificação do Crescimento</h2>
          <p>
            Transformamos a disciplina estratégica em progressão. No Lastro, você desbloqueia badges e evolui XP 
            conforme seu negócio ganha maturidade para escalar.
          </p>
        </section>

        <footer className="manifesto-footer">
          <blockquote>
            "Seus números não mentem. Sua intuição, sim."
          </blockquote>
          <button className="lastro-btn lastro-btn-primary" onClick={() => navigate('/diagnostico')}>
            Iniciar Diagnóstico Matemático
          </button>
        </footer>
      </div>
    </div>
  );
}
