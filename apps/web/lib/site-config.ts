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
    description: "Seven-day live event experience with three independent camera feeds and community-driven milestones.",
    isLive: true,
    multiview: true,
    selectedCamera: "cam1",
    twitchChannel: "dantefdd",
    cameras: [
      {
        id: "cam1",
        title: "Camera 01",
        src: process.env.NEXT_PUBLIC_STREAM_CAM1_URL ?? "http://localhost:8888/cam1/index.m3u8",
        enabled: true,
      },
      {
        id: "cam2",
        title: "Camera 02",
        src: process.env.NEXT_PUBLIC_STREAM_CAM2_URL ?? "http://localhost:8888/cam2/index.m3u8",
        enabled: true,
      },
      {
        id: "cam3",
        title: "Camera 03",
        src: process.env.NEXT_PUBLIC_STREAM_CAM3_URL ?? "http://localhost:8888/cam3/index.m3u8",
        enabled: true,
      },
    ],
  };
}
