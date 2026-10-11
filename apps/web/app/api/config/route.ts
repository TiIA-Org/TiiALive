import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  type EventSiteConfig,
  getDefaultSiteConfig,
} from "@/lib/site-config";
import { readSiteConfig, writeSiteConfig } from "@/lib/site-config-server";

const ADMIN_COOKIE = "tiia_admin_session";

export async function GET() {
  const config = await readSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (session !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Partial<EventSiteConfig>;
  const current = await readSiteConfig();
  const merged: EventSiteConfig = {
    ...getDefaultSiteConfig(),
    ...current,
    ...payload,
    cameras:
      Array.isArray(payload.cameras) && payload.cameras.length > 0 ? payload.cameras : current.cameras,
  };

  if (!merged.selectedCamera || !merged.cameras.some((camera) => camera.id === merged.selectedCamera)) {
    merged.selectedCamera = merged.cameras[0]?.id ?? "cam1";
  }

  const saved = await writeSiteConfig(merged);
  return NextResponse.json(saved);
}
