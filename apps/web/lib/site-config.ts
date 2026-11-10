import { normalizePlaybackUrl, streamerConfig } from "@/lib/config";

export type CameraDefinition = {
  id: string;
  title: string;
  src: string;
  enabled: boolean;
};

export type EventSiteConfig = {
  eventName: string;
  description: string;
  isLive: boolean;
  multiview: boolean;
  selectedCamera: string;
  twitchChannel: string;
  cameras: CameraDefinition[];
};

export function getDefaultSiteConfig(): EventSiteConfig {
  return {
    eventName: "DanteFDD GTA VI Live Experience",
    description: "",
    isLive: false,
    multiview: false,
    selectedCamera: "cam1",
    twitchChannel: streamerConfig.twitchChannel,
    cameras: [
      {
        id: "cam1",
        title: "Camera 01",
        src: normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM1_URL),
        enabled: Boolean(normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM1_URL)),
      },
      {
        id: "cam2",
        title: "Camera 02",
        src: normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM2_URL),
        enabled: Boolean(normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM2_URL)),
      },
      {
        id: "cam3",
        title: "Camera 03",
        src: normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM3_URL),
        enabled: Boolean(normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM3_URL)),
      },
    ],
  };
}
