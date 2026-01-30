---
title: "Revisão de Código: Visualização de Git Diff | plannotator"
sidebarTitle: "Revisar Código do Agent"
subtitle: "Revisão de Código: Visualização de Git Diff"
description: "Aprenda a funcionalidade de revisão de código do Plannotator. Use a interface visual para revisar Git Diff, alterne entre visualizações side-by-side e unified, adicione comentários por linha e envie feedback para o AI Agent."
tags:
  - "Revisão de Código"
  - "Git Diff"
  - "Comentários por Linha"
  - "Side-by-side"
  - "Unified"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 4
---

# Fundamentos da Revisão de Código: Revisando Git Diff com /plannotator-review

## O Que Você Vai Aprender

- ✅ Usar o comando `/plannotator-review` para revisar Git Diff
- ✅ Alternar entre visualizações side-by-side e unified
- ✅ Clicar em números de linha para selecionar intervalos de código e adicionar comentários
- ✅ Adicionar diferentes tipos de anotações (comment/suggestion/concern)
- ✅ Alternar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
- ✅ Enviar feedback de revisão para o AI Agent

## Seu Problema Atual

**Problema 1**: Ao usar `git diff` para visualizar alterações de código, a saída rola no terminal, dificultando a compreensão completa das modificações.

**Problema 2**: Ao dar feedback ao Agent sobre problemas no código, você só pode descrever em texto "há um problema na linha 10", "modifique esta função", o que pode gerar ambiguidade.

**Problema 3**: Você não sabe exatamente quais arquivos o Agent modificou, tornando difícil focar nas partes críticas em meio a muitas alterações.

**Problema 4**: Após revisar o código, você quer enviar feedback estruturado ao Agent para que ele faça as correções com base nas sugestões.

**O Plannotator pode ajudar você**:
- Visualizar Git Diff com suporte a duas visualizações: side-by-side e unified
- Clicar em números de linha para selecionar intervalos de código e marcar precisamente a localização dos problemas
- Adicionar comentários por linha (comment/suggestion/concern) com código sugerido
- Alternar facilmente entre tipos de diff (uncommitted, staged, last commit, branch)
- Comentários são automaticamente convertidos em Markdown para que o Agent entenda seu feedback com precisão

## Quando Usar Esta Técnica

**Cenários de uso**:
- Após o Agent completar modificações de código, você precisa revisar as alterações
- Antes de fazer commit, você quer verificar completamente suas alterações
- Ao colaborar com a equipe, você precisa fornecer feedback estruturado sobre problemas no código
- Você quer alternar entre diferentes tipos de diff (não commitado vs staged vs último commit)

**Cenários não aplicáveis**:
- Revisar planos de implementação gerados por IA (use a funcionalidade de revisão de planos)
- Usar `git diff` diretamente no terminal (não precisa de interface visual)

## 🎒 Preparação Antes de Começar

**Pré-requisitos**:
- ✅ Plannotator CLI instalado (veja [Início Rápido](../../start/getting-started/))
- ✅ Plugin Claude Code ou OpenCode configurado (veja o guia de instalação correspondente)
- ✅ Diretório atual está em um repositório Git

**Como acionar**:
- Execute o comando `/plannotator-review` no Claude Code ou OpenCode

## Conceito Principal

### O Que é Revisão de Código

**Revisão de Código** é a ferramenta visual de revisão de Git Diff fornecida pelo Plannotator, permitindo que você visualize alterações de código no navegador e adicione comentários por linha.

::: info Por que precisamos de revisão de código?
Após o AI Agent completar modificações de código, geralmente ele exibe o conteúdo do git diff na saída do terminal. Este formato de texto puro dificulta a compreensão completa das alterações e não é conveniente para marcar precisamente a localização dos problemas. O Plannotator fornece uma interface visual (side-by-side ou unified), suporta clicar em números de linha para adicionar comentários e envia feedback estruturado ao Agent para que ele modifique o código com base nas sugestões.
:::

