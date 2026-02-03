import type { Answer, DiagnosisResult, OptionKey, Question, TypeResult } from "./types";
import questionsData from "@/data/questions.json";
import resultsData from "@/data/results.json";

const questions = questionsData.questions as Question[];
const scoring = questionsData.scoring;
const types = resultsData.types as TypeResult[];

function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}

function getSelectedOption(question: Question, optionKey: OptionKey) {
  return question.options.find((o) => o.key === optionKey);
}

export function calculateMBTI(answers: Answer[]): string {
  const axes: Record<string, { first: string; second: string }> = {
    EI: { first: "E", second: "I" },
    SN: { first: "S", second: "N" },
    TF: { first: "T", second: "F" },
    JP: { first: "J", second: "P" },
  };

  const counts: Record<string, Record<string, number>> = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  for (const answer of answers) {
    const question = getQuestionById(answer.questionId);
    if (!question) continue;

    const option = getSelectedOption(question, answer.optionKey);
    if (!option) continue;

    counts[question.axis][option.mbti]++;
  }

  let mbti = "";
  for (const [axis, { first, second }] of Object.entries(axes)) {
    const firstCount = counts[axis][first];
    const secondCount = counts[axis][second];

    if (firstCount > secondCount) {
      mbti += first;
    } else if (secondCount > firstCount) {
      mbti += second;
    } else {
      // Tiebreaker: first option wins
      mbti += first;
    }
  }

  return mbti;
}

export function calculateFCScore(answers: Answer[], mbti: string): number {
  let score = 0;

  // Base points from option keys
  for (const answer of answers) {
    const basePoints =
      scoring.fc.basePointsByOptionKey[answer.optionKey as keyof typeof scoring.fc.basePointsByOptionKey];
    score += basePoints || 0;
  }

  // Bonuses
  for (const bonus of scoring.fc.bonuses) {
    if ("ifDominant" in bonus && bonus.ifDominant) {
      if (mbti.includes(bonus.ifDominant)) {
        score += bonus.add;
      }
    }
    if ("ifMbtiIn" in bonus && bonus.ifMbtiIn) {
      if (bonus.ifMbtiIn.includes(mbti)) {
        score += bonus.add;
      }
    }
  }

  return score;
}

export function calculateStars(fcScore: number): number {
  for (const range of scoring.fc.stars) {
    if (fcScore >= range.min && fcScore <= range.max) {
      return range.stars;
    }
  }
  return 1;
}

export function calculateParams(
  answers: Answer[],
  mbti: string,
  fcScore: number
): { exposure: number; awareness: number; collateral: number } {
  const params = scoring.fc.params;

  // Count B and D selections
  let bCount = 0;
  let dCount = 0;
  for (const answer of answers) {
    if (answer.optionKey === "B") bCount++;
    if (answer.optionKey === "D") dCount++;
  }

  // Awareness: base + B bonus - D penalty
  let awareness = params.awareness.base + bCount * params.awareness.addPerB - dCount * params.awareness.subPerD;
  awareness = Math.max(params.awareness.clamp[0], Math.min(params.awareness.clamp[1], awareness));

  // Collateral: base + D bonus + MBTI bonuses
  let collateral = params.collateral.base + dCount * params.collateral.addPerD;
  if (mbti.includes("T")) {
    collateral += params.collateral.addIfDominantT;
  }
  if (mbti.includes("J")) {
    collateral += params.collateral.addIfDominantJ;
  }
  collateral = Math.max(params.collateral.clamp[0], Math.min(params.collateral.clamp[1], collateral));

  // Exposure: normalized from fcScore (max possible ~80)
  const maxPossibleScore = 80;
  const exposure = Math.min(params.exposure.cap, Math.round((fcScore / maxPossibleScore) * 100));

  return {
    exposure,
    awareness: Math.round(awareness),
    collateral: Math.round(collateral),
  };
}

export function getTypeResult(mbti: string): TypeResult {
  const result = types.find((t) => t.mbti === mbti);
  if (!result) {
    // Fallback if MBTI not found
    return {
      mbti,
      typeKey: `${mbti}-FC`,
      nameJa: "不明型",
      starsHint: 3,
      description: "あなたのタイプは特定できませんでした。",
      verdict: "何かが顔から出ているようです。",
      advice: ["もう一度診断してみてください。"],
    };
  }
  return result;
}

export function calculateDiagnosis(answers: Answer[]): DiagnosisResult {
  const mbti = calculateMBTI(answers);
  const fcScore = calculateFCScore(answers, mbti);
  const stars = calculateStars(fcScore);
  const params = calculateParams(answers, mbti, fcScore);
  const typeResult = getTypeResult(mbti);

  return {
    mbti,
    typeResult,
    fcScore,
    stars,
    params,
  };
}

export { questions, resultsData };
