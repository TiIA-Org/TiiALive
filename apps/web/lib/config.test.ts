import { describe, expect, it } from "vitest";

import { streamerConfig } from "./config";

describe("streamerConfig", () => {
  it("centralizes the channel and does not invent camera endpoints", () => {
    expect(streamerConfig.name).toBe("DanteFDD");
    expect(streamerConfig.twitchChannel).toBe("dantefdd");
    expect(streamerConfig.streams.main).toBe("");
    expect(streamerConfig.streams.camera2).toBe("");
    expect(streamerConfig.streams.camera3).toBe("");
    expect(streamerConfig.socials.twitch).toBe("https://www.twitch.tv/dantefdd");
  });
});
