"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

import type { StreamStatus } from "@/lib/config";
import { StreamStatus as StreamStatusBadge } from "@/components/StreamStatus";

type VideoPlayerProps = { src: string; title: string; className?: string };

export function VideoPlayer({ src, title, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<StreamStatus>(src ? "connecting" : "offline");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let networkRecoveries = 0;
    let mediaRecoveries = 0;
    let hls: Hls | null = null;

    video.removeAttribute("src");
    video.load();
    if (!src) return;

    const onPlaying = () => { if (!disposed) setStatus("live"); };
    const onError = () => { if (!disposed) setStatus("error"); };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    const offlineTimer = window.setTimeout(() => {
      if (!disposed && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) setStatus("offline");
    }, 15000);

    if (src.includes(".m3u8") && Hls.isSupported()) {
      hls = new Hls({ liveSyncDurationCount: 3, backBufferLength: 30, maxLiveSyncPlaybackRate: 1.2 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal || disposed || !hls) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRecoveries < 2) {
          networkRecoveries += 1;
          setStatus("connecting");
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveries < 1) {
          mediaRecoveries += 1;
          setStatus("connecting");
          hls.recoverMediaError();
        } else {
          setStatus("error");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.setAttribute("src", src);
      video.load();
    } else {
      setStatus("error");
    }

    return () => {
      disposed = true;
      window.clearTimeout(offlineTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, retryKey]);

  const retry = () => {
    setStatus("connecting");
    setRetryKey((value) => value + 1);
  };

  return (
    <div className={`group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-zinc-950 ${className}`}>
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 sm:p-4">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/85">{title}</span>
        <StreamStatusBadge status={status} />
      </div>
      {src ? (
        <video ref={videoRef} className="h-full w-full bg-black object-contain" autoPlay muted playsInline controls preload="none" aria-label={`${title} live stream`} />
      ) : (
        <div className="flex aspect-video min-h-48 items-center justify-center bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_rgba(10,10,10,1))] px-4 text-center text-sm text-white/55">
          This camera feed is not configured yet.
        </div>
      )}
      {src && status === "connecting" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/35">
          <span className="rounded-full border border-white/10 bg-black/65 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-100">Connecting to feed…</span>
        </div>
      )}
      {src && (status === "error" || status === "offline") && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/75 px-5 text-center">
          <p className="text-sm font-semibold text-white">{status === "offline" ? "Feed is offline" : "Playback could not start"}</p>
          <button type="button" onClick={retry} className="rounded-full border border-white/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:border-[#ffb6a0]">Try again</button>
        </div>
      )}
    </div>
  );
}
