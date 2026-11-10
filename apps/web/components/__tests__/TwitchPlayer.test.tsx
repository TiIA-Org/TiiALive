import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TwitchPlayer } from "@/components/TwitchPlayer";

function parentResponse(parentHostnames: string[]) {
  return {
    ok: true,
    json: async () => ({ parentHostnames }),
  } as Response;
}

describe("TwitchPlayer", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(parentResponse(["localhost", "live.example.test"])));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses Twitch's official player, the approved browser hostname, and the configured channel", async () => {
    render(<TwitchPlayer />);
    const iframe = await screen.findByTitle("dantefdd Twitch live player");
    const playerUrl = new URL(iframe.getAttribute("src") ?? "");

    expect(playerUrl.origin + playerUrl.pathname).toBe("https://player.twitch.tv/");
    expect(playerUrl.searchParams.get("parent")).toBe("localhost");
    expect(playerUrl.searchParams.get("channel")).toBe("dantefdd");
    expect(playerUrl.searchParams.get("autoplay")).toBe("false");
    expect(iframe).toHaveAttribute("allowfullscreen");
    expect(screen.getByRole("link", { name: /watch the official channel/i })).toHaveAttribute("href", "https://www.twitch.tv/dantefdd");
  });

  it("allows autoplay to be enabled explicitly", async () => {
    render(<TwitchPlayer autoplay />);
    const iframe = await screen.findByTitle("dantefdd Twitch live player");

    expect(new URL(iframe.getAttribute("src") ?? "").searchParams.get("autoplay")).toBe("true");
  });

  it("uses a responsive 16:9 player frame", async () => {
    render(<TwitchPlayer />);

    expect(screen.getByLabelText("DanteFDD Twitch player container")).toHaveClass("aspect-video");
    await screen.findByTitle("dantefdd Twitch live player");
  });

  it("shows a direct-channel fallback when the current hostname is not approved", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(parentResponse(["live.example.test"])));
    render(<TwitchPlayer />);

    expect(await screen.findByRole("alert")).toHaveTextContent("This hostname is not approved");
    expect(screen.queryByTitle("dantefdd Twitch live player")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the official channel" })).toHaveAttribute("href", "https://www.twitch.tv/dantefdd");
  });

  it("shows the direct-channel fallback if approved-domain configuration cannot be loaded", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")));
    render(<TwitchPlayer />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Network unavailable");
    expect(screen.getByRole("link", { name: "Open the official channel" })).toBeInTheDocument();
  });

  it("hydrates without reading the browser hostname during render", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<TwitchPlayer />);
    document.body.append(container);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const root = hydrateRoot(container, <TwitchPlayer />);

    await waitFor(() => expect(container.querySelector("iframe")).toBeInTheDocument());
    expect(consoleError).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    container.remove();
    consoleError.mockRestore();
  });

  it("renders only one iframe instance", async () => {
    render(<TwitchPlayer />);
    await screen.findByTitle("dantefdd Twitch live player");

    expect(screen.getAllByTitle("dantefdd Twitch live player")).toHaveLength(1);
  });
});
