import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, getAuthorizedAdminUserId } from "@/lib/admin-auth";
import { readEventState, writeEventState } from "@/lib/event-store";
import { parseJsonBody, parseSiteConfig, ValidationError } from "@/lib/validation";

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
    return NextResponse.json(state.siteConfig, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Event configuration is temporarily unavailable", 503);
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
    if (Object.keys(payload).some((key) => !["version", "config"].includes(key)) ||
        !Number.isInteger(payload.version) || (payload.version as number) < 1) {
      throw new ValidationError("Expected version and config fields");
    }
    const config = parseSiteConfig(payload.config);
    if (!config.cameras.some((camera) => camera.id === config.selectedCamera)) {
      throw new ValidationError("Selected camera must exist in the camera list");
    }
    const current = await readEventState();
    if (current.version !== payload.version) return errorResponse("Event configuration changed. Reload before saving.", 409);
    const saved = await writeEventState(current.version, current.eventData, config, adminUserId, "config.updated");
    if (!saved) return errorResponse("Event configuration changed. Reload before saving.", 409);
    return NextResponse.json({ version: saved.version, config: saved.siteConfig }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ValidationError) return errorResponse(error.message, 400);
    return errorResponse("Unable to save event configuration", 503);
  }
}
