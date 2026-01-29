---
title: "Limitações Conhecidas: Tabelas HTML e outros não suportados | opencode-md-table-formatter"
sidebarTitle: "O que fazer quando a formatação da tabela falha"
subtitle: "Limitações Conhecidas: Tabelas HTML e outros não suportados"
description: "Entenda os limites técnicos do opencode-md-table-formatter, incluindo não suportar tabelas HTML e células multilinha. Evite usar o plugin em cenários não suportados para melhorar a eficiência do trabalho."
tags:
  - "limitações conhecidas"
  - "tabelas HTML"
  - "células multilinha"
  - "tabelas sem linha separadora"
prerequisite:
  - "start-features"
order: 70
---

# Limitações Conhecidas: Onde estão os limites do plugin

::: info O que você será capaz de fazer após esta aula
- Saber quais tipos de tabelas o plugin não suporta
- Evitar usar o plugin em cenários não suportados
- Entender os limites técnicos e escolhas de design do plugin
:::

## Ideia central

Este plugin se concentra em um objetivo: **otimizar a formatação de tabelas de pipe Markdown para o modo de ocultação do OpenCode**.

Para isso, limitamos deliberadamente algumas funções para garantir a confiabilidade e o desempenho em cenários principais.

## Visão geral das limitações

| Limitação | Descrição | Planejado para suportar |
|--- | --- | ---|
| **Tabelas HTML** | Apenas suporta tabelas de pipe Markdown (`\| ... \|`) | ❌ Não suportado |
| **Células multilinha** | Células não podem conter tags `<br>` ou outras quebras de linha | ❌ Não suportado |
| **Tabelas sem linha separadora** | Deve ter linha separadora `|---|` | ❌ Não suportado |
| **Células mescladas** | Não suporta mesclagem de linhas ou colunas | ❌ Não suportado |
| **Tabelas sem cabeçalho** | A linha separadora é considerada cabeçalho, não é possível criar tabelas sem cabeçalho | ❌ Não suportado |
| **Opções de configuração** | Não é possível personalizar largura de colunas, desabilitar funções, etc. | 🤔 Possivelmente no futuro |
| **Tabelas muito grandes** | Desempenho de tabelas com 100+ linhas não foi verificado | 🤔 Otimização futura |

---

## Detalhes das limitações

### 1. Não suporta tabelas HTML

**Fenômeno**

```html
<!-- Este tipo de tabela não será formatado -->
<table>
  <tr>
    <th>列 1</th>
    <th>列 2</th>
  </tr>
  <tr>
    <td>数据 1</td>
    <td>数据 2</td>
  </tr>
</table>
```

**Causa**

O plugin processa apenas tabelas de pipe Markdown (Pipe Table), ou seja, o formato separado por `|`:

```markdown
| 列 1 | 列 2 |
|--- | ---|
| 数据 1 | 数据 2 |
```

**Base no código-fonte**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

A lógica de detecção corresponde apenas a linhas que começam e terminam com `|`, tabelas HTML são ignoradas diretamente.

**Solução alternativa**

Se você precisa formatar tabelas HTML, recomenda-se:
- Usar outras ferramentas especializadas de formatação HTML
- Converter tabelas HTML para tabelas de pipe Markdown

---

### 2. Não suporta células multilinha

**Fenômeno**

```markdown
| 列 1 | 列 2 |
|--- | ---|
| 第 1 行<br>第 2 行 | 单行 |
```

Ao gerar a saída, você verá o comentário `<!-- table not formatted: invalid structure -->`.

**Causa**

O plugin processa tabelas linha por linha, não suporta quebras de linha dentro de células.

**Base no código-fonte**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... varredura linha por linha, sem lógica de mesclagem de múltiplas linhas
}
```

**Solução alternativa**

- Dividir conteúdo multilinha em múltiplas linhas de dados
- Ou aceitar que a tabela fique mais larga, exibindo o conteúdo em uma única linha

---

### 3. Não suporta tabelas sem linha separadora

**Fenômeno**

```markdown
<!-- Falta linha separadora -->
| 列 1 | 列 2 |
| 数据 1 | 数据 2 |
| 数据 3 | 数据 4 |
```

Você verá o comentário `<!-- table not formatted: invalid structure -->`.

**Causa**

Tabelas de pipe Markdown devem conter uma linha separadora (Separator Row), usada para definir o número de colunas e o método de alinhamento.

**Base no código-fonte**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // Retorna false se não houver linha separadora
```

**Forma correta**

```markdown
| 列 1 | 列 2 |
| --- | --- |  ← Linha separadora
| 数据 1 | 数据 2 |
| 数据 3 | 数据 4 |
```

---

### 4. Não suporta células mescladas

**Fenômeno**

```markdown
| 列 1 | 列 2 |
|--- | ---|
| 合并两列 |  ← Espera atravessar coluna 1 e coluna 2
| 数据 1 | 数据 2 |
```

**Causa**

O padrão Markdown não suporta sintaxe de mesclagem de células, e o plugin não implementou nenhuma lógica de mesclagem.

**Solução alternativa**

