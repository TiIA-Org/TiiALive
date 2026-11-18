
"use client";

import { useEffect, useState } from "react";

import { ClipsSection } from "@/components/ClipsSection";
import { EventSection } from "@/components/EventSection";
import { Hero } from "@/components/Hero";
import { SocialsSection } from "@/components/SocialsSection";
import { TwitchPlayer } from "@/components/TwitchPlayer";
import { TwitchChat } from "@/components/TwitchChat";

import {
  type EventData,
  getDefaultEventData,
} from "@/lib/event-data";

export default function Home() {
  const [eventData, setEventData] =
    useState<EventData>(getDefaultEventData());

  useEffect(() => {
    let mounted = true;

    async function loadEvent() {
      try {
        const response = await fetch("/api/event", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = (await response.json()) as EventData;

        if (mounted) setEventData(payload);
      } catch {
        // Keep default event data if the API is unavailable.
      }
    }

    void loadEvent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b13] text-white">
      <Hero />

      {/* OFFICIAL TWITCH BROADCAST */}
      <TwitchPlayer />

      {/* COMMUNITY EXPERIENCE */}
      <section
        id="community"
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20"
      >
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Broadcast community
          </p>

          <h2 className="font-display text-3xl font-black uppercase sm:text-5xl">
            Join the action
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
            Be part of the DanteFDD broadcast. Join the
            conversation and support the event.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* TWITCH CHAT */}
          <TwitchChat />

          {/* LEADERBOARD */}
          <section
            id="rankings"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c101b] p-5 sm:p-7"
          >
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffb6a0]">
                Community recognition
              </p>

              <h3 className="mt-2 text-2xl font-black uppercase">
                Top supporters
              </h3>

              <p className="mt-2 text-xs text-white/45">
                Event supporter leaderboard
              </p>
            </div>

            {eventData.rankings.length > 0 ? (
              <div className="space-y-3">
                {eventData.rankings.map((entry, index) => (
                  <article
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${
                          index === 0
                            ? "bg-[#ffb6a0] text-[#10121b]"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {entry.badge || index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {entry.name}
                        </p>
                        <p className="text-[9px] uppercase tracking-wider text-white/40">
                          Supporter
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-[#ffcfb0]">
                      {entry.amount}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-6 text-center">
                <p className="text-sm font-semibold text-white/70">
                  Supporter leaderboard
                </p>
                <p className="mt-2 text-xs text-white/40">
                  Supporters will be highlighted during the event.
                </p>
              </div>
            )}

            <p className="mt-5 text-[10px] leading-5 text-white/35">
              Rankings are managed and verified by the event
              administrator.
            </p>
          </section>
        </div>
      </section>

      {/* EVENT GOALS */}
      <section
        id="goals"
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16"
      >
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Challenges / goals
          </p>

          <h2 className="font-display text-3xl font-black uppercase sm:text-5xl">
            Event progress
          </h2>
        </div>

        {eventData.goals.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {eventData.goals.map((goal) => {
              const percent =
                goal.target > 0
                  ? Math.min(
                      100,
                      (goal.current / goal.target) * 100
                    )
                  : 0;

              const current =
                goal.unit === "€"
                  ? `€${goal.current.toLocaleString()}`
                  : `${goal.current.toLocaleString()}${goal.unit}`;

              const target =
                goal.unit === "€"
                  ? `€${goal.target.toLocaleString()}`
                  : `${goal.target.toLocaleString()}${goal.unit}`;

              return (
                <article
                  key={goal.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffcfb0]">
                      {goal.title}
                    </p>

                    <span className="text-[9px] uppercase text-white/45">
                      {percent >= 100 ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="mb-3 flex items-end justify-between">
                    <span className="text-2xl font-black">
                      {current}
                    </span>
                    <span className="text-sm text-white/45">
                      {target}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ffb6a0] to-[#ffe5d7]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/45">
            Event goals will be announced during the broadcast.
          </p>
        )}
      </section>

      <EventSection />

      <ClipsSection />

      <SocialsSection />

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#080b13]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-base font-black uppercase tracking-[0.18em] text-white">
              DanteFDD
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-white/45">
              GTA VI Broadcast Event
            </p>
          </div>

          <nav
            aria-label="Page sections"
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {[
              ["Live", "#broadcast"],
              ["Community", "#community"],
              ["Rankings", "#rankings"],
              ["Goals", "#goals"],
              ["Clips", "#clips"],
              ["Socials", "#socials"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
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
