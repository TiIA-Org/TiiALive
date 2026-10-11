import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CameraGrid } from "../CameraGrid";

describe("CameraGrid", () => {
  it("shows a single selected camera when multiview is off", () => {
    render(
      <CameraGrid
        streams={[
          { key: "cam1", title: "Camera 01", src: "http://localhost:8888/cam1/index.m3u8" },
          { key: "cam2", title: "Camera 02", src: "http://localhost:8888/cam2/index.m3u8" },
          { key: "cam3", title: "Camera 03", src: "http://localhost:8888/cam3/index.m3u8" },
        ]}
        selectedCamera="cam2"
        multiview={false}
        onSelectCamera={() => undefined}
      />,
    );

    expect(screen.getByText("Camera 02")).toBeInTheDocument();
    expect(screen.getByText("CAM 02")).toBeInTheDocument();
  });

  it("renders all cameras in a multiview layout when enabled", () => {
    render(
      <CameraGrid
        streams={[
          { key: "cam1", title: "Camera 01", src: "http://localhost:8888/cam1/index.m3u8" },
          { key: "cam2", title: "Camera 02", src: "http://localhost:8888/cam2/index.m3u8" },
          { key: "cam3", title: "Camera 03", src: "http://localhost:8888/cam3/index.m3u8" },
        ]}
        selectedCamera="cam1"
        multiview={true}
        onSelectCamera={() => undefined}
      />,
    );

    expect(screen.getAllByText(/CAM\s+0[1-3]/).length).toBeGreaterThanOrEqual(3);
  });
});
