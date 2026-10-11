import type { StreamStatus } from "@/lib/config";

const statusMap: Record<
  StreamStatus,
  { label: string; icon: string; className: string }
> = {
  live: { label: "LIVE", icon: "●", className: "text-[#ff4d9d]" },
  offline: { label: "OFFLINE", icon: "○", className: "text-zinc-400" },
  connecting: { label: "CONNECTING", icon: "◌", className: "text-[#ffb347]" },
  error: { label: "ERROR", icon: "⚠", className: "text-rose-400" },
};

export function StreamStatus({ status }: { status: StreamStatus }) {
  const current = statusMap[status];

  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.28em] shadow-[0_0_20px_rgba(255,77,157,0.15)] ${current.className}`}
    >
      <span aria-hidden="true" className="inline-block animate-pulse">{current.icon}</span>
      {current.label}
    </span>
  );
}
