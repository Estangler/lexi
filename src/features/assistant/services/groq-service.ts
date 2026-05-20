import { env } from "../../../config/env";

async function testGroq() {
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
            role: "user",
            content: "Diga apenas: Say my name! beyonce",
          },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error("res is not ok. :(");
    }
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
