import { createHash, randomBytes } from "node:crypto";

import { createAdminSessionRecord, findAdminSessionRecord, revokeAdminSessionRecord } from "@/lib/event-store";

export const ADMIN_SESSION_COOKIE = "tiia_admin_session";
export const ADMIN_OAUTH_STATE_COOKIE = "tiia_admin_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function sessionHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createOAuthState(): string {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(userId: string, now = new Date()): Promise<string | null> {
  if (!userId || userId !== process.env.ADMIN_TWITCH_USER_ID) return null;
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();
  await createAdminSessionRecord(sessionHash(token), userId, expiresAt);
  return token;
}

export async function getAuthorizedAdminUserId(token: string | undefined, now = new Date()): Promise<string | null> {
  const adminUserId = process.env.ADMIN_TWITCH_USER_ID;
  if (!adminUserId || !token || !/^[A-Za-z0-9_-]{40,64}$/.test(token)) return null;
  try {
    const session = await findAdminSessionRecord(sessionHash(token));
    return session && session.user_id === adminUserId && !session.revoked_at &&
      Date.parse(session.expires_at) > now.getTime() ? session.user_id : null;
  } catch {
    return null;
  }
}

export async function verifyAdminSession(token: string | undefined, now = new Date()): Promise<boolean> {
  return Boolean(await getAuthorizedAdminUserId(token, now));
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
  if (token && /^[A-Za-z0-9_-]{40,64}$/.test(token)) {
    await revokeAdminSessionRecord(sessionHash(token));
  }
}

export async function isAuthorizedAdmin(token: string | undefined): Promise<boolean> {
  return verifyAdminSession(token);
}

export function adminSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}

export function secureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}
