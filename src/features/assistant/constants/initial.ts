import type { AssistantSession } from "../types";

export const EMPTY_STATE: AssistantSession = {
  error: null,
  isLoading: false,
  originalText: "",
  questions: [],
  results: { summary: null, explanation: null, questions: null },
};
