import { NextResponse } from "next/server";

import { getApprovedTwitchParentHostnames } from "@/lib/twitch-embed";

export const dynamic = "force-dynamic";

export async function GET() {
  const parentHostnames = getApprovedTwitchParentHostnames(process.env);

  return NextResponse.json(
    { parentHostnames },
    { headers: { "Cache-Control": "no-store" } },
  );
}