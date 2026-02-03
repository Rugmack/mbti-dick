"use client";

import { useState } from "react";
import { calculateDiagnosis, questions, resultsData } from "@/lib/scoring";
import type { Answer, DiagnosisResult, OptionKey } from "@/lib/types";

type Phase = "start" | "quiz" | "result";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleStart = () => {
    setPhase("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (optionKey: OptionKey) => {
    const question = questions[currentQuestion];
    const newAnswers = [...answers, { questionId: question.id, optionKey }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const diagnosis = calculateDiagnosis(newAnswers);
      setResult(diagnosis);
      setPhase("result");
    }
  };

  const handleRetry = () => {
    setPhase("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getImageUrl = () => {
    if (!result) return "";
    const params = new URLSearchParams({
      typeKey: result.typeResult.typeKey,
      nameJa: result.typeResult.nameJa,
      stars: result.stars.toString(),
      exposure: result.params.exposure.toString(),
      awareness: result.params.awareness.toString(),
      collateral: result.params.collateral.toString(),
      verdict: result.typeResult.verdict,
    });
    return `/api/og?${params.toString()}`;
  };

  const handleShare = () => {
    if (!result) return;
    const text = `私は${result.typeResult.typeKey}（${result.typeResult.nameJa}）でした。\n顔ちんぽ度：${"★".repeat(result.stars)}${"☆".repeat(5 - result.stars)}\n\n#FCMBTI #診断 #ジョーク`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleDownloadImage = async () => {
    const imageUrl = getImageUrl();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fc-mbti-${result?.typeResult.typeKey || "result"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (phase === "start") {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">FC-MBTI</h1>
          <p className="subtitle">Face-Cock Behavioral Index</p>

          <div className="disclaimer">
            この診断はジョークです。医学・心理学的根拠はありません。結果は演出であり、人格や価値を断定するものではありません。
          </div>

          <p style={{ marginBottom: "24px", textAlign: "center" }}>
            20問の質問に答えて、あなたの
            <br />
            <strong>顔ちんぽ度</strong>を診断します。
          </p>

          <button className="btn btn-primary" onClick={handleStart}>
            診断スタート
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="container">
        <div className="card">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <p className="question-number">
            Q{currentQuestion + 1} / {questions.length}
          </p>

          <p className="question-text">{question.text}</p>

          <div className="options">
            {question.options.map((option) => (
              <button key={option.key} className="option-btn" onClick={() => handleAnswer(option.key as OptionKey)}>
                <span className="option-key">{option.key}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="container">
        <div className="card">
          <div className="result-header">
            <div className="type-key">{result.typeResult.typeKey}</div>
            <div className="type-name">{result.typeResult.nameJa}</div>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < result.stars ? "star-filled" : "star-empty"}>
                  {i < result.stars ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>

          <div className="params">
            <div className="param">
              <div className="param-value">{result.params.exposure}%</div>
              <div className="param-label">露出度</div>
            </div>
            <div className="param">
              <div className="param-value">{result.params.awareness}%</div>
              <div className="param-label">自覚</div>
            </div>
            <div className="param">
              <div className="param-value">{result.params.collateral}%</div>
              <div className="param-label">無自覚加害性</div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            （パラメータは演出です。値が高い＝偉い、ではありません。）
          </p>

          <div className="section-title">タイプ概要</div>
          <p className="description">{result.typeResult.description}</p>

          <div className="verdict">{result.typeResult.verdict}</div>

          <div className="section-title">引っ込めるためのヒント（※完全には治りません）</div>
          <ul className="advice-list">
            {result.typeResult.advice.map((advice, i) => (
              <li key={i}>{advice}</li>
            ))}
          </ul>

          <div className="image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImageUrl()} alt="診断結果" className="result-image" />
          </div>

          <div className="share-section">
            <button className="btn btn-primary btn-download" onClick={handleDownloadImage}>
              画像をダウンロード
            </button>
            <button className="btn btn-primary btn-share" onClick={handleShare}>
              Xでシェア
            </button>
            <button className="btn btn-retry" onClick={handleRetry}>
              もう一度診断する
            </button>
          </div>

          <p className="result-disclaimer">{resultsData.resultDisclaimer}</p>
        </div>
      </div>
    );
  }

  return null;
}
