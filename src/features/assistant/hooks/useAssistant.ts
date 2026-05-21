import { useState } from "react";
import { analyzeText } from "../services/groq.service";
import type { AnalysisMode, AssistantSession } from "../types";
import { EMPTY_STATE } from "../constants/initial";
import { parseQuestionResponse } from "../utils/parseQuestionResponse";

export function useAssistant() {
  const [assistantSession, setAssistantSession] =
    useState<AssistantSession>(EMPTY_STATE);

  async function analyze(text: string, mode: AnalysisMode) {
    if (assistantSession.isLoading) return;
    if (assistantSession.results[mode] !== null) return;

    setAssistantSession((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      originalText: prev.originalText || text,
    }));

    try {
      const content = await analyzeText(text, mode);
      if (mode === "questions") {
        const parsed = parseQuestionResponse(content);

        setAssistantSession((prev) => ({
          ...prev,
          results: {
            ...prev.results,
            [mode]: { mode, content: content, generatedAt: new Date() },
          },
          questions: parsed,
        }));
      } else {
        setAssistantSession((prev) => ({
          ...prev,
          results: {
            ...prev.results,
            [mode]: { mode, content: content, generatedAt: new Date() },
          },
          questions: [],
        }));
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      setAssistantSession((prev) => ({ ...prev, error: message }));
    } finally {
      setAssistantSession((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }

  function toggleReveal(questionId: string) {
    setAssistantSession((prev) => ({
      ...prev,
      questions: prev.questions.map((question) =>
        question.id === questionId
          ? { ...question, isRevealed: !question.isRevealed }
          : question,
      ),
    }));
  }

  return {
    assistantSession,
    analyze,
    toggleReveal,
  };
}
