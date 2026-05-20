import { useEffect, useState } from "react";
import { analyzeText } from "../features/assistant/services/groq.service";

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await analyzeText(
          "Roadmap inicial para aprender React",
          "summary",
        );

        setAnalysis(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  console.log(analysis);
  return <h1>Home</h1>;
}
