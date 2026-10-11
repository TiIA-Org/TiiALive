import { VideoPlayer } from "@/components/VideoPlayer";

export function CameraCard({
  title,
  src,
  cameraNumber,
  isMain = false,
  isUpcoming = false,
  isSelected = false,
  onSelect,
}: {
  title: string;
  src: string;
  cameraNumber: number;
  isMain?: boolean;
  isUpcoming?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const cameraLabel = `CAM ${String(cameraNumber).padStart(2, "0")}`;

  return (
    <article
      aria-label={`${cameraLabel}: ${isUpcoming ? "coming soon" : title}`}
      className={`camera-card relative overflow-hidden rounded-2xl border bg-[#10121a] ${isSelected ? "border-[#ffb6a0]/80 ring-1 ring-[#ffb6a0]/70" : "border-white/15"} ${isMain ? "camera-card-main" : "camera-card-secondary"}`}
    >
      <span className="sr-only">{title}</span>
      <div className="absolute left-4 top-4 z-30 flex items-center gap-2">
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            className={`rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] transition ${isSelected ? "border-[#ffcfb0] bg-[#ffcfb0]/15 text-[#ffcfb0]" : "border-white/15 bg-black/35 text-white/75 hover:text-white"}`}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        ) : null}
      </div>
      {isUpcoming ? (
        <div className="camera-upcoming flex aspect-video flex-col items-center justify-center gap-3 px-4 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/55">
            {title}
          </span>
          <p className="font-display text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
            Coming soon
          </p>
          <span className="border-t border-[#ffb6a0]/50 pt-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#ffcfb0]">
            Feed prepared
          </span>
        </div>
      ) : (
        <VideoPlayer
          src={src}
          title={cameraLabel}
          autoplay
          muted
          className="aspect-video"
        />
      )}
    </article>
  );
}
