import Link from "next/link";

const messages: Record<string, string> = {
  configuration: "Admin sign-in is not configured yet. Contact the site operator.",
  unauthorized: "This Twitch account is not authorized to administer this event.",
  invalid_state: "The sign-in request expired. Please try again.",
  authentication: "Twitch sign-in could not be completed. Please try again.",
  rate_limit: "Too many sign-in attempts. Wait before trying again.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b13] px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10131d] p-8 shadow-2xl">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Private administration</p>
        <h1 className="font-display text-4xl font-black uppercase">Admin sign in</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">Continue with the authorized DanteFDD Twitch account.</p>
        {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">{messages[error] ?? messages.authentication}</p>}
        <a href="/api/admin/login" className="mt-7 flex min-h-12 items-center justify-center rounded-full bg-[#ffb6a0] px-5 text-sm font-bold text-[#11131a] transition hover:bg-[#ffd1c2]">
          Continue with Twitch
        </a>
        <Link href="/" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-white/55 hover:text-white">Return to event</Link>
      </section>
    </main>
  );
}
