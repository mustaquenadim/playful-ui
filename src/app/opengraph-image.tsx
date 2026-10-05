import { ImageResponse } from "next/og";

export const alt = "Playful UI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 96,
        background: "#f7f3ec",
        color: "#3b2a24",
      }}
    >
      <div style={{ fontSize: 112, fontWeight: 700 }}>Playful UI</div>
      <div style={{ fontSize: 40, marginTop: 24, opacity: 0.75 }}>
        A playful, shadcn-compatible component registry
      </div>
    </div>,
    size,
  );
}
