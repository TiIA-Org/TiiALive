import { NextResponse } from "next/server";

import { readSiteConfig } from "@/lib/site-config-server";

export async function GET() {
  const config = await readSiteConfig();
  const cameras = config.cameras.filter((camera) => camera.enabled);

  return NextResponse.json({
    ok: true,
    service: "tiia-live",
    live: config.isLive,
    multiview: config.multiview,
    selectedCamera: config.selectedCamera,
    cameraCount: cameras.length,
    status: "healthy",
  });
}
