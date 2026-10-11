const clipSlots = ["01", "02", "03"];

export function ClipsSection() {
  return (
    <section
      id="clips"
      aria-labelledby="clips-heading"
      className="border-t border-white/10 bg-[#0a0d15]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
              On replay
            </p>
            <h2
              id="clips-heading"
              className="font-display text-4xl font-black uppercase leading-none text-white sm:text-6xl"
            >
              Clips
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-white/55 sm:text-right">
            Highlights will appear here after the broadcast.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {clipSlots.map((clip) => (
            <article key={clip} className="group overflow-hidden rounded-lg border border-white/10 bg-[#10131d]">
              <div className="clip-still relative flex aspect-video items-end justify-between overflow-hidden p-5">
                <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.3em] text-white/65">
                  Replay / {clip}
                </span>
                <span className="relative z-10 border border-white/20 bg-black/30 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.22em] text-white/75">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  Clip {clip}
                </h3>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                  Not published
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
