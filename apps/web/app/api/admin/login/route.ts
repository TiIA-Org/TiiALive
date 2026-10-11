import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "tiia_admin_session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ password: "" }));
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin password is not configured" },
      { status: 503 }
    );
}  
  const providedPassword = String(body.password ?? "");

  if (providedPassword !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
