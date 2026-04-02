"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./admissao.module.css";
import type {
  ProjectStage,
  ExpertiseArea,
  DedicationType,
  HorizonType,
  FinancialExpectation,
  AdmissionFormData,
} from "@/lib/types";
import { submitAdmission } from "@/lib/supabase/actions";

const STAGES: { value: ProjectStage; label: string }[] = [
  { value: "exploration", label: "Exploração — validando ideia" },
  { value: "building", label: "Construção — desenvolvendo MVP" },
  { value: "traction", label: "Tração — primeiros usuários" },
  { value: "expansion", label: "Expansão — escalando" },
];

const EXPERTISE: { value: ExpertiseArea; label: string }[] = [
  { value: "engineering", label: "Engenharia" },
  { value: "design", label: "Design" },
  { value: "growth", label: "Growth" },
  { value: "sales", label: "Vendas" },
  { value: "data-ai", label: "Dados / IA" },
  { value: "operations-finance", label: "Operações / Finanças" },
];

const DEDICATION: { value: DedicationType; label: string }[] = [
  { value: "full-time", label: "Integral" },
  { value: "part-time-transition", label: "Meio período com transição" },
  { value: "gradual", label: "Gradual conforme tração" },
];

const HORIZON: { value: HorizonType; label: string }[] = [
  { value: "1-3-months", label: "1 a 3 meses" },
  { value: "3-6-months", label: "3 a 6 meses" },
  { value: "no-deadline", label: "Sem prazo definido" },
];

const FINANCIAL: { value: FinancialExpectation; label: string }[] = [
  { value: "equity-only", label: "Equity puro" },
  { value: "equity-pro-labore", label: "Equity + pró-labore simbólico" },
  { value: "equity-market", label: "Equity + remuneração de mercado" },
  { value: "defining", label: "Ainda definindo" },
];

const CITIES = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre",
  "Brasília", "Salvador", "Recife", "Fortaleza", "Florianópolis", "Campinas",
  "Goiânia", "Manaus", "Belém", "Vitória", "Natal", "João Pessoa", "Outra",
];

const TOTAL_STEPS = 6;