### Fluxo de Trabalho

```
┌─────────────────┐
│  Usuário        │
│  (executa cmd)  │
└────────┬────────┘
         │
         │ /plannotator-review
         ▼
┌─────────────────┐
│  CLI            │
│  (executa git)  │
│  git diff HEAD  │
└────────┬────────┘
         │
         │ rawPatch + gitRef
         ▼
┌─────────────────┐
│ Review Server   │  ← Servidor local iniciado
│  /api/diff      │
└────────┬────────┘
         │
         │ Navegador abre UI
         ▼
┌─────────────────┐
│ Review UI       │
│                 │
│ ┌───────────┐   │
│ │ File Tree │   │
│ │ (lista)   │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ DiffViewer│   │
│ │ (comparar)│   │
│ │ split/    │   │
│ │ unified   │   │
│ └───────────┘   │
│       │         │
│       │ Clique na linha
│       ▼         │
│ ┌───────────┐   │
│ │ Adicionar │   │
│ │ comentário│   │
│ │ comment/  │   │
│ │ suggestion│   │
│ │ concern   │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ Enviar    │   │
│ │ Feedback  │   │
│ │ ou LGTM   │   │
│ └───────────┘   │
└────────┬────────┘
         │
         │ Feedback em Markdown
         ▼
┌─────────────────┐
│  AI Agent       │
│  (modifica)     │
└─────────────────┘
```

### Modos de Visualização

| Modo de Visualização | Descrição | Cenário de Uso |
| --- | --- | --- |
| **Split (Side-by-side)** | Tela dividida, código antigo à esquerda, código novo à direita | Comparar grandes alterações, ver claramente antes e depois |
| **Unified** | Mesclado verticalmente, exclusões e adições na mesma coluna | Ver pequenas alterações, economizar espaço vertical |

### Tipos de Anotação

O Plannotator suporta três tipos de anotação de código:

| Tipo de Anotação | Uso | Aparência na UI |
| --- | --- | --- |
| **Comment** | Comentar uma linha de código, fazer perguntas ou explicações | Marcação com borda roxa/azul |
| **Suggestion** | Fornecer sugestões específicas de modificação de código | Marcação com borda verde, com bloco de código sugerido |
| **Concern** | Marcar problemas potenciais que precisam de atenção | Marcação com borda amarela/laranja |

::: tip Diferença entre tipos de anotação
- **Comment**: Para perguntas, explicações, feedback geral
- **Suggestion**: Para fornecer soluções específicas de modificação de código (com código sugerido)
- **Concern**: Para marcar problemas que precisam ser corrigidos ou riscos potenciais
:::

### Tipos de Diff

| Tipo de Diff | Comando Git | Descrição |
| --- | --- | --- |
| **Uncommitted** | `git diff HEAD` | Alterações não commitadas (padrão) |
| **Staged** | `git diff --staged` | Alterações em staging |
| **Unstaged** | `git diff` | Alterações não em staging |
| **Last commit** | `git diff HEAD~1..HEAD` | Conteúdo do último commit |
| **Branch** | `git diff main..HEAD` | Comparação entre branch atual e branch padrão |

## Siga Comigo

### Passo 1: Acionar a Revisão de Código

Execute o comando `/plannotator-review` no Claude Code ou OpenCode:

```
Usuário: /plannotator-review

CLI: Executando git diff...
     Navegador aberto
```

**Você deve ver**:
1. Navegador abre automaticamente a interface de revisão de código do Plannotator
2. Lista de arquivos (File Tree) à esquerda
3. Diff Viewer à direita (visualização split por padrão)
4. Botões de alternância de visualização no topo (Split/Unified)
5. Botões "Send Feedback" e "LGTM" na parte inferior

### Passo 2: Navegar pela Lista de Arquivos

Visualize os arquivos modificados no File Tree à esquerda:

