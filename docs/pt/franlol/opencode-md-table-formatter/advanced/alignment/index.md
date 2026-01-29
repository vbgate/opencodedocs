---
title: "Métodos de Alinhamento: Layout de Tabelas Markdown | opencode-md-table-formatter"
subtitle: "Métodos de Alinhamento: Layout de Tabelas Markdown | opencode-md-table-formatter"
sidebarTitle: "Faça o alinhamento das tabelas mais bonito"
description: "Aprenda os três métodos de alinhamento de tabelas Markdown e a sintaxe da linha separadora. Domine a implementação do algoritmo de alinhamento e faça com que as tabelas geradas pela IA fiquem bonitas e organizadas em diferentes métodos de alinhamento."
tags:
  - "alinhamento à esquerda"
  - "alinhamento centralizado"
  - "alinhamento à direita"
  - "sintaxe de linha separadora"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# Detalhes de Alinhamento: Alinhamento à Esquerda, Centralizado, Alinhamento à Direita

::: info O que você será capaz de fazer após esta aula
- Dominar a sintaxe e o efeito dos três métodos de alinhamento
- Entender como a linha separadora especifica o método de alinhamento
- Entender o princípio de funcionamento do algoritmo de preenchimento de células
- Saber por que a linha separadora é ajustada automaticamente em largura
:::

## Seu dilema atual

A IA gerou uma tabela, mas o alinhamento das colunas não está muito bonito:

```markdown
| 名称 | 类型 | 描述 |
|--- | --- | ---|
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

Você quer que certas colunas fiquem centralizadas ou alinhadas à direita, para tornar a tabela mais legível, mas não sabe como especificar.

## Quando usar esta técnica

- Quer que certas colunas da tabela fiquem centralizadas (como status, tags)
- Quer que colunas numéricas fiquem alinhadas à direita (para facilitar a comparação de tamanho)
- Quer que colunas de texto fiquem alinhadas à esquerda (comportamento padrão)
- Quer entender o princípio de implementação do alinhamento

## Ideia central: A linha separadora determina o método de alinhamento

O método de alinhamento de uma tabela Markdown não é escrito em cada linha, mas é especificado uniformemente através da **linha separadora**.

A sintaxe da linha separadora é: `:?-+:?` (dois pontos + hífen + dois pontos)

| Posição dos dois pontos | Método de alinhamento | Exemplo |
|--- | --- | ---|
| Ambos os lados | Centralizado | `:---:` |
| Apenas o lado direito | Alinhamento à direita | `---:` |
| Nenhum | Alinhamento à esquerda | `---` ou `:---` |

Cada célula da linha separadora corresponde ao método de alinhamento de uma coluna, e o plugin formatará a coluna inteira de acordo com esta regra.

## Siga comigo: Três métodos de alinhamento

### Passo 1: Alinhamento à esquerda (padrão)

**Por quê**

O alinhamento à esquerda é o comportamento padrão das tabelas, adequado para dados do tipo texto.

**Sintaxe**

```markdown
| 名称 | 描述 |
| :--- | :--- |    ← Ter dois pontos à esquerda ou nenhum dois pontos é alinhamento à esquerda
| 用户 | 用户名 |
```

**Você deve ver**

```markdown
| 名称   | 描述   |
|--- | ---|
| 用户   | 用户名 |
```

A linha separadora será exibida como `:---` (marcador de alinhamento à esquerda), com o texto alinhado à esquerda.

**Implementação no código-fonte**

```typescript
// Função getAlignment: analisa o método de alinhamento
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // Retorna left por padrão
}
```

Localização no código-fonte: `index.ts:141-149`

**Explicação da lógica**

- Tem dois pontos em ambos os lados (`:---:`) → Retorna `"center"`
- Tem dois pontos apenas no lado direito (`---:`) → Retorna `"right"`
- Outros casos (`---` ou `:---`) → Retorna `"left"` (padrão)

### Passo 2: Alinhamento centralizado

**Por quê**

O alinhamento centralizado é adequado para tags de status, textos curtos, títulos e outros conteúdos que precisam de centralização visual.

**Sintaxe**

```markdown
| 名称 | 状态 | 描述 |
|--- | --- | --- | ---|
| 用户 | 激活 | 用户名 |
```

**Você deve ver**

```markdown
| 名称   |  状态  | 描述   |
|--- | --- | ---|
| 用户   |  激活  | 用户名 |
```

A "激活" na coluna do meio será exibida centralizada, e a linha separadora será exibida como `:---:` (marcador de centralização).

**Princípio de formatação da linha separadora**

A formatação da célula da linha separadora é tratada pela função `formatSeparatorCell`:

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

Localização no código-fonte: `index.ts:213-217

