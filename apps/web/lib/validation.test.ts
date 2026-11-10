import { describe, expect, it } from "vitest";

import { getDefaultEventData } from "@/lib/event-data";
import { getDefaultSiteConfig } from "@/lib/site-config";
import { parseEventData, parseJsonBody, parseSiteConfig, ValidationError } from "@/lib/validation";

describe("API payload validation", () => {
  it("accepts empty managed data and rejects malformed structures", () => {
    expect(parseEventData(getDefaultEventData()).goals).toEqual([]);
    expect(() => parseEventData({ goals: [{ id: "x", current: -1 }] })).toThrow(ValidationError);
    expect(() => parseJsonBody("{" )).toThrow("valid JSON");
    expect(() => parseJsonBody("x".repeat(64 * 1024 + 1))).toThrow("too large");
  });

  it("rejects camera URLs with credentials or unsupported schemes", () => {
    const config = getDefaultSiteConfig();
    config.cameras[0] = { ...config.cameras[0], src: "javascript:alert(1)", enabled: true };
    expect(() => parseSiteConfig(config)).toThrow("HTTP(S)");
    config.cameras[0] = { ...config.cameras[0], src: "https://user:pass@media.example.test/cam1.m3u8" };
    expect(() => parseSiteConfig(config)).toThrow("credentials");
  });
});
