---
title: "Diretrizes de Design Web: Auditoria de UI | Agent Skills"
sidebarTitle: "Design Web"
subtitle: "Auditoria de Diretrizes de Design de Interface Web"
description: "Aprenda a auditar acessibilidade, desempenho e UX com 100 regras de design web. Verifique aria-labels, validação de formulários, animações e modo escuro."
tags:
  - "Acessibilidade"
  - "UX"
  - "Auditoria de Código"
  - "Design da Web"
prerequisite:
  - "start-getting-started"
---

# Auditoria de Diretrizes de Design de Interface Web

## O Que Você Poderá Fazer Após Este Curso

- 🎯 Deixe a IA auditar automaticamente código de UI, descobrindo problemas de acessibilidade, desempenho e UX
- ♿ Aplique as melhores práticas de Acessibilidade Web (WCAG), melhorando a acessibilidade do site
- ⚡ Otimize o desempenho de animações e carregamento de imagens, melhorando a experiência do usuário
- 🎨 Garanta implementação correta de modo escuro e design responsivo
- 🔍 Corrija padrões comuns de UI (como `transition: all`, falta de aria-label, etc.)

## Seu Desafio Atual

Você escreveu componentes de UI, mas sente que algo não está certo:

- O site passa em testes funcionais, mas você não sabe se atende aos padrões de acessibilidade
- O desempenho de animações é ruim, usuários relatam que a página trava
- Certos elementos ficam invisíveis no modo escuro
- O código gerado pela IA funciona, mas falta aria-labels necessários ou HTML semântico
- Cada auditoria de código exige verificar manualmente 17 categorias de regras, com baixa eficiência
- Você não sabe quando usar propriedades CSS como `prefers-reduced-motion`, `tabular-nums`

Na verdade, a equipe de engenharia da Vercel já resumiu um conjunto de **100 diretrizes** de design de interface, cobrindo todos os cenários desde acessibilidade até otimização de desempenho. Agora, essas regras foram empacotadas no Agent Skills, e você pode deixar a IA auditar e corrigir problemas de UI automaticamente.

::: info O que são "Web Interface Guidelines"
As Web Interface Guidelines são o conjunto de padrões de qualidade de UI da Vercel, incluindo 100 regras em 17 categorias. Estas regras são baseadas em padrões de acessibilidade WCAG, melhores práticas de desempenho e princípios de design UX, garantindo que aplicativos web atinjam padrões de qualidade de produção.
:::

## Quando Usar Esta Abordagem

Cenários típicos para usar a habilidade de Diretrizes de Design da Web:

- ❌ **Inaplicável**: Lógica puramente de backend, páginas de protótipo simples (sem interação com o usuário)
- ✅ **Aplicável**:
  - Escrevendo novos componentes de UI (botões, formulários, cards, etc.)
  - Implementando funcionalidades interativas (modais, menus dropdowns, arrastar e soltar, etc.)
  - Auditando código ou refatorando componentes de UI
  - Verificando qualidade de UI antes de lançamento
  - Corrigindo problemas de acessibilidade ou desempenho relatados por usuários

## 🎒 Preparação Antes de Começar

::: warning Verificação de Pré-requisitos
Antes de começar, certifique-se de que você:
1. Instalou o Agent Skills (consulte [Guia de Instalação](../../start/installation/))
2. Entende HTML/CSS/React básicos
3. Possui um projeto de UI para auditar (pode ser um único componente ou página inteira)
:::

## Ideia Central

As diretrizes de design da web cobrem **17 categorias**, divididas em três grandes blocos por prioridade:

