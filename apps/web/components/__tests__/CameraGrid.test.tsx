import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraGrid } from "@/components/CameraGrid";

describe("CameraGrid", () => {
  const streams = [
    { id: "cam1", title: "Camera 01", src: "https://media.example.test/cam1/index.m3u8", enabled: true },
    { id: "cam2", title: "Camera 02", src: "https://media.example.test/cam2/index.m3u8", enabled: true },
    { id: "cam3", title: "Camera 03", src: "", enabled: false },
  ];

  it("selects one configured camera and keeps the feeds independent", () => {
    const { container } = render(<CameraGrid streams={streams} selectedCamera="cam1" onSelectCamera={vi.fn()} />);
    expect(screen.getByLabelText("Camera 01 live stream")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Camera 02/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Camera 03/ })).toBeDisabled();
    expect(container.querySelectorAll("video")).toHaveLength(1);
  });

  it("switches feeds without rendering multiple active players", () => {
    const onSelectCamera = vi.fn();
    render(<CameraGrid streams={streams} selectedCamera="cam1" onSelectCamera={onSelectCamera} />);
    fireEvent.click(screen.getByRole("button", { name: /Camera 02/ }));
    expect(onSelectCamera).toHaveBeenCalledWith("cam2");
  });

  it("shows an explicit unavailable state when no feed is configured", () => {
    render(<CameraGrid streams={streams.map((camera) => ({ ...camera, src: "", enabled: false }))} selectedCamera="cam1" onSelectCamera={vi.fn()} />);
    expect(screen.getByText(/Camera playback is not configured/)).toBeInTheDocument();
  });
});
