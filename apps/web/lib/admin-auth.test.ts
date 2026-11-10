import { afterEach, describe, expect, it, vi } from "vitest";

import { createAdminSession, revokeAdminSession, verifyAdminSession } from "@/lib/admin-auth";

describe("Twitch administrator sessions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("stores an opaque session, verifies the configured identity, and revokes it", async () => {
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-service-key");
    vi.stubEnv("ADMIN_TWITCH_USER_ID", "verified-admin-id");
    let revoked = false;
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "POST") return new Response(null, { status: 201 });
      if (init?.method === "PATCH") { revoked = true; return new Response(null, { status: 204 }); }
      return Response.json([{ user_id: "verified-admin-id", expires_at: "2035-01-01T00:00:00.000Z", revoked_at: revoked ? "2030-01-01T00:00:00.000Z" : null }]);
    }));

    const token = await createAdminSession("verified-admin-id", new Date("2030-01-01T00:00:00.000Z"));
    expect(token).toMatch(/^[A-Za-z0-9_-]{40,64}$/);
    if (!token) throw new Error("Expected a created session token");
    expect(await verifyAdminSession(token, new Date("2030-01-02T00:00:00.000Z"))).toBe(true);
    expect(await verifyAdminSession("authenticated")).toBe(false);
    expect(await verifyAdminSession(token, new Date("2035-01-01T00:00:00.000Z"))).toBe(false);
    await revokeAdminSession(token ?? undefined);
    expect(await verifyAdminSession(token)).toBe(false);
  });

  it("does not issue a session to a different Twitch identity", async () => {
    vi.stubEnv("ADMIN_TWITCH_USER_ID", "verified-admin-id");
    expect(await createAdminSession("other-id")).toBeNull();
  });
});
