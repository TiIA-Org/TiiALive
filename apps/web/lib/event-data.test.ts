import { describe, expect, it } from "vitest";

import { getDefaultEventData } from "./event-data";

describe("event data model", () => {
  it("starts without invented event measurements", () => {
    const data = getDefaultEventData();

    expect(data.goals).toEqual([]);
    expect(data.rankings).toEqual([]);
    expect(data.stats).toEqual([]);
    expect(data.votes).toEqual([]);
  });
});
