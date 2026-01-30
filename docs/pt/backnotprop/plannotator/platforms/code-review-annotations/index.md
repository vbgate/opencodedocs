---
title: "Anotações de Código: Comentários em Nível de Linha | Plannotator"
subtitle: "Anotações de Código: Comentários em Nível de Linha"
sidebarTitle: "5 Minutos para Adicionar Anotações"
description: "Aprenda a funcionalidade de anotações de código do Plannotator. Adicione comentários em nível de linha precisos (comment/suggestion/concern) no diff, anexe código sugerido, marque pontos de risco, gerencie todas as anotações e exporte feedback."
tags:
  - "Revisão de Código"
  - "Anotações"
  - "diff"
  - "comment"
  - "suggestion"
  - "concern"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
  - "platforms-code-review-basics"
order: 5
---

# Adicionar Anotações de Código: Comentários, Sugestões e Preocupações em Nível de Linha

## O Que Você Será Capaz de Fazer

- ✅ Adicionar anotações em nível de linha (comment/suggestion/concern) no diff de código
- ✅ Fornecer código sugerido para modificações de código (suggestedCode)
- ✅ Marcar segmentos de código que precisam de atenção (concern)
- ✅ Visualizar e gerenciar todas as anotações (barra lateral)
- ✅ Entender os cenários de uso dos três tipos de anotações
- ✅ Exportar feedback em formato Markdown

## Seu Problema Atual

**Problema 1**: Ao revisar alterações de código, você só consegue ver o diff no terminal e escrever "a linha 3 tem um problema", "sugiro mudar para XXX", sem precisão de localização.

**Problema 2**: Alguns códigos você só quer comentar (comment), outros quer sugerir modificações (suggestion), outros são problemas graves que precisam de atenção (concern), mas não há ferramenta para ajudá-lo a diferenciar.

**Problema 3**: Você quer dar uma sugestão de modificação para uma função, mas não sabe como passar o trecho de código para a IA.

**Problema 4**: Depois de adicionar várias anotações, você esquece quais lugares revisou, sem visão geral.

**Plannotator pode ajudá-lo**:
- Clique no número da linha para selecionar o intervalo de código, preciso até a linha
- Três tipos de anotações (comment/suggestion/concern) correspondem a diferentes cenários
- Pode anexar código sugerido, a IA vê diretamente a solução de modificação
- Barra lateral lista todas as anotações, pula com um clique

## Quando Usar Esta Técnica

**Cenários de uso**:
- Após executar o comando `/plannotator-review`, visualizar alterações de código
- Precisa dar feedback em linhas de código específicas
- Quer fornecer sugestões de modificação de código para a IA
- Precisa marcar problemas potenciais ou pontos de risco

**Cenários não aplicáveis**:
- Revisar planos de implementação gerados por IA (use a funcionalidade de revisão de planos)
- Apenas precisa navegar rapidamente pelo diff (use a funcionalidade básica de revisão de código)

## 🎒 Preparação Antes de Começar

**Pré-requisitos**:
- ✅ Plannotator CLI instalado (veja [Início Rápido](../../../start/getting-started/))
- ✅ Já aprendeu revisão de código básica (veja [Revisão de Código Básica](../../code-review-basics/))
- ✅ Tem um repositório Git local com alterações não commitadas

**Como acionar**:
- Execute o comando `/plannotator-review` no OpenCode ou Claude Code

## Ideia Central

### O Que São Anotações de Código

**Anotações de código** são a funcionalidade principal da revisão de código do Plannotator, usadas para adicionar feedback em nível de linha no Git diff. Ao clicar no número da linha para selecionar o intervalo de código, você pode adicionar comentários, sugestões ou preocupações de forma precisa para linhas de código específicas. As anotações são exibidas abaixo do diff, facilitando a compreensão precisa da intenção do seu feedback pela IA.

