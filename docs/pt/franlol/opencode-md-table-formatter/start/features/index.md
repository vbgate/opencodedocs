---
title: "Visão Geral de Recursos: 8 Recursos Principais | opencode-md-table-formatter"
sidebarTitle: "Visão geral dos 8 recursos"
subtitle: "Visão Geral de Recursos: 8 Recursos Principais"
description: "Aprenda os 8 recursos principais do plugin opencode-md-table-formatter. Domine a formatação automática de tabelas, compatibilidade com modo de ocultação e suporte a alinhamento, processando rapidamente Emoji e Unicode."
tags:
  - "formatação automática"
  - "modo de ocultação"
  - "suporte a alinhamento"
  - "proteção de blocos de código"
prerequisite:
  - "start-getting-started"
order: 20
---

# Visão Geral de Recursos: A Mágica da Formatação Automática

::: info O que você será capaz de fazer após esta aula
- Entender os 8 recursos principais do plugin
- Saber quais cenários são adequados para usar este plugin
- Entender os limites do plugin (o que ele não pode fazer)
:::

## Seu dilema atual

::: info Informações do plugin
O nome completo deste plugin é **@franlol/opencode-md-table-formatter**, doravante chamado de "plugin de formatação de tabelas".
:::

As tabelas Markdown geradas por IA frequentemente ficam assim:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

As larguras das colunas são irregulares, o que é desconfortável de ver. Ajustar manualmente? Cada vez que a IA gera uma nova tabela, você precisa ajustar tudo de novo, o que é muito cansativo.

## Quando usar esta técnica

- A IA gerou uma tabela Markdown e você quer que ela fique mais organizada
- Você ativou o modo de ocultação (Concealment Mode) do OpenCode e o alinhamento das tabelas sempre apresenta problemas
- Você é preguiçoso para ajustar manualmente a largura das colunas das tabelas

## Ideia central

O princípio de funcionamento deste plugin é muito simples:

```
IA gera texto → Plugin detecta tabela → Valida estrutura → Formata → Retorna texto formatado
```

Ele é montado no hook `experimental.text.complete` do OpenCode. Cada vez que a IA termina de gerar texto, o plugin o processa automaticamente. Você não precisa acionar manualmente, é totalmente transparente.

## 8 Recursos Principais

### 1. Formatação automática de tabelas

O plugin detecta automaticamente tabelas Markdown no texto gerado pela IA, unifica as larguras das colunas e torna as tabelas organizadas e bonitas.

**Antes da formatação**:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

**Após a formatação**:

```markdown
| 名称         | 描述         | 状态       |
| ------------ | ------------ | ---------- |
| **用户管理** | 管理系统用户 | ✅ 完成    |
| API          | 接口文档     | 🚧 进行中  |
```

::: tip Condições de acionamento
O plugin é montado no hook `experimental.text.complete` e é acionado automaticamente após a IA gerar o texto, sem necessidade de operação manual.
:::

### 2. Compatibilidade com modo de ocultação

O OpenCode ativa o modo de ocultação (Concealment Mode) por padrão, que oculta símbolos de sintaxe Markdown (como `**`, `*`, `~~`).

Ferramentas comuns de formatação de tabelas não consideram isso e calculam a largura incluindo `**`, o que causa desalinhamento.

Este plugin é otimizado especificamente para o modo de ocultação:

- Ao calcular a largura, remove símbolos como `**粗体**`, `*斜体*`, `~~删除线~~`
- Ao gerar saída, mantém a sintaxe Markdown original
- Resultado final: tabelas perfeitamente alinhadas no modo de ocultação

::: details Detalhes técnicos: Lógica de cálculo de largura
```typescript
// Remove símbolos Markdown (usado para cálculo de largura)
visualText = visualText
  .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***粗斜体*** → 文本
  .replace(/\*\*(.+?)\*\*/g, "$1")     // **粗体** → 粗体
  .replace(/\*(.+?)\*/g, "$1")         // *斜体* → 斜体
  .replace(/~~(.+?)~~/g, "$1")         // ~~删除线~~ → 删除线
```
Localização no código-fonte: `index.ts:181-185`
:::

### 3. Suporte a alinhamento

Suporta os três métodos de alinhamento de tabelas Markdown:

| Sintaxe | Método de alinhamento | Efeito |
| --- | --- | --- |
| `---` ou `:---` | Alinhamento à esquerda | Texto alinhado à esquerda (as duas sintaxes têm o mesmo efeito)|
| `:---:` | Centralizado | Texto centralizado |
| `---:` | Alinhamento à direita | Texto alinhado à direita |

