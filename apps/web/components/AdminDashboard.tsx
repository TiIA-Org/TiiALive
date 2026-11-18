
"use client";

import { useState } from "react";

import type { EventData, EventGoal, EventRanking } from "@/lib/event-data";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080b13] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ffb6a0]";

const buttonClass =
  "rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AdminDashboard({
  initialData,
  initialVersion,
}: {
  initialData: EventData;
  initialVersion: number;
}) {
  const [eventData, setEventData] = useState<EventData>(initialData);
  const [savedData, setSavedData] = useState<EventData>(initialData);
  const [version, setVersion] = useState(initialVersion);
  const [status, setStatus] = useState(
    "Os valores são geridos manualmente. As métricas externas ainda não estão ligadas.",
  );
  const [saving, setSaving] = useState(false);

  const updateGoal = (id: string, changes: Partial<EventGoal>) => {
    setEventData((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === id ? { ...goal, ...changes } : goal,
      ),
    }));
  };

  const addGoal = () => {
    const goal: EventGoal = {
      id: createId(),
      title: "Nova meta",
      current: 0,
      target: 100,
      unit: "",
      status: "active",
    };

    setEventData((current) => ({
      ...current,
      goals: [...current.goals, goal],
    }));
    setStatus("Nova meta adicionada. Guarda as alterações para publicar.");
  };

  const removeGoal = (id: string) => {
    setEventData((current) => ({
      ...current,
      goals: current.goals.filter((goal) => goal.id !== id),
    }));
  };

  const updateRanking = (id: string, changes: Partial<EventRanking>) => {
    setEventData((current) => ({
      ...current,
      rankings: current.rankings.map((ranking) =>
        ranking.id === id ? { ...ranking, ...changes } : ranking,
      ),
    }));
  };

  const addRanking = () => {
    const ranking: EventRanking = {
      id: createId(),
      name: "Novo apoiador",
      amount: "0",
      badge: "Supporter",
    };

    setEventData((current) => ({
      ...current,
      rankings: [...current.rankings, ranking],
    }));
    setStatus("Novo apoiador adicionado. Guarda as alterações para publicar.");
  };

  const removeRanking = (id: string) => {
    setEventData((current) => ({
      ...current,
      rankings: current.rankings.filter((ranking) => ranking.id !== id),
    }));
  };

  const moveRanking = (id: string, direction: -1 | 1) => {
    setEventData((current) => {
      const rankings = [...current.rankings];
      const index = rankings.findIndex((item) => item.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= rankings.length) {
        return current;
      }

      [rankings[index], rankings[nextIndex]] = [
        rankings[nextIndex],
        rankings[index],
      ];

      return { ...current, rankings };
    });
  };

  const validateData = (): string | null => {
    for (const goal of eventData.goals) {
      if (!goal.title.trim()) return "Todas as metas precisam de um título.";
      if (!Number.isFinite(goal.current) || goal.current < 0) {
        return `Valor atual inválido na meta "${goal.title}".`;
      }
      if (!Number.isFinite(goal.target) || goal.target <= 0) {
        return `A meta "${goal.title}" precisa de um objetivo superior a zero.`;
      }
    }

    for (const ranking of eventData.rankings) {
      if (!ranking.name.trim()) return "Todos os apoiantes precisam de um nome.";
      if (!ranking.amount.trim()) return `Falta o valor de ${ranking.name}.`;
      if (!ranking.badge.trim()) return `Falta o badge de ${ranking.name}.`;
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateData();

    if (validationError) {
      setStatus(validationError);
      return;
    }

    setSaving(true);
    setStatus("A guardar alterações...");

    try {
      const response = await fetch("/api/event", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, eventData }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setStatus("Conflito de versões. Atualiza a página antes de guardar.");
        } else if (response.status === 401 || response.status === 403) {
          setStatus("Sessão inválida ou sem autorização. Volta a iniciar sessão.");
        } else {
          setStatus(`Erro ao guardar (HTTP ${response.status}). Verifica o Supabase.`);
        }
        return;
      }

      const result = (await response.json()) as {
        version: number;
        eventData: EventData;
      };

      setEventData(result.eventData);
      setSavedData(result.eventData);
      setVersion(result.version);
      setStatus("Alterações guardadas com sucesso.");
    } catch {
      setStatus("Não foi possível contactar o servidor. Verifica a ligação.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setEventData(savedData);
    setStatus("Alterações não guardadas descartadas.");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      window.location.assign(
        response.ok ? "/" : "/admin/login?error=authentication",
      );
    } catch {
      setStatus("Não foi possível terminar a sessão.");
    }
  };

  return (
    <main className="min-h-screen bg-[#080b13] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              DanteFDD Broadcast Event
            </p>
            <h1 className="font-display text-4xl font-black uppercase sm:text-6xl">
              {eventData.admin.title}
            </h1>
            <p className="mt-3 text-sm text-white/45">
              Event management · Version {version}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={buttonClass}
          >
            Sign out
          </button>
        </header>

        <section className="mb-8 rounded-2xl border border-white/10 bg-[#10131d] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold">Estado das alterações</p>
              <p role="status" aria-live="polite" className="mt-2 text-sm text-white/60">
                {status}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={saving}
                className={buttonClass}
              >
                Discard changes
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#ffb6a0] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#11131a] transition hover:bg-[#ffd1c2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </section>

        {/* EVENT GOALS */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffb6a0]">
                Event management
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase">
                Event goals
              </h2>
            </div>

            <button type="button" onClick={addGoal} className={buttonClass}>
              + Add goal
            </button>
          </div>

          <div className="space-y-4">
            {eventData.goals.map((goal) => (
              <article
                key={goal.id}
                className="rounded-2xl border border-white/10 bg-[#10131d] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/45">
                    Goal
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="text-xs font-bold text-rose-300 hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-bold text-white/65">
                    Title
                    <input
                      className={inputClass}
                      value={goal.title}
                      onChange={(e) =>
                        updateGoal(goal.id, { title: e.target.value })
                      }
                    />
                  </label>

                  <label className="text-xs font-bold text-white/65">
                    Current value
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      value={goal.current}
                      onChange={(e) =>
                        updateGoal(goal.id, { current: Number(e.target.value) })
                      }
                    />
                  </label>

                  <label className="text-xs font-bold text-white/65">
                    Target
                    <input
                      type="number"
                      min="1"
                      className={inputClass}
                      value={goal.target}
                      onChange={(e) =>
                        updateGoal(goal.id, { target: Number(e.target.value) })
                      }
                    />
                  </label>

                  <label className="text-xs font-bold text-white/65">
                    Unit
                    <input
                      className={inputClass}
                      placeholder="Subs, followers, €..."
                      value={goal.unit}
                      onChange={(e) =>
                        updateGoal(goal.id, { unit: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold text-white/65">
                    Status
                    <input
                      className={inputClass}
                      value={goal.status}
                      onChange={(e) =>
                        updateGoal(goal.id, { status: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-white/50">
                    <span>Progress preview</span>
                    <span>
                      {Math.round(
                        Math.min(100, (goal.current / Math.max(1, goal.target)) * 100),
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#ffb6a0] transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, (goal.current / Math.max(1, goal.target)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}

            {eventData.goals.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
                No event goals configured.
              </p>
            )}
          </div>
        </section>

        {/* LEADERBOARD */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffb6a0]">
                Community
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase">
                Supporter leaderboard
              </h2>
            </div>

            <button
              type="button"
              onClick={addRanking}
              className={buttonClass}
            >
              + Add supporter
            </button>
          </div>

          <div className="space-y-3">
            {eventData.rankings.map((ranking, index) => (
              <article
                key={ranking.id}
                className="rounded-2xl border border-white/10 bg-[#10131d] p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffb6a0]">
                    Position #{index + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveRanking(ranking.id, -1)}
                      disabled={index === 0}
                      aria-label="Move supporter up"
                      className={buttonClass}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRanking(ranking.id, 1)}
                      disabled={index === eventData.rankings.length - 1}
                      aria-label="Move supporter down"
                      className={buttonClass}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRanking(ranking.id)}
                      className="px-2 text-xs font-bold text-rose-300 hover:text-rose-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs font-bold text-white/65">
                    Supporter name
                    <input
                      className={inputClass}
                      value={ranking.name}
                      onChange={(e) =>
                        updateRanking(ranking.id, { name: e.target.value })
                      }
                    />
                  </label>

                  <label className="text-xs font-bold text-white/65">
                    Contribution
                    <input
                      className={inputClass}
                      value={ranking.amount}
                      placeholder="€100"
                      onChange={(e) =>
                        updateRanking(ranking.id, { amount: e.target.value })
                      }
                    />
                  </label>

                  <label className="text-xs font-bold text-white/65">
                    Badge
                    <input
                      className={inputClass}
                      value={ranking.badge}
                      placeholder="Top Supporter"
                      onChange={(e) =>
                        updateRanking(ranking.id, { badge: e.target.value })
                      }
                    />
                  </label>
                </div>
              </article>
            ))}

            {eventData.rankings.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
                No supporters in the leaderboard yet.
              </p>
            )}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs text-white/35">
          DanteFDD Broadcast Event · Private administration panel
        </footer>
      </div>
    </main>
  );
}
