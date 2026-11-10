import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, getAuthorizedAdminUserId } from "@/lib/admin-auth";
import { readEventState, writeEventState } from "@/lib/event-store";
import { parseEventData, parseJsonBody, ValidationError } from "@/lib/validation";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export async function GET() {
  try {
    const state = await readEventState();
    return NextResponse.json(state.eventData, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Event data is temporarily unavailable", 503);
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return errorResponse("Invalid request origin", 403);
  const cookieStore = await cookies();
  const adminUserId = await getAuthorizedAdminUserId(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!adminUserId) {
    return errorResponse("Unauthorized", 401);
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 64 * 1024) return errorResponse("Request body too large", 413);

  try {
    const body = parseJsonBody(await request.text());
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError("Invalid request body");
    const payload = body as Record<string, unknown>;
    if (Object.keys(payload).some((key) => !["version", "eventData"].includes(key)) ||
        !Number.isInteger(payload.version) || (payload.version as number) < 1) {
      throw new ValidationError("Expected version and eventData fields");
    }
    const eventData = parseEventData(payload.eventData);
    eventData.admin.lastUpdated = new Date().toISOString();
    const current = await readEventState();
    if (current.version !== payload.version) return errorResponse("Event data changed. Reload before saving.", 409);
    const saved = await writeEventState(current.version, eventData, current.siteConfig, adminUserId, "event.updated");
    if (!saved) return errorResponse("Event data changed. Reload before saving.", 409);
    return NextResponse.json({ version: saved.version, eventData: saved.eventData }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ValidationError) return errorResponse(error.message, 400);
    return errorResponse("Unable to save event data", 503);
  }
}
