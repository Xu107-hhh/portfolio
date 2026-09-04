import { ImageResponse } from "next/og";

// 社交分享卡（1200x630）。satori 默认字体不含 CJK 字形，
// 文案用英文避免渲染为方框。
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Xu Longxin — AI Product Manager Portfolio";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0b0f",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: "#8b7cff",
              fontSize: 34,
              fontWeight: 700,
              color: "#0b0b0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            X
          </div>
          <div style={{ color: "#f2efe9", fontSize: 26, letterSpacing: 6 }}>
            XU LONGXIN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#8b7cff", fontSize: 30, marginBottom: 18 }}>
            AI Product Manager
          </div>
          <div
            style={{
              color: "#f2efe9",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            From model evaluation
          </div>
          <div style={{ color: "#f2efe9", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            to product delivery.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, color: "#a09c94", fontSize: 26 }}>
          <span>Prompt Engineering</span>
          <span style={{ color: "#8b7cff" }}>·</span>
          <span>AI Agent</span>
          <span style={{ color: "#8b7cff" }}>·</span>
          <span>RAG</span>
          <span style={{ color: "#8b7cff" }}>·</span>
          <span>Multi-Agent</span>
        </div>
      </div>
    ),
    size
  );
}
