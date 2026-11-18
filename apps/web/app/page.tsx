
"use client";

import { Hero } from "@/components/Hero";
import { TwitchPlayer } from "@/components/TwitchPlayer";
import { TwitchChat } from "@/components/TwitchChat";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b13] text-white">
      {/* HERO */}
      <Hero />

      {/* OFFICIAL TWITCH BROADCAST */}
      <TwitchPlayer />

      {/* TWITCH COMMUNITY CHAT */}
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
            Be part of the DanteFDD broadcast.
            Join the conversation live on Twitch.
          </p>
        </div>

        <TwitchChat />
      </section>

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
            <a
              href="#broadcast"
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
            >
              Live
            </a>

            <a
              href="#community"
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
            >
              Community
            </a>

            <a
              href="https://www.twitch.tv/dantefdd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
            >
              Twitch
            </a>
          </nav>

          <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
            Powered by TiiA
          </p>
        </div>
      </footer>
    </main>
  );
}