**Exemplo**:

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文本 | 文本 | 文本 |
```

Após a formatação, cada coluna será alinhada conforme o método especificado, e a linha separadora será regenerada de acordo com o método de alinhamento.

### 4. Processamento de Markdown aninhado

As células da tabela podem conter sintaxe Markdown aninhada, como `***粗斜体***`.

O plugin usa um algoritmo de múltiplas passagens com expressões regulares, removendo camada por camada de fora para dentro:

```
***粗斜体*** → **粗斜体** → *粗斜体* → 粗斜体
```

Dessa forma, mesmo com múltiplas camadas de aninhamento, o cálculo da largura é preciso.

### 5. Proteção de blocos de código

Os símbolos Markdown dentro do código em linha (envolto por crases) devem permanecer inalterados e não serem removidos.

Por exemplo, `` `**bold**` `` - o usuário vê `**bold**` como 8 caracteres, não `bold` como 4 caracteres.

O plugin primeiro extrai o conteúdo do bloco de código, remove os símbolos Markdown de outras partes e depois coloca o conteúdo do bloco de código de volta.

::: details Detalhes técnicos: Lógica de proteção de blocos de código
```typescript
// Passo 1: Extrair e proteger código em linha
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})

// Passo 2: Remover símbolos Markdown de partes que não são código
// ...

// Passo 3: Restaurar conteúdo do código em linha
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})
```
Localização no código-fonte: `index.ts:168-193`
:::

### 6. Tratamento de casos extremos

O plugin pode lidar corretamente com vários casos extremos:

| Cenário | Método de tratamento |
| --- | --- |
| Emoji表情 | Usa `Bun.stringWidth` para calcular corretamente a largura de exibição |
| Unicode字符 | Caracteres de largura fixa como chinês e japonês são alinhados corretamente |
| Células vazias | Preenche com espaços até a largura mínima (3 caracteres) |
| Conteúdo muito longo | Processa normalmente, sem truncamento |

### 7. Operação silenciosa

O plugin opera silenciosamente em segundo plano:

- **Sem saída de logs**: Não imprime nenhuma informação no console
- **Erros não interrompem**: Mesmo que a formatação falhe, não afeta a saída normal da IA

Se ocorrer um erro durante a formatação, o plugin manterá o texto original e adicionará um comentário HTML no final:

```markdown
<!-- table formatting failed: [错误信息] -->
```

### 8. Feedback de validação

O plugin valida se a estrutura da tabela é válida. Tabelas inválidas não serão formatadas, mas mantidas como estão, com uma mensagem de aviso:

```markdown
<!-- table not formatted: invalid structure -->
```

**Requisitos para tabelas válidas**:

- Pelo menos 2 linhas (incluindo a linha separadora)
- Todas as linhas têm o mesmo número de colunas
- Deve ter uma linha separadora (formato: `|---|---|`)

## Limites do plugin

::: warning Cenários não suportados
- **Tabelas HTML**: Processa apenas tabelas de pipe Markdown (`| ... |`)
- **Células multilinha**: Células contendo tags `<br>` não são suportadas
- **Tabelas sem linha separadora**: Deve ter uma linha separadora `|---|---|`
- **Tabelas sem cabeçalho**: Deve ter uma linha de cabeçalho
:::

## Ponto de verificação

Após concluir esta aula, você deve ser capaz de responder:

- [ ] Como o plugin é acionado automaticamente? (Resposta: hook `experimental.text.complete`)
- [ ] Por que é necessária a "compatibilidade com modo de ocultação"? (Resposta: O modo de ocultação oculta símbolos Markdown, afetando o cálculo da largura)
- [ ] Os símbolos Markdown dentro do código em linha serão removidos? (Resposta: Não, os símbolos Markdown dentro do código são mantidos integralmente)
- [ ] Como as tabelas inválidas são tratadas? (Resposta: Mantidas como estão, com comentário de erro adicionado)

## Resumo da aula

| Recurso | Descrição |
| --- | --- |
| Formatação automática | Acionado automaticamente após a IA gerar texto, sem necessidade de operação manual |
| Compatibilidade com modo de ocultação | Calcula corretamente a largura de exibição após ocultar símbolos Markdown |
| Suporte a alinhamento | Alinhamento à esquerda, centralizado, alinhamento à direita |
| Markdown aninhado | Remoção em múltiplas passagens com regex, suporta sintaxe aninhada |
| Proteção de blocos de código | Símbolos dentro do código em linha permanecem inalterados |
| Casos extremos | Emoji, Unicode, células vazias, conteúdo muito longo |
| Operação silenciosa | Sem logs, erros não interrompem |
| Feedback de validação | Tabelas inválidas recebem comentário de erro |

## Próxima aula

> Na próxima aula, vamos nos aprofundar em **[Princípio do Modo de Ocultação](../../advanced/concealment-mode/)**.
>
> Você aprenderá:
> - Como funciona o modo de ocultação do OpenCode
> - Como o plugin calcula corretamente a largura de exibição
> - O papel do `Bun.stringWidth`

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Entrada do plugin | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23 |
| Detecção de tabelas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Validação de tabelas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Cálculo de largura (modo de ocultação) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L161-L196) | 161-196 |
| Análise de métodos de alinhamento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Proteção de blocos de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |

**Constantes principais**:
- `colWidths[col] = 3`: Largura mínima da coluna é 3 caracteres (`index.ts:115`)

**Funções principais**:
- `formatMarkdownTables()`: Função principal de processamento, formata todas as tabelas no texto
- `getStringWidth()`: Calcula a largura de exibição de uma string, remove símbolos Markdown
- `isValidTable()`: Valida se a estrutura da tabela é válida

</details>