::: info Por que precisamos de anotações de código?
Na revisão de código, você precisa dar feedback em linhas de código específicas. Se apenas descrever com texto "a linha 5 tem um problema", "sugiro mudar para XXX", a IA precisa localizar o código por conta própria, o que pode levar a erros. Plannotator permite que você clique no número da linha para selecionar o intervalo de código e adicione anotações diretamente naquele local. As anotações são exibidas abaixo do diff (estilo GitHub), e a IA pode ver com precisão em qual trecho de código você está sugerindo modificações.
:::

### Fluxo de Trabalho

```
┌─────────────────┐
│  /plannotator-   │  Acionar comando
│  review comando  │
└────────┬────────┘
          │
          │ Executar git diff
          ▼
┌─────────────────┐
│  Diff Viewer    │  ← Exibir diff de código
│  (split/unified) │
└────────┬────────┘
          │
          │ Clicar número de linha / Hover +
          ▼
┌─────────────────┐
│  Selecionar      │
│  intervalo de    │
│  código          │
│  (lineStart-     │
│   lineEnd)       │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Adicionar      │  ← Barra de ferramentas aparece
│  anotação       │     Preencher conteúdo do comentário
│  - Comment      │     Opcional: fornecer código sugerido
│  - Suggestion   │
│  - Concern      │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Anotações      │  Abaixo do diff
│  exibidas       │  Barra lateral lista todas as anotações
│  (estilo GitHub)│
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Exportar       │  Send Feedback
│  feedback       │  IA recebe feedback estruturado
│  (Markdown)     │
└─────────────────┘
```

### Tipos de Anotações

Plannotator suporta três tipos de anotações de código, cada um com diferentes propósitos:

| Tipo de Anotação | Propósito | Cenário Típico | Código Sugerido |
|--- | --- | --- | ---|
| **Comment** | Comentar um trecho de código, fornecer feedback geral | "Esta lógica pode ser simplificada", "Nome da variável não muito claro" | Opcional |
| **Suggestion** | Fornecer sugestões específicas de modificação de código | "Sugiro usar map em vez de loop for", "Usar await em vez de Promise.then" | Recomendado |
| **Concern** | Marcar problemas potenciais ou pontos de risco | "Esta consulta SQL pode ter problemas de desempenho", "Falta tratamento de erro" | Opcional |

::: tip Sugestões de escolha de tipo de anotação
- **Comment**: Para "sugerir mas não obrigar", como estilo de código, direção de otimização
- **Suggestion**: Para "sugerir fortemente modificação", e você tem uma solução de modificação clara
- **Concern**: Para "problemas que precisam de atenção", como bugs, riscos de desempenho, riscos de segurança
:::

### Comment vs Suggestion vs Concern

| Cenário | Escolher Tipo | Exemplo de Texto |
|--- | --- | ---|
| Código funciona, mas há espaço para otimização | Comment | "Este trecho pode ser simplificado com async/await" |
| Código tem solução de melhoria clara | Suggestion | "Sugiro usar `Array.from()` em vez do operador spread" (com código) |
| Encontrou bug ou problema grave | Concern | "Falta verificação de null aqui, pode causar erro em tempo de execução" |

## Siga-me

### Passo 1: Acionar Revisão de Código

Execute no terminal:

```bash
/plannotator-review
```

**Você deve ver**:
1. O navegador abre automaticamente a interface de revisão de código
2. Exibe o conteúdo do git diff (padrão é `git diff HEAD`)
3. Esquerda: árvore de arquivos, centro: diff viewer, direita: barra lateral de anotações

### Passo 2: Navegar pelo Conteúdo do Diff

Visualize as alterações de código no navegador:

- Padrão usa **visualização split** (comparação lado a lado)
- Pode alternar para **visualização unified** (comparação acima e abaixo)
- Clique no nome do arquivo na árvore de arquivos para alternar o arquivo visualizado

### Passo 3: Selecionar Linhas de Código, Adicionar Anotação

**Método 1: Hover clicar no botão "+"**