export default function AdmissaoPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Partial<AdmissionFormData>>({
    expertise_areas: [],
    avatar_url: "", // Defaulting for simple MVP
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  function updateField<K extends keyof AdmissionFormData>(
    key: K,
    value: AdmissionFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const toggleExpertise = (area: ExpertiseArea) => {
    const current = form.expertise_areas || [];
    if (current.includes(area)) {
      updateField("expertise_areas", current.filter((a) => a !== area));
    } else {
      updateField("expertise_areas", [...current, area]);
    }
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return !!form.role;
      case 2: return !!form.project_name && !!form.problem_statement && !!form.stage;
      case 3: return (form.expertise_areas?.length || 0) > 0 && !!form.dedication && !!form.horizon && !!form.financial_expectation;
      case 4: return !!form.contribution_summary;
      case 5: return !!form.name && (!!form.linkedin_url || !!form.github_url) && !!form.city;
      default: return true;
    }
  };

    const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitAdmission(form as AdmissionFormData) as { error?: string; success?: boolean };
      
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        setSubmitted(true);
        setStep(6);
      }
    } catch (err: unknown) {
      console.error("Error submitting admission:", err);
      const message = err instanceof Error ? err.message : "Ocorreu um erro ao enviar sua admissão.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step === 5) {
      handleSubmit();
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  if (!mounted) {
    return (
      <div className={styles.admissao} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-pulse text-tertiary">Carregando formulário...</div>
      </div>
    );
  }

  return (
    <div className={styles.admissao}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              found<span className={styles.logoAccent}>o</span>
            </Link>
            {step <= 5 && (
              <span className={styles.stepInfo}>
                Etapa {step} de 5
              </span>
            )}
          </div>
          {step <= 5 && (
            <div className={styles.stepperBar}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.stepperSegment} ${
                    i + 1 === step ? styles.active : ""
                  } ${i + 1 < step ? styles.completed : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container container-narrow">
        <div className={styles.content}>
          {/* ── Step 1: Identity ─────────────────────────────── */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>Quem é você?</h2>
              <p className={styles.stepSubtitle}>
                Uma pergunta, duas opções. Sem caminho do meio.
              </p>

              <div className={styles.roleGrid}>
                <div
                  className={`${styles.roleCard} ${form.role === "founder" ? styles.selected : ""}`}
                  onClick={() => updateField("role", "founder")}
                  id="role-founder"
                >
                  <div className={styles.roleIcon}>🚀</div>
                  <h3 className={styles.roleTitle}>Founder</h3>
                  <p className={styles.roleDesc}>
                    Tenho visão de negócio e preciso de um parceiro técnico para construir
                  </p>
                </div>

                <div
                  className={`${styles.roleCard} ${form.role === "builder" ? styles.selected : ""}`}
                  onClick={() => updateField("role", "builder")}
                  id="role-builder"
                >
                  <div className={styles.roleIcon}>⚡</div>
                  <h3 className={styles.roleTitle}>Construtor técnico</h3>
                  <p className={styles.roleDesc}>
                    Tenho capacidade técnica e quero um parceiro com visão de negócio
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Project ──────────────────────────────── */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>Seu projeto</h2>
              <p className={styles.stepSubtitle}>
                O que você está construindo ou pretende construir?
              </p>

              <div className={styles.formGroup}>
                <label className="input-label">Nome do projeto</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Foundo"
                  maxLength={40}
                  value={form.project_name || ""}
                  onChange={(e) => updateField("project_name", e.target.value)}
                  id="project-name"
                />
                <span className="input-hint">{(form.project_name || "").length}/40 caracteres</span>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">
                  Problema que resolve — em uma frase
                </label>
                <textarea
                  className="input textarea"
                  placeholder="Ex: Founders não encontram co-founders técnicos de confiança no Brasil"
                  value={form.problem_statement || ""}
                  onChange={(e) => updateField("problem_statement", e.target.value)}
                  id="problem-statement"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">Estágio atual</label>
                <div className={styles.optionGrid}>
                  {STAGES.map((s) => (
                    <div
                      key={s.value}
                      className={`${styles.optionCard} ${form.stage === s.value ? styles.selected : ""}`}
                      onClick={() => updateField("stage", s.value)}
                    >
                      <div className={styles.optionRadio} />
                      <span className={styles.optionLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">
                  Evidência do estágio <span className="text-muted">(opcional)</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: 200 usuários beta, R$15k MRR, protótipo funcional..."
                  value={form.evidence || ""}
                  onChange={(e) => updateField("evidence", e.target.value)}
                  id="project-evidence"
                />
              </div>
            </div>
          )}

          {/* ── Step 3: What You Seek ────────────────────────── */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>O que você busca</h2>
              <p className={styles.stepSubtitle}>
                Que tipo de parceiro tornaria seu projeto viável?
              </p>

              <div className={styles.formGroup}>
                <label className="input-label">Expertise desejada</label>
                <div className={styles.chipGrid}>
                  {EXPERTISE.map((e) => (
                    <div
                      key={e.value}
                      className={`${styles.chip} ${(form.expertise_areas || []).includes(e.value) ? styles.selected : ""}`}
                      onClick={() => toggleExpertise(e.value)}
                    >
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">Dedicação esperada</label>
                <div className={styles.optionGrid}>
                  {DEDICATION.map((d) => (
                    <div
                      key={d.value}
                      className={`${styles.optionCard} ${form.dedication === d.value ? styles.selected : ""}`}
                      onClick={() => updateField("dedication", d.value)}
                    >
                      <div className={styles.optionRadio} />
                      <span className={styles.optionLabel}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">Horizonte de busca</label>
                <div className={styles.optionGrid}>
                  {HORIZON.map((h) => (
                    <div
                      key={h.value}
                      className={`${styles.optionCard} ${form.horizon === h.value ? styles.selected : ""}`}
                      onClick={() => updateField("horizon", h.value)}
                    >
                      <div className={styles.optionRadio} />
                      <span className={styles.optionLabel}>{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">Expectativa financeira</label>
                <div className={styles.optionGrid}>
                  {FINANCIAL.map((f) => (
                    <div
                      key={f.value}
                      className={`${styles.optionCard} ${form.financial_expectation === f.value ? styles.selected : ""}`}
                      onClick={() => updateField("financial_expectation", f.value)}
                    >
                      <div className={styles.optionRadio} />
                      <span className={styles.optionLabel}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: What You Offer ───────────────────────── */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>O que você oferece</h2>
              <p className={styles.stepSubtitle}>
                Convença o outro lado de que vale a pena construir com você.
              </p>

              <div className={styles.formGroup}>
                <label className="input-label">Sua contribuição principal</label>
                <textarea
                  className="input textarea"
                  placeholder="Ex: 8 anos de experiência em React/Node, já construí 3 SaaS do zero ao primeiro R$100k MRR"
                  value={form.contribution_summary || ""}
                  onChange={(e) => updateField("contribution_summary", e.target.value)}
                  id="contribution-summary"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">
                  Prova de trabalho <span className="text-muted">(opcional)</span>
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="URL: repositório, protótipo, artigo, produto..."
                  value={form.proof_of_work_url || ""}
                  onChange={(e) => updateField("proof_of_work_url", e.target.value)}
                  id="proof-of-work"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">
                  Referência no ecossistema <span className="text-muted">(opcional — mas tem peso)</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Nome de uma pessoa que possa validar você"
                  value={form.reference_name || ""}
                  onChange={(e) => updateField("reference_name", e.target.value)}
                  id="reference-name"
                />
              </div>
            </div>
          )}

          {/* ── Step 5: Verification ─────────────────────────── */}
          {step === 5 && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>Verificação</h2>
              <p className={styles.stepSubtitle}>
                Nome real, foto real, perfil verificável. Sem essa, não entra.
              </p>

              <div className={styles.formGroup}>
                <label className="input-label">Nome completo</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Seu nome real"
                  value={form.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  id="full-name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label">Cidade</label>
                <select
                  className="input"
                  value={form.city || ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  id="city-select"
                >
                  <option value="">Selecione sua cidade</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className="input-label">LinkedIn</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="linkedin.com/in/..."
                    value={form.linkedin_url || ""}
                    onChange={(e) => updateField("linkedin_url", e.target.value)}
                    id="linkedin-url"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className="input-label">GitHub</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="github.com/..."
                    value={form.github_url || ""}
                    onChange={(e) => updateField("github_url", e.target.value)}
                    id="github-url"
                  />
                </div>
              </div>
              <span className="input-hint">
                LinkedIn ou GitHub — pelo menos um é obrigatório.
              </span>

              {submitError && (
                <div className="input-error-msg" style={{ marginTop: "var(--space-md)" }}>
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* ── Step 6: Waiting ──────────────────────────────── */}
          {step === 6 && submitted && (
            <div className={`${styles.waitingScreen} animate-fade-in-up`}>
              <div className={styles.waitingIcon}>🔥</div>
              <h2 className={styles.waitingTitle}>Sua admissão foi enviada</h2>
              <p className={styles.waitingDesc}>
                Cada perfil é revisado pessoalmente. Você receberá um retorno
                por email em até 48 horas.
              </p>

              <div className={styles.waitingSteps}>
                <div className={styles.waitingStep}>
                  <div className={styles.waitingStepIcon}>✓</div>
                  <span>Perfil enviado com sucesso</span>
                </div>
                <div className={styles.waitingStep}>
                  <div className={styles.waitingStepIcon}>⏳</div>
                  <span>Revisão manual em até 48h</span>
                </div>
                <div className={styles.waitingStep}>
                  <div className={styles.waitingStepIcon}>📧</div>
                  <span>Resultado enviado por email</span>
                </div>
              </div>

              <div style={{ marginTop: "var(--space-2xl)" }}>
                <Link href="/" className="btn btn-secondary">
                  Voltar para Home
                </Link>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ───────────────────────────── */}
          {step <= 5 && (
            <div className={styles.navButtons}>
              {step > 1 ? (
                <button
                  className="btn btn-ghost"
                  onClick={back}
                  id="btn-back"
                  disabled={isSubmitting}
                >
                  ← Voltar
                </button>
              ) : (
                <div />
              )}
              <button
                className="btn btn-primary"
                onClick={next}
                disabled={!canAdvance() || isSubmitting}
                id="btn-next"
              >
                {isSubmitting ? "Enviando..." : step === 5 ? "Enviar admissão" : "Continuar →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
