import { beforeEach, describe, expect, it, vi } from "vitest";

const oauthState = vi.hoisted(() => ({ expected: "test-oauth-state" }));
const sessionStore = vi.hoisted(() => ({
  createAdminSessionRecord: vi.fn(),
  findAdminSessionRecord: vi.fn(),
  revokeAdminSessionRecord: vi.fn(),
  checkAdminRateLimit: vi.fn(async () => true),
  readEventState: vi.fn(),
  writeEventState: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: async () => ({ get: (name: string) => name === "tiia_admin_oauth_state" ? { value: oauthState.expected } : undefined }) }));
vi.mock("@/lib/event-store", () => sessionStore);

import { GET } from "@/app/api/admin/callback/route";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

describe("Twitch OAuth callback", () => {
  beforeEach(() => {
    vi.stubEnv("TWITCH_CLIENT_ID", "test-client-id");
    vi.stubEnv("TWITCH_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("TWITCH_REDIRECT_URI", "https://tiia.example/api/admin/callback");
    vi.stubEnv("ADMIN_TWITCH_USER_ID", "verified-admin-id");
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    sessionStore.createAdminSessionRecord.mockClear();
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(Response.json({ access_token: "test-access-token" }))
      .mockResolvedValueOnce(Response.json({ client_id: "test-client-id", user_id: "verified-admin-id" })));
  });

  it("creates a session only after validating the configured Twitch identity", async () => {
    const request = new Request("https://tiia.example/api/admin/callback?code=one-time-code&state=test-oauth-state", { headers: { "x-real-ip": "oauth-test-1" } });
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://tiia.example/admin");
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)?.httpOnly).toBe(true);
    expect(sessionStore.createAdminSessionRecord).toHaveBeenCalledOnce();
  });

  it("rejects state mismatches and non-admin Twitch identities", async () => {
    const badState = await GET(new Request("https://tiia.example/api/admin/callback?code=one-time-code&state=wrong", { headers: { "x-real-ip": "oauth-test-2" } }));
    expect(badState.headers.get("location")).toContain("invalid_state");

    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(Response.json({ access_token: "test-access-token" }))
      .mockResolvedValueOnce(Response.json({ client_id: "test-client-id", user_id: "different-user" })));
    const wrongUser = await GET(new Request("https://tiia.example/api/admin/callback?code=one-time-code&state=test-oauth-state", { headers: { "x-real-ip": "oauth-test-3" } }));
    expect(wrongUser.headers.get("location")).toContain("unauthorized");
    expect(sessionStore.createAdminSessionRecord).not.toHaveBeenCalled();
  });
});
