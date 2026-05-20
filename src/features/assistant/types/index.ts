export type AnalysisMode = "summary" | "explanation" | "questions";

export interface AnalysisResult {
  mode: AnalysisMode;
  content: string;
  generatedAt: Date;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  isRevealed: boolean;
}

export interface AssistantSession {
  originalText: string;
  results: Record<AnalysisMode, AnalysisResult | null>;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}