1. Passe o mouse sobre a linha de código onde deseja adicionar anotação
2. Um botão **+** aparece à direita (apenas exibido em linhas do diff)
3. Clique no botão **+**
4. A barra de ferramentas de anotação aparece

**Método 2: Clicar diretamente no número da linha**

1. Clique em um número de linha (por exemplo `L10`), seleciona uma linha única
2. Clique em outro número de linha (por exemplo `L15`), seleciona um intervalo de múltiplas linhas
3. Após selecionar o intervalo, a barra de ferramentas aparece automaticamente

**Você deve ver**:
- A barra de ferramentas exibe o número da linha selecionada (por exemplo `Line 10` ou `Lines 10-15`)
- A barra de ferramentas contém uma caixa de entrada de texto (`Leave feedback...`)
- Botão opcional "Add suggested code"

### Passo 4: Adicionar Anotação Comment

**Cenário**: Fornecer sugestões para o código, mas não exigir modificação obrigatória

1. Digite o conteúdo do comentário na caixa de texto da barra de ferramentas
2. Opcional: Clique em **Add suggested code**, digite o código sugerido
3. Clique no botão **Add Comment**

**Exemplo**:

```
Conteúdo do comentário: O nome do parâmetro desta função não é muito claro, sugiro renomear para fetchUserData
```

**Você deve ver**:
- A barra de ferramentas desaparece
- A anotação é exibida abaixo do diff (caixa azul)
- Um novo registro de anotação é adicionado na barra lateral
- Se o código sugerido foi fornecido, é exibido abaixo da anotação (formato de bloco de código)

### Passo 5: Adicionar Anotação Suggestion

**Cenário**: Fornecer uma solução clara de modificação de código, esperando que a IA adote diretamente

1. Digite a descrição da sugestão na caixa de texto da barra de ferramentas (opcional)
2. Clique em **Add suggested code**
3. Na caixa de entrada de código que aparece, digite o código sugerido
4. Clique no botão **Add Comment**

**Exemplo**:

```
Descrição da sugestão: Usar async/await para simplificar a cadeia Promise

Código sugerido:
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

**Você deve ver**:
- A anotação é exibida abaixo do diff (caixa azul)
- O código sugerido é exibido como um bloco de código, com rótulo "Suggested:"
- A barra lateral exibe a primeira linha do código sugerido (com reticências)

### Passo 6: Adicionar Anotação Concern

**Cenário**: Marcar problemas potenciais ou pontos de risco, lembrando a IA para prestar atenção

**Nota**: Na UI do Plannotator na versão atual, o tipo de anotação é padrão como **Comment**. Se precisar marcar **Concern**, você pode explicar claramente no texto da anotação.

1. Digite a descrição da preocupação na caixa de texto da barra de ferramentas
2. Pode usar marcadores como `Concern:` ou `⚠️` para esclarecer que é uma preocupação
3. Clique no botão **Add Comment**

**Exemplo**:

```
Concern: Falta verificação de null aqui, se user for null causará erro em tempo de execução

Sugiro adicionar:
if (!user) return null;
```

**Você deve ver**:
- A anotação é exibida abaixo do diff
- A barra lateral exibe o conteúdo da anotação

### Passo 7: Visualizar e Gerenciar Anotações

**Visualizar todas as anotações na barra lateral**:

1. A barra lateral direita exibe a lista de todas as anotações
2. Cada anotação exibe:
   - Nome do arquivo (último componente do caminho)
   - Intervalo de linhas (por exemplo `L10` ou `L10-L15`)
   - Autor (se for revisão colaborativa)
   - Timestamp (por exemplo `5m`, `2h`, `1d`)
   - Conteúdo da anotação (máximo 2 linhas)
   - Pré-visualização do código sugerido (primeira linha)

**Pular para anotação**:

1. Clique em uma anotação na barra lateral
2. O Diff viewer rola automaticamente para a posição correspondente
3. A anotação é destacada

**Excluir anotação**:

1. Passe o mouse sobre uma anotação na barra lateral
2. Clique no botão **×** no canto superior direito
3. A anotação é excluída, o destaque no diff desaparece

**Você deve ver**:
- A barra lateral exibe a quantidade de anotações (por exemplo `Annotations: 3`)
- Após clicar na anotação, o diff viewer rola suavemente para a linha correspondente
- Após excluir a anotação, a quantidade é atualizada

### Passo 8: Exportar Feedback

Após concluir todas as anotações, clique no botão **Send Feedback** na parte inferior da página.

**Você deve ver**:
- O navegador fecha automaticamente
- O conteúdo do feedback em formato Markdown é exibido no terminal
- A IA recebe feedback estruturado e pode responder automaticamente

**Formato Markdown exportado**:

```markdown
# Code Review Feedback

