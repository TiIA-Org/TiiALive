import { describe, expect, it } from "vitest";

import { streamerConfig } from "./config";

describe("streamerConfig", () => {
  it("exposes all DanteFDD stream URLs and metadata", () => {
    expect(streamerConfig.name).toBe("DanteFDD");
    expect(streamerConfig.streams.main).toContain("cam1");
    expect(streamerConfig.streams.camera2).toContain("cam2");
    expect(streamerConfig.streams.camera3).toContain("cam3");
    expect(streamerConfig.socials.twitch).toBe("https://www.twitch.tv/dantefdd");
  });
});
