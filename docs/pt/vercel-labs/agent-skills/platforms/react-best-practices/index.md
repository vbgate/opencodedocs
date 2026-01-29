---
title: "Otimização React: 57 Regras da Vercel | Agent Skills"
sidebarTitle: "Desempenho React"
subtitle: "Melhores Práticas de Otimização de Desempenho do React/Next.js"
description: "Aprenda otimização de desempenho do React e Next.js com 57 regras da Vercel. Elimine cachoeiras, otimize bundle e reduza Re-render."
tags:
  - "React"
  - "Next.js"
  - "Otimização de Desempenho"
  - "Auditoria de Código"
prerequisite:
  - "start-getting-started"
---

# Melhores Práticas de Otimização de Desempenho do React/Next.js

## O Que Você Poderá Fazer Após Este Curso

- 🎯 Deixe a IA auditar automaticamente código em busca de problemas de desempenho e dar sugestões de otimização
- ⚡ Elimine cachoeiras, acelere o carregamento da página 2-10 vezes
- 📦 Otimize o tamanho do empacotamento, reduza o tempo de carregamento inicial
- 🔄 Reduza Re-render, melhore a velocidade de resposta da página
- 🏗️ Aplique as melhores práticas de produção da equipe de engenharia da Vercel

## Seu Desafio Atual

Você escreveu código React, mas sente que algo não está certo:

- A página carrega lentamente, abrindo o Developer Tools você não vê os problemas
- O código gerado pela IA funciona, mas você não sabe se atende às melhores práticas de desempenho
- Você vê os aplicativos Next.js de outras pessoas rodando rápido, mas o seu trava
- Você sabe algumas técnicas de otimização (como `useMemo`, `useCallback`), mas não sabe quando usar
- Cada auditoria de código exige verificar manualmente problemas de desempenho, com baixa eficiência

Na verdade, a equipe de engenharia da Vercel já resumiu um conjunto de **57 regras** de otimização de desempenho validadas na prática, cobrindo todos os cenários desde "eliminando cachoeiras" até "modos avançados". Agora, essas regras foram empacotadas no Agent Skills, e você pode deixar a IA auditar e corrigir problemas de código automaticamente.

::: info O que é "Agent Skills"
Agent Skills é um pacote de habilidades para agentes de codificação por IA (como Claude, Cursor, Copilot). Após a instalação, a IA aplicará automaticamente essas regras em tarefas relevantes, como se tivesse equipado o Claude com o cérebro de um engenheiro da Vercel.
:::

## Quando Usar Esta Abordagem

Cenários típicos para usar a habilidade de Melhores Práticas do React:

- ❌ **Inaplicável**: Páginas estáticas simples, componentes sem interação complexa
- ✅ **Aplicável**:
  - Escrevendo novos componentes React ou páginas Next.js
  - Implementando busca de dados client-side ou server-side
  - Auditoria ou refatorando código existente
  - Otimizando tamanho de bundle ou tempo de carregamento
  - Feedback de experiência de usuário sobre página lenta

## 🎒 Preparação Antes de Começar

::: warning Verificação de Pré-requisitos
Antes de começar, certifique-se de que você:
1. Instalou o Agent Skills (consulte [Guia de Instalação](../../start/installation/))
2. Entende o básico de React e Next.js
3. Possui um projeto React/Next.js que precisa de otimização
:::

## Ideia Central

Otimização de desempenho do React não é apenas usar alguns Hooks, mas sim resolver problemas do nível de **arquitetura**. As 57 regras da Vercel são divididas em 8 categorias por prioridade:

| Prioridade   | Categoria   | Foco                     | Benefício Típico                    |
|--- | --- | --- | ---|
| **CRITICAL** | Eliminando Cachoeiras | Evita operações assíncronas em série | Melhoria 2-10×              |
| **CRITICAL** | Otimização de Bundle      | Reduz o tamanho do bundle inicial | Melhoria significativa no TTI/LCP |
| **HIGH**      | Desempenho no Servidor  | Otimiza busca de dados e cache   | Reduz a carga no servidor          |
| **MEDIUM-HIGH** | Busca de Dados no Cliente | Evita requisições duplicadas    | Reduz tráfego de rede            |
| **MEDIUM**    | Otimização de Re-render     | Reduz re-renders desnecessários | Melhora velocidade de resposta    |
| **MEDIUM**    | Desempenho de Renderização | Otimiza CSS e execução de JS   | Melhora frame rate                 |
| **LOW-MEDIUM** | Desempenho JavaScript  | Micro-otimizações de código     | Melhoria de 5-20%                |
| **LOW**       | Modos Avançados            | Otimização de cenários de borda    | Casos de borda                  |

