import fs from "fs";
import path from "path";

const types = [
  { mbti: "ENTJ", typeKey: "ENTJ-FC", nameJa: "フル勃起キング", stars: 5 },
  { mbti: "ENTP", typeKey: "ENTP-FC", nameJa: "ブンブン振り回し型", stars: 4 },
  { mbti: "ENFJ", typeKey: "ENFJ-FC", nameJa: "善意のゴリ押し型", stars: 4 },
  { mbti: "ENFP", typeKey: "ENFP-FC", nameJa: "お漏らしハッピー型", stars: 3 },
  { mbti: "ESTJ", typeKey: "ESTJ-FC", nameJa: "規則カチコチ型", stars: 5 },
  { mbti: "ESTP", typeKey: "ESTP-FC", nameJa: "物理で殴る型", stars: 4 },
  { mbti: "ESFJ", typeKey: "ESFJ-FC", nameJa: "世話焼きグイグイ型", stars: 4 },
  { mbti: "ESFP", typeKey: "ESFP-FC", nameJa: "天然フルオープン型", stars: 3 },
  { mbti: "INTJ", typeKey: "INTJ-FC", nameJa: "無自覚キング", stars: 5 },
  { mbti: "INTP", typeKey: "INTP-FC", nameJa: "こじらせ肥大型", stars: 4 },
  { mbti: "INFJ", typeKey: "INFJ-FC", nameJa: "静かに刺す型", stars: 4 },
  { mbti: "INFP", typeKey: "INFP-FC", nameJa: "こじらせ内蔵型", stars: 3 },
  { mbti: "ISTJ", typeKey: "ISTJ-FC", nameJa: "マニュアル直立型", stars: 4 },
  { mbti: "ISTP", typeKey: "ISTP-FC", nameJa: "無口で存在感型", stars: 3 },
  { mbti: "ISFJ", typeKey: "ISFJ-FC", nameJa: "埋まってるけど踏むと痛い型", stars: 3 },
  { mbti: "ISFP", typeKey: "ISFP-FC", nameJa: "芽生えちゃった型", stars: 2 },
];

const verdicts: Record<string, string> = {
  ENTJ: "顔面からビンビンに主導権が生えており、誰も止められません。",
  ENTP: "高速で振り回されており、会話についていけない人が続出します。",
  ENFJ: "善意という名のそれが顔から突き出し、逃げ場を塞いでいます。",
  ENFP: "感情がそのまま顔面から漏れ出ており、隠しきれていません。",
  ESTJ: "規則正しく直立したそれが、周囲を威圧しています。",
  ESTP: "物理的にデカく、避けようがありません。",
  ESFJ: "親切という名目でグイグイ近づいてきます。逃げられません。",
  ESFP: "ナチュラルに丸出しですが、本人は気づいていません。",
  INTJ: "本人だけが気づいていない最重症タイプ。顔に全部出てます。",
  INTP: "考えすぎて肥大化したそれが、会話の邪魔をしています。",
  INFJ: "静かに、しかし確実に存在感を放っています。刺さります。",
  INFP: "内側に溜め込みすぎて、たまに暴発します。",
  ISTJ: "規則正しく直立しており、曲げようがありません。",
  ISTP: "喋らないのに見える不思議なタイプです。",
  ISFJ: "埋まっていますが、踏むと当たります。注意。",
  ISFP: "小さいけど、たまに致命傷を与えます。",
};

async function generateImages() {
  const baseUrl = "http://localhost:3000";
  const outputDir = path.join(process.cwd(), "public", "images");

  for (const type of types) {
    const params = new URLSearchParams({
      typeKey: type.typeKey,
      nameJa: type.nameJa,
      stars: type.stars.toString(),
      exposure: "70",
      awareness: "50",
      collateral: "60",
      verdict: verdicts[type.mbti],
    });

    const url = `${baseUrl}/api/og?${params.toString()}`;
    console.log(`Generating ${type.mbti}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch ${type.mbti}: ${response.status}`);
        continue;
      }
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
