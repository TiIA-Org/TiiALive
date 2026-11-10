import { checkAdminRateLimit } from "@/lib/event-store";

/** Shared database-backed limit. Fail closed when persistent rate-limit storage is unavailable. */
export async function allowAttempt(key: string): Promise<boolean> {
  try {
    return await checkAdminRateLimit(key, 10, 900);
  } catch {
    return false;
  }
}