**Princípios Fundamentais**:
1. **Priorize resolver problemas de níveis CRITICAL e HIGH** — essas mudanças trazem os maiores benefícios
2. **Comece pelo fluxo de dados** — otimize primeiro operações assíncronas e busca de dados
3. **Depois otimize a renderização** — finalmente considere `useMemo`, `useCallback` etc.

## Siga-me

### Passo 1: Acione Auditoria de Desempenho da IA

Abra seu projeto React/Next.js, no Claude ou Cursor digite:

```
Review this React component for performance issues
```

Ou

```
Apply React best practices to optimize this code
```

**Você Deve Ver**: A IA ativará a habilidade `vercel-react-best-practices`, e começará a aplicar as regras de verificação ao código.

### Passo 2: IA Detecta Automaticamente Problemas

A IA verificará o código linha por linha, e ao descobrir problemas fornecerá sugestões de correção. Por exemplo:

```typescript
// ❌ Seu código original (tem problema)
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**Feedback da IA**:

```
⚠️ async-parallel: 3 requisições independentes executadas em série, causando cachoeira
Impacto: CRITICAL (melhoria 2-10×)

Sugestão:
Use Promise.all() para executar requisições independentes em paralelo, reduzindo 3 viagens de rede para 1.
```

**Código de Correção da IA**:
```typescript
// ✅ Após correção (busca paralela)
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### Passo 3: Exemplos de Problemas Comuns

Abaixo estão alguns problemas de desempenho típicos e soluções:

#### Problema 1: Componente Grande Causa Tamanho Inicial do Bundle Muito Grande

```typescript
// ❌ Incorreto: Editor Monaco carregado com bundle principal (~300KB)
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ Correto: import dinâmico, carregamento sob demanda
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Regra**: `bundle-dynamic-imports` (CRITICAL)

#### Problema 2: Re-render Desnecessário

```typescript
// ❌ Incorreto: cada atualização do pai causa re-render de ExpensiveList
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

```typescript
// ✅ Correto: use React.memo para evitar re-renders desnecessários
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  // ...
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

**Regra**: `rerender-memo` (MEDIUM)

#### Problema 3: Derivar Estado no Effect

```typescript
// ❌ Incorreto: Effect desnecessário e re-render adicional
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ Correto: derivar estado durante render, sem Effect
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**Regra**: `rerender-derived-state-no-effect` (MEDIUM)

### Passo 4: Otimização de Desempenho no Servidor (Next.js Específico)

Se você usa Next.js, a IA também verificará o desempenho no servidor:

```typescript
// ❌ Incorreto: múltiplos fetch independentes executados em série
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ Correto: buscar todos os dados em paralelo
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**Regra**: `server-parallel-fetching` (**CRITICAL**)

### Passo 5: React.cache para Cálculos Repetidos

```typescript
// ❌ Incorreto: recalcula a cada render
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ Correto: usar React.cache para cache, mesma solicitação apenas uma vez
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // pode reusar userData
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**Regra**: `server-cache-react` (**MEDIUM**)

## Ponto de Verificação ✅

Após concluir as etapas acima, verifique se você dominou:

- [ ] Sabe como acionar auditoria de desempenho do React pela IA
- [ ] Entende a importância de "eliminando cachoeiras" (nível CRITICAL)
- [ ] Sabe quando usar `Promise.all()` para requisições paralelas
- [ ] Entende o papel de importações dinâmicas (`next/dynamic`)
- [ ] Sabe como reduzir re-renders desnecessários
- [ ] Entende o papel do React.cache no servidor
- [ ] Consegue identificar problemas de desempenho no código

## Armadilhas

### Armadilha 1: Otimização Excessiva

::: warning Não Otimize Precocemente
Otimize apenas quando realmente existirem problemas de desempenho. Uso prematuro de `useMemo`, `useCallback` pode tornar o código mais difícil de ler, e pode trazer retornos negativos.

