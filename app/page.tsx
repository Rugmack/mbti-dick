"use client";

import { useState } from "react";
import { calculateDiagnosis, questions, resultsData } from "@/lib/scoring";
import type { Answer, DiagnosisResult, OptionKey } from "@/lib/types";

type Phase = "start" | "quiz" | "result";

const IMAGE_VERSION = "v2";

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
    return `/images/${result.mbti.toLowerCase()}.png?${IMAGE_VERSION}`;
  };

  const handleShare = () => {
    if (!result) return;
    const text = `【悲報】俺の顔ちんぽ、${result.typeResult.nameJa}だった\n\n${"★".repeat(result.stars)}${"☆".repeat(5 - result.stars)}（${result.stars}/5）\n\n#顔ちんぽ診断 #FCMBTI`;
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
          <h1 className="title">顔ちんぽ診断</h1>
          <p className="subtitle">FC-MBTI / Face-Cock Behavioral Index</p>

          <div className="disclaimer">
            これはクソ診断です。科学的根拠ゼロ。真に受けた人から順に顔ちんぽが伸びます。
          </div>

          <p style={{ marginBottom: "24px", textAlign: "center", lineHeight: "1.8" }}>
            あなたの顔からは、どのくらい
            <br />
            <strong style={{ fontSize: "1.2em" }}>ちんぽが生えているでしょうか？</strong>
            <br />
            <span style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
              20問の質問で暴きます
            </span>
          </p>

          <button className="btn btn-primary" onClick={handleStart}>
            己の顔ちんぽを知る
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
              <div className="param-label">巻き添え被害</div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            （数値が高いほどヤバいです）
          </p>

          <div className="section-title">症状</div>
          <p className="description">{result.typeResult.description}</p>

          <div className="verdict">{result.typeResult.verdict}</div>

          <div className="section-title">しまい方のコツ（※しまえません）</div>
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
              恥を保存する
            </button>
            <button className="btn btn-primary btn-share" onClick={handleShare}>
              Xで晒す
            </button>
            <button className="btn btn-retry" onClick={handleRetry}>
              もう一度恥をかく
            </button>
          </div>

          <p className="result-disclaimer">{resultsData.resultDisclaimer}</p>
        </div>
      </div>
    );
  }

  return null;
}
