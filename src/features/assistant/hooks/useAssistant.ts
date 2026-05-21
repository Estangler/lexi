import { useState } from "react";
import { analyzeText } from "../services/groq.service";
import type { AnalysisMode, AssistantSession } from "../types";
import { EMPTY_STATE } from "../constants/initial";

export function useAssistant() {
  const [assistantSession, setAssistantSession] =
    useState<AssistantSession>(EMPTY_STATE);

  async function analyze(text: string, mode: AnalysisMode) {
    if (assistantSession.results[mode] !== null) return;

    setAssistantSession((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const content = await analyzeText(text, mode);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setAssistantSession((prev) => ({
          ...prev,
          error: error.message,
        }));
      }
    } finally {
      setAssistantSession((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }

  return {
    assistantSession,
  };
}
