import { beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ token: undefined as string | undefined, session: null as { user_id: string; expires_at: string; revoked_at: string | null } | null }));
const store = vi.hoisted(() => ({
  readEventState: vi.fn(),
  writeEventState: vi.fn(),
  findAdminSessionRecord: vi.fn(),
  createAdminSessionRecord: vi.fn(),
  revokeAdminSessionRecord: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => authState.token ? { value: authState.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (destination: string) => { throw new Error(`redirect:${destination}`); } }));
vi.mock("@/lib/event-store", () => store);

import { GET, PUT } from "@/app/api/event/route";
import { PUT as updateConfig } from "@/app/api/config/route";
import AdminPage from "@/app/admin/page";
import { getDefaultEventData } from "@/lib/event-data";

const state = () => ({ version: 4, eventData: getDefaultEventData(), siteConfig: { eventName: "TiiA", description: "", isLive: false, multiview: false, selectedCamera: "cam1", twitchChannel: "dantefdd", cameras: [{ id: "cam1", title: "Camera 01", src: "", enabled: false }] }, updatedAt: "2030-01-01T00:00:00.000Z" });

describe("admin access control", () => {
  beforeEach(() => {
    authState.token = undefined;
    authState.session = null;
    vi.stubEnv("ADMIN_TWITCH_USER_ID", "admin-id");
    store.findAdminSessionRecord.mockImplementation(async () => authState.session);
    store.readEventState.mockImplementation(async () => state());
    store.writeEventState.mockImplementation(async (version: number, eventData: unknown, siteConfig: unknown) => ({ ...state(), version: version + 1, eventData, siteConfig }));
    vi.clearAllMocks();
  });

  it("does not render private admin data for an anonymous visitor", async () => {
    await expect(AdminPage()).rejects.toThrow("redirect:/admin/login");
    expect(store.readEventState).not.toHaveBeenCalled();
  });

  it("rejects anonymous and legacy fixed-cookie mutations", async () => {
    const body = JSON.stringify({ version: 4, eventData: getDefaultEventData() });
    const request = () => new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body });
    const anonymous = await PUT(request());
    expect(anonymous.status).toBe(401);
    authState.token = "authenticated";
    const legacyCookie = await PUT(request());
    expect(legacyCookie.status).toBe(401);
    expect(store.writeEventState).not.toHaveBeenCalled();
  });

  it("keeps a successful public read separate from administrator authorization", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(getDefaultEventData());
    expect(store.findAdminSessionRecord).not.toHaveBeenCalled();
    expect(store.writeEventState).not.toHaveBeenCalled();
  });

  it("rejects authenticated non-admin identities and bad origins", async () => {
    authState.token = "a".repeat(43);
    authState.session = { user_id: "other-id", expires_at: "2099-01-01T00:00:00.000Z", revoked_at: null };
    const body = JSON.stringify({ version: 4, eventData: getDefaultEventData() });
    const wrongOrigin = await PUT(new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://evil.example", "content-type": "application/json" }, body }));
    expect(wrongOrigin.status).toBe(403);
    const wrongUser = await PUT(new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body }));
    expect(wrongUser.status).toBe(401);
  });

  it("rejects invalid event payloads before writing", async () => {
    authState.token = "c".repeat(43);
    authState.session = { user_id: "admin-id", expires_at: "2099-01-01T00:00:00.000Z", revoked_at: null };
    const invalid = await PUT(new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body: "{" }));
    expect(invalid.status).toBe(400);
    expect(store.writeEventState).not.toHaveBeenCalled();
  });

  it("allows an active configured administrator and rejects stale versions", async () => {
    authState.token = "a".repeat(43);
    authState.session = { user_id: "admin-id", expires_at: "2099-01-01T00:00:00.000Z", revoked_at: null };
    const payload = JSON.stringify({ version: 4, eventData: getDefaultEventData() });
    const response = await PUT(new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body: payload }));
    expect(response.status).toBe(200);
    expect(store.writeEventState).toHaveBeenCalledOnce();

    store.readEventState.mockResolvedValueOnce({ ...state(), version: 5 });
    const conflict = await PUT(new Request("https://tiia.example/api/event", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body: payload }));
    expect(conflict.status).toBe(409);
  });

  it("protects the configuration mutation route as well", async () => {
    const body = JSON.stringify({ version: 4, config: state().siteConfig });
    const request = () => new Request("https://tiia.example/api/config", { method: "PUT", headers: { origin: "https://tiia.example", "content-type": "application/json" }, body });
    expect((await updateConfig(request())).status).toBe(401);
    authState.token = "b".repeat(43);
    authState.session = { user_id: "admin-id", expires_at: "2099-01-01T00:00:00.000Z", revoked_at: "2030-01-01T00:00:00.000Z" };
    expect((await updateConfig(request())).status).toBe(401);
    authState.session = { user_id: "admin-id", expires_at: "2099-01-01T00:00:00.000Z", revoked_at: null };
    expect((await updateConfig(request())).status).toBe(200);
  });
});
