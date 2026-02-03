export type OptionKey = "A" | "B" | "C" | "D";

export interface Option {
  key: OptionKey;
  label: string;
  mbti: string;
  fc: number;
  tags: string[];
}

export interface Question {
  id: number;
  axis: "EI" | "SN" | "TF" | "JP";
  text: string;
  options: Option[];
}

export interface Answer {
  questionId: number;
  optionKey: OptionKey;
}

export interface TypeResult {
  mbti: string;
  typeKey: string;
  nameJa: string;
  starsHint: number;
  description: string;
  verdict: string;
  advice: string[];
}

export interface DiagnosisResult {
  mbti: string;
  typeResult: TypeResult;
  fcScore: number;
  stars: number;
  params: {
    exposure: number;
    awareness: number;
    collateral: number;
  };
}
