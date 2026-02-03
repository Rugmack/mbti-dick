import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FC-MBTI / 顔ちんぽ診断",
  description: "あなたの顔からどのくらいちんぽが生えているかを診断します（ジョーク）",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
