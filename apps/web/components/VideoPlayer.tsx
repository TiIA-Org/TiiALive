"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

import type { StreamStatus } from "@/lib/config";
import { StreamStatus as StreamStatusBadge } from "@/components/StreamStatus";

type VideoPlayerProps = {
  src: string;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
};

export function VideoPlayer({
  src,
  title,
  autoplay = true,
  muted = true,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<StreamStatus>(src ? "connecting" : "offline");
  const [isLoading, setIsLoading] = useState(Boolean(src));

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) {
      return;
    }

    const handleLoaded = () => {
      setStatus("live");
      setIsLoading(false);
    };

    const handleError = () => {
      setStatus("error");
      setIsLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("error", handleError);

    if (src.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        backBufferLength: 90,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setStatus("error");
          setIsLoading(false);
        }
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus("live");
        setIsLoading(false);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener("loadedmetadata", handleLoaded);
        video.removeEventListener("error", handleError);
      };
    }

    video.src = src;
    video.muted = muted;
    video.autoplay = autoplay;
    video.playsInline = true;
    video.controls = true;

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("error", handleError);
    };
  }, [src, autoplay, muted]);

  return (
    <div className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 ${className}`}>
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">
          {title}
        </span>
        <StreamStatusBadge status={status} />
      </div>

      {src ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay={autoplay}
          muted={muted}
          playsInline
          controls
          preload="metadata"
          aria-label={`${title} live stream`}
        />
      ) : (
        <div className="flex h-[18rem] items-center justify-center bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_rgba(10,10,10,1))] text-zinc-300">
          <div className="text-center">
            <p className="text-lg font-semibold uppercase tracking-[0.25em] text-zinc-200">
              OFFLINE
            </p>
            <p className="mt-3 text-sm text-zinc-400">Stream unavailable</p>
          </div>
        </div>
      )}

      {isLoading && src && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            CONNECTING
          </div>
        </div>
      )}

      {status === "error" && src && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300">ERROR</p>
            <p className="mt-3 text-sm text-zinc-300">Unable to load stream</p>
          </div>
        </div>
      )}
    </div>
  );
}
