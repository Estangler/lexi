# Plano de Desenvolvimento Técnico — Lexi

---

## Escopo principal

Lexi é uma SPA que permite ao usuário colar qualquer texto e receber três análises geradas por IA: resumo em tópicos, explicação didática e perguntas de fixação com respostas reveláveis. O produto é construído em React + TypeScript com integração à Groq API, arquitetura feature-based e design system próprio com tokens âmbar.

---

## Fase 1 — Setup e Infraestrutura

### [TASK-01] Inicializar projeto com stack definida

**Definition of Done:** projeto rodando em `localhost:5173` com Tailwind, React Router e variáveis de ambiente configuradas.

- [x] Criar projeto com `npm create vite@latest lexi -- --template react-ts`
- [x] Instalar dependências: `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`, `zod`
- [x] Configurar `vite.config.ts` com plugin do Tailwind v4
- [x] Criar `.env.local` com `VITE_GROQ_API_KEY` e `VITE_GROQ_MODEL=llama3-8b-8192`
- [x] Adicionar `.env.local` ao `.gitignore`
- [x] Confirmar que `import.meta.env.VITE_GROQ_API_KEY` está acessível

---

### [TASK-02] Configurar design system no Tailwind

**Definition of Done:** todas as classes de cor do design system funcionando via tokens CSS.

- [ ] Criar `src/index.css` com bloco `@theme` contendo os tokens:
  - `--color-background: #0A0C10`
  - `--color-surface: #111520`
  - `--color-surface-elevated: #1C2130`
  - `--color-accent: #F59E0B`
  - `--color-accent-glow: rgba(245,158,11,0.12)`
  - `--color-accent-dim: rgba(245,158,11,0.25)`
  - `--color-text-primary: #F1F5F9`
  - `--color-text-secondary: #94A3B8`
  - `--color-text-tertiary: #475569`
  - `--color-border: rgba(255,255,255,0.07)`
  - `--color-border-hover: rgba(255,255,255,0.14)`
- [x] Configurar fonte Inter via Google Fonts no `index.html`
- [x] Testar classes `bg-surface`, `text-accent`, `border-border` num componente dummy

---

### [TASK-03] Configurar estrutura de pastas

**Definition of Done:** estrutura de diretórios criada conforme arquitetura feature-based definida no PDR.

- [x] Criar estrutura:

```
src/
├── features/assistant/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── constants/
├── context/
├── validators/
├── pages/
└── components/
```

- [ ] Criar `src/routes/AppRoutes.tsx` com React Router v7
- [ ] Configurar rota `/` → `Home.tsx` e `/analysis` → `Analysis.tsx`
- [ ] Configurar rota `/components` → `ComponentsDoc.tsx` (acessível só via URL)
- [ ] Criar páginas vazias com placeholder pra cada rota

---

## Fase 2 — Serviço de IA e Validação

### [TASK-04] Criar tipos e contratos da feature

**Definition of Done:** todos os tipos exportados e sem erros de TypeScript.

- [ ] Criar `src/features/assistant/types/index.ts` com:

```typescript
type AnalysisMode = "summary" | "explanation" | "questions";

interface AnalysisResult {
  mode: AnalysisMode;
  content: string;
  generatedAt: Date;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  isRevealed: boolean;
}

interface AssistantSession {
  originalText: string;
  results: Record<AnalysisMode, AnalysisResult | null>;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}
```

---

### [TASK-05] Criar system prompts centralizados

**Definition of Done:** prompts exportados, tipados e consumíveis pelo service.

- [ ] Criar `src/features/assistant/constants/prompts.ts`
- [ ] Escrever prompt para modo `summary`:
  - Instrução para retornar bullets em português
  - Máximo 5 tópicos
  - Sem introdução nem conclusão
- [ ] Escrever prompt para modo `explanation`:
  - Explicação didática com analogias
  - Parágrafos curtos
- [ ] Escrever prompt para modo `questions`:
  - Retornar **apenas** JSON válido — sem markdown, sem texto extra
  - Array com 5 objetos `{ question, answer }`
- [ ] Tipar `SYSTEM_PROMPTS` como `Record<AnalysisMode, string>`

---

### [TASK-06] Criar Groq service isolado

**Definition of Done:** `analyzeText()` retorna string com resposta da IA; erros lançados com mensagem descritiva.

- [ ] Criar `src/features/assistant/services/groq.service.ts`
- [ ] Implementar função `analyzeText(text: string, mode: AnalysisMode): Promise<string>`
- [ ] Montar payload com `model`, `messages` (system + user)
- [ ] Adicionar verificação `if (!response.ok) throw new Error(...)`
- [ ] Retornar `data.choices[0].message.content`
- [ ] Testar chamada no console antes de integrar com UI

---

### [TASK-07] Criar validador de input

**Definition of Done:** `validateTextInput()` retorna erros descritivos para inputs inválidos.

