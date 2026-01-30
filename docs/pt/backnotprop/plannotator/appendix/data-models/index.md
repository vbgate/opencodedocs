---
title: "Modelos de Dados: Definições Completas dos Tipos Principais | Plannotator"
subtitle: "Modelos de Dados: Definições Completas dos Tipos Principais | Plannotator"
sidebarTitle: "Dominando os Modelos de Dados"
description: "Conheça os modelos de dados do Plannotator, incluindo as definições completas e descrições de campos dos tipos principais como Annotation, Block e CodeAnnotation, para uma compreensão profunda da arquitetura do sistema."
tags:
  - "Modelos de Dados"
  - "Definições de Tipos"
  - "Referência de API"
prerequisite: []
order: 2
---

# Modelos de Dados do Plannotator

Este apêndice apresenta todos os modelos de dados utilizados pelo Plannotator, incluindo as estruturas de dados principais para revisão de planos, revisão de código e compartilhamento via URL.

## Visão Geral dos Modelos de Dados Principais

O Plannotator define os seguintes modelos de dados principais em TypeScript:

| Modelo | Finalidade | Localização da Definição |
| --- | --- | --- |
| `Annotation` | Anotações em revisões de planos | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Blocos de conteúdo após análise do Markdown | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Anotações em revisões de código | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Formato compacto de anotações para compartilhamento via URL | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Anotação de Plano)

`Annotation` representa uma anotação em revisões de planos, usada para marcar exclusões, inserções, substituições ou comentários no plano.

### Definição Completa

```typescript
export interface Annotation {
  id: string;              // Identificador único
  blockId: string;         // ID do Block associado (obsoleto, mantido para compatibilidade)
  startOffset: number;     // Deslocamento inicial (obsoleto, mantido para compatibilidade)
  endOffset: number;       // Deslocamento final (obsoleto, mantido para compatibilidade)
  type: AnnotationType;     // Tipo de anotação
  text?: string;           // Conteúdo do comentário (para INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Texto original anotado
  createdA: number;        // Timestamp de criação
  author?: string;         // Identidade do colaborador (para compartilhamento via URL)
  imagePaths?: string[];    // Caminhos das imagens anexadas
  startMeta?: {            // Metadados do web-highlighter para seleção entre elementos
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // Metadados do web-highlighter para seleção entre elementos
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### Enumeração AnnotationType

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Excluir este conteúdo
  INSERTION = 'INSERTION',         // Inserir este conteúdo
  REPLACEMENT = 'REPLACEMENT',     // Substituir este conteúdo
  COMMENT = 'COMMENT',             // Comentar este conteúdo
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Comentário global (não associado a texto específico)
}
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | ✅ | Identificador único, geralmente um UUID gerado automaticamente |
| `blockId` | string | ✅ | ID do `Block` associado (obsoleto, mantido para compatibilidade) |
| `startOffset` | number | ✅ | Deslocamento inicial em caracteres (obsoleto, mantido para compatibilidade) |
| `endOffset` | number | ✅ | Deslocamento final em caracteres (obsoleto, mantido para compatibilidade) |
| `type` | AnnotationType | ✅ | Tipo de anotação (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Conteúdo do comentário (preenchido para INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Texto original anotado |
| `createdA` | number | ✅ | Timestamp de criação (milissegundos) |
| `author` | string | ❌ | Identificador do colaborador (para distinguir autores no compartilhamento via URL) |
| `imagePaths` | string[] | ❌ | Array de caminhos das imagens anexadas |
| `startMeta` | object | ❌ | Metadados iniciais do web-highlighter para seleção entre elementos |
| `endMeta` | object | ❌ | Metadados finais do web-highlighter para seleção entre elementos |

### Exemplos

#### Anotação de Exclusão

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "Esta parte não é necessária",
  createdA: Date.now(),
}
```

