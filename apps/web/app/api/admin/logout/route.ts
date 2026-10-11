import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "tiia_admin_session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