- [ ] Criar `src/validators/validateTextInput.ts`
- [ ] Validar mínimo de 100 caracteres
- [ ] Validar máximo de 5000 caracteres
- [ ] Retornar `{ isValid: boolean, error: string | null }`
- [ ] Usar Zod schema como alternativa: `z.string().min(100).max(5000)`

---

## Fase 3 — Hook e Gerenciamento de Estado

### [TASK-08] Criar useAssistant hook

**Definition of Done:** hook expõe estado da sessão e função `analyze()` que atualiza estado corretamente em todos os cenários.

- [ ] Criar `src/features/assistant/hooks/useAssistant.ts`
- [ ] Inicializar estado `AssistantSession` com valores padrão
- [ ] Implementar `analyze(text: string, mode: AnalysisMode)`:
  - Setar `isLoading: true` e `error: null`
  - Chamar `analyzeText()` do service
  - Para modo `questions`: fazer `JSON.parse()` da resposta e mapear pra `Question[]` com `crypto.randomUUID()`
  - Salvar resultado em `results[mode]` — cache por modo
  - Setar `isLoading: false` no `finally`
- [ ] Implementar `toggleReveal(id: string)` para `QuestionCard`
- [ ] Implementar verificação de cache: se `results[mode]` já existe, não refaz a chamada
- [ ] Tratar erro de `JSON.parse` no modo questions separadamente

---

## Fase 4 — Componentes de UI

### [TASK-09] Criar componentes base reutilizáveis

**Definition of Done:** componentes renderizam corretamente e aceitam as props tipadas.

- [ ] `src/components/Button.tsx` — variantes: `primary`, `ghost`; estados: `loading`, `disabled`
- [ ] `src/components/Spinner.tsx` — animação CSS, tamanho configurável
- [ ] `src/components/Badge.tsx` — recebe `label` e `variant`
- [ ] `src/components/Navbar.tsx` — logo `Lexi.` + badge `✦ Powered by Groq` com pulse animation

---

### [TASK-10] Criar componente TextInput

**Definition of Done:** textarea com contador, validação visual e animações especificadas.

- [ ] Criar `src/features/assistant/components/TextInput.tsx`
- [ ] Textarea com `placeholder` e `value` controlado
- [ ] Contador de caracteres: `{length} / 5.000`
- [ ] Mudar cor do contador para âmbar acima de 80% e vermelho no limite
- [ ] Border âmbar no `focus` + box-shadow glow `0 0 0 3px rgba(245,158,11,0.08)`
- [ ] Botão `Analisar texto` no rodapé com estados: padrão, hover, active, loading, disabled
- [ ] Chamar `validateTextInput()` antes de submeter
- [ ] Exibir mensagem de erro de validação abaixo do textarea

---

### [TASK-11] Criar componente TabGroup

**Definition of Done:** tabs trocam corretamente, tab ativa tem estilo âmbar, ponto indicador aparece quando modo tem cache.

- [ ] Criar `src/features/assistant/components/TabGroup.tsx`
- [ ] Receber `activeTab`, `onTabChange`, `cachedModes` como props
- [ ] Renderizar 3 tabs: Resumo, Explicação, Perguntas
- [ ] Aplicar estilo ativo: background `surface-elevated`, texto âmbar, border âmbar sutil
- [ ] Hover em tab inativa: texto primário, background sutil
- [ ] Ponto âmbar `●` ao lado do label quando modo está em cache
- [ ] Transição `150ms ease` em todas as mudanças de estado

---

### [TASK-12] Criar componente ResultCard

**Definition of Done:** card exibe conteúdo do modo ativo com animação de entrada e botão copiar funcional.

- [ ] Criar `src/features/assistant/components/ResultCard.tsx`
- [ ] Animação de entrada: `opacity 0→1` + `translateY(6px→0)` em `250ms ease-out`
- [ ] Troca de tab: fade out `100ms` + fade in `200ms`
- [ ] Header com badge do modo ativo + botão `Copiar`
- [ ] Botão Copiar: usa `navigator.clipboard.writeText()`, muda label pra `Copiado! ✓` por 2000ms
- [ ] Renderização condicional: modo `summary`/`explanation` → texto; modo `questions` → lista de `QuestionCard`

---

### [TASK-13] Criar componente QuestionCard

**Definition of Done:** pergunta exibe/oculta resposta com animação, estado de reveal controlado pelo hook.

- [ ] Criar `src/features/assistant/components/QuestionCard.tsx`
- [ ] Receber `question: Question` e `onToggle: (id: string) => void`
- [ ] Exibir pergunta sempre visível
- [ ] Botão `Ver resposta` / `Ocultar` baseado em `question.isRevealed`
- [ ] Reveal com `max-height + opacity` em `250ms ease`
- [ ] Hover no card: border muda de `border` para `border-hover` em `150ms`

---

### [TASK-14] Criar estados de UI

**Definition of Done:** loading, empty e error aparecem nos momentos corretos e com visual especificado.

