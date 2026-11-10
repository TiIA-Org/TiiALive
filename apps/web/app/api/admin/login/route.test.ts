import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/admin/login/route";

describe("Twitch OAuth sign-in start", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("fails closed when OAuth or persistence configuration is missing", async () => {
    vi.stubEnv("TWITCH_CLIENT_ID", "test-client-id");
    const response = await GET(new Request("https://tiia.example/api/admin/login", { headers: { "x-real-ip": "login-test-1" } }));
    expect(response.headers.get("location")).toContain("configuration");
  });

  it("starts an authorization-code flow with random state and minimal identity scope", async () => {
    vi.stubEnv("TWITCH_CLIENT_ID", "test-client-id");
    vi.stubEnv("TWITCH_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("TWITCH_REDIRECT_URI", "https://tiia.example/api/admin/callback");
    vi.stubEnv("ADMIN_TWITCH_USER_ID", "verified-admin-id");
    vi.stubEnv("SUPABASE_URL", "https://project.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json(true)));
    const response = await GET(new Request("https://tiia.example/api/admin/login", { headers: { "x-real-ip": "login-test-2" } }));
    const location = new URL(response.headers.get("location") ?? "");
    expect(location.origin).toBe("https://id.twitch.tv");
    expect(location.searchParams.get("response_type")).toBe("code");
    expect(location.searchParams.get("scope")).toBe("openid");
    expect(location.searchParams.get("state")).toHaveLength(43);
    expect(response.cookies.get("tiia_admin_oauth_state")?.httpOnly).toBe(true);
  });
});
