"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ErpLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/erp/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível entrar.");
      router.push("/gestao");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar.");
      setSubmitting(false);
    }
  };

  return <main className="erp-login"><form onSubmit={submit}><p>J&apos;AIME · GESTÃO</p><h1>SEU ATELIER<br />DE OPERAÇÃO.</h1><span>Entre com o acesso da equipe para acompanhar pedidos, cozinha e cardápio.</span><label>E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label><label>Senha<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error ? <output role="alert">{error}</output> : null}<button disabled={submitting}>{submitting ? "ENTRANDO..." : "ENTRAR NO ERP"}</button></form></main>;
}

