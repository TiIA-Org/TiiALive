import { VideoPlayer } from "@/components/VideoPlayer";

export type CameraFeed = { id: string; title: string; src: string; enabled: boolean };

export function CameraGrid({
  streams,
  selectedCamera,
  onSelectCamera,
}: {
  streams: CameraFeed[];
  selectedCamera: string;
  onSelectCamera: (cameraId: string) => void;
}) {
  const selected = streams.find((camera) => camera.id === selectedCamera && camera.enabled && camera.src)
    ?? streams.find((camera) => camera.enabled && camera.src);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
      <div className="min-w-0">
        {selected ? (
          <VideoPlayer key={selected.src} src={selected.src} title={selected.title} className="aspect-video" />
        ) : (
          <div className="flex aspect-video min-h-48 items-center justify-center rounded-[1.25rem] border border-white/10 bg-black/50 px-6 text-center text-sm text-white/55">Camera playback is not configured. Production HLS URLs are required.</div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {streams.map((camera, index) => {
          const available = camera.enabled && Boolean(camera.src);
          const active = camera.id === selected?.id;
          return (
            <button
              key={camera.id}
              type="button"
              aria-pressed={active}
              disabled={!available}
              onClick={() => onSelectCamera(camera.id)}
              className={`group flex min-h-20 items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition ${active ? "border-[#ffb6a0]/75 bg-[#ffb6a0]/10" : "border-white/10 bg-white/[0.025] hover:border-white/25"} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-[#ffb6a0]">Camera {String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 block text-sm font-semibold text-white">{camera.title}</span>
              </span>
              <span className="text-right text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">{available ? (active ? "Selected" : "Select feed") : "Not configured"}</span>
            </button>
          );
        })}
        <p className="self-end px-1 text-xs leading-5 text-white/40">One camera plays at a time. Each feed has an independent MediaMTX/HLS source.</p>
      </div>
    </div>
  );
}