- Arquivos agrupados por caminho
- Cada arquivo mostra estatísticas de alteração (additions/deletions)
- Clique em um arquivo para ver o conteúdo do diff correspondente

**Você deve ver**:
```
src/
  auth/
    login.ts          (+12, -5)  ← Clique para ver o diff deste arquivo
    user.ts          (+8, -2)
  api/
    routes.ts        (+25, -10)
```

### Passo 3: Alternar Modo de Visualização

Clique nos botões "Split" ou "Unified" no topo da página para alternar a visualização:

**Visualização Split** (Side-by-side):
- Código antigo à esquerda (fundo cinza, linhas excluídas em vermelho)
- Código novo à direita (fundo branco, linhas adicionadas em verde)
- Ideal para comparar grandes alterações

**Visualização Unified** (Mesclada):
- Código antigo e novo na mesma coluna
- Linhas excluídas com fundo vermelho, linhas adicionadas com fundo verde
- Ideal para ver pequenas alterações

**Você deve ver**:
- Visualização Split: Tela dividida, comparação clara antes e depois
- Visualização Unified: Mesclado verticalmente, economiza espaço vertical

### Passo 4: Selecionar Linhas de Código e Adicionar Anotações

**Adicionar anotação Comment**:

1. Passe o mouse sobre uma linha de código, um botão `+` aparecerá ao lado do número da linha
2. Clique no botão `+`, ou clique diretamente no número da linha para selecioná-la
3. Selecionar múltiplas linhas: Clique no número da linha inicial, segure Shift e clique no número da linha final
4. Digite o conteúdo do comentário na barra de ferramentas que aparece
5. Clique no botão "Add Comment"

**Adicionar anotação Suggestion (com código sugerido)**:

1. Siga os passos acima para adicionar uma anotação
2. Clique no botão "Add suggested code" na barra de ferramentas
3. Digite o código sugerido na caixa de código que aparece
4. Clique no botão "Add Comment"

**Você deve ver**:
- Anotação exibida abaixo da linha de código
- Anotação Comment: Marcação com borda roxa/azul, mostrando o conteúdo do comentário
- Anotação Suggestion: Marcação com borda verde, mostrando o conteúdo do comentário e bloco de código sugerido
- Barra lateral direita mostrando lista de todas as anotações

### Passo 5: Alternar Tipo de Diff

Selecione diferentes tipos de diff no topo da página:

- **Uncommitted changes** (padrão): Alterações não commitadas
- **Staged changes**: Alterações em staging
- **Last commit**: Conteúdo do último commit
- **vs main** (se não estiver na branch padrão): Comparação com a branch padrão

**Você deve ver**:
- Diff Viewer atualizado com o novo conteúdo de diff selecionado
- Lista de arquivos atualizada mostrando novas estatísticas de alteração

### Passo 6: Enviar Feedback para o Agent

**Send Feedback (Enviar Feedback)**:

1. Adicione as anotações necessárias (Comment/Suggestion/Concern)
2. Clique no botão "Send Feedback" na parte inferior da página
3. Se não houver anotações, uma caixa de diálogo de confirmação perguntará se deseja continuar

**LGTM (Looks Good To Me)**:

Se o código não tiver problemas, clique no botão "LGTM".

**Você deve ver**:
- Navegador fecha automaticamente (atraso de 1,5 segundos)
- Terminal mostra o conteúdo do feedback ou "LGTM - no changes requested."
- Agent recebe o feedback e começa a modificar o código

### Passo 7: Visualizar Conteúdo do Feedback (Opcional)

Se você quiser ver o conteúdo do feedback que o Plannotator enviou ao Agent, pode visualizar no terminal:

```
# Code Review Feedback

## src/auth/login.ts

### Line 15 (new)
É necessário adicionar lógica de tratamento de erros aqui.

### Line 20-25 (old)
**Suggested code:**
```typescript
try {
  await authenticate(req);
} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}
```

## src/api/routes.ts

### Line 10 (new)
Esta função está sem validação de entrada.
```

