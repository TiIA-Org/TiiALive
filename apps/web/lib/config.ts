export type StreamStatus = "live" | "offline" | "connecting" | "error";

export function normalizePlaybackUrl(value: string | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return "";
    if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) return "";
    return url.toString();
  } catch {
    return "";
  }
}

const camera1Url = normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM1_URL);
const camera2Url = normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM2_URL);
const camera3Url = normalizePlaybackUrl(process.env.NEXT_PUBLIC_STREAM_CAM3_URL);

export const streamerConfig = {
  name: "DanteFDD",
  twitchChannel: process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? "dantefdd",
  description: "DanteFDD is going live around the clock for a special GTA VI event.",
  streams: {
    main: camera1Url,
    camera2: camera2Url,
    camera3: camera3Url,
  },
  socials: {
    twitch: `https://www.twitch.tv/${process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? "dantefdd"}`,
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
