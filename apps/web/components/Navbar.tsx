import { streamerConfig } from "@/lib/config";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_0_18px_rgba(255,77,157,0.45)]">
            {streamerConfig.name}
          </span>
        </div>

        <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 md:flex">
          <a href="#live" className="transition hover:text-[#ffb3d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]">LIVE</a>
          <a href="#about" className="transition hover:text-[#ffb3d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]">THE EVENT</a>
          <a href="#socials" className="transition hover:text-[#ffb3d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]">SOCIALS</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[#ff4d9d]/40 bg-[#ff4d9d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb3d9] shadow-[0_0_18px_rgba(255,77,157,0.22)] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#ff4d9d] shadow-[0_0_12px_rgba(255,77,157,0.9)]" aria-hidden="true" />
            LIVE
          </span>
          <a
            href="#live"
            className="inline-flex items-center rounded-full border border-[#ff4d9d]/40 bg-[#ff4d9d]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition hover:border-[#ff8b3d]/70 hover:bg-[#ff8b3d]/10"
          >
            WATCH LIVE
          </a>
        </div>
      </nav>
    </header>
  );
}