| Bloco de Categorias    | Foco                 | Benefício Típico                      |
|--- | --- | ---|
| **Acessibilidade (Accessibility)** | Garante que todos os usuários possam usar (incluindo leitores de tela, usuários de teclado) | Atende aos padrões WCAG, amplia o público de usuários |
| **Desempenho & UX (Performance & UX)** | Otimiza velocidade de carregamento, fluidez de animações, experiência de interação | Melhora retenção de usuários, reduz taxa de rejeição |
| **Integridade & Detalhes (Completeness)** | Modo escuro, design responsivo, validação de formulários, tratamento de erros | Reduz reclamações de usuários, melhora imagem da marca |

**17 Categorias de Regras**:

| Categoria        | Regras Típicas                       | Prioridade |
|--- | --- | ---|
| Accessibility    | aria-labels, HTML semântico, tratamento de teclado | ⭐⭐⭐ Mais alta |
| Focus States    | Foco visível, :focus-visible em vez de :focus | ⭐⭐⭐ Mais alta |
| Forms            | autocomplete, validação, tratamento de erros  | ⭐⭐⭐ Mais alta |
| Animation        | prefers-reduced-motion, transform/opacity   | ⭐⭐ Alta |
| Typography       | curly quotes, ellipsis, tabular-nums         | ⭐⭐ Alta |
| Content Handling | Truncamento de texto, tratamento de estados vazios | ⭐⭐ Alta |
| Images           | dimensões, lazy loading, texto alt          | ⭐⭐ Alta |
| Performance      | virtualização, preconnect, processamento em lote de DOM | ⭐⭐ Alta |
| Navigation & State  | URL reflete estado, deep linking        | ⭐⭐ Alta |
| Touch & Interaction | touch-action, tap-highlight              | ⭐ Média |
| Safe Areas & Layout  | Áreas seguras, tratamento de barras de rolagem | ⭐ Média |
| Dark Mode & Theming | color-scheme, theme-color meta            | ⭐ Média |
| Locale & i18n  | Intl.DateTimeFormat, Intl.NumberFormat    | ⭐ Média |
| Hydration Safety | value + onChange, evitando mismatch de células | ⭐ Média |
| Hover & Interactive States | estados hover, melhoria de contraste  | ⭐ Média |
| Content & Copy  | voz ativa, rótulos de botão específicos | ⭐ Baixa |
| Anti-patterns    | sinalizar padrões de erro comuns        | ⭐⭐⭐ Mais alta |

**Princípios Fundamentais**:
1. **Priorize corrigir problemas de Accessibility** — estes afetam uso por usuários com deficiência
2. **Comece com desempenho** — animações e imagens impactam diretamente a experiência do usuário
3. **Verifique integridade por último** — modo escuro, i18n, validação de formulários, tratamento de erros

## Siga-me

### Passo 1: Acionar Auditoria de UI da IA

Abra seu projeto de UI (pode ser um único arquivo de componente ou diretório inteiro), no Claude ou Cursor digite:

```
Review my UI components for accessibility and UX issues
```

Ou

```
Check accessibility of my site
```

Ou

```
Audit design and apply Web Interface Guidelines
```

**Você Deve Ver**: A IA ativará a habilidade `web-design-guidelines`, e buscará as 100 regras mais recentes do GitHub.

### Passo 2: Especificar Arquivos para Auditoria (se a IA não detectou automaticamente)

Se a IA perguntar quais arquivos auditar, você pode:

```bash
# Auditar arquivo único
src/components/Button.tsx

# Auditar múltiplos arquivos (separados por espaço)
src/components/Button.tsx src/components/Input.tsx

# Auditar diretório inteiro (usando padrão glob)
src/components/**/*.tsx
```

### Passo 3: IA Detecta Automaticamente Problemas

A IA verificará o código linha por linha, e ao descobrir problemas exibirá resultados de auditoria em formato `file:line`. Por exemplo:

```typescript
// ❌ Seu código original (tem problema)
export function Button({ icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      {icon}
    </button>
  )
}
```

**Resultado da Auditoria da IA**:

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**Código de Correção da IA**:

