export type TwitchParentEnvironment = {
  NODE_ENV?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  TWITCH_PARENT_HOSTS?: string;
};

export function normalizeTwitchHostname(value: string): string | null {
  const hostname = value.trim().toLowerCase().replace(/\.$/, "");
  const labels = hostname.split(".");
  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

  if (
    hostname.length > 253 ||
    labels.some((label) => !validLabel.test(label)) ||
    hostname.includes("..")
  ) {
    return null;
  }

  return hostname;
}

export function getApprovedTwitchParentHostnames(
  environment: TwitchParentEnvironment,
): string[] {
  const configuredHosts = environment.TWITCH_PARENT_HOSTS?.split(",") ?? [];
  const deploymentHosts = [environment.VERCEL_URL ?? "", environment.VERCEL_BRANCH_URL ?? ""];
  const localHosts = environment.NODE_ENV === "production" ? [] : ["localhost", "127.0.0.1"];
  const hostnames = [...configuredHosts, ...deploymentHosts, ...localHosts]
    .map(normalizeTwitchHostname)
    .filter((hostname): hostname is string => hostname !== null);

  return [...new Set(hostnames)];
}

export function getApprovedTwitchParent(
  browserHostname: string,
  approvedHostnames: readonly string[],
): string | null {
  const hostname = normalizeTwitchHostname(browserHostname);
  if (!hostname) return null;

  return approvedHostnames.some((approved) => normalizeTwitchHostname(approved) === hostname)
    ? hostname
    : null;
}

export function buildTwitchPlayerUrl(
  channel: string,
  parentHostname: string,
  autoplay = false,
): string {
  const parameters = new URLSearchParams({
    channel,
    parent: parentHostname,
    autoplay: String(autoplay),
    layout: "video",
    muted: "true",
  });

  return `https://player.twitch.tv/?${parameters.toString()}`;
}