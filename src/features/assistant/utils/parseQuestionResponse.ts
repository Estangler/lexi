import type { Question } from "../types";

export function parseQuestionResponse(content: string): Question[] {
  let data: unknown;

  try {
    data = JSON.parse(content);
  } catch {
    throw new Error("A IA não retornou JSON válido no modo perguntas.");
  }

  if (!Array.isArray(data)) {
    throw new Error("Formato de perguntas inválido.");
  }

  return data.map((item) => {
    const row = item as { question?: string; answer?: string };
    if (!row.question || !row.answer) {
      throw new Error("Cada item precisa de question e answer.");
    }
    return {
      id: crypto.randomUUID(),
      question: row.question,
      answer: row.answer,
      isRevealed: false,
    };
  });
}
