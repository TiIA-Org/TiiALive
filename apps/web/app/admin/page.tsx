"use client";

import { type FormEvent, useEffect, useState } from "react";

import { type EventData, getDefaultEventData } from "@/lib/event-data";

const defaultEventData = getDefaultEventData();

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [eventData, setEventData] = useState<EventData>(defaultEventData);
  const [status, setStatus] = useState("A carregar...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/event", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("not ready");
        }
        const payload = (await response.json()) as EventData;
        setEventData(payload);
        setIsAuthenticated(true);
        setStatus("Painel ativo");
      } catch {
        setIsAuthenticated(false);
        setStatus("Login necessário");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Autenticando...");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setStatus("Credenciais inválidas");
      setIsAuthenticated(false);
      return;
    }

    const payload = (await fetch("/api/event", { cache: "no-store" }).then((res) => res.json())) as EventData;
    setEventData(payload);
    setIsAuthenticated(true);
    setStatus("Painel ativo");
  };

  const handleSave = async () => {
    setStatus("A guardar...");

    const response = await fetch("/api/event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      setStatus("Sem autorização. Faça login novamente.");
      setIsAuthenticated(false);
      return;
    }

    const payload = (await response.json()) as EventData;
    setEventData(payload);
    setStatus("Dados guardados com sucesso");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPassword("");
    setStatus("Sessão terminada");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#080b13] p-10 text-white">A carregar painel...</div>;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b13] px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 p-8 shadow-2xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Admin
          </p>
          <h1 className="font-display text-4xl font-black uppercase text-white">Login</h1>
          <p className="mt-4 text-sm text-white/60">Introduz a palavra-passe para gerir desafios, metas e estatísticas.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block text-sm text-white/80">
              Palavra-passe
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-[#ffb6a0]"
                placeholder="Senha de admin"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-[#ffb6a0] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0d1117]"
            >
              Entrar
            </button>
          </form>

          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[#ffcfb0]">{status}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080b13] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              Painel de controlo
            </p>
            <h1 className="font-display text-4xl font-black uppercase text-white sm:text-6xl">
              {eventData.admin.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-emerald-300">
              Online
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white/80 hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/3 p-4 text-sm text-white/70">
          <p>{status}</p>
        </div>

        <textarea
          value={JSON.stringify(eventData, null, 2)}
          onChange={(event) => {
            try {
              const next = JSON.parse(event.target.value) as EventData;
              setEventData(next);
            } catch {
              // keep the raw JSON in the editor until it becomes valid
            }
          }}
          className="min-h-[420px] w-full rounded-3xl border border-white/10 bg-[#0d1117] p-6 font-mono text-sm text-[#e5e7eb] outline-none focus:border-[#ffb6a0]"
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#ffb6a0] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0d1117]"
          >
            Guardar alterações
          </button>
          <button
            type="button"
            onClick={() => setEventData(getDefaultEventData())}
            className="rounded-full border border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/80"
          >
            Repor dados
          </button>
        </div>
      </div>
    </main>
  );
}
