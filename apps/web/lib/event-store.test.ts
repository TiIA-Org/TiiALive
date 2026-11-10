import { afterEach, describe, expect, it, vi } from "vitest";

import { readEventState, writeEventState } from "@/lib/event-store";
import { getDefaultEventData } from "@/lib/event-data";
import { getDefaultSiteConfig } from "@/lib/site-config";

describe("persistent event store REST contract", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("reads the singleton state with server-only credentials and no cache", async () => {
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const row = { version: 2, event_data: getDefaultEventData(), site_config: getDefaultSiteConfig(), updated_at: "2030-01-01T00:00:00Z" };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json([row]));
    vi.stubGlobal("fetch", fetchMock);

    const state = await readEventState();
    expect(state.version).toBe(2);
    expect(state.eventData.goals).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("tiia_event_state?id=eq.1"), expect.objectContaining({ cache: "no-store" }));
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({ apikey: "test-only-key", Authorization: "Bearer test-only-key" });
  });

  it("uses compare-and-swap writes and reports concurrent conflicts", async () => {
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json([])));
    expect(await writeEventState(4, getDefaultEventData(), getDefaultSiteConfig(), "admin-id", "event.updated")).toBeNull();
  });
});
