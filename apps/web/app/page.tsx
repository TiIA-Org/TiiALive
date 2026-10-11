"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ClipsSection } from "@/components/ClipsSection";
import { CameraGrid } from "@/components/CameraGrid";
import { EventSection } from "@/components/EventSection";
import { Hero } from "@/components/Hero";
import { SocialsSection } from "@/components/SocialsSection";
import { streamerConfig } from "@/lib/config";
import { type EventData, getDefaultEventData } from "@/lib/event-data";
import { liveCameras } from "@/lib/streaming";

const defaultEventData = getDefaultEventData();

export default function Home() {
  const router = useRouter();
  const [multiview, setMultiview] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState("cam1");
  const [eventData, setEventData] = useState<EventData>(defaultEventData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const response = await fetch("/api/event", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not fetch event data");
        }

        const payload = (await response.json()) as EventData;
        setEventData(payload);
      } catch {
        setEventData(defaultEventData);
      } finally {
        setIsLoading(false);
      }
    };

    void loadEventData();
  }, []);

  const goalCards = eventData.goals ?? defaultEventData.goals;
  const rankings = eventData.rankings ?? defaultEventData.rankings;
  const stats = eventData.stats ?? defaultEventData.stats;
  const votes = eventData.votes ?? defaultEventData.votes;
  const activeVote = votes[0] ?? defaultEventData.votes[0];

  const adminActions = [
    "Criar/editar desafios",
    "Alterar metas",
    "Atualizar informações",
    "Ver estatísticas",
    "Controlar elementos do site",
  ];

  const openAdminPanel = () => {
    router.push("/admin");
  };

  if (isLoading) {
    return <main className="min-h-screen bg-[#080b13] px-5 py-10 text-white">A carregar dados do evento...</main>;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b13] text-white">
      <Hero />

      <section
        id="live"
        aria-labelledby="live-heading"
        className="camera-stage relative z-10 mx-auto -mt-16 max-w-7xl px-5 pb-24 sm:-mt-20 sm:px-8 sm:pb-32"
      >
        <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              Broadcast / Vice City
            </p>
            <h2
              id="live-heading"
              className="font-display text-3xl font-black uppercase leading-none text-white sm:text-5xl"
            >
              Live cameras
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1">
              <button
                type="button"
                onClick={() => setMultiview(true)}
                className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition ${multiview ? "bg-[#ffb6a0] text-[#0b0f17]" : "text-white/70 hover:text-white"}`}
              >
                All feeds
              </button>
              <button
                type="button"
                onClick={() => setMultiview(false)}
                className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition ${!multiview ? "bg-[#ffb6a0] text-[#0b0f17]" : "text-white/70 hover:text-white"}`}
              >
                Focus
              </button>
            </div>
            <p className="max-w-sm text-xs leading-5 text-white/60 sm:text-right">
              Three angles. One continuous broadcast.
            </p>
          </div>
        </div>

        <CameraGrid
          streams={liveCameras}
          selectedCamera={selectedCamera}
          multiview={multiview}
          onSelectCamera={(cameraId) => setSelectedCamera(cameraId)}
        />
      </section>

      <section id="goals" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              Desafios / metas
            </p>
            <h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">
              Progresso do evento
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/65">
            Cada meta alcançada pode desbloquear automaticamente um novo desafio e manter a comunidade ativa.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goalCards.map((goal) => {
            const percent = Math.min(100, (goal.current / goal.target) * 100);
            const displayValue = goal.unit === "€" ? `${goal.unit}${goal.current.toLocaleString()}` : `${goal.current.toLocaleString()}${goal.unit}`;

            return (
              <article key={goal.title} className="rounded-2xl border border-white/10 bg-white/3 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#ffcfb0]">
                    {goal.status}
                  </p>
                  <span className="rounded-full border border-[#ffb6a0]/30 bg-[#ffb6a0]/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ffcfb0]">
                    {percent >= 100 ? "Unlocked" : "Active"}
                  </span>
                </div>

                <h3 className="mb-4 text-lg font-semibold text-white">{goal.title}</h3>

                <div className="mb-2 flex items-end justify-between gap-3 text-sm">
                  <span className="font-bold text-white">{displayValue}</span>
                  <span className="text-white/55">
                    {goal.unit === "€" ? `${goal.unit}${goal.target.toLocaleString()}` : `${goal.target.toLocaleString()}${goal.unit}`}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffb6a0] via-[#ffcfb0] to-[#ffe5d7]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="rankings" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              Ranking
            </p>
            <h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">
              Top supporters
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/65">
            Ranking diário, geral do evento e contribuições dos apoiadores mais ativos.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">
              Donativos
            </h3>
            <div className="space-y-4">
              {rankings.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffb6a0] text-xs font-black text-[#111827]">
                      {entry.badge}
                    </span>
                    <span className="font-medium text-white">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#ffe5d7]">{entry.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">
              Eventos ativos
            </h3>
            <div className="space-y-4 text-sm text-white/70">
              <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffcfb0]">
                  Ranking diário
                </p>
                <p>Top 10 das doações da última 24h.</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffcfb0]">
                  Ranking geral
                </p>
                <p>Acumulado com todas as sessões do evento.</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffcfb0]">
                  Desafios desbloqueados
                </p>
                <p>11 / 18 objetivos concluídos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Estatísticas
          </p>
          <h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Visão geral da comunidade
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/55">{stat.label}</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffcfb0]">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="interaction" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Interação
          </p>
          <h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Votações da comunidade
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
          <p className="mb-6 text-xl font-semibold text-white">{activeVote.question}</p>
          <div className="space-y-4">
            {activeVote.options.map((option) => {
              const totalVotes = activeVote.options.reduce((sum, item) => sum + item.votes, 0) || 1;
              const percentage = Math.round((option.votes / totalVotes) * 100);

              return (
                <div key={option.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-white">{option.label}</span>
                    <span className="text-[#ffcfb0]">{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#ffb6a0] to-[#ffd9c9]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="control-panel" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              Painel de controlo
            </p>
            <h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">
              Administração privada
            </h2>
          </div>
          <button
            type="button"
            onClick={openAdminPanel}
            className="inline-flex items-center justify-center rounded-full border border-[#ffb6a0]/60 bg-[#ffb6a0]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ffe5d7] transition hover:bg-[#ffb6a0]/20"
          >
            Abrir painel
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-[#0d1018] p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">
                Ferramentas
              </h3>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Admin online
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {adminActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={openAdminPanel}
                  className="rounded-2xl border border-white/10 bg-white/3 p-4 text-left text-sm font-medium text-white/80 transition hover:border-[#ffb6a0]/50 hover:text-white"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">
              Resumo
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>• {goalCards.length} desafios ativos</li>
              <li>• {stats.length} métricas em tempo real</li>
              <li>• {rankings.length} rankings registados</li>
              <li>• {votes.length} votações disponíveis</li>
            </ul>
          </div>
        </div>
      </section>

      <EventSection />
      <ClipsSection />
      <SocialsSection />

      <footer className="relative z-10 border-t border-white/10 bg-[#080b13]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-base font-black uppercase tracking-[0.18em] text-white">
              {streamerConfig.name}
            </p>
            <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-white/45">
              Independent live event experience
            </p>
          </div>
          <nav aria-label="Page sections" className="flex flex-wrap gap-x-5 gap-y-3">
            {[
              ["Live", "#live"],
              ["Event", "#about"],
              ["Clips", "#clips"],
              ["Socials", "#socials"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]"
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
            Powered by TiiA
          </p>
        </div>
      </footer>
    </main>
  );
}
