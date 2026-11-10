import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHls = vi.hoisted(() => ({
  handler: undefined as ((event: string, data: { fatal: boolean; type: string }) => void) | undefined,
  startLoad: vi.fn(),
  recoverMediaError: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("hls.js", () => {
  class HlsMock {
    static Events = { ERROR: "hlsError" };
    static ErrorTypes = { NETWORK_ERROR: "networkError", MEDIA_ERROR: "mediaError" };
    static isSupported() { return true; }
    constructor() { mockHls.startLoad.mockClear(); mockHls.recoverMediaError.mockClear(); }
    loadSource() {}
    attachMedia() {}
    on(_event: string, handler: typeof mockHls.handler) { mockHls.handler = handler; }
    startLoad() { mockHls.startLoad(); }
    recoverMediaError() { mockHls.recoverMediaError(); }
    destroy() { mockHls.destroy(); }
  }
  return { default: HlsMock };
});

import { VideoPlayer } from "../VideoPlayer";

describe("VideoPlayer", () => {
  beforeEach(() => { mockHls.handler = undefined; vi.clearAllMocks(); });

  it("renders an explicit offline state when there is no source", () => {
    render(<VideoPlayer src="" title="Camera 01" />);
    expect(screen.getAllByText("OFFLINE").length).toBeGreaterThan(0);
    expect(screen.getByText(/not configured yet/i)).toBeInTheDocument();
  });

  it("reports connecting until actual playback starts", () => {
    const { getByLabelText } = render(<VideoPlayer src="https://media.example.test/cam1/index.m3u8" title="Camera 01" />);
    expect(screen.getByText("Camera 01")).toBeInTheDocument();
    expect(screen.getAllByText("CONNECTING").length).toBeGreaterThan(0);
    fireEvent.playing(getByLabelText("Camera 01 live stream"));
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("retries fatal network errors only within the configured bound", () => {
    render(<VideoPlayer src="https://media.example.test/cam1/index.m3u8" title="Camera 01" />);
    act(() => mockHls.handler?.("hlsError", { fatal: true, type: "networkError" }));
    act(() => mockHls.handler?.("hlsError", { fatal: true, type: "networkError" }));
    act(() => mockHls.handler?.("hlsError", { fatal: true, type: "networkError" }));
    expect(mockHls.startLoad).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Playback could not start")).toBeInTheDocument();
  });

  it("lets viewers retry after a fatal playback error and releases the HLS instance", () => {
    const { unmount } = render(<VideoPlayer src="https://media.example.test/cam1/index.m3u8" title="Camera 01" />);
    act(() => mockHls.handler?.("hlsError", { fatal: true, type: "other" }));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mockHls.destroy).toHaveBeenCalled();
    unmount();
    expect(mockHls.destroy).toHaveBeenCalledTimes(2);
  });
});
