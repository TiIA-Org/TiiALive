import { promises as fs } from "node:fs";
import path from "node:path";

import { getDefaultEventData, type EventData } from "@/lib/event-data";

const dataPath = path.join(process.cwd(), "data", "event-data.json");

export async function readEventData(): Promise<EventData> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    if (!raw.trim()) {
      const fallback = getDefaultEventData();
      await writeEventData(fallback);
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<EventData>;
    const defaultData = getDefaultEventData();

    return {
      goals: Array.isArray(parsed.goals) && parsed.goals.length > 0 ? parsed.goals : defaultData.goals,
      rankings: Array.isArray(parsed.rankings) && parsed.rankings.length > 0 ? parsed.rankings : defaultData.rankings,
      stats: Array.isArray(parsed.stats) && parsed.stats.length > 0 ? parsed.stats : defaultData.stats,
      votes: Array.isArray(parsed.votes) && parsed.votes.length > 0 ? parsed.votes : defaultData.votes,
      admin: {
        ...defaultData.admin,
        ...(parsed.admin ?? {}),
      },
    };
  } catch {
    const fallback = getDefaultEventData();
    await writeEventData(fallback);
    return fallback;
  }
}

export async function writeEventData(data: EventData): Promise<EventData> {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return data;
}