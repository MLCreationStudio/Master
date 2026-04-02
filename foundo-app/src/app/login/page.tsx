"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "../page.module.css";
import loginStyles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admissao`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Link de login enviado! Verifique seu e-mail." });
    }
    setLoading(false);
  };

  return (
    <div className={styles.landing}>
      <div className="container container-narrow">
        <div className={loginStyles.loginBox}>
          <div className={styles.logo} style={{ marginBottom: "var(--space-xl)", textAlign: "center" }}>
            found<span className={styles.logoAccent}>o</span>
          </div>

          <h1 className={styles.heroTitle} style={{ fontSize: "var(--font-size-2xl)", textAlign: "center" }}>
            Bem-vindo de volta
          </h1>
          <p className={styles.heroSubtitle} style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            Entre com seu e-mail para continuar sua jornada no Foundo.
          </p>

          <form className={loginStyles.loginForm} onSubmit={handleLogin}>
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

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              id="login-submit"
            >
              {loading ? "Enviando acesso..." : "Entrar no Foundo →"}
            </button>
          </form>

          {message && (
            <div className={`${loginStyles.message} ${loginStyles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div style={{ marginTop: "var(--space-xl)", textAlign: "center" }}>
            <Link href="/" className="btn btn-ghost btn-sm">
              ← Voltar para a Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
