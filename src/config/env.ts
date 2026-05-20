type EnvKey = "VITE_GROQ_API_KEY" | "VITE_GROQ_MODEL";

function getEnv(name: EnvKey): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing env variable ${name}`);
  }

  return value;
}

export const env = {
  groqApiKey: getEnv("VITE_GROQ_API_KEY"),
  groqModel: getEnv("VITE_GROQ_MODEL"),
};
