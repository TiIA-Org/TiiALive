
"use client";

import { useEffect, useState } from "react";
import { streamerConfig } from "@/lib/config";

export function TwitchChat() {
  const [chatUrl, setChatUrl] = useState("");

  useEffect(() => {
    const hostname = window.location.hostname;
    const channel = streamerConfig.twitchChannel;

    const params = new URLSearchParams();
    params.set("parent", hostname);
    params.set("darkpopout", "");

    setChatUrl(
      `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?${params.toString()}`
    );
  }, []);

  return (
    <section
      aria-label="Twitch live chat"
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c101b]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffb6a0]">
            Community
          </p>
          <h3 className="mt-1 text-lg font-black uppercase text-white">
            Live chat
          </h3>
        </div>
        <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/60">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Twitch chat
        </span>
      </div>

      {chatUrl ? (
        <iframe
          src={chatUrl}
          title="DanteFDD Twitch Chat"
          className="h-[480px] w-full border-0"
          allow="clipboard-write"
        />
      ) : (
        <div className="flex h-[480px] items-center justify-center text-sm text-white/50">
          Loading community chat...
        </div>
      )}
    </section>
  );
}
