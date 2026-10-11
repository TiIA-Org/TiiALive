import { describe, expect, it } from "vitest";

import { getDefaultEventData } from "./event-data";

describe("event data model", () => {
  it("exposes seeded challenge, leaderboard, stats and vote data", () => {
    const data = getDefaultEventData();

    expect(data.goals.length).toBeGreaterThan(0);
    expect(data.rankings.length).toBeGreaterThan(0);
    expect(data.stats.length).toBeGreaterThan(0);
    expect(data.votes.length).toBeGreaterThan(0);
    expect(data.goals[0].title).toContain("donativos");
  });
});
