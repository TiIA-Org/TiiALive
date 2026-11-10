import { NextResponse } from "next/server";

import { ADMIN_OAUTH_STATE_COOKIE, createOAuthState, secureCookie } from "@/lib/admin-auth";
import { allowAttempt } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  const clientId = process.env.TWITCH_CLIENT_ID;
  const redirectUri = process.env.TWITCH_REDIRECT_URI;
  if (!clientId || !redirectUri || !process.env.TWITCH_CLIENT_SECRET || !process.env.ADMIN_TWITCH_USER_ID ||
      !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(new URL("/admin/login?error=configuration", url));
  }
  if (!(await allowAttempt(`admin-login:${ip}`))) {
    return NextResponse.redirect(new URL("/admin/login?error=rate_limit", url));
  }

  const state = createOAuthState();
  const authorize = new URL("https://id.twitch.tv/oauth2/authorize");
  authorize.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid",
    state,
  }).toString();

  const response = NextResponse.redirect(authorize);
  response.cookies.set(ADMIN_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
