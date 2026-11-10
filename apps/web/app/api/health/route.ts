import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "tiia-live-web", status: "ok" }, {
    headers: { "Cache-Control": "no-store" },
  });
}