#### Anotação de Substituição

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "Novo conteúdo",
  originalText: "Conteúdo original",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Comentário Global

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "No geral, o plano está muito claro",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Nota sobre Campos Obsoletos
Os campos `blockId`, `startOffset` e `endOffset` eram usados em versões anteriores para destaque de texto baseado em deslocamento de caracteres. A versão atual utiliza a biblioteca [web-highlighter](https://github.com/alvarotrigo/web-highlighter), implementando seleção entre elementos através de `startMeta` e `endMeta`. Esses campos são mantidos apenas para compatibilidade.
:::

## Block (Bloco de Plano)

`Block` representa um bloco de conteúdo após a análise do texto Markdown, usado para exibição estruturada do conteúdo do plano.

### Definição Completa

```typescript
export interface Block {
  id: string;              // Identificador único
  type: BlockType;         // Tipo de bloco
  content: string;        // Conteúdo em texto puro
  level?: number;         // Nível (para títulos ou listas)
  language?: string;      // Linguagem do código (para blocos de código)
  checked?: boolean;      // Estado da caixa de seleção (para itens de lista)
  order: number;          // Ordem de classificação
  startLine: number;      // Número da linha inicial (base 1)
}
```

### Tipo BlockType

```typescript
type BlockType =
  | 'paragraph'     // Parágrafo
  | 'heading'       // Título
  | 'blockquote'    // Bloco de citação
  | 'list-item'     // Item de lista
  | 'code'          // Bloco de código
  | 'hr'            // Linha divisória
  | 'table';        // Tabela
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | ✅ | Identificador único, formato `block-{número}` |
| `type` | BlockType | ✅ | Tipo de bloco (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Conteúdo em texto puro do bloco |
| `level` | number | ❌ | Nível: 1-6 para títulos, nível de indentação para itens de lista |
| `language` | string | ❌ | Linguagem do bloco de código (ex: 'typescript', 'rust') |
| `checked` | boolean | ❌ | Estado da caixa de seleção do item de lista (true = marcado, false = desmarcado) |
| `order` | number | ✅ | Número de ordem, usado para manter a sequência dos blocos |
| `startLine` | number | ✅ | Número da linha inicial no Markdown fonte (começando em 1) |

### Exemplos

#### Bloco de Título

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Implementation Plan",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Bloco de Parágrafo

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### Bloco de Código

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### Item de Lista (com caixa de seleção)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "Concluir módulo de autenticação",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Análise de Markdown
O Plannotator utiliza um analisador Markdown simplificado personalizado (`parseMarkdownToBlocks`), que converte o Markdown fonte em um array `Block[]`. O analisador suporta sintaxes comuns como títulos, listas, blocos de código, tabelas e blocos de citação.
:::

## CodeAnnotation (Anotação de Código)

`CodeAnnotation` representa anotações em nível de linha em revisões de código, usadas para adicionar feedback a linhas ou intervalos específicos de um diff Git.

### Definição Completa

```typescript
export interface CodeAnnotation {
  id: string;              // Identificador único
  type: CodeAnnotationType;  // Tipo de anotação
  filePath: string;         // Caminho do arquivo
  lineStart: number;        // Número da linha inicial
  lineEnd: number;          // Número da linha final
  side: 'old' | 'new';     // Lado ('old' = linha removida, 'new' = linha adicionada)
  text?: string;           // Conteúdo do comentário
  suggestedCode?: string;    // Código sugerido (para tipo suggestion)
  createdAt: number;        // Timestamp de criação
  author?: string;         // Identidade do colaborador
}
```

### Tipo CodeAnnotationType

```typescript
export type CodeAnnotationType =
  | 'comment'      // Comentário comum
  | 'suggestion'  // Sugestão de modificação (requer suggestedCode)
  | 'concern';     // Ponto de atenção (lembrete de assunto importante)
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | ✅ | Identificador único |
| `type` | CodeAnnotationType | ✅ | Tipo de anotação (comment/suggestion/concern) |
| `filePath` | string | ✅ | Caminho relativo do arquivo anotado (ex: `src/auth.ts`) |
| `lineStart` | number | ✅ | Número da linha inicial (começando em 1) |
| `lineEnd` | number | ✅ | Número da linha final (começando em 1) |
| `side` | 'old' \| 'new' | ✅ | Lado: `'old'` = linha removida (versão antiga), `'new'` = linha adicionada (versão nova) |
| `text` | string | ❌ | Conteúdo do comentário |
| `suggestedCode` | string | ❌ | Código sugerido (obrigatório quando type é 'suggestion') |
| `createdAt` | number | ✅ | Timestamp de criação (milissegundos) |
| `author` | string | ❌ | Identificador do colaborador |

### Explicação do Campo side

O campo `side` corresponde à visualização de diff da biblioteca [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs):

| Valor de side | Correspondência em @pierre/diffs | Descrição |
| --- | --- | --- |
| `'old'` | `deletions` | Linhas removidas (conteúdo da versão antiga) |
| `'new'` | `additions` | Linhas adicionadas (conteúdo da versão nova) |

### Exemplos

#### Comentário Comum (linha adicionada)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "É necessário tratar casos de erro aqui",
  createdAt: Date.now(),
}
```

#### Sugestão de Modificação (linha removida)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "Sugiro usar async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation (Anotação Compartilhável)

`ShareableAnnotation` é um formato compacto de anotação para compartilhamento via URL, representado como tuplas de array para reduzir o tamanho do payload.

### Definição Completa

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [tipo, original, autor, imagens]
  | ['R', string, string, string | null, string[]?]   // Replacement: [tipo, original, substituição, autor, imagens]
  | ['C', string, string, string | null, string[]?]   // Comment: [tipo, original, comentário, autor, imagens]
  | ['I', string, string, string | null, string[]?]   // Insertion: [tipo, contexto, novo texto, autor, imagens]
  | ['G', string, string | null, string[]?];          // Global Comment: [tipo, comentário, autor, imagens]
```