```typescript
// ✅ Após correção
export function Button({ icon, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded hover:bg-gray-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                motion-safe:hover:scale-105 active:scale-100
                motion-reduce:transition-none motion-reduce:transform-none"
    >
      {icon}
    </button>
  )
}
```

### Passo 4: Exemplos de Problemas Comuns

#### Problema 1: Form Input Falta Label e Autocomplete

```typescript
// ❌ Incorreto: falta label e autocomplete
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ Correto: inclui label, name, autocomplete
<label htmlFor="email" className="sr-only">
  Email address
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="your@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Regras**:
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### Problema 2: Animação Não Considera `prefers-reduced-motion`

```css
/* ❌ Incorreto: todos os usuários veem animação, desagradável para usuários com vestibular disorder */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ Correto: respeita preferência de redução de movimento do usuário */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**Regras**:
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### Problema 3: Imagem Falta Dimensões e Lazy Loading

```typescript
// ❌ Incorreto: causa Cumulative Layout Shift (CLS)
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ Correto: reserva espaço antecipadamente, evita mudança de layout
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // Para imagens críticas above-fold
/>
```

**Regras**:
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### Problema 4: Modo Escuro Não Definiu `color-scheme`

```html
<!-- ❌ Incorreto: no modo escuro, controles nativos (como select, input) ainda têm fundo branco -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ Correto: controles nativos adaptam automaticamente ao tema escuro -->
<html class="dark">
  <head>
    <meta name="theme-color" content="#0f172a" />
  </head>
  <body style="color-scheme: dark">
    <select style="background-color: #1e293b; color: #e2e8f0">
      ...
    </select>
  </body>
</html>
```

**Regras**:
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### Problema 5: Suporte de Navegação por Teclado Incompleto

```typescript
// ❌ Incorreto: apenas mouse pode clicar, usuários de teclado não conseguem usar
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ Correto: suporta navegação por teclado (Enter/Space aciona)
<button
  onClick={handleClick}
  className="cursor-pointer"
  // Suporta teclado automaticamente, sem código adicional
>
  Click me
</button>

// Ou se for necessário usar div, adicione suporte de teclado:
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }}
  onClick={handleClick}
  className="cursor-pointer"
>
  Click me
</div>
```

**Regras**:
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- `Icon-only buttons need aria-label`

#### Problema 6: Longa Lista Não Virtualizada

```typescript
// ❌ Incorreto: renderiza 1000 itens, causando travamento da página
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

```typescript
// ✅ Correto: usa virtual scrolling, apenas renderiza itens visíveis
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,  // Altura de cada item
    overscan: 5,  // Renderizar alguns itens a mais para evitar espaços em branco
  })

  return (
    <ul ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {users[virtualItem.index].name}
          </div>
        ))}
      </div>
    </ul>
  )
}
```

**Regras**:
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### Problema 7: Colunas Numéricas Não Usam `tabular-nums`

```css
/* ❌ Incorreto: largura de número não fixa, causa alinhamento saltando */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ Correto: números monoespaçados, alinhamento estável */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**Regras**:
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### Passo 5: Corrigir Anti-patterns Comuns

A IA marcará automaticamente esses anti-patterns:

