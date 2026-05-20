# PDR — Lexi
### Assistente de Texto com IA

> O usuário cola qualquer conteúdo — artigo, capítulo, documentação, anotação —
> e a IA resume, explica e gera perguntas para fixação do aprendizado.

---

## Visão do produto

Estudar lendo passivamente não funciona. Lexi transforma qualquer texto em uma
sessão de estudo ativa: resumo para visão geral, explicação para aprofundamento
e perguntas para fixação — tudo gerado sob demanda, sem sair da página.

**Problema que resolve:** o gap entre "ler um conteúdo" e "realmente aprender".

**Para quem:** estudantes, desenvolvedores e profissionais que consomem muito
conteúdo técnico ou acadêmico.

---

## Princípios do projeto

- **Uma coisa bem feita** — o foco é processar texto. Não vira um chat genérico.
- **UI limpa** — a complexidade está na IA, não na interface.
- **Arquitetura que escala** — as mesmas decisões do StudyFlow: feature-based,
  separação de responsabilidades, tipos explícitos.

---

## Stack

| Tecnologia | Decisão |
|---|---|
| React + TypeScript | Stack principal — consistência com portfólio |
| TailwindCSS v4 | Estilização com design system |
| Vite | Build e dev server |
| Groq API | LLM gratuita, interface idêntica à OpenAI |
| React Router | Navegação entre páginas |
| Zod | Validação de inputs antes de enviar pra IA |

---

## Arquitetura de pastas

```
src/
├── features/
│   └── assistant/
│       ├── components/       # TextInput, ResultPanel, QuestionCard...
│       ├── hooks/            # useAssistant, useTextAnalysis
│       ├── services/         # groq.service.ts — chamadas à API isoladas
│       ├── types/            # AssistantResult, AnalysisMode, Question
│       └── constants/        # prompts.ts — system prompts centralizados
├── context/
│   └── AssistantContext      # estado global da sessão atual
├── validators/               # validateTextInput (mínimo de chars, máximo, etc)
├── pages/
│   ├── Home.tsx              # landing / input inicial
│   └── Analysis.tsx          # resultado da análise
└── components/               # componentes reutilizáveis (Button, Spinner...)
```

---

## Estrutura de dados

```typescript
// Os três modos de análise
type AnalysisMode = "summary" | "explanation" | "questions";

// Resultado de cada análise
interface AnalysisResult {
  mode: AnalysisMode;
  content: string;
  generatedAt: Date;
}

// Questão gerada pela IA
interface Question {
  id: string;
  question: string;
  answer: string;
  isRevealed: boolean; // controla se a resposta está visível
}

// Estado da sessão atual
interface AssistantSession {
  originalText: string;
  results: Record<AnalysisMode, AnalysisResult | null>;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}
```

---

## Prompts centralizados

```typescript
// features/assistant/constants/prompts.ts

export const SYSTEM_PROMPTS: Record<AnalysisMode, string> = {
  summary: `
    Você é um assistente especializado em resumos.
    Retorne APENAS um resumo em tópicos claros e objetivos.
    Máximo de 5 tópicos. Cada tópico em uma linha começando com "•".
    Não inclua introdução nem conclusão.
  `,
  explanation: `
    Você é um professor especializado em explicar conteúdo complexo de forma simples.
    Explique o texto fornecido como se estivesse ensinando para alguém que nunca viu o assunto.
    Use analogias quando possível. Responda em parágrafos curtos.
  `,
  questions: `
    Você é um especialista em criar avaliações de fixação.
    Gere exatamente 5 perguntas sobre o texto fornecido.
    Retorne APENAS um JSON válido nesse formato, sem markdown, sem explicação:
    [
      { "question": "pergunta aqui", "answer": "resposta aqui" },
      ...
    ]
  `,
};
```

---

## Entregas por fase

### Fase 1 — MVP (1 semana)
**Objetivo:** produto funcionando do zero ao resultado na tela.

- [ ] Setup do projeto (Vite + React + TS + Tailwind + React Router)
- [ ] Variável de ambiente para API key da Groq
- [ ] `groq.service.ts` — função isolada de chamada à API
- [ ] Tela de input — textarea + botão de análise
- [ ] Validação do input (mínimo 100 caracteres, máximo 5000)
- [ ] Integração com Groq — modo **resumo** funcionando
- [ ] Exibição do resultado na tela
- [ ] Loading state durante a chamada
- [ ] Error state com mensagem descritiva
- [ ] Deploy na Vercel

**Critério de conclusão:** usuário cola texto, clica em resumir, vê o resultado.

---

### Fase 2 — Três modos de análise (3-5 dias)
**Objetivo:** entregar os três pilares do produto.

- [ ] Modo **explicação** integrado
- [ ] Modo **perguntas** integrado com parse do JSON da resposta
- [ ] `QuestionCard` — exibe pergunta e revela resposta ao clicar
- [ ] Toggle entre os três modos sem precisar reenviar o texto
- [ ] Cache dos resultados na sessão (não refaz a chamada se já tem resultado)

**Critério de conclusão:** os três modos funcionam e o resultado é cacheado.

---

### Fase 3 — Experiência e polimento (3-5 dias)
**Objetivo:** produto que impressiona no portfólio.

- [ ] Histórico de sessões via localStorage
- [ ] Contador de caracteres no textarea com feedback visual
- [ ] Skeleton loading nos painéis de resultado
- [ ] Animação de entrada nos resultados
- [ ] Copiar resultado para clipboard com feedback visual
- [ ] Design responsivo completo
- [ ] Empty states com orientação ao usuário

**Critério de conclusão:** produto que você se orgulha de mostrar.

---

### Fase 4 — Diferenciais de portfólio (futuro)
**Objetivo:** funcionalidades que elevam o projeto a outro nível.

- [ ] Upload de arquivo PDF como input
- [ ] Exportar sessão como PDF ou Markdown
- [ ] Seleção de idioma do output (PT / EN)
- [ ] Modo de estudo — flashcards navegáveis das perguntas geradas
- [ ] Autenticação e histórico persistido por usuário
- [ ] Troca de modelo de IA (Groq / Gemini)

---

## Regras de desenvolvimento

### Variáveis de ambiente
```bash
# .env.local — nunca commitar
VITE_GROQ_API_KEY=gsk_sua_chave_aqui
VITE_GROQ_MODEL=llama3-8b-8192
```

### A chamada à API fica isolada em um único lugar
```typescript
// features/assistant/services/groq.service.ts
export async function analyzeText(
  text: string,
  mode: AnalysisMode
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[mode] },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Nenhum componente chama a API diretamente
Componentes chamam hooks. Hooks chamam services. Services chamam a API.

```
Componente → useAssistant() → analyzeText() → Groq API
```

---

## O que esse projeto demonstra pro mercado

| Habilidade | Como aparece no projeto |
|---|---|
| Integração com API de LLM | Groq API com system prompts estruturados |
| Prompt engineering | Prompts centralizados e tipados por modo |
| Tratamento de resposta não estruturada | Parse do JSON retornado pela IA |
| Arquitetura escalável | Feature-based, service layer, hooks isolados |
| UX de estados assíncronos | Loading, error e empty states em todos os fluxos |
| TypeScript avançado | Tipos explícitos para todos os contratos da IA |

---

## Primeiro passo

Antes de qualquer código:

```bash
npm create vite@latest lexi -- --template react-ts
cd lexi
npm install
npm install react-router-dom tailwindcss @tailwindcss/vite zod
```

Depois: criar o `.env.local` com a chave da Groq e fazer a primeira chamada
funcionar no console antes de construir qualquer UI.
