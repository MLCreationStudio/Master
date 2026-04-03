"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";
import loginStyles from "./login.module.css";

import { signInWithEmailPassword, signUpWithEmailPassword } from "@/lib/supabase/actions";
import { ArrowLeft, ArrowRight } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      let result;
      if (isSignUp) {
        result = await signUpWithEmailPassword(formData);
      } else {
        result = await signInWithEmailPassword(formData);
      }

      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result?.redirectTo) {
        // Handle successful auth & redirect
        if (isSignUp) {
          setMessage({ type: "success", text: "Conta validada com sucesso! Redirecionando..." });
        }
        router.push(result.redirectTo);
      }
    } catch (err: unknown) {
      const error = err as Error;
      // Filter out Next.js internal redirect errors just in case
      if (error.message !== "NEXT_REDIRECT") {
        setMessage({ type: "error", text: error.message || "Erro na autenticação" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.landing} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-pulse text-tertiary">Carregando acesso...</div>
      </div>
    );
  }

  return (
    <div className={styles.landing}>
      <div className="container container-narrow">
        <div className={loginStyles.loginBox}>
          <div className={styles.logo} style={{ marginBottom: "var(--space-xl)", textAlign: "center" }}>
            clip
          </div>

          <h1 className={styles.heroTitle} style={{ fontSize: "var(--font-size-2xl)", textAlign: "center" }}>
            {isSignUp ? "Criar sua conta" : "Bem-vindo de volta"}
          </h1>
          <p className={styles.heroSubtitle} style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            {isSignUp ? "Escolha uma senha para começar sua jornada." : "Entre com seus dados para continuar no Clip."}
          </p>

          <form className={loginStyles.loginForm} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Seu melhor e-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                id="login-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (isSignUp ? "Criando..." : "Entrando...") : (isSignUp ? <>Criar minha conta <ArrowRight size={18} /></> : <>Entrar no Clip <ArrowRight size={18} /></>)}
            </button>
          </form>

          <div style={{ marginTop: "var(--space-lg)", textAlign: "center" }}>
             <button 
                className="text-accent hover:underline text-sm font-medium"
                onClick={() => setIsSignUp(!isSignUp)}
                type="button"
             >
                {isSignUp ? "Já tenho conta? Entrar" : "Ainda não tem conta? Criar agora"}
             </button>
          </div>

          {message && (
            <div className={`${loginStyles.message} ${loginStyles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div style={{ marginTop: "var(--space-xl)", textAlign: "center" }}>
            <Link href="/" className="btn btn-ghost btn-sm">
              <ArrowLeft size={16} /> Voltar para a Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.landing} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-pulse text-tertiary">Preparando...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