```typescript
// ❌ Coleção de anti-patterns
const BadComponent = () => (
  <div>
    {/* Anti-pattern 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* Anti-pattern 2: botão com ícone sem aria-label */}
    <button onClick={handleClose}>✕</button>

    {/* Anti-pattern 3: proibir colar */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* Anti-pattern 4: outline-none sem substituto de foco */}
    <button className="focus:outline-none">...</button>

    {/* Anti-pattern 5: imagem sem dimensões */}
    <img src="/logo.png" alt="Logo" />

    {/* Anti-pattern 6: usa div em vez de button */}
    <div onClick={handleClick}>Submit</div>

    {/* Anti-pattern 7: formato de data hard-coded */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* Anti-pattern 8: autofocus no mobile */}
    <input autoFocus />

    {/* Anti-pattern 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* Anti-pattern 10: longa lista não virtualizada */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ Após correção
const GoodComponent = () => (
  <div>
    {/* Correção 1: listar explicitamente propriedades de transição */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* Correção 2: botão com ícone inclui aria-label */}
    <button onClick={handleClose} aria-label="Close dialog">✕</button>

    {/* Correção 3: permitir colar */}
    <Input />

    {/* Correção 4: usar focus-visible ring */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* Correção 5: imagem inclui dimensões */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* Correção 6: usar botão semântico */}
    <button onClick={handleClick}>Submit</button>

    {/* Correção 7: usar formatação Intl */}
    <Text>{new Intl.DateTimeFormat('en-US').format(new Date())}</Text>

    {/* Correção 8: autoFocus apenas no desktop */}
    <input autoFocus={isDesktop} />

    {/* Correção 9: permitir zoom */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Correção 10: virtualização */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## Ponto de Verificação ✅

Após concluir as etapas acima, verifique se você dominou:

- [ ] Sabe como acionar auditoria de UI pela IA
- [ ] Entende a importância de acessibilidade (Accessibility é a prioridade mais alta)
- [ ] Sabe como adicionar aria-label e HTML semântico
- [ ] Entende o papel de `prefers-reduced-motion`
- [ ] Sabe como otimizar carregamento de imagens (dimensões, lazy loading)
- [ ] Entende implementação correta de modo escuro (`color-scheme`)
- [ ] Consegue identificar anti-patterns comuns de UI no código

## Armadilhas

### Armadilha 1: Focar Apenas em Visual, Ignorar Acessibilidade

::: warning Acessibilidade Não é Opcional
Acessibilidade é um requisito legal (como ADA, WCAG), e também uma responsabilidade social.

**Omissões Comuns**:
- Botões com ícone sem `aria-label`
- Controles personalizados (como menus dropdown) sem suporte de teclado
- Entradas de formulário sem `<label>`
- Atualizações assíncronas (como Toast) sem `aria-live="polite"`
:::

### Armadilha 2: Uso Excessivo de `transition: all`

::: danger Assassino de Desempenho
`transition: all` monitorará todas as mudanças de propriedade CSS, fazendo o navegador recalcular muitos valores.

**Uso Incorreto**:
```css
.card {
  transition: all 0.3s ease;  // ❌ Fará transição de background, color, transform, padding, margin, etc.
}
```

**Uso Correto**:
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ Apenas transições de propriedades necessárias
}
```
:::

### Armadilha 3: Esquecer Substituto de `outline`

::: focus-visible Não é Opcional
Ao remover o `outline` padrão, deve fornecer estilo de foco visível, caso contrário usuários de teclado não sabem onde está o foco.

**Prática Incorreta**:
```css
button {
  outline: none;  // ❌ Remove completamente o foco
}
```

**Prática Correta**:
```css
button {
  outline: none;  /* Remove o contorno feio padrão */
}

button:focus-visible {
  ring: 2px solid blue;  /* ✅ Adiciona estilo de foco personalizado (apenas durante navegação por teclado) */
}

button:focus {
  /* Não exibe ao clicar com mouse (porque focus-visible = false) */
}
```
:::

### Armadilha 4: Imagem Falta `alt` ou Dimensões

::: CLS é um dos Core Web Vitals
Faltar `width` e `height` causará mudança de layout ao carregar a página, afetando experiência do usuário e SEO.

**Lembre-se**:
- Imagens decorativas usam `alt=""` (string vazia)
- Imagens informativas usam `alt` descritivo (como "Team photo: Alice and Bob")
- Todas imagens devem incluir `width` e `height`
:::

### Armadilha 5: Hard-code de Formato i18n

::: Use API Intl
Não hard-code formatos de data, número, moeda; use a API `Intl` embutida do navegador.

