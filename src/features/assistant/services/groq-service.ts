import { env } from "../../../config/env";
import type { AnalysisMode } from "../types";

async function analyzeText(text: string, mode: AnalysisMode): Promise<string> {
  try {
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
            role: mode,
            content: text,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error("res is not ok. :(");
    }
    const data = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
  }
}
