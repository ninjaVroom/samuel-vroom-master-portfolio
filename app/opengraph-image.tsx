import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}, ${site.title}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#F7F8FB", color: "#0B0E1C", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 80 }}>
      <div style={{ fontSize: 28, color: "#5E6275" }}>{`${site.title} · ${site.location}`}</div>
      <div style={{ fontSize: 96, letterSpacing: -3, marginTop: 16 }}>{site.name}</div>
    </div>,
    size,
  );
}