## src/app/api/users.ts

### Line 10 (new)
Esta lógica pode ser simplificada, sugiro usar async/await

### Lines 15-20 (new)
**Suggested code:**
```typescript
async function fetchUserData() {
  const response = await fetch(url);
  return await response.json();
}
```

### Line 25 (old)
Concern: Falta verificação de null aqui, se user for null causará erro em tempo de execução
```

::: tip Copiar feedback
Se precisar copiar manualmente o conteúdo do feedback, pode clicar no botão **Copy Feedback** na parte inferior da barra lateral para copiar o feedback em formato Markdown para a área de transferência.
:::

## Ponto de Verificação ✅

Após concluir as etapas acima, você deve ser capaz de:

- [ ] Clicar no número da linha ou botão Hover "+" no diff de código para selecionar linhas de código
- [ ] Adicionar anotação Comment (comentário geral)
- [ ] Adicionar anotação Suggestion (com código sugerido)
- [ ] Adicionar anotação Concern (marcar problemas potenciais)
- [ ] Visualizar todas as anotações na barra lateral, clicar para pular para a posição correspondente
- [ ] Excluir anotações desnecessárias
- [ ] Exportar feedback em formato Markdown
- [ ] Copiar conteúdo do feedback para a área de transferência

**Se alguma etapa falhar**, veja:
- [Perguntas Frequentes](../../../faq/common-problems/)
- [Revisão de Código Básica](../../code-review-basics/)
- [Solução de Problemas](../../../faq/troubleshooting/)

## Avisos de Armadilhas

**Erro comum 1**: Após clicar no número da linha, a barra de ferramentas não aparece

**Causa**: Pode ter clicado no nome do arquivo ou o número da linha não está no intervalo do diff.

**Solução**:
- Certifique-se de clicar no número da linha da linha do diff (linhas verdes ou vermelhas)
- Para linhas excluídas (vermelhas), clique no número da linha à esquerda
- Para linhas adicionadas (verdes), clique no número da linha à direita

**Erro comum 2**: Após selecionar múltiplas linhas, a anotação é exibida na posição errada

**Causa**: side (old/new) incorreto.

**Solução**:
- Verifique se você selecionou código antigo (deletions) ou novo (additions)
- A anotação é exibida abaixo da última linha do intervalo
- Se a posição estiver errada, exclua a anotação e adicione novamente

**Erro comum 3**: Após adicionar código sugerido, o formato do código fica desordenado

**Causa**: O código sugerido pode conter caracteres especiais ou problemas de indentação.

**Solução**:
- Na caixa de entrada de código sugerido, certifique-se de que a indentação está correta
- Use fonte monoespaçada para editar o código sugerido
- Se houver quebras de linha, use `Shift + Enter` em vez de Enter direto

**Erro comum 4**: Não consegue ver novas anotações na barra lateral

**Causa**: A barra lateral pode não ter atualizado, ou a anotação foi adicionada em outro arquivo.

**Solução**:
- Alterne o arquivo e depois alterne de volta
- Verifique se a anotação foi adicionada no arquivo atualmente visualizado
- Atualize a página do navegador (pode perder anotações não commitadas)

**Erro comum 5**: Após exportar feedback, a IA não modificou conforme a sugestão

**Causa**: A IA pode não ter compreendido corretamente a intenção da anotação, ou a sugestão não é viável.

**Solução**:
- Use anotações mais claras (Suggestion é mais claro que Comment)
- Adicione comentários explicando o motivo no código sugerido
- Se o problema persistir, pode enviar feedback novamente, ajustando o conteúdo da anotação

## Resumo da Lição

Anotações de código são a funcionalidade principal da revisão de código do Plannotator, permitindo que você forneça feedback preciso sobre problemas de código:

**Operações principais**:
1. **Acionar**: Execute `/plannotator-review`, o navegador abre automaticamente o diff viewer
2. **Navegar**: Visualize alterações de código (alternar visualização split/unified)
3. **Selecionar**: Clique no número da linha ou botão Hover "+" para selecionar o intervalo de código
4. **Anotar**: Adicione anotações Comment/Suggestion/Concern
5. **Gerenciar**: Visualize, pule, exclua anotações na barra lateral
6. **Exportar**: Send Feedback, a IA recebe feedback estruturado

**Tipos de anotações**:
- **Comment**: Comentário geral, fornece sugestões mas não obriga
- **Suggestion**: Sugestão clara de modificação, com código sugerido
- **Concern**: Marca problemas potenciais ou pontos de risco

**Melhores práticas**:
- Ao usar Suggestion, tente fornecer código completo executável
- Para problemas de desempenho ou segurança, use Concern para marcar
- O conteúdo da anotação deve ser específico, evite descrições vagas (como "isso não é bom")
- Pode anexar imagens para auxiliar na explicação (usar funcionalidade de anotação de imagem)

## Próxima Lição

> Na próxima lição, aprenderemos **[Alternar Visualização Diff](../../code-review-diff-types/)**.
>
> Você aprenderá:
> - Como alternar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
> - Cenários de uso de diferentes tipos de diff
> - Como alternar rapidamente entre múltiplos tipos de diff

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Definição do tipo CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L56) | 53-56 |
| Interface CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Componente DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Componente ReviewPanel | [`packages/review-editor/components/ReviewPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/ReviewPanel.tsx#L1-L211) | 1-211 |
| Exportar feedback Markdown | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86-L126) | 86-126 |
| Botão Hover "+" | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#LL180-L199) | 180-199 |
| Barra de ferramentas de anotação | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L267-L344) | 267-344 |
| Renderização de anotação | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L140-L177) | 140-177 |

