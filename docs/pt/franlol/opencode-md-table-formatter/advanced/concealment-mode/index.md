---
title: "Modo de Ocultação: Princípio de Cálculo de Largura | opencode-md-table-formatter"
sidebarTitle: "Cálculo de largura em três passos"
subtitle: "Princípio do Modo de Ocultação: Por que o cálculo de largura é tão importante"
description: "Aprenda como funciona o modo de ocultação do OpenCode. Domine o método de cálculo de largura de exibição do plugin, entenda a remoção de símbolos Markdown, proteção de blocos de código e o uso de Bun.stringWidth."
tags:
  - "modo de ocultação"
  - "cálculo de largura de exibição"
  - "remoção de símbolos Markdown"
  - "Bun.stringWidth"
prerequisite:
  - "start-features"
order: 30
---

# Princípio do Modo de Ocultação: Por que o cálculo de largura é tão importante

::: info O que você será capaz de fazer após esta aula
- Entender como funciona o modo de ocultação do OpenCode
- Saber por que ferramentas comuns de formatação causam desalinhamento no modo de ocultação
- Dominar o algoritmo de cálculo de largura do plugin (três passos)
- Entender o papel do `Bun.stringWidth`
:::

## Seu dilema atual

Você usa o OpenCode para escrever código, e a IA gerou uma tabela bonita:

```markdown
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **name** | string | 用户名 |
| age | number | 年龄 |
```

Na visualização do código-fonte, parece organizada. Mas ao mudar para o modo de visualização, a tabela fica desalinhada:

```
| 字段     | 类型   | 说明   |
| -------- | ------ | ------ |
| name | string | 用户名 |    ← 怎么短了？
| age      | number | 年龄   |
```

Qual é o problema? **Modo de ocultação**.

## O que é modo de ocultação

O OpenCode ativa o **modo de ocultação (Concealment Mode)** por padrão, que oculta símbolos de sintaxe Markdown ao renderizar:

| Código-fonte | Exibição no modo de ocultação |
| --- | --- |
| `**粗体**` | 粗体（4 个字符） |
| `*斜体*` | 斜体（4 个字符） |
| `~~删除线~~` | 删除线（6 个字符） |
| `` `代码` `` | `代码`（4 个字符 + cor de fundo） |

::: tip Benefícios do modo de ocultação
Permite que você se concentre no conteúdo em si, em vez de ser distraído por uma série de símbolos `**`, `*`.
:::

## Por que ferramentas comuns de formatação têm problemas

Ferramentas comuns de formatação de tabelas calculam a largura considerando `**name**` como 8 caracteres:

```
** n a m e ** = 8 字符
```

Mas no modo de ocultação, o usuário vê `name`, que tem apenas 4 caracteres.

O resultado é: a ferramenta de formatação alinha por 8 caracteres, mas o usuário vê 4 caracteres, então a tabela fica naturalmente desalinhada.

## Ideia central: Calcular "largura de exibição" em vez de "comprimento de caracteres"

A ideia central deste plugin é: **calcular a largura que o usuário realmente vê, em vez do número de caracteres no código-fonte**.

O algoritmo tem três passos:

```
Passo 1: Proteger blocos de código (símbolos dentro dos blocos não são removidos)
Passo 2: Remover símbolos Markdown (**, *, ~~, etc.)
Passo 3: Calcular a largura final com Bun.stringWidth
```

## Siga comigo: Entenda o algoritmo de três passos

### Passo 1: Proteger blocos de código

**Por quê**

Os símbolos Markdown dentro do código em linha (envolto por crases) são "literais". O usuário verá `**bold**` como 8 caracteres, não `bold` como 4 caracteres.

Portanto, antes de remover os símbolos Markdown, é preciso "esconder" o conteúdo dos blocos de código primeiro.

**Implementação no código-fonte**

```typescript
// Passo 1: Extrair e proteger código em linha
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})
```

**Como funciona**

| Entrada | Após processamento | Array codeBlocks |
| --- | --- | --- |
| `` `**bold**` `` | `\x00CODE0\x00` | `["**bold**"]` |
| `` `a` and `b` `` | `\x00CODE0\x00 and \x00CODE1\x00` | `["a", "b"]` |

Substitui os blocos de código por placeholders especiais como `\x00CODE0\x00`, para que, ao remover símbolos Markdown posteriormente, eles não sejam afetados.

### Passo 2: Remover símbolos Markdown

**Por quê**

No modo de ocultação, `**粗体**` é exibido como `粗体`, `*斜体*` como `斜体`. Ao calcular a largura, é preciso remover esses símbolos.

**Implementação no código-fonte**

```typescript
// Passo 2: Remover símbolos Markdown de partes que não são código
let visualText = textWithPlaceholders
let previousText = ""

while (visualText !== previousText) {
  previousText = visualText
  visualText = visualText
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***粗斜体*** → 文本
    .replace(/\*\*(.+?)\*\*/g, "$1")     // **粗体** → 粗体
    .replace(/\*(.+?)\*/g, "$1")         // *斜体* → 斜体
    .replace(/~~(.+?)~~/g, "$1")         // ~~删除线~~ → 删除线
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")     // ![alt](url) → alt
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // [text](url) → text (url)
}
```