**Lembre-se**:
- Meça primeiro com o React DevTools Profiler
- Priorize resolver problemas de níveis CRITICAL e HIGH
- `useMemo` apenas quando "custo de computação durante render for alto"
:::

### Armadilha 2: Ignorar Desempenho no Servidor

::: tip Particularidade do Next.js
O Next.js tem muitas técnicas de otimização no servidor (React.cache, parallel fetching, after()), que trazem benefícios maiores que otimizações no cliente.

**Prioridade**: Otimização no servidor > Otimização no cliente > Micro-otimizações
:::

### Armadilha 3: Envolver Todos os Componentes com React.memo

::: danger React.memo Não é Bala de Prata
`React.memo` só é útil quando "props não mudam mas o componente pai atualiza frequentemente".

**Uso Incorreto**:
- Componentes simples (tempo de render < 1ms)
- Componentes cujas props mudam frequentemente
- Componentes que precisam responder a atualizações do pai

:::

### Armadilha 4: Derivar Estado com `useEffect`

Estado derivado (derived state) deve ser calculado durante a render, não com `useEffect` + `setState`.

```typescript
// ❌ Incorreto: derivar estado com Effect (re-render adicional)
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ Correto: calcular durante render (zero overhead adicional)
const filtered = items.filter(...)
```

## Resumo da Lição

Princípios fundamentais de otimização de desempenho do React:

1. **Elimine Cachoeiras**: Operações independentes usem `Promise.all()` para execução paralela
2. **Reduza o Tamanho do Bundle**: Componentes grandes usem importações dinâmicas `next/dynamic`
3. **Reduza Re-render**: Use `React.memo` para envolver componentes puros, evite Effects desnecessários
4. **Priorize Otimização no Servidor**: `React.cache` e busca paralela do Next.js trazem os maiores benefícios
5. **Auditoria Automatizada por IA**: Deixe o Agent Skills ajudá-lo a descobrir e corrigir problemas

As 57 regras da Vercel cobrem todos os cenários da arquitetura até micro-otimizações. Depois de dominar como acionar a IA para aplicar essas regras, a qualidade do seu código melhorará significativamente.

## Próxima Lição

Em seguida, aprenderemos **[Auditoria de Diretrizes de Design da Interface Web](../web-design-guidelines/)**.

Você aprenderá:
- Como usar 100+ regras para auditar acessibilidade (a11y)
- Verificar desempenho de animações e Focus States
- Auditoriar validação de formulários e suporte a modo escuro

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade                  | Caminho do Arquivo                                                                      | Número de Linha    |
|--- | --- | ---|
| Definição de habilidade de melhores práticas do React | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Total            |
| Documento de regras completo | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md) | Total            |
| 57 arquivos de regras        | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) | -                |
| Arquivo de modelos de regras | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Total            |
| Metadados                       | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json) | Total            |
| Visão geral README             | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 9-27              |

**Arquivos de Regras Chave** (nível CRITICAL):

| Regra                    | Caminho do Arquivo                                                                         | Descrição                     |
|--- | --- | ---|
| Requisições paralelas Promise.all() | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md) | Eliminar cachoeiras    |
| Importações dinâmicas para componentes grandes | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | Reduzir tamanho do bundle |
| Defer Await                 | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md) | Adiar operações assíncronas não críticas |

**Constantes Chave**:
- `version = "1.0.0"`: Número da versão da biblioteca de regras (metadata.json)
- `organization = "Vercel Engineering"`: Organização de manutenção

**8 Categorias de Regras**:
- `async-` (Eliminando Cachoeiras, 5 regras, CRITICAL)
- `bundle-` (Otimização de Empacotamento, 5 regras, CRITICAL)
- `server-` (Desempenho no Servidor, 7 regras, HIGH)
- `client-` (Busca de Dados no Cliente, 4 regras, MEDIUM-HIGH)
- `rerender-` (Otimização de Re-render, 12 regras, MEDIUM)
- `rendering-` (Desempenho de Renderização, 9 regras, MEDIUM)
- `js-` (Desempenho JavaScript, 12 regras, LOW-MEDIUM)
- `advanced-` (Modos Avançados, 3 regras, LOW)

</details>
