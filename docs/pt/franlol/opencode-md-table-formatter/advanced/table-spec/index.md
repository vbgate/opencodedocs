---
title: "Especificações de Tabelas: Condições de Formatação | opencode-md-table-formatter"
sidebarTitle: "Resolva o erro invalid structure"
subtitle: "Especificações de Tabelas: Que tipo de tabelas podem ser formatadas"
description: "Aprenda as 4 condições válidas para tabelas Markdown. Domine a sintaxe da linha separadora, consistência do número de colunas e resolva erros de invalid structure."
tags:
  - "validação de tabelas"
  - "linha separadora"
  - "consistência de colunas"
  - "sintaxe de alinhamento"
prerequisite:
  - "start-features"
order: 40
---

# Especificações de Tabelas: Que tipo de tabelas podem ser formatadas

::: info O que você será capaz de fazer após esta aula
- Saber que tipo de tabelas podem ser formatadas pelo plugin
- Entender a causa do erro `invalid structure`
- Escrever tabelas Markdown que estejam em conformidade com as especificações
:::

## Seu dilema atual

A IA gerou uma tabela, mas o plugin não a formatou e ainda adicionou uma frase no final:

```markdown
<!-- table not formatted: invalid structure -->
```

O que é "estrutura inválida"? Por que minha tabela não funciona?

## Quando usar esta técnica

- Encontrou o erro `invalid structure` e quer saber onde está o problema
- Quer garantir que as tabelas geradas pela IA possam ser formatadas corretamente
- Quer escrever manualmente uma tabela Markdown que esteja em conformidade com as especificações

## Ideia central

Antes de formatar, o plugin faz três camadas de validação:

```
Camada 1: É uma linha de tabela? → isTableRow()
Camada 2: Tem linha separadora? → isSeparatorRow()
Camada 3: A estrutura é válida? → isValidTable()
```

Somente quando todas as três camadas passarem, a formatação é realizada. Se qualquer camada falhar, o original é mantido e um comentário de erro é adicionado.

## As 4 condições para tabelas válidas

### Condição 1: Cada linha deve começar e terminar com `|`

Este é o requisito mais básico. Cada linha de uma tabela de pipe Markdown (Pipe Table) deve ser envolvida por `|`.

```markdown
✅ Correto
| 名称 | 描述 |

❌ Errado
名称 | 描述      ← Falta | no início
| 名称 | 描述     ← Falta | no final
```

::: details Implementação no código-fonte
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
Localização no código-fonte: `index.ts:58-61`
:::

### Condição 2: Cada linha deve ter pelo menos 2 separadores

`split("|").length > 2` significa que deve haver pelo menos 2 `|` separando o conteúdo.

```markdown
✅ Correto（3 个 |，2 个分隔符）
| 名称 | 描述 |

❌ Errado（apenas 2 |，1 separador）
| 名称 |
```

Em outras palavras, **tabelas de coluna única são válidas**, mas devem ser escritas no formato `| 内容 |`.

### Condição 3: Deve ter uma linha separadora

A linha separadora é a linha entre o cabeçalho e as linhas de dados, usada para definir o método de alinhamento.

```markdown
| 名称 | 描述 |
| --- | --- |      ← Esta é a linha separadora
| 值1 | 值2 |
```

**Regras de sintaxe da linha separadora**:

Cada célula deve corresponder à regex `/^\s*:?-+:?\s*$/`, traduzindo para português:

| Componente | Significado | Exemplo |
| --- | --- | --- |
| `\s*` | Espaços opcionais | Permite `| --- |` ou `|---|` |
| `:?` | Dois pontos opcionais | Usado para especificar o método de alinhamento |
| `-+` | Pelo menos um hífen | `-`, `---`, `------` todos são válidos |

**Exemplos de linhas separadoras válidas**:

```markdown
| --- | --- |           ← Forma mais simples
| :--- | ---: |         ← Com marcadores de alinhamento
| :---: | :---: |       ← Alinhamento centralizado
|---|---|               ← Sem espaços também funciona
| -------- | -------- | ← Hífens longos também funcionam
```

**Exemplos de linhas separadoras inválidas**:

