import { streamerConfig } from "@/lib/config";

export const liveCameras = [
  {
    id: "cam1",
    key: "cam1",
    title: "Camera 01",
    src: streamerConfig.streams.main,
    isMain: true,
    enabled: true,
  },
  {
    id: "cam2",
    key: "cam2",
    title: "Camera 02",
    src: streamerConfig.streams.camera2,
    isMain: false,
    enabled: true,
  },
  {
    id: "cam3",
    key: "cam3",
    title: "Camera 03",
    src: streamerConfig.streams.camera3,
    isMain: false,
    enabled: true,
  },
];
