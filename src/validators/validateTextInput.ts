export default function validateTextInput(text: string) {
  const userText = text.trim();
  let error: string | null = null;

  if (!userText) {
    error = "Digite algo, sua requisição não pode conter texto vazio.";
  } else if (userText.length < 100) {
    error = "Sua requisição precisa ter pelo menos 100 caracteres.";
  } else if (userText.length > 5000) {
    error =
      "Verifique o número máximo de caracteres para fazer a sua requisição.";
  }

  return { isValid: error === null, error };
}
