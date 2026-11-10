"use client";

import { useEffect, useState } from "react";

import { CameraGrid } from "@/components/CameraGrid";
import { ClipsSection } from "@/components/ClipsSection";
import { EventSection } from "@/components/EventSection";
import { Hero } from "@/components/Hero";
import { SocialsSection } from "@/components/SocialsSection";
import { TwitchPlayer } from "@/components/TwitchPlayer";
import { type EventData, getDefaultEventData } from "@/lib/event-data";
import { liveCameras } from "@/lib/streaming";

const emptyEventData = getDefaultEventData();

export default function Home() {
  const [eventData, setEventData] = useState<EventData>(emptyEventData);
  const [selectedCamera, setSelectedCamera] = useState("cam1");

  useEffect(() => {
    let mounted = true;
    void fetch("/api/event", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<EventData> : null)
      .then((payload) => { if (mounted && payload) setEventData(payload); })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const activeVote = eventData.votes[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b13] text-white">
      <Hero />
      <TwitchPlayer />

      <section id="live" aria-labelledby="live-heading" className="camera-stage mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Independent MediaMTX feeds</p>
            <h2 id="live-heading" className="font-display text-3xl font-black uppercase leading-none text-white sm:text-5xl">Live cameras</h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-white/55 sm:text-right">Three separate camera sources. Choose one secondary feed to play.</p>
        </div>
        <CameraGrid streams={liveCameras} selectedCamera={selectedCamera} onSelectCamera={setSelectedCamera} />
      </section>

      <section id="goals" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Challenges / goals</p><h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">Event progress</h2></div>
          <p className="max-w-md text-sm text-white/65">Event figures are entered by an administrator. External donation and Twitch metrics are not connected.</p>
        </div>
        {eventData.goals.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {eventData.goals.map((goal) => {
              const percent = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
              const displayValue = goal.unit === "€" ? `${goal.unit}${goal.current.toLocaleString()}` : `${goal.current.toLocaleString()}${goal.unit}`;
              return <article key={goal.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="mb-4 flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#ffcfb0]">{goal.status}</p><span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">{percent >= 100 ? "Reached" : "In progress"}</span></div>
                <h3 className="mb-4 text-lg font-semibold text-white">{goal.title}</h3>
                <div className="mb-2 flex items-end justify-between gap-3 text-sm"><span className="font-bold text-white">{displayValue}</span><span className="text-white/55">{goal.unit === "€" ? `${goal.unit}${goal.target.toLocaleString()}` : `${goal.target.toLocaleString()}${goal.unit}`}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb6a0] to-[#ffe5d7]" style={{ width: `${percent}%` }} /></div>
              </article>;
            })}
          </div>
        ) : <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-sm text-white/55">No event goals have been configured.</p>}
      </section>

      <section id="rankings" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Ranking</p><h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">Top supporters</h2></div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">Manually managed ranking</h3>
            {eventData.rankings.length ? <div className="space-y-4">{eventData.rankings.map((entry) => <div key={entry.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffb6a0] text-xs font-black text-[#111827]">{entry.badge}</span><span className="font-medium text-white">{entry.name}</span></div><span className="text-sm font-semibold text-[#ffe5d7]">{entry.amount}</span></div>)}</div> : <p className="text-sm text-white/55">No verified supporter ranking is available.</p>}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffcfb0]">Data source</h3><p className="text-sm leading-6 text-white/60">No donation provider is connected. Names or amounts shown here must be verified and approved before publication.</p></div>
        </div>
      </section>

      <section id="stats" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Statistics</p><h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">Community overview</h2><p className="mt-3 text-sm text-white/50">Manually entered values only; no live Twitch metrics are connected.</p></div>
        {eventData.stats.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{eventData.stats.map((stat) => <div key={stat.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/55">{stat.label}</p><div className="mt-4 flex items-end justify-between gap-3"><span className="text-2xl font-black text-white">{stat.value}</span><span className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffcfb0]">{stat.change}</span></div></div>)}</div> : <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-sm text-white/55">No verified event statistics are available.</p>}
      </section>

      <section id="interaction" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Community interaction</p><h2 className="font-display text-3xl font-black uppercase text-white sm:text-5xl">Polls</h2></div>
        {activeVote ? <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><p className="mb-2 text-sm text-white/50">Results only · voting is not enabled</p><p className="mb-6 text-xl font-semibold text-white">{activeVote.question}</p><div className="space-y-4">{activeVote.options.map((option) => { const total = activeVote.options.reduce((sum, item) => sum + item.votes, 0); const percentage = total ? Math.round((option.votes / total) * 100) : 0; return <div key={option.id} className="rounded-2xl border border-white/8 bg-black/20 p-4"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-white">{option.label}</span><span className="text-[#ffcfb0]">{percentage}%</span></div><div className="h-2 rounded-full bg-white/8"><div className="h-2 rounded-full bg-gradient-to-r from-[#ffb6a0] to-[#ffd9c9]" style={{ width: `${percentage}%` }} /></div></div>; })}</div></div> : <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-sm text-white/55">Polls are paused until a durable voting service and abuse controls are configured.</p>}
      </section>

      <EventSection />
      <ClipsSection />
      <SocialsSection />

      <footer className="relative z-10 border-t border-white/10 bg-[#080b13]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="font-display text-base font-black uppercase tracking-[0.18em] text-white">DanteFDD</p><p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-white/45">Independent live event experience</p></div><nav aria-label="Page sections" className="flex flex-wrap gap-x-5 gap-y-3">{[["Live", "#broadcast"], ["Cameras", "#live"], ["Event", "#about"], ["Clips", "#clips"], ["Socials", "#socials"]].map(([label, href]) => <a key={href} href={href} className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white">{label}</a>)}</nav><p className="text-[9px] uppercase tracking-[0.22em] text-white/35">Powered by TiiA</p></div></footer>
    </main>
  );
}