**Por que usar um loop while?**

Para lidar com sintaxe aninhada. Por exemplo, `***粗斜体***`:

```
Passo 1: ***粗斜体*** → **粗斜体**（remove a camada mais externa ***）
Passo 2: **粗斜体** → *粗斜体*（remove **）
Passo 3: *粗斜体* → 粗斜体（remove *）
Passo 4: 粗斜体 = 粗斜体（sem mudanças, sai do loop）
```

::: details Tratamento de imagens e links
- **Imagens** `![alt](url)`: O OpenCode exibe apenas o texto alt, então substitui por `alt`
- **Links** `[text](url)`: Exibido como `text (url)`, mantendo as informações da URL
:::

### Passo 3: Restaurar blocos de código + Calcular largura

**Por quê**

O conteúdo dos blocos de código precisa ser colocado de volta, e então usar `Bun.stringWidth` para calcular a largura final de exibição.

**Implementação no código-fonte**

```typescript
// Passo 3: Restaurar conteúdo dos blocos de código
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})

return Bun.stringWidth(visualText)
```

**Por que usar Bun.stringWidth?**

`Bun.stringWidth` pode calcular corretamente:

| Tipo de caractere | Exemplo | Número de caracteres | Largura de exibição |
| --- | --- | --- | --- |
| ASCII | `abc` | 3 | 3 |
| Chinês | `你好` | 2 | 4（cada um ocupa 2 espaços） |
| Emoji | `😀` | 1 | 2（ocupa 2 espaços） |
| Caractere de largura zero | `a\u200Bb` | 3 | 2（caractere de largura zero não ocupa espaço） |

O `text.length` comum só pode contar o número de caracteres, não consegue lidar com esses casos especiais.

## Exemplo completo

Suponha que o conteúdo da célula seja: `` **`code`** and *text* ``

**Passo 1: Proteger blocos de código**

```
Entrada：**`code`** and *text*
Saída：**\x00CODE0\x00** and *text*
codeBlocks = ["code"]
```

**Passo 2: Remover símbolos Markdown**

```
Passo 1：**\x00CODE0\x00** and *text* → \x00CODE0\x00 and text
Passo 2：sem mudanças, sai do loop
```

**Passo 3: Restaurar blocos de código + Calcular largura**

```
Após restaurar：code and text
Largura：Bun.stringWidth("code and text") = 13
```

No final, o plugin alinha esta célula com uma largura de 13 caracteres, em vez dos 22 caracteres do código-fonte.

## Ponto de verificação

Após concluir esta aula, você deve ser capaz de responder:

- [ ] Quais símbolos são ocultados pelo modo de ocultação? (Resposta: `**`, `*`, `~~` e outros símbolos de sintaxe Markdown)
- [ ] Por que proteger os blocos de código primeiro? (Resposta: Os símbolos dentro dos blocos de código são literais e não devem ser removidos)
- [ ] Por que usar um loop while para remover símbolos? (Resposta: Para lidar com sintaxe aninhada, como `***粗斜体***`)
- [ ] Em que `Bun.stringWidth` é melhor que `text.length`? (Resposta: Pode calcular corretamente a largura de exibição de chinês, Emoji, caracteres de largura zero)

## Avisos de armadilhas

::: warning Mal-entendidos comuns
**Mal-entendido**: O `**` dentro dos blocos de código também será removido

**Fato**: Não. O plugin primeiro protege o conteúdo dos blocos de código com placeholders, remove os símbolos de outras partes e depois restaura.

Portanto, a largura de `` `**bold**` `` é 8 (`**bold**`), não 4 (`bold`).
:::

## Resumo da aula

| Passo | Função | Código principal |
| --- | --- | --- |
| Proteger blocos de código | Evita que símbolos dentro dos blocos sejam removidos por engano | `text.replace(/\`(.+?)\`/g, ...)` |
| Remover Markdown | Calcula o conteúdo real exibido no modo de ocultação | Múltiplas substituições com regex |
| Calcular largura | Processa caracteres especiais como chinês, Emoji | `Bun.stringWidth()` |

## Próxima aula

> Na próxima aula, aprenderemos **[Especificações de Tabelas](../table-spec/)**.
>
> Você aprenderá:
> - Que tipo de tabelas podem ser formatadas
> - As 4 regras de validação de tabelas
> - Como evitar erros de "tabela inválida"

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Entrada de cálculo de largura de exibição | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L151-L159) | 151-159 |
| Proteção de blocos de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |
| Remoção de símbolos Markdown | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L175-L188) | 175-188 |
| Restauração de blocos de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L190-L193) | 190-193 |
| Chamada de Bun.stringWidth | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L195) | 195 |

**Funções principais**:
- `calculateDisplayWidth()`: Entrada de cálculo de largura com cache
- `getStringWidth()`: Algoritmo principal, remove símbolos Markdown e calcula a largura de exibição

**Constantes principais**:
- `\x00CODE{n}\x00`: Formato do placeholder de bloco de código

</details>
