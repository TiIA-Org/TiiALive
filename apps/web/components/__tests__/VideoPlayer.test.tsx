import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoPlayer } from "../VideoPlayer";

describe("VideoPlayer", () => {
  it("renders the offline state when there is no stream source", () => {
    render(<VideoPlayer src="" title="Main Camera" autoplay muted />);
    expect(screen.getAllByText("OFFLINE").length).toBeGreaterThan(0);
  });

  it("renders the stream title and connecting state", () => {
    render(<VideoPlayer src="http://localhost:8888/cam1/index.m3u8" title="Main Camera" autoplay muted />);
    expect(screen.getByText("Main Camera")).toBeInTheDocument();
    expect(screen.getAllByText("CONNECTING").length).toBeGreaterThan(0);
  });
});
