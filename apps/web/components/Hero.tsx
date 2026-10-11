import Image from "next/image";

export function Hero() {
  return (
    <section className="hero relative isolate flex min-h-[720px] items-center overflow-hidden sm:min-h-[800px]">
      <div className="hero-image absolute inset-0">
        <Image
          src="/assets/gta-vi-cinema.jpeg"
          alt="Miami street at sunset with palm trees, oceanfront buildings, and traffic"
          fill
          preload
          unoptimized
          className="hero-image-photo"
        />
      </div>
      <div className="hero-gradient absolute inset-0" aria-hidden="true" />
      <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      <div className="hero-grain absolute inset-0" aria-hidden="true" />
      <div className="hero-light absolute inset-0" aria-hidden="true" />

      <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-24 pt-32 sm:px-8 sm:pb-28">
        <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/75 sm:text-xs">
          A DanteFDD broadcast event
        </p>
        <p className="font-display text-sm font-bold uppercase tracking-[0.44em] text-[#ffe2cd] sm:text-base">
          DANTEFDD
        </p>
        <h1 className="hero-title mt-3 font-display font-black uppercase leading-[0.78] text-white">
          <span className="hero-title-outline block">GTA VI</span>
          <span className="hero-title-live mt-3 block">LIVE</span>
        </h1>
        <div className="mt-8 flex flex-col items-start gap-5 sm:mt-10">
          <span className="live-now inline-flex items-center gap-3 rounded-full border border-white/25 bg-black/30 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-sm sm:text-xs">
            <span className="live-now-dot" aria-hidden="true" />
            LIVE NOW
          </span>
          <a
            href="#live"
            className="hero-cta mt-1 inline-flex min-h-12 items-center justify-center gap-3 border border-white/70 px-7 text-[10px] font-bold uppercase tracking-[0.28em] text-white transition duration-300 hover:border-[#ffb3a0] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]"
          >
            Watch live <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-44" aria-hidden="true" />
    </section>
  );
}
