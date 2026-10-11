export type StreamStatus = "live" | "offline" | "connecting" | "error";

export const streamerConfig = {
  name: "DanteFDD",
  description: "DanteFDD is going live around the clock for a special GTA VI event.",
  streams: {
    main: process.env.NEXT_PUBLIC_STREAM_CAM1_URL ?? "http://localhost:8888/cam1/index.m3u8",
    camera2: process.env.NEXT_PUBLIC_STREAM_CAM2_URL ?? "http://localhost:8888/cam2/index.m3u8",
    camera3: process.env.NEXT_PUBLIC_STREAM_CAM3_URL ?? "http://localhost:8888/cam3/index.m3u8",
  },
  socials: {
    twitch: "https://www.twitch.tv/dantefdd",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
};

export const streamerMeta = {
  title: "DanteFDD — Live",
  description: "DanteFDD is going live around the clock for a special GTA VI event.",
  navItems: ["LIVE", "CAMERAS", "ABOUT"],
  contentCategories: ["GTA VI", "NIGHTLIFE", "SUNSET", "EVENTS"],
};
