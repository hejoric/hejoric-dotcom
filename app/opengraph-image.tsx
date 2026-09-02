import { ImageResponse } from "next/og";

// Generated share card, so every page has a real preview image. The previous
// metadata pointed at /og-default.png, which was never committed.
export const alt = "Jose R. Herrera: CS at UVA, full-stack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS = ["#2f6fb0", "#d8593f", "#e0952a", "#1f9e75"];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf8f4",
          color: "#1a1917",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: 44,
              height: 44,
              gap: 4,
            }}
          >
            {CATEGORY_COLORS.map((color) => (
              <div
                key={color}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  background: color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Jose R. Herrera
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, letterSpacing: -1 }}>
            I build things, and I keep track of them.
          </div>
          <div style={{ fontSize: 30, color: "#5c574d", lineHeight: 1.4 }}>
            CS at the University of Virginia. Full-stack, infrastructure, and a
            year of real activity on one page.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a8478",
            fontWeight: 600,
          }}
        >
          hejoric.com
        </div>
      </div>
    ),
    size
  );
}