```markdown
| === | === |           ← Usou sinais de igual, não hífens
| - - | - - |           ← Espaços entre os hífens
| ::: | ::: |           ← Apenas dois pontos, sem hífens
```

::: details Implementação no código-fonte
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
Localização no código-fonte: `index.ts:63-68`
:::

### Condição 4: Todas as linhas devem ter o mesmo número de colunas

Se a primeira linha tiver 3 colunas, cada linha subsequente também deve ter 3 colunas.

```markdown
✅ Correto（cada linha tem 3 colunas）
| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 |

❌ Errado（a terceira linha tem apenas 2 colunas）
| A | B | C |
| --- | --- | --- |
| 1 | 2 |
```

::: details Implementação no código-fonte
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
Localização no código-fonte: `index.ts:70-88`
:::

## Guia rápido de sintaxe de alinhamento

A linha separadora não serve apenas para separar, mas também para especificar o método de alinhamento:

| Sintaxe | Método de alinhamento | Efeito |
| --- | --- | --- |
| `---` ou `:---` | Alinhamento à esquerda | Texto alinhado à esquerda (padrão) |
| `:---:` | Centralizado | Texto centralizado |
| `---:` | Alinhamento à direita | Texto alinhado à direita |

**Exemplo**:

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文本 | 文本 | 文本 |
```

Após a formatação:

```markdown
| 左对齐 |  居中  | 右对齐 |
| :----- | :----: | -----: |
| 文本   |  文本  |   文本 |
```

::: details Implementação no código-fonte
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
Localização no código-fonte: `index.ts:141-149`
:::

## Solução de problemas comuns

| Fenômeno de erro | Possível causa | Solução |
| --- | --- | --- |
| `invalid structure` | Falta linha separadora | Adicione `\| --- \| --- \|` após o cabeçalho |
| `invalid structure` | Número de colunas inconsistente | Verifique se o número de `\|` em cada linha é o mesmo |
| `invalid structure` | Falta `\|` no início/fim da linha | Adicione o `\|` que está faltando |
| Tabela não detectada | Apenas 1 coluna | Certifique-se de ter pelo menos 2 separadores `\|` |
| Alinhamento não funciona | Erro de sintaxe da linha separadora | Verifique se usou `-` em vez de outros caracteres |

## Ponto de verificação

Após concluir esta aula, você deve ser capaz de responder:

- [ ] Quais condições uma linha de tabela deve atender? (Resposta: Começar e terminar com `|`, pelo menos 2 separadores)
- [ ] O que significa a regex da linha separadora? (Resposta: Dois pontos opcionais + pelo menos um hífen + dois pontos opcionais)
- [ ] Por que ocorre `invalid structure`? (Resposta: Falta linha separadora, número de colunas inconsistente, ou falta `|` no início/fim da linha)
- [ ] O que `:---:` significa em termos de alinhamento? (Resposta: Alinhamento centralizado)

## Resumo da aula

| Condição | Requisito |
| --- | --- |
| Início e fim da linha | Deve começar e terminar com `\|` |
| Número de separadores | Pelo menos 2 `\|` |
| Linha separadora | Deve existir, no formato `:?-+:?` |
| Consistência de colunas | Todas as linhas devem ter o mesmo número de colunas |

**Dica de memorização**:

> 管道包裹两边齐，分隔行里短横线，列数一致不能少，四条规则记心间。

## Próxima aula

> Na próxima aula, aprenderemos **[Detalhes de Alinhamento](../alignment/)**.
>
> Você aprenderá:
> - Uso detalhado dos três métodos de alinhamento
> - Princípio de implementação da formatação da linha separadora
> - Algoritmo de preenchimento de células

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Determinação de linha de tabela | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Determinação de linha separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validação de tabela | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Análise de método de alinhamento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Tratamento de tabela inválida | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**Regex principal**:
- `/^\s*:?-+:?\s*$/`: Regra de correspondência de célula de linha separadora

**Funções principais**:
- `isTableRow()`: Determina se é uma linha de tabela
- `isSeparatorRow()`: Determina se é uma linha separadora
- `isValidTable()`: Valida se a estrutura da tabela é válida
- `getAlignment()`: Analisa o método de alinhamento

</details>