- [ ] `SkeletonLoader.tsx` — linhas com shimmer animation `1.4s infinite`
- [ ] `EmptyState.tsx` — ícone âmbar + texto orientando o usuário + sem bordas
- [ ] `ErrorState.tsx` — banner vermelho sutil + shake animation `300ms` na entrada

---

## Fase 5 — Páginas

### [TASK-15] Montar página Home

**Definition of Done:** usuário cola texto, clica em analisar e é redirecionado para `/analysis` com resultado.

- [ ] Criar `src/pages/Home.tsx`
- [ ] Compor `Navbar` + título + subtítulo + `TextInput`
- [ ] Ao submeter: chamar `analyze()` do hook para modo `summary` (primeiro modo padrão)
- [ ] Redirecionar para `/analysis` com `useNavigate()` após disparar análise
- [ ] Passar texto via estado do router ou Context

---

### [TASK-16] Montar página Analysis

**Definition of Done:** página exibe resultado correto para cada tab, cache funciona e navegação de volta funciona.

- [ ] Criar `src/pages/Analysis.tsx`
- [ ] Compor `Navbar` + link `← Novo texto` + `TabGroup` + `ResultCard`
- [ ] `TabGroup` chama `analyze()` apenas se modo não está em cache
- [ ] Exibir `SkeletonLoader` quando `isLoading: true`
- [ ] Exibir `ErrorState` quando `error !== null`
- [ ] Link `← Novo texto` navega de volta para `/` com `useNavigate()`

---

### [TASK-17] Montar página de documentação `/components`

**Definition of Done:** rota acessível via URL com tokens, componentes e animações documentados e interativos.

- [ ] Criar `src/pages/ComponentsDoc.tsx`
- [ ] Seção **Cores**: grid de swatches com nome e hex de cada token
- [ ] Seção **Componentes**: cada componente em estado real com medidas anotadas
- [ ] Seção **Animações**: lista com botão `Testar` que demonstra cada animação ao clicar
- [ ] Sem link na navbar — acessível apenas via `/components`

---

## Fase 6 — Responsividade e Polimento

### [TASK-18] Implementar responsividade mobile

**Definition of Done:** layout funciona corretamente em viewport de 375px sem scroll horizontal.

- [ ] Textarea: altura `120px` no mobile, `160px` no desktop
- [ ] Tabs: labels reduzidos no mobile (ícone + nome curto)
- [ ] Botão `Analisar texto`: largura total no mobile
- [ ] Padding: `16px` mobile, `40px` desktop
- [ ] Testar nos breakpoints `375px`, `768px` e `1280px`

---

### [TASK-19] Implementar navbar com scroll behavior

**Definition of Done:** navbar recebe blur ao fazer scroll, transição suave.

- [ ] Adicionar `useEffect` com listener de `scroll` no `Navbar.tsx`
- [ ] Aplicar `backdrop-filter: blur(12px)` e `border-bottom` quando `scrollY > 10`
- [ ] Transição `200ms ease` na mudança de estado
- [ ] Remover listener no cleanup do `useEffect`

---

### [TASK-20] Histórico de sessões no localStorage

**Definition of Done:** sessões anteriores persistidas e acessíveis após reload.

- [ ] Criar `src/storage/getStorage.ts` e `saveStorage.ts` com genéricos TypeScript
- [ ] Adicionar `try/catch` no `JSON.parse` do `getStorage`
- [ ] Salvar sessão atual no localStorage ao receber primeiro resultado
- [ ] Listar sessões anteriores numa seção colapsável na página Home (máximo 5 sessões)
- [ ] Ao clicar numa sessão anterior: restaurar `originalText` e `results` no hook

---

## Fase 7 — Deploy

### [TASK-21] Preparar projeto para produção

**Definition of Done:** build sem erros, variáveis de ambiente configuradas na Vercel, URL pública funcionando.

- [ ] Rodar `npm run build` e corrigir todos os erros de TypeScript
- [ ] Criar projeto na Vercel via `vercel --prod` ou dashboard
- [ ] Adicionar `VITE_GROQ_API_KEY` e `VITE_GROQ_MODEL` nas variáveis de ambiente da Vercel
- [ ] Testar URL de produção com texto real
- [ ] Atualizar README com link de deploy
- [ ] Atualizar currículo com link do projeto

---

## Resumo de tarefas por fase

| Fase                       | Tasks        | Estimativa   |
| -------------------------- | ------------ | ------------ |
| Setup e Infraestrutura     | TASK-01 a 03 | 1 dia        |
| Serviço de IA e Validação  | TASK-04 a 07 | 2 dias       |
| Hook e Estado              | TASK-08      | 1 dia        |
| Componentes de UI          | TASK-09 a 14 | 3 dias       |
| Páginas                    | TASK-15 a 17 | 2 dias       |
| Responsividade e Polimento | TASK-18 a 20 | 2 dias       |
| Deploy                     | TASK-21      | 1 dia        |
| **Total**                  | **21 tasks** | **~12 dias** |