**Tipos principais**:
- `CodeAnnotationType`: Tipo de anotação de código ('comment' | 'suggestion' | 'concern') (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Interface de anotação de código (`packages/ui/types.ts:55-66`)
- `SelectedLineRange`: Intervalo de código selecionado (`packages/ui/types.ts:77-82`)

**Funções principais**:
- `exportReviewFeedback()`: Converte anotações para formato Markdown (`packages/review-editor/App.tsx:86`)
- `renderAnnotation()`: Renderiza anotações no diff (`packages/review-editor/components/DiffViewer.tsx:140`)
- `renderHoverUtility()`: Renderiza botão Hover "+" (`packages/review-editor/components/DiffViewer.tsx:180`)

**Rotas da API**:
- `POST /api/feedback`: Enviar feedback de revisão (`packages/server/review.ts`)
- `GET /api/diff`: Obter git diff (`packages/server/review.ts:111`)
- `POST /api/diff/switch`: Alternar tipo de diff (`packages/server/review.ts`)

**Regras de negócio**:
- Padrão visualiza diff não commitado (`git diff HEAD`) (`packages/server/review.ts:111`)
- Anotações são exibidas abaixo da última linha do intervalo (estilo GitHub) (`packages/review-editor/components/DiffViewer.tsx:81`)
- Suporta anexar código sugerido em anotações (campo `suggestedCode`) (`packages/ui/types.ts:63`)

</details>
