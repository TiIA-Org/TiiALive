"use client";

import { StreamStatus } from "@/components/StreamStatus";

type CameraOption = {
  key: string;
  title: string;
  src: string;
  status: "live" | "offline" | "connecting" | "error";
};

export function CameraSelector({
  cameras,
  selected,
  onSelect,
}: {
  cameras: CameraOption[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-black/20 p-2 backdrop-blur-sm">
      {cameras.map((camera) => {
        const isSelected = selected === camera.key;
        return (
          <button
            key={camera.key}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(camera.key)}
            className={[
              "group inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-300",
              isSelected
                ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-white shadow-[0_0_25px_rgba(217,70,239,0.25)]"
                : "border-white/10 bg-white/0 text-zinc-300 hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            <span>{camera.title}</span>
            <span className="opacity-70">
              <StreamStatus status={camera.status} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