### Explicação dos Tipos

| Tipo | Caractere Inicial | Estrutura da Tupla | Descrição |
| --- | --- | --- | --- |
| DELETION | `'D'` | `['D', original, autor?, imagens?]` | Excluir conteúdo |
| REPLACEMENT | `'R'` | `['R', original, substituição, autor?, imagens?]` | Substituir conteúdo |
| COMMENT | `'C'` | `['C', original, comentário, autor?, imagens?]` | Comentar conteúdo |
| INSERTION | `'I'` | `['I', contexto, novoTexto, autor?, imagens?]` | Inserir conteúdo |
| GLOBAL_COMMENT | `'G'` | `['G', comentário, autor?, imagens?]` | Comentário global |

### Exemplos

```typescript
// Exclusão
['D', 'conteúdo a excluir', null, []]

// Substituição
['R', 'texto original', 'substituir por', null, ['/tmp/img.png']]

// Comentário
['C', 'este código', 'sugiro otimizar', null, []]

// Inserção
['I', 'contexto', 'novo conteúdo a inserir', null, []]

// Comentário global
['G', 'muito bom no geral', null, []]
```

::: tip Por que usar formato compacto?
Usar tuplas de array em vez de objetos reduz o tamanho do payload, resultando em URLs mais curtas após compressão. Por exemplo:
- Formato de objeto: `{"type":"DELETION","originalText":"text"}` → 38 bytes
- Formato compacto: `["D","text",null,[]]` → 18 bytes
:::

## SharePayload (Payload de Compartilhamento)

`SharePayload` é a estrutura de dados completa para compartilhamento via URL, contendo o conteúdo do plano e as anotações.

### Definição Completa

