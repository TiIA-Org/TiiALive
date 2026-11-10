"use client";

import { useState } from "react";

import type { EventData } from "@/lib/event-data";

export function AdminDashboard({ initialData, initialVersion }: { initialData: EventData; initialVersion: number }) {
  const [eventData, setEventData] = useState(initialData);
  const [version, setVersion] = useState(initialVersion);
  const [rawData, setRawData] = useState(JSON.stringify(initialData, null, 2));
  const [status, setStatus] = useState("Event figures are manually managed. External metrics are not connected.");

  const handleSave = async () => {
    let parsed: EventData;
    try { parsed = JSON.parse(rawData) as EventData; } catch {
      setStatus("JSON is invalid. Correct it before saving.");
      return;
    }
    setStatus("Saving…");
    const response = await fetch("/api/event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version, eventData: parsed }),
    });
    if (!response.ok) {
      setStatus(response.status === 409 ? "Data changed elsewhere. Reload before saving." : "Save failed. Check authorization and storage configuration.");
      return;
    }
    const result = await response.json() as { version: number; eventData: EventData };
    setEventData(result.eventData);
    setVersion(result.version);
    setRawData(JSON.stringify(result.eventData, null, 2));
    setStatus("Changes saved.");
  };

  const handleLogout = async () => {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign(response.ok ? "/" : "/admin/login?error=authentication");
  };

  return (
    <main className="min-h-screen bg-[#080b13] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffb6a0]">Private control panel</p><h1 className="font-display text-4xl font-black uppercase sm:text-6xl">{eventData.admin.title}</h1></div>
          <button type="button" onClick={handleLogout} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white">Sign out</button>
        </div>
        <section className="rounded-3xl border border-white/10 bg-[#10131d] p-5 sm:p-7">
          <p role="status" className="mb-5 text-sm text-white/65">{status}</p>
          <label htmlFor="event-data" className="sr-only">Event data JSON</label>
          <textarea id="event-data" value={rawData} onChange={(event) => setRawData(event.target.value)} spellCheck={false} className="min-h-[420px] w-full rounded-2xl border border-white/10 bg-[#080b13] p-5 font-mono text-sm text-[#e5e7eb] outline-none focus:border-[#ffb6a0]" />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={handleSave} className="rounded-full bg-[#ffb6a0] px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#11131a]">Save changes</button>
            <button type="button" onClick={() => { setRawData(JSON.stringify(eventData, null, 2)); setStatus("Unsaved edits discarded."); }} className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">Discard edits</button>
          </div>
        </section>
      </div>
    </main>
  );
}
