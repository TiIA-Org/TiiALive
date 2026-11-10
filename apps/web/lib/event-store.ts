import type { EventData } from "@/lib/event-data";
import { getDefaultEventData } from "@/lib/event-data";
import { getDefaultSiteConfig, type EventSiteConfig } from "@/lib/site-config";
import { createHash } from "node:crypto";

export type EventState = {
  version: number;
  eventData: EventData;
  siteConfig: EventSiteConfig;
  updatedAt: string;
};

type DatabaseRow = {
  version: number;
  event_data: EventData;
  site_config: EventSiteConfig;
  updated_at: string;
};

function databaseConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Persistent event storage is not configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function databaseFetch(path: string, init?: RequestInit): Promise<Response> {
  const { url, key } = databaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Persistent event storage returned ${response.status}`);
  return response;
}

function fromRow(row: DatabaseRow | undefined): EventState {
  if (!row) throw new Error("Event state has not been initialized");
  return { version: row.version, eventData: row.event_data, siteConfig: row.site_config, updatedAt: row.updated_at };
}

export async function readEventState(): Promise<EventState> {
  const response = await databaseFetch("tiia_event_state?id=eq.1&select=version,event_data,site_config,updated_at");
  const rows = await response.json() as DatabaseRow[];
  return fromRow(rows[0]);
}

export async function writeEventState(
  expectedVersion: number,
  eventData: EventData,
  siteConfig: EventSiteConfig,
  adminUserId: string,
  action: "event.updated" | "config.updated",
): Promise<EventState | null> {
  const response = await databaseFetch("rpc/update_tiia_event_state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      p_expected_version: expectedVersion,
      p_event_data: eventData,
      p_site_config: siteConfig,
      p_admin_user_id: adminUserId,
      p_action: action,
    }),
  });
  const rows = await response.json() as DatabaseRow[];
  return rows.length ? fromRow(rows[0]) : null;
}

export type AdminSessionRecord = { user_id: string; expires_at: string; revoked_at: string | null };

export async function createAdminSessionRecord(sessionHash: string, userId: string, expiresAt: string): Promise<void> {
  await databaseFetch("tiia_admin_sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ session_hash: sessionHash, user_id: userId, expires_at: expiresAt }),
  });
}

export async function findAdminSessionRecord(sessionHash: string): Promise<AdminSessionRecord | null> {
  const query = new URLSearchParams({
    select: "user_id,expires_at,revoked_at",
    session_hash: `eq.${sessionHash}`,
    limit: "1",
  });
  const response = await databaseFetch(`tiia_admin_sessions?${query.toString()}`);
  const rows = await response.json() as AdminSessionRecord[];
  return rows[0] ?? null;
}

export async function revokeAdminSessionRecord(sessionHash: string): Promise<void> {
  const query = new URLSearchParams({ session_hash: `eq.${sessionHash}` });
  await databaseFetch(`tiia_admin_sessions?${query.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ revoked_at: new Date().toISOString() }),
  });
}

export async function checkAdminRateLimit(key: string, maxAttempts = 10, windowSeconds = 900): Promise<boolean> {
  const keyHash = createHash("sha256").update(key).digest("hex");
  const response = await databaseFetch("rpc/check_tiia_admin_rate_limit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ p_key_hash: keyHash, p_max_attempts: maxAttempts, p_window_seconds: windowSeconds }),
  });
  return await response.json() === true;
}

export function getEmptyEventState(): EventState {
  return {
    version: 0,
    eventData: getDefaultEventData(),
    siteConfig: getDefaultSiteConfig(),
    updatedAt: "",
  };
}
