import { describe, expect, it } from "vitest";

import {
  buildTwitchPlayerUrl,
  getApprovedTwitchParent,
  getApprovedTwitchParentHostnames,
  normalizeTwitchHostname,
} from "./twitch-embed";

describe("Twitch embed hostname configuration", () => {
  it("includes exact configured, Vercel deployment, and branch hostnames", () => {
    expect(
      getApprovedTwitchParentHostnames({
        NODE_ENV: "production",
        TWITCH_PARENT_HOSTS: "live.example.test, www.example.test",
        VERCEL_URL: "tiia-preview-a1b2.vercel.app",
        VERCEL_BRANCH_URL: "tiia-preview.vercel.app",
      }),
    ).toEqual([
      "live.example.test",
      "www.example.test",
      "tiia-preview-a1b2.vercel.app",
      "tiia-preview.vercel.app",
    ]);
  });

  it("allows localhost only outside production", () => {
    expect(getApprovedTwitchParentHostnames({ NODE_ENV: "development" })).toContain("localhost");
    expect(getApprovedTwitchParentHostnames({ NODE_ENV: "production" })).not.toContain("localhost");
  });

  it("matches the browser hostname exactly and rejects unapproved or malformed hosts", () => {
    expect(getApprovedTwitchParent("WWW.Example.Test.", ["www.example.test"])).toBe("www.example.test");
    expect(getApprovedTwitchParent("attacker.example.test", ["example.test"])).toBeNull();
    expect(getApprovedTwitchParent("preview.vercel.app:3000", ["preview.vercel.app"])).toBeNull();
    expect(normalizeTwitchHostname("*.vercel.app")).toBeNull();
    expect(normalizeTwitchHostname("https://example.test")).toBeNull();
  });

  it("builds an official video-only player URL with autoplay disabled by default", () => {
    const url = new URL(buildTwitchPlayerUrl("dantefdd", "live.example.test"));

    expect(url.origin + url.pathname).toBe("https://player.twitch.tv/");
    expect(url.searchParams.get("channel")).toBe("dantefdd");
    expect(url.searchParams.get("parent")).toBe("live.example.test");
    expect(url.searchParams.get("autoplay")).toBe("false");
    expect(url.searchParams.get("layout")).toBe("video");
  });
});