**Você deve ver**:
- Feedback agrupado por arquivo
- Cada anotação mostra caminho do arquivo, número da linha, tipo
- Anotações Suggestion incluem bloco de código sugerido

## Checkpoint ✅

Após completar os passos acima, você deve ser capaz de:

- [ ] Executar o comando `/plannotator-review`, navegador abre automaticamente a interface de revisão de código
- [ ] Visualizar a lista de arquivos modificados no File Tree
- [ ] Alternar entre visualizações Split e Unified
- [ ] Clicar em números de linha ou botão `+` para selecionar linhas de código
- [ ] Adicionar anotações Comment, Suggestion, Concern
- [ ] Adicionar código sugerido nas anotações
- [ ] Alternar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
- [ ] Clicar em Send Feedback, navegador fecha, terminal mostra conteúdo do feedback
- [ ] Clicar em LGTM, navegador fecha, terminal mostra "LGTM - no changes requested."

**Se algum passo falhar**, consulte:
- [Problemas Comuns](../../faq/common-problems/)
- [Guia de Instalação do Claude Code](../../start/installation-claude-code/)
- [Guia de Instalação do OpenCode](../../start/installation-opencode/)

## Armadilhas Comuns

**Erro comum 1**: Após executar `/plannotator-review`, o navegador não abre

**Causa**: Pode ser porta ocupada ou falha ao iniciar o servidor.

**Solução**:
- Verifique se há mensagens de erro no terminal
- Tente abrir manualmente a URL exibida no navegador
- Se o problema persistir, consulte [Solução de Problemas](../../faq/troubleshooting/)

**Erro comum 2**: Após clicar no número da linha, a barra de ferramentas não aparece

**Causa**: Pode ser porque a linha selecionada está vazia, ou a janela do navegador está muito pequena.

**Solução**:
- Tente selecionar linhas que contêm código
- Aumente a janela do navegador
- Certifique-se de que o JavaScript não está desabilitado

**Erro comum 3**: Após adicionar anotação, ela não aparece abaixo da linha de código

**Causa**: Pode ser porque a linha selecionada está vazia, ou a janela do navegador está muito pequena.

**Solução**:
- Tente selecionar linhas que contêm código
- Aumente a janela do navegador
- Certifique-se de que o JavaScript não está desabilitado
- Verifique se a barra lateral direita está mostrando a lista de anotações

**Erro comum 4**: Após clicar em Send Feedback, o terminal não mostra o conteúdo do feedback

**Causa**: Pode ser problema de rede ou erro do servidor.

**Solução**:
- Verifique se há mensagens de erro no terminal
- Tente reenviar o feedback
- Se o problema persistir, consulte [Solução de Problemas](../../faq/troubleshooting/)

**Erro comum 5**: Agent recebe o feedback mas não modifica o código conforme as sugestões

**Causa**: O Agent pode não ter entendido corretamente a intenção da anotação.

**Solução**:
- Tente usar anotações mais claras (Suggestion é mais claro que Comment)
- Use Comment para adicionar explicações detalhadas
- Forneça código sugerido completo no Suggestion
- Se o problema persistir, você pode executar `/plannotator-review` novamente para revisar as novas alterações

**Erro comum 6**: Após alternar o tipo de diff, a lista de arquivos está vazia

**Causa**: Pode ser porque o tipo de diff selecionado não tem alterações.

**Solução**:
- Tente voltar para "Uncommitted changes"
- Verifique o status do git para confirmar se há alterações
- Use `git status` para ver o estado atual

## Resumo da Lição

Revisão de Código é a ferramenta visual de revisão de Git Diff fornecida pelo Plannotator:

