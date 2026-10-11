import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { type EventData, getDefaultEventData } from "@/lib/event-data";
import { readEventData, writeEventData } from "@/lib/event-data-server";

const ADMIN_COOKIE = "tiia_admin_session";

export async function GET() {
  const data = await readEventData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (session !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Partial<EventData>;
  const current = await readEventData();
  const merged: EventData = {
    ...getDefaultEventData(),
    ...current,
    ...payload,
    goals: Array.isArray(payload.goals) && payload.goals.length > 0 ? payload.goals : current.goals,
    rankings: Array.isArray(payload.rankings) && payload.rankings.length > 0 ? payload.rankings : current.rankings,
    stats: Array.isArray(payload.stats) && payload.stats.length > 0 ? payload.stats : current.stats,
    votes: Array.isArray(payload.votes) && payload.votes.length > 0 ? payload.votes : current.votes,
    admin: {
      ...current.admin,
      ...(payload.admin ?? {}),
      lastUpdated: new Date().toISOString(),
    },
  };

  const saved = await writeEventData(merged);
  return NextResponse.json(saved);
}
