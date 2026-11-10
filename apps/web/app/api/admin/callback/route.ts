import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  ADMIN_OAUTH_STATE_COOKIE,
  ADMIN_SESSION_COOKIE,
  adminSessionMaxAge,
  createAdminSession,
  secureCookie,
} from "@/lib/admin-auth";
import { allowAttempt } from "@/lib/rate-limit";

type TwitchTokenResponse = { access_token?: string };
type TwitchValidationResponse = { client_id?: string; user_id?: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const appUrl = new URL("/admin/login", url);
  const params = url.searchParams;
  const oauthError = params.get("error");
  if (oauthError) return NextResponse.redirect(appUrl);

  const code = params.get("code");
  const state = params.get("state");
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(ADMIN_OAUTH_STATE_COOKIE)?.value;
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid_state", url));
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const redirectUri = process.env.TWITCH_REDIRECT_URI;
  const expectedAdmin = process.env.ADMIN_TWITCH_USER_ID;
  if (!clientId || !clientSecret || !redirectUri || !expectedAdmin) {
    return NextResponse.redirect(new URL("/admin/login?error=configuration", url));
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(new URL("/admin/login?error=configuration", url));
  }
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  if (!(await allowAttempt(`admin-callback:${ip}`))) {
    return NextResponse.redirect(new URL("/admin/login?error=rate_limit", url));
  }

  try {
    const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenResponse.ok) return NextResponse.redirect(new URL("/admin/login?error=authentication", url));
    const token = await tokenResponse.json() as TwitchTokenResponse;
    if (!token.access_token) return NextResponse.redirect(new URL("/admin/login?error=authentication", url));

    const validationResponse = await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: { Authorization: `OAuth ${token.access_token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!validationResponse.ok) return NextResponse.redirect(new URL("/admin/login?error=authentication", url));
    const validated = await validationResponse.json() as TwitchValidationResponse;
    const userId = validated.client_id === clientId ? validated.user_id : undefined;
    const session = userId === expectedAdmin ? await createAdminSession(userId) : null;
    if (!session) return NextResponse.redirect(new URL("/admin/login?error=unauthorized", url));

    const response = NextResponse.redirect(new URL("/admin", url));
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: adminSessionMaxAge(),
    });
    response.cookies.set(ADMIN_OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=authentication", url));
  }
}
