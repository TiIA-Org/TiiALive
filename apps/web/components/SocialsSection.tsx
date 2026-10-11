import { streamerConfig } from "@/lib/config";

const socialLinks = [
  { label: "Twitch", href: streamerConfig.socials.twitch },
  { label: "Instagram", href: streamerConfig.socials.instagram },
  { label: "TikTok", href: streamerConfig.socials.tiktok },
  { label: "YouTube", href: streamerConfig.socials.youtube },
].filter((social) => social.href);

export function SocialsSection() {
  return (
    <section
      id="socials"
      aria-labelledby="socials-heading"
      className="relative isolate overflow-hidden border-t border-white/10 bg-[#090c14]"
    >
      <div className="event-night-image absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="event-night-overlay absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">
            Find DanteFDD
          </p>
          <h2
            id="socials-heading"
            className="font-display text-4xl font-black uppercase leading-none text-white sm:text-6xl"
          >
            Socials
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="social-link inline-flex min-h-12 items-center gap-4 rounded-lg border px-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcfb0]"
            >
              {social.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