```typescript
export interface SharePayload {
  p: string;                  // Texto Markdown do plano
  a: ShareableAnnotation[];    // Array de anotações (formato compacto)
  g?: string[];              // Caminhos de anexos globais (imagens)
}
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `p` | string | ✅ | Conteúdo Markdown do plano original |
| `a` | ShareableAnnotation[] | ✅ | Array de anotações (usando formato compacto `ShareableAnnotation`) |
| `g` | string[] | ❌ | Caminhos de anexos globais (imagens não associadas a anotações específicas) |

### Exemplo

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', 'Precisa suportar OAuth', null, []],
    ['G', 'Plano geral está claro', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter (Metadados Iniciais)

`Frontmatter` representa os metadados YAML no topo do arquivo Markdown, usados para armazenar informações adicionais.

### Definição Completa

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Exemplo

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan (Exemplo)
...
```

Após análise:

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Uso dos Metadados Iniciais
O Plannotator gera automaticamente o frontmatter ao salvar planos no Obsidian, incluindo informações como data de criação e tags de origem, facilitando o gerenciamento e a busca de notas.
:::

## Tipos Auxiliares Relacionados

### EditorMode (Modo do Editor)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`: Modo de seleção de texto
- `'comment'`: Modo de comentário
- `'redline'`: Modo de anotação em vermelho

### DiffResult (Resultado do Diff)

```typescript
export interface DiffResult {
  original: string;    // Conteúdo original
  modified: string;    // Conteúdo modificado
  diffText: string;    // Texto do diff unificado
}
```

### DiffAnnotationMetadata (Metadados de Anotação de Diff)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // ID da anotação associada
  type: CodeAnnotationType;  // Tipo de anotação
  text?: string;            // Conteúdo do comentário
  suggestedCode?: string;   // Código sugerido
  author?: string;          // Autor
}
```

### SelectedLineRange (Intervalo de Linhas Selecionadas)

```typescript
export interface SelectedLineRange {
  start: number;                      // Número da linha inicial
  end: number;                        // Número da linha final
  side: 'deletions' | 'additions';   // Lado (corresponde à visualização de diff do @pierre/diffs)
  endSide?: 'deletions' | 'additions'; // Lado final (para seleção entre lados)
}
```

## Relações de Conversão de Dados

### Annotation ↔ ShareableAnnotation

```typescript
// Completo → Compacto
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Compacto → Completo
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Perda de Coordenadas
Os campos `blockId`, `startOffset` e `endOffset` nas `Annotation` geradas por `fromShareable` estarão vazios ou com valor 0. É necessário recuperar a posição exata através de correspondência de texto ou web-highlighter.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## Resumo da Lição

Este apêndice apresentou todos os modelos de dados principais do Plannotator:

- **Annotation**: Anotações em revisões de planos, suportando tipos como exclusão, inserção, substituição e comentário
- **Block**: Blocos de conteúdo após análise do Markdown, para exibição estruturada do plano
- **CodeAnnotation**: Anotações em nível de linha em revisões de código, suportando comentários e sugestões
- **ShareableAnnotation**: Formato compacto para compartilhamento via URL, reduzindo o tamanho do payload
- **SharePayload**: Estrutura de dados completa para compartilhamento via URL

Esses modelos de dados são amplamente utilizados em funcionalidades como revisão de planos, revisão de código e compartilhamento via URL. Compreendê-los ajuda a personalizar e estender o Plannotator de forma aprofundada.

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre a **[Explicação da Licença do Plannotator](../license/)**.
>
> Você verá:
> - Os termos principais da Business Source License 1.1 (BSL)
> - Usos permitidos e restrições comerciais
> - O cronograma de conversão para Apache 2.0 em 2030
> - Como obter uma licença comercial

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Enumeração AnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interface Block | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| Interface CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Tipo CodeAnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| Tipo ShareableAnnotation | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| Interface SharePayload | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Constantes Principais**:
- Nenhuma

**Funções Principais**:
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Converte anotações completas para formato compacto
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Restaura formato compacto para anotações completas
- `parseMarkdownToBlocks(markdown: string): Block[]`: Analisa Markdown em array de Block
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`: Exporta anotações para formato Markdown

</details>
