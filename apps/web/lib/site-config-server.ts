import { promises as fs } from "node:fs";
import path from "node:path";

import { getDefaultSiteConfig, type EventSiteConfig } from "@/lib/site-config";

const configPath = path.join(process.cwd(), "data", "site-config.json");

export async function readSiteConfig(): Promise<EventSiteConfig> {
  try {
    const raw = await fs.readFile(configPath, "utf8");
    if (!raw.trim()) {
      const fallback = getDefaultSiteConfig();
      await writeSiteConfig(fallback);
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<EventSiteConfig>;
    const merged = {
      ...getDefaultSiteConfig(),
      ...parsed,
      cameras: Array.isArray(parsed.cameras) && parsed.cameras.length > 0 ? parsed.cameras : getDefaultSiteConfig().cameras,
    };

    return merged;
  } catch {
    const fallback = getDefaultSiteConfig();
    await writeSiteConfig(fallback);
    return fallback;
  }
}

export async function writeSiteConfig(config: EventSiteConfig): Promise<EventSiteConfig> {
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return config;
}