**Princípio matemático do alinhamento centralizado**

O formato da linha separadora centralizada é: `:` + hífen + `:`

| Largura alvo | Fórmula de cálculo | Resultado |
|--- | --- | ---|
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` garante que pelo menos 1 hífen seja mantido, evitando que a largura de 2 se torne `::` (sem efeito de separação).

### Passo 3: Alinhamento à direita

**Por quê**

O alinhamento à direita é adequado para dados como números, valores monetários, datas que precisam ser comparados da direita para a esquerda.

**Sintaxe**

```markdown
| 名称 | 价格 | 数量 |
| :--- | ---: | ---: |    ← Ter dois pontos à direita indica alinhamento à direita
| 商品 | 99.9 | 100 |
```

**Você deve ver**

```markdown
| 名称   | 价格 | 数量 |
|--- | --- | ---|
| 商品   |  99.9 |  100 |
```

Os números são alinhados à direita, facilitando a comparação de tamanho.

**Princípio matemático do alinhamento à direita**

O formato da linha separadora alinhada à direita é: hífen + `:`

| Largura alvo | Fórmula de cálculo | Resultado |
|--- | --- | ---|
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` garante que pelo menos 1 hífen seja mantido.

## Algoritmo de preenchimento de células

Como o plugin decide quantos espaços preencher em ambos os lados da célula? A resposta está na função `padCell`.

**Implementação no código-fonte**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // Calcula a largura de exibição
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

Localização no código-fonte: `index.ts:198-211

**Regras de preenchimento**

| Método de alinhamento | Preenchimento à esquerda | Preenchimento à direita | Exemplo (largura alvo 10, texto "abc") |
|--- | --- | --- | ---|
| Alinhamento à esquerda | 0 | totalPadding | `abc       ` |
| Centralizado | floor(total/2) | total - floor(total/2) | `   abc    ` |
| Alinhamento à direita | totalPadding | 0 | `       abc` |

**Detalhes matemáticos do alinhamento centralizado**

`Math.floor(totalPadding / 2)` garante que o preenchimento à esquerda seja um número inteiro, e o espaço extra é adicionado à direita.

| Largura alvo | Largura do texto | totalPadding | Preenchimento à esquerda | Preenchimento à direita | Resultado |
|--- | --- | --- | --- | --- | ---|
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## Exemplo completo

**Tabela de entrada** (especificando diferentes métodos de alinhamento para cada coluna):

```markdown
| 名称 | 状态 | 价格 | 描述 |
|--- | --- | --- | ---|
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**Resultado da formatação**:

