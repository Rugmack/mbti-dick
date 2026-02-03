import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const typeKey = searchParams.get("typeKey") || "XXXX-FC";
  const nameJa = searchParams.get("nameJa") || "不明型";
  const stars = parseInt(searchParams.get("stars") || "3", 10);
  const exposure = searchParams.get("exposure") || "50";
  const awareness = searchParams.get("awareness") || "50";
  const collateral = searchParams.get("collateral") || "50";
  const verdict = searchParams.get("verdict") || "";

  const starsFilled = "★".repeat(stars);
  const starsEmpty = "☆".repeat(5 - stars);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 32,
            color: "#a0a0a0",
            marginBottom: 8,
          }}
        >
          FC-MBTI 診断結果
        </div>

        {/* Type Key */}
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #e94560, #ff9966)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 8,
          }}
        >
          {typeKey}
        </div>

        {/* Type Name */}
        <div
          style={{
            fontSize: 36,
            color: "#a0a0a0",
            marginBottom: 24,
          }}
        >
          {nameJa}
        </div>

        {/* Stars */}
        <div
          style={{
            fontSize: 56,
            marginBottom: 32,
            display: "flex",
          }}
        >
          <span style={{ color: "#ffd700", textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}>
            {starsFilled}
          </span>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>{starsEmpty}</span>
        </div>

        {/* Parameters */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 32px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: "bold", color: "#e94560" }}>{exposure}%</div>
            <div style={{ fontSize: 18, color: "#a0a0a0" }}>露出度</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 32px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: "bold", color: "#e94560" }}>{awareness}%</div>
            <div style={{ fontSize: 18, color: "#a0a0a0" }}>自覚</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 32px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: "bold", color: "#e94560" }}>{collateral}%</div>
            <div style={{ fontSize: 18, color: "#a0a0a0" }}>無自覚加害性</div>
          </div>
        </div>

        {/* Verdict */}
        {verdict && (
          <div
            style={{
              fontSize: 24,
              color: "#e94560",
              textAlign: "center",
              maxWidth: 800,
              padding: "16px 24px",
              background: "rgba(233, 69, 96, 0.1)",
              borderRadius: 12,
            }}
          >
            {verdict}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 18,
            color: "#666",
          }}
        >
          ※この診断はジョークです
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