**Operações principais**:
1. **Acionar**: Execute `/plannotator-review`, navegador abre automaticamente a UI
2. **Navegar**: Visualize a lista de arquivos modificados no File Tree
3. **Visualização**: Alterne entre visualizações Split (side-by-side) e Unified
4. **Anotar**: Clique em números de linha para selecionar código, adicione anotações Comment/Suggestion/Concern
5. **Alternar**: Selecione diferentes tipos de diff (uncommitted/staged/last commit/branch)
6. **Feedback**: Clique em Send Feedback ou LGTM, feedback é enviado ao Agent

**Modos de visualização**:
- **Split (Side-by-side)**: Tela dividida, código antigo à esquerda, código novo à direita
- **Unified**: Mesclado verticalmente, exclusões e adições na mesma coluna

**Tipos de anotação**:
- **Comment**: Comentar uma linha de código, fazer perguntas ou explicações
- **Suggestion**: Fornecer sugestões específicas de modificação de código (com código sugerido)
- **Concern**: Marcar problemas potenciais que precisam de atenção

**Tipos de Diff**:
- **Uncommitted**: Alterações não commitadas (padrão)
- **Staged**: Alterações em staging
- **Unstaged**: Alterações não em staging
- **Last commit**: Conteúdo do último commit
- **Branch**: Comparação entre branch atual e branch padrão

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Adicionar Anotações de Código](../code-review-annotations/)**.
>
> Você vai aprender:
> - Como usar precisamente anotações Comment, Suggestion, Concern
> - Como adicionar código sugerido e formatá-lo para exibição
> - Como editar e excluir anotações
> - Melhores práticas e cenários comuns de anotações
> - Como selecionar o lado old/new na visualização side-by-side

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Servidor de revisão de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L302) | 1-302 |
| UI de revisão de código | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L150) | 1-150 |
| Componente DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Utilitários Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L148) | 1-148 |
| Entrada do Hook (review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Definição de tipos de anotação | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L83) | 53-83 |

**Tipos principais**:
- `CodeAnnotationType`: Enum de tipos de anotação de código (comment, suggestion, concern) (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Interface de anotação de código (`packages/ui/types.ts:55-66`)
- `DiffType`: Enum de tipos de Diff (uncommitted, staged, unstaged, last-commit, branch) (`packages/server/git.ts:10-15`)
- `GitContext`: Interface de contexto Git (`packages/server/git.ts:22-26`)

**Funções principais**:
- `startReviewServer()`: Inicia o servidor de revisão de código (`packages/server/review.ts:79`)
- `runGitDiff()`: Executa o comando git diff (`packages/server/git.ts:101`)
- `getGitContext()`: Obtém o contexto Git (informações de branch e opções de diff) (`packages/server/git.ts:79`)
- `parseDiffToFiles()`: Analisa o diff em lista de arquivos (`packages/review-editor/App.tsx:48`)
- `exportReviewFeedback()`: Exporta anotações como feedback em Markdown (`packages/review-editor/App.tsx:86`)

**Rotas da API**:
- `GET /api/diff`: Obtém conteúdo do diff (`packages/server/review.ts:118`)
- `POST /api/diff/switch`: Alterna tipo de diff (`packages/server/review.ts:130`)
- `POST /api/feedback`: Envia feedback de revisão (`packages/server/review.ts:222`)
- `GET /api/image`: Obtém imagem (`packages/server/review.ts:164`)
- `POST /api/upload`: Upload de imagem (`packages/server/review.ts:181`)
- `GET /api/agents`: Obtém agents disponíveis (OpenCode) (`packages/server/review.ts:204`)

**Regras de negócio**:
- Visualiza diff não commitado por padrão (`apps/hook/server/index.ts:55`)
- Suporta alternar para diff vs main (`packages/server/git.ts:131`)
- Feedback formatado como Markdown (`packages/review-editor/App.tsx:86`)
- Envia texto "LGTM" ao aprovar (`packages/review-editor/App.tsx:430`)

</details>
