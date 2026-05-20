import { env } from "../../../config/env";
import { SYSTEM_PROMPTS } from "../constants/prompts";
import type { AnalysisMode, GroqResponse } from "../types";

export async function analyzeText(
  text: string,
  mode: AnalysisMode,
): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    body: JSON.stringify({
      model: env.groqModel,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS[mode],
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
  }
  const data: GroqResponse = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("invalid API response");
  }

  return content;
}