**Prática Incorreta**:
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY')  // ❌ Formato americano, usuários de outros países ficam confusos
```

**Prática Correta**:
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date)  // ✅ Usa automaticamente a localidade do usuário
```
:::

## Resumo da Lição

Princípios fundamentais das Diretrizes de Design da Web:

1. **Priorize Acessibilidade**: Garanta que todos os usuários possam usar (teclado, leitor de tela)
2. **Otimização de Desempenho**: Animações usam `transform/opacity`, imagens lazy load, longa lista virtualizada
3. **Respeite Preferências do Usuário**: `prefers-reduced-motion`, `color-scheme`, permitir zoom
4. **HTML Semântico**: Use `<button>`, `<label>`, `<input>` em vez de `<div>`
5. **Verificação de Integridade**: Modo escuro, i18n, validação de formulários, tratamento de erros
6. **Auditoria Automática por IA**: Deixe o Agent Skills ajudá-lo a descobrir e corrigir 100 regras

As 100 regras da Vercel cobrem todos os cenários do básico aos detalhes. Depois de dominar como acionar a IA para aplicar essas regras, a qualidade da sua UI alcançará padrões de produção.

## Próxima Lição

Em seguida, aprenderemos **[Deploy com um Clique no Vercel](../vercel-deploy/)**.

Você aprenderá:
- Como fazer deploy com um clique de projeto no Vercel (suporte a 40+ frameworks)
- Detecção automática de tipo de framework (Next.js, Vue, Svelte, etc.)
- Obter link de preview e link de transferência de propriedade

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Função           | Caminho do Arquivo                                                                 | Número de Linha |
|--- | --- | ---|
| Definição de habilidade de Diretrizes de Design da Web | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Total          |
| Fonte de regras (100 regras) | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | Total          |
| Visão geral README | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 28-50          |

**17 Categorias de Regras**:

| Categoria             | Quantidade de Regras | Regras Típicas                                    |
|--- | --- | ---|
| Accessibility         | 10 regras         | aria-labels, HTML semântico, tratamento de teclado |
| Focus States         | 4 regras          | Foco visível, :focus-visible                       |
| Forms                | 11 regras         | autocomplete, validação, tratamento de erros          |
| Animation            | 6 regras          | prefers-reduced-motion, transform/opacity             |
| Typography           | 6 regras          | curly quotes, ellipsis, tabular-nums                  |
| Content Handling      | 4 regras          | Truncamento de texto, tratamento de estados vazios      |
| Images               | 3 regras          | dimensões, lazy loading, texto alt                  |
| Performance          | 6 regras          | virtualização, preconnect, processamento em lote      |
| Navigation & State  | 4 regras          | URL reflete estado, deep linking                    |
| Touch & Interaction  | 5 regras          | touch-action, tap-highlight                        |
| Safe Areas & Layout  | 3 regras          | Áreas seguras, tratamento de barras de rolagem        |
| Dark Mode & Theming | 3 regras          | color-scheme, theme-color                             |
| Locale & i18n        | 3 regras          | Intl.DateTimeFormat, Intl.NumberFormat               |
| Hydration Safety     | 3 regras          | value + onChange, evitando mismatch de células        |
| Hover & Interactive States | 2 regras    | estados hover, melhoria de contraste                  |
| Content & Copy       | 7 regras          | voz ativa, rótulos de botão específicos              |
| Anti-patterns         | 20 regras         | sinalizar padrões de erro comuns                    |

**Constantes Chave**:
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"`: Fonte de busca de regras
- `version = "1.0.0"`: Número da versão da habilidade (SKILL.md)

**Fluxo de Trabalho**:
1. `SKILL.md:23-27`: Buscar regras mais recentes do GitHub
2. `SKILL.md:31-38`: Ler arquivos do usuário e aplicar todas as regras
3. `SKILL.md:39`: Se arquivos não especificados, perguntar ao usuário

**Palavras-Chave de Acionamento**:
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>
