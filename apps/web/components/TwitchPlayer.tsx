"use client";

import { useEffect, useState } from "react";

import { streamerConfig } from "@/lib/config";
import { buildTwitchPlayerUrl, getApprovedTwitchParent } from "@/lib/twitch-embed";

type TwitchPlayerProps = {
  autoplay?: boolean;
};

type ParentHostResponse = {
  parentHostnames?: unknown;
};

export function TwitchPlayer({ autoplay = false }: TwitchPlayerProps) {
  const [parentHostname, setParentHostname] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("The Twitch player is unavailable.");
  const channel = streamerConfig.twitchChannel;

  useEffect(() => {
    const controller = new AbortController();

    const loadApprovedParent = async () => {
      try {
        const response = await fetch("/api/twitch-parent", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load approved Twitch domains.");

        const payload = (await response.json()) as ParentHostResponse;
        const approvedHostnames = Array.isArray(payload.parentHostnames)
          ? payload.parentHostnames.filter((hostname): hostname is string => typeof hostname === "string")
          : [];
        const approvedParent = getApprovedTwitchParent(window.location.hostname, approvedHostnames);

        if (!approvedParent) {
          throw new Error("This hostname is not approved for the Twitch player.");
        }

        setParentHostname(approvedParent);
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage(error instanceof Error ? error.message : "The Twitch player is unavailable.");
        setStatus("error");
      }
    };

    void loadApprovedParent();
    return () => controller.abort();
  }, []);

  const playerUrl = parentHostname
    ? buildTwitchPlayerUrl(channel, parentHostname, autoplay)
    : null;

  return (
    <section id="broadcast" aria-labelledby="broadcast-heading" className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Main broadcast</p>
          <h2 id="broadcast-heading" className="font-display text-3xl font-black uppercase text-white sm:text-5xl">DanteFDD on Twitch</h2>
        </div>
        <a href={`https://www.twitch.tv/${encodeURIComponent(channel)}`} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffcfb0] underline decoration-[#ffb6a0]/50 underline-offset-4">Open channel ↗</a>
      </div>
      <div
        aria-label="DanteFDD Twitch player container"
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
      >
        {playerUrl && status !== "error" ? (
          <iframe
            src={playerUrl}
            title={`${channel} Twitch live player`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            onLoad={() => setStatus("ready")}
            onError={() => {
              setErrorMessage("The Twitch player could not be loaded.");
              setStatus("error");
            }}
          />
        ) : (
          <div
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/65"
          >
            {status === "error" ? errorMessage : "Preparing the Twitch player…"}
            {status === "error" && (
              <a
                href={`https://www.twitch.tv/${encodeURIComponent(channel)}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#ffcfb0] underline underline-offset-4"
              >
                Open the official channel
              </a>
            )}
          </div>
        )}
        {status === "loading" && playerUrl && (
          <div role="status" aria-live="polite" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white/80">
            Loading Twitch player…
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-white/45">
        If playback is unavailable here, <a href={`https://www.twitch.tv/${encodeURIComponent(channel)}`} target="_blank" rel="noreferrer" className="text-[#ffcfb0] underline underline-offset-4">watch the official channel on Twitch</a>.
      </p>
    </section>
  );
}
