import type { EventData, EventGoal, EventRanking, EventStat, EventVote, EventVoteOption } from "@/lib/event-data";
import type { CameraDefinition, EventSiteConfig } from "@/lib/site-config";

export class ValidationError extends Error {}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("Expected an object");
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, max = 200): string {
  if (typeof value !== "string" || value.length > max) throw new ValidationError(`Invalid ${field}`);
  return value.trim();
}

function nonnegative(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1_000_000_000) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return value;
}

function list<T>(value: unknown, field: string, max: number, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value) || value.length > max) throw new ValidationError(`Invalid ${field}`);
  return value.map(parse);
}

function uniqueIds<T extends { id: string }>(values: T[], field: string): T[] {
  if (new Set(values.map((item) => item.id)).size !== values.length) throw new ValidationError(`Duplicate ${field} id`);
  return values;
}

function parseGoal(value: unknown): EventGoal {
  const item = record(value);
  return {
    id: text(item.id, "goal id", 80),
    title: text(item.title, "goal title", 120),
    current: nonnegative(item.current, "goal current"),
    target: nonnegative(item.target, "goal target"),
    unit: text(item.unit, "goal unit", 16),
    status: text(item.status, "goal status", 60),
  };
}

function parseRanking(value: unknown): EventRanking {
  const item = record(value);
  return {
    id: text(item.id, "ranking id", 80),
    name: text(item.name, "ranking name", 80),
    amount: text(item.amount, "ranking amount", 40),
    badge: text(item.badge, "ranking badge", 24),
  };
}

function parseStat(value: unknown): EventStat {
  const item = record(value);
  return {
    id: text(item.id, "stat id", 80),
    label: text(item.label, "stat label", 80),
    value: text(item.value, "stat value", 80),
    change: text(item.change, "stat change", 40),
  };
}

function parseVoteOption(value: unknown): EventVoteOption {
  const item = record(value);
  return {
    id: text(item.id, "vote option id", 80),
    label: text(item.label, "vote option label", 120),
    votes: nonnegative(item.votes, "vote count"),
  };
}

function parseVote(value: unknown): EventVote {
  const item = record(value);
  const options = uniqueIds(list(item.options, "vote options", 20, parseVoteOption), "vote option");
  return {
    id: text(item.id, "vote id", 80),
    question: text(item.question, "vote question", 240),
    options,
  };
}

export function parseEventData(value: unknown): EventData {
  const item = record(value);
  const goals = uniqueIds(list(item.goals, "goals", 100, parseGoal), "goal");
  const rankings = uniqueIds(list(item.rankings, "rankings", 100, parseRanking), "ranking");
  const stats = uniqueIds(list(item.stats, "stats", 100, parseStat), "stat");
  const votes = uniqueIds(list(item.votes, "votes", 20, parseVote), "vote");
  const admin = record(item.admin);
  return {
    goals,
    rankings,
    stats,
    votes,
    admin: {
      title: text(admin.title, "admin title", 120),
      lastUpdated: "",
    },
  };
}

function parseCamera(value: unknown): CameraDefinition {
  const item = record(value);
  const src = text(item.src, "camera URL", 2048);
  if (src) {
    let url: URL;
    try { url = new URL(src); } catch { throw new ValidationError("Invalid camera URL"); }
    if (!(["https:", "http:"].includes(url.protocol)) || url.username || url.password) {
      throw new ValidationError("Camera URL must use HTTP(S) and cannot contain credentials");
    }
    if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) {
      throw new ValidationError("Production camera URLs must use HTTPS and cannot be localhost");
    }
  }
  if (typeof item.enabled !== "boolean") throw new ValidationError("Invalid camera enabled state");
  return {
    id: text(item.id, "camera id", 80),
    title: text(item.title, "camera title", 80),
    src,
    enabled: item.enabled && Boolean(src),
  };
}

export function parseSiteConfig(value: unknown): EventSiteConfig {
  const item = record(value);
  const cameras = uniqueIds(list(item.cameras, "cameras", 3, parseCamera), "camera");
  if (typeof item.isLive !== "boolean" || typeof item.multiview !== "boolean") throw new ValidationError("Invalid event state");
  return {
    eventName: text(item.eventName, "event name", 160),
    description: text(item.description, "event description", 1000),
    isLive: item.isLive,
    multiview: item.multiview,
    selectedCamera: text(item.selectedCamera, "selected camera", 80),
    twitchChannel: text(item.twitchChannel, "Twitch channel", 80),
    cameras,
  };
}

export function parseJsonBody(body: string): unknown {
  if (Buffer.byteLength(body, "utf8") > 64 * 1024) throw new ValidationError("Request body too large");
  try { return JSON.parse(body) as unknown; } catch { throw new ValidationError("Request body must be valid JSON"); }
}
