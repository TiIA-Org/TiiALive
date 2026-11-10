import { afterEach, describe, expect, it, vi } from "vitest";

import { allowAttempt } from "@/lib/rate-limit";

describe("per-process request throttling", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("uses shared database rate limits and fails closed when the limit is reached", async () => {
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(true))
      .mockResolvedValueOnce(Response.json(false));
    vi.stubGlobal("fetch", fetchMock);
    expect(await allowAttempt("admin-login:test-ip")).toBe(true);
    expect(await allowAttempt("admin-login:test-ip")).toBe(false);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("rpc/check_tiia_admin_rate_limit");
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain("test-ip");
  });
});
