import { streamerConfig } from "@/lib/config";

export function EventSection() {
  return (
    <section id="about" className="event-section relative isolate overflow-hidden">
      <div className="event-night-image absolute inset-0" aria-hidden="true" />
      <div className="event-night-overlay absolute inset-0" aria-hidden="true" />
      <div className="event-grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-20">
        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.38em] text-[#f4a9a0]">
            The event
          </p>
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            One week.
            <span className="block text-[#ffb6a0]">Three cameras.</span>
            <span className="block">24/7 live.</span>
          </h2>
        </div>
        <div className="max-w-xl border-l border-[#ffb6a0]/55 pl-6 sm:pl-8">
          <p className="text-lg leading-8 text-white/85 sm:text-xl">
            {streamerConfig.description}
          </p>
          <a
            href="#live"
            className="mt-8 inline-flex min-h-11 items-center border-b border-[#ffb6a0]/70 pb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]"
          >
            Watch the broadcast <span className="ml-3" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
