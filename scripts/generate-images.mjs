import { ImageResponse } from "@vercel/og";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const types = [
  { mbti: "ENTJ", typeKey: "ENTJ-FC", nameJa: "フル勃起キング", stars: 5, verdict: "顔面からビンビンに主導権が生えており、誰も止められません。" },
  { mbti: "ENTP", typeKey: "ENTP-FC", nameJa: "ブンブン振り回し型", stars: 4, verdict: "高速で振り回されており、会話についていけない人が続出します。" },
  { mbti: "ENFJ", typeKey: "ENFJ-FC", nameJa: "善意のゴリ押し型", stars: 4, verdict: "善意という名のそれが顔から突き出し、逃げ場を塞いでいます。" },
  { mbti: "ENFP", typeKey: "ENFP-FC", nameJa: "お漏らしハッピー型", stars: 3, verdict: "感情がそのまま顔面から漏れ出ており、隠しきれていません。" },
  { mbti: "ESTJ", typeKey: "ESTJ-FC", nameJa: "規則カチコチ型", stars: 5, verdict: "規則正しく直立したそれが、周囲を威圧しています。" },
  { mbti: "ESTP", typeKey: "ESTP-FC", nameJa: "物理で殴る型", stars: 4, verdict: "物理的にデカく、避けようがありません。" },
  { mbti: "ESFJ", typeKey: "ESFJ-FC", nameJa: "世話焼きグイグイ型", stars: 4, verdict: "親切という名目でグイグイ近づいてきます。逃げられません。" },
  { mbti: "ESFP", typeKey: "ESFP-FC", nameJa: "天然フルオープン型", stars: 3, verdict: "ナチュラルに丸出しですが、本人は気づいていません。" },
  { mbti: "INTJ", typeKey: "INTJ-FC", nameJa: "無自覚キング", stars: 5, verdict: "本人だけが気づいていない最重症タイプ。顔に全部出てます。" },
  { mbti: "INTP", typeKey: "INTP-FC", nameJa: "こじらせ肥大型", stars: 4, verdict: "考えすぎて肥大化したそれが、会話の邪魔をしています。" },
  { mbti: "INFJ", typeKey: "INFJ-FC", nameJa: "静かに刺す型", stars: 4, verdict: "静かに、しかし確実に存在感を放っています。刺さります。" },
  { mbti: "INFP", typeKey: "INFP-FC", nameJa: "こじらせ内蔵型", stars: 3, verdict: "内側に溜め込みすぎて、たまに暴発します。" },
  { mbti: "ISTJ", typeKey: "ISTJ-FC", nameJa: "マニュアル直立型", stars: 4, verdict: "規則正しく直立しており、曲げようがありません。" },
  { mbti: "ISTP", typeKey: "ISTP-FC", nameJa: "無口で存在感型", stars: 3, verdict: "喋らないのに見える不思議なタイプです。" },
  { mbti: "ISFJ", typeKey: "ISFJ-FC", nameJa: "埋まってるけど踏むと痛い型", stars: 3, verdict: "埋まっていますが、踏むと当たります。注意。" },
  { mbti: "ISFP", typeKey: "ISFP-FC", nameJa: "芽生えちゃった型", stars: 2, verdict: "小さいけど、たまに致命傷を与えます。" },
];

function createImageElement(type) {
  const starsFilled = "★".repeat(type.stars);
  const starsEmpty = "☆".repeat(5 - type.stars);

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)",
        fontFamily: "sans-serif",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 32, color: "#6e6e73", marginBottom: 8 },
            children: "顔ちんぽ診断結果",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 80,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #e94560, #ff6b6b)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 8,
            },
            children: type.typeKey,
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 36, color: "#6e6e73", marginBottom: 24 },
            children: type.nameJa,
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 56, marginBottom: 32, display: "flex" },
            children: [
              {
                type: "span",
                props: { style: { color: "#ff9500" }, children: starsFilled },
              },
              {
                type: "span",
                props: { style: { color: "#d2d2d7" }, children: starsEmpty },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 24,
              color: "#e94560",
              textAlign: "center",
              maxWidth: 800,
              padding: "16px 24px",
              background: "#fff5f5",
              borderRadius: 12,
            },
            children: type.verdict,
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 24,
              fontSize: 18,
              color: "#6e6e73",
            },
            children: "※この診断はジョークです",
          },
        },
      ],
    },
  };
}

async function generateImages() {
  const outputDir = path.join(__dirname, "..", "public", "images");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const type of types) {
    console.log(`Generating ${type.mbti}...`);

    try {
      const element = createImageElement(type);
      const response = new ImageResponse(element, {
        width: 1200,
        height: 630,
      });

      const buffer = await response.arrayBuffer();
      const outputPath = path.join(outputDir, `${type.mbti.toLowerCase()}.png`);
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`Saved ${outputPath}`);
    } catch (error) {
      console.error(`Error generating ${type.mbti}:`, error);
    }
  }

  console.log("Done!");
}

generateImages();