- Usar células vazias como marcadores: `| 合并两列 | |`
- Ou aceitar a limitação do Markdown e usar tabelas HTML

---

### 5. A linha separadora é considerada cabeçalho

**Fenômeno**

```markdown
|--- | --- | ---|
| 左对齐 | 居中 | 右对齐 |
| 数据 1 | 数据 2 | 数据 3 |
```

A linha separadora será considerada como linha de cabeçalho, não é possível criar tabelas de dados puros "sem cabeçalho".

**Causa**

A especificação Markdown considera a primeira linha após a linha separadora como cabeçalho (Table Header).

**Solução alternativa**

- Esta é uma limitação do próprio Markdown, não específica do plugin
- Se precisar de tabelas sem cabeçalho, considere outros formatos (como CSV)

---

### 6. Sem opções de configuração

**Fenômeno**

Não é possível ajustar através do arquivo de configuração:
- Largura mínima/máxima de colunas
- Desabilitar funções específicas
- Estratégia de cache personalizada

**Causa**

A versão atual (v0.0.3) não fornece interface de configuração, todos os parâmetros estão codificados no código-fonte.

::: tip Nota de versão
A versão atual do plugin é v0.0.3 (declarado em package.json). O v0.1.0 registrado em CHANGELOG.md é um planejamento de versão futura, ainda não lançado.
:::

**Base no código-fonte**

```typescript
// index.ts:115 - Largura mínima da coluna codificada como 3
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - Limiar de cache codificado
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Planejamento futuro**

O CHANGELOG menciona possível suporte futuro:
> Configuration options (min/max column width, disable features)

---

### 7. Desempenho de tabelas muito grandes não verificado

**Fenômeno**

Para tabelas com 100+ linhas, a formatação pode ser mais lenta ou ocupar mais memória.

**Causa**

O plugin usa varredura linha por linha e mecanismo de cache, teoricamente pode processar tabelas grandes, mas não houve otimização de desempenho específica.

**Base no código-fonte**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// O cache será limpo após 100 operações ou 1000 entradas
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Sugestão**

- Para tabelas muito grandes, recomenda-se dividir em várias tabelas menores
- Ou aguardar versões futuras com otimização de desempenho

---

## Ponto de verificação

Após concluir esta aula, você deve ser capaz de responder:

- [ ] Quais formatos de tabela o plugin suporta? (Resposta: Apenas tabelas de pipe Markdown)
- [ ] Por que não é possível formatar células multilinha? (Resposta: O plugin processa linha por linha, sem lógica de mesclagem)
- [ ] Qual é a função da linha separadora? (Resposta: Define o número de colunas e o método de alinhamento, é obrigatória)
- [ ] É possível personalizar a largura das colunas? (Resposta: A versão atual não suporta)

---

## Avisos de armadilhas

::: warning Erros comuns

**Erro 1**: Esperar que tabelas HTML sejam formatadas

O plugin processa apenas tabelas de pipe Markdown, tabelas HTML precisam ser formatadas manualmente ou usar outras ferramentas.

**Erro 2**: A tabela não tem linha separadora

A linha separadora é uma parte obrigatória das tabelas Markdown, a falta dela causa erro de "estrutura inválida".

**Erro 3**: O conteúdo da célula é muito longo, fazendo a tabela ficar muito larga

O plugin não tem limite de largura máxima de coluna, se o conteúdo da célula for muito longo, a tabela inteira ficará muito larga. Recomenda-se quebrar manualmente as linhas ou simplificar o conteúdo.

:::

---

## Resumo da aula

| Limitação | Causa | Solução alternativa |
|--- | --- | ---|
| Tabelas HTML não suportadas | O plugin se concentra em tabelas de pipe Markdown | Use ferramentas de formatação HTML |
| Células multilinha não suportadas | Lógica de processamento linha por linha | Divida em múltiplas linhas ou aceite a largura maior |
| Tabelas sem linha separadora não suportadas | Requisito da especificação Markdown | Adicione linha separadora `|---|` |
| Sem opções de configuração | Versão atual não implementada | Aguarde atualizações futuras de versão |

## Próxima aula

> Na próxima aula, aprenderemos **[Detalhes Técnicos](../tech-details/)**.
>
> Você aprenderá:
> - Como funciona o mecanismo de cache do plugin
> - Estratégias de otimização de desempenho
> - Por que o cache é limpo após 100 operações

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Limitação | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Detecção de tabelas HTML | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Detecção de linha separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validação de tabela (deve conter linha separadora) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Largura mínima da coluna codificada | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| Limiar de cache codificado | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**Funções principais**:
- `isTableRow()`: Detecta se é uma linha de tabela de pipe Markdown
- `isSeparatorRow()`: Detecta linha separadora
- `isValidTable()`: Valida a validade da estrutura da tabela

**Constantes principais**:
- `colWidths 最小宽度 = 3`: Largura mínima de exibição da coluna
- `缓存阈值 = 100 次操作或 1000 条目`: Condição para acionar limpeza de cache

**Referência do CHANGELOG**:
- Seção de limitações conhecidas: [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) linhas 31-36

</details>