```markdown
| 名称   |  状态  | 价格 | 描述         |
|--- | --- | --- | ---|
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**Método de alinhamento de cada coluna**:

| Nome da coluna | Sintaxe da linha separadora | Método de alinhamento | Descrição |
|--- | --- | --- | ---|
| 名称 | `:---` | Alinhamento à esquerda | Texto alinhado à esquerda |
| 状态 | `:---:` | Centralizado | Texto centralizado |
| 价格 | `---:` | Alinhamento à direita | Números alinhados à direita |
| 描述 | `:---` | Alinhamento à esquerda | Texto alinhado à esquerda |

## Ponto de verificação

Após concluir esta aula, você deve ser capaz de responder:

- [ ] Como especificar alinhamento centralizado? (Resposta: Use `:---:` na linha separadora)
- [ ] Como especificar alinhamento à direita? (Resposta: Use `---:` na linha separadora)
- [ ] Qual é a sintaxe padrão para alinhamento à esquerda? (Resposta: `---` ou `:---`)
- [ ] Por que o alinhamento centralizado usa `Math.floor(totalPadding / 2)`? (Resposta: Garante que o preenchimento à esquerda seja um número inteiro, espaço extra adicionado à direita)
- [ ] O que `:---:` na linha separadora significa? (Resposta: Marcador de alinhamento centralizado, dois pontos em ambos os lados, hífens no meio)

## Avisos de armadilhas

::: warning Mal-entendidos comuns
**Mal-entendido**: Cada linha deve especificar o método de alinhamento

**Fato**: Não é necessário. Apenas a linha separadora especifica o método de alinhamento, e as linhas de dados serão alinhadas automaticamente por coluna.

A linha separadora é "configuração", as linhas de dados são "conteúdo", uma linha de configuração é suficiente.
:::

::: danger Lembre-se
A posição dos dois pontos na linha separadora **deve** corresponder às colunas.

| Exemplo errado | Problema |
|--- | ---|
| `| :--- | --- |` | Primeira coluna centralizada, segunda coluna alinhada à esquerda (2 colunas) |
| `| :--- | ---: | :--- |` | Primeira coluna alinhada à esquerda, segunda coluna alinhada à direita, terceira coluna alinhada à esquerda (3 colunas) |

O número de colunas na linha separadora deve ser o mesmo que o número de colunas no cabeçalho e nas linhas de dados!
:::

## Resumo da aula

| Método de alinhamento | Sintaxe da linha separadora | Cenário de uso |
|--- | --- | ---|
| Alinhamento à esquerda | `---` ou `:---` | Dados do tipo texto, descrição (padrão) |
| Centralizado | `:---:` | Tags de status, textos curtos, títulos |
| Alinhamento à direita | `---:` | Números, valores monetários, datas |

**Funções principais**:

| Função | Função | Localização no código-fonte |
|--- | --- | ---|
| `getAlignment()` | Analisa o método de alinhamento da célula da linha separadora | 141-149 |
| `padCell()` | Preenche a célula até a largura especificada | 198-211 |
| `formatSeparatorCell()` | Formata a célula da linha separadora | 213-217 |

**Dica de memorização**:

> 左右冒号居中放，右边冒号靠右对齐，
> 没有冒号默认左，分隔行里定规矩。

## Próxima aula

> Na próxima aula, aprenderemos **[Perguntas Frequentes: O que fazer quando a tabela não é formatada](../../faq/troubleshooting/)**.
>
> Você aprenderá:
> - Como localizar rapidamente o erro `invalid structure`
> - Métodos de solução de problemas de configuração
> - Soluções para problemas comuns de tabelas

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Análise de método de alinhamento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Preenchimento de células | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| Formatação da linha separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| Aplicação de método de alinhamento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**Funções principais**:
- `getAlignment(delimiterCell: string)`: Analisa o método de alinhamento da célula da linha separadora
  - Retorna `"left"` | `"center"` | `"right"`
  - Lógica: Tem dois pontos em ambos os lados → centralizado, tem dois pontos apenas no lado direito → alinhamento à direita, outros → alinhamento à esquerda

- `padCell(text, width, align)`: Preenche a célula até a largura especificada
  - Calcula a diferença entre a largura de exibição e a largura alvo
  - Distribui o preenchimento à esquerda e à direita de acordo com o método de alinhamento
  - Centralizado usa `Math.floor(totalPadding / 2)` para garantir que o preenchimento à esquerda seja um número inteiro

- `formatSeparatorCell(width, align)`: Formata a célula da linha separadora
  - Centralizado: `:` + `-`*(width-2) + `:`
  - Alinhamento à direita: `-`*(width-1) + `:`
  - Alinhamento à esquerda: `-`*width
  - Usa `Math.max(1, ...)` para garantir que pelo menos 1 hífen seja mantido

</details>
