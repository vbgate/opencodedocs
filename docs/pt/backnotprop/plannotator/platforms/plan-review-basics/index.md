---
title: "Revisão de Planos: Revise Visualmente Planos de IA | Plannotator"
subtitle: "Fundamentos da Revisão de Planos: Revise Visualmente Planos de IA"
description: "Aprenda a funcionalidade de revisão de planos do Plannotator. Use a interface visual para revisar planos gerados por IA, adicione anotações para aprovar ou rejeitar, e domine a diferença entre Approve e Request Changes."
sidebarTitle: "Aprenda a Revisar Planos em 5 min"
tags:
  - "Revisão de Planos"
  - "Revisão Visual"
  - "Anotações"
  - "Aprovação"
  - "Rejeição"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# Fundamentos da Revisão de Planos: Revise Visualmente Planos de IA

## O Que Você Vai Aprender

- ✅ Usar a interface visual do Plannotator para revisar planos gerados por IA
- ✅ Selecionar texto do plano e adicionar diferentes tipos de anotações (excluir, substituir, comentar)
- ✅ Aprovar planos para que a IA continue a implementação
- ✅ Rejeitar planos, enviando anotações como feedback para a IA
- ✅ Entender os cenários de uso e diferenças entre tipos de anotações

## Seu Problema Atual

**Problema 1**: Planos de implementação gerados por IA são difíceis de ler no terminal—muito texto, estrutura confusa, revisão cansativa.

**Problema 2**: Ao dar feedback para a IA, você só pode descrever em texto "exclua o parágrafo 3", "modifique esta função"—alto custo de comunicação, e a IA pode entender errado.

**Problema 3**: Algumas partes do plano não precisam de modificação, outras precisam de substituição, outras precisam de comentários, mas não há ferramenta para estruturar esse feedback.

**Problema 4**: Você não sabe como informar a IA se aprovou o plano ou se precisa de modificações.

**O Plannotator pode ajudar**:
- Interface visual substitui leitura no terminal, estrutura clara
- Selecione texto para adicionar anotações (excluir, substituir, comentar), feedback preciso
- Anotações são automaticamente convertidas em dados estruturados, a IA entende sua intenção com precisão
- Aprove ou rejeite com um clique, a IA responde imediatamente

## Quando Usar Esta Técnica

**Cenários de uso**:
- AI Agent completa o plano e chama `ExitPlanMode` (Claude Code)
- AI Agent chama a ferramenta `submit_plan` (OpenCode)
- Precisa revisar planos de implementação gerados por IA
- Precisa dar feedback preciso sobre modificações no plano

**Cenários não aplicáveis**:
- Deixar a IA implementar código diretamente (pulando a revisão do plano)
- Já aprovou o plano, precisa revisar as mudanças reais no código (use a funcionalidade de revisão de código)

## 🎒 Preparação Antes de Começar

**Pré-requisitos**:
- ✅ CLI do Plannotator instalado (veja [Início Rápido](../start/getting-started/))
- ✅ Plugin Claude Code ou OpenCode configurado (veja o guia de instalação correspondente)
- ✅ AI Agent suporta revisão de planos (Claude Code 2.1.7+ ou OpenCode)

**Como acionar**:
- **Claude Code**: Após a IA completar o plano, ela automaticamente chama `ExitPlanMode`, e o Plannotator inicia automaticamente
- **OpenCode**: A IA chama a ferramenta `submit_plan`, e o Plannotator inicia automaticamente

## Conceito Central

### O Que é Revisão de Planos

**Revisão de Planos** é a funcionalidade central do Plannotator, usada para revisar visualmente planos de implementação gerados por IA.

::: info Por que precisamos de revisão de planos?
Após a IA gerar um plano, ela geralmente pergunta "Este plano está bom?" ou "Devo começar a implementação?". Sem uma ferramenta visual, você só pode ler o plano em texto puro no terminal e responder com feedback vago como "ok", "não, modifique XX". O Plannotator permite que você visualize o plano em uma interface visual, selecione precisamente as partes que precisam de modificação, adicione anotações estruturadas, e a IA entende sua intenção mais facilmente.
:::

### Fluxo de Trabalho

```
┌─────────────────┐
│  AI Agent      │
│  (gera plano)  │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← navegador abre automaticamente
│                 │
│ ┌───────────┐  │
│ │ Conteúdo   │  │
│ │ do Plano   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ selecionar texto
│       ▼         │
│ ┌───────────┐  │
│ │ Adicionar  │  │
│ │ Anotação   │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Decisão   │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} ou
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (continua     │
│  implementação)│
└─────────────────┘
```

### Tipos de Anotações

O Plannotator suporta quatro tipos de anotações, cada um com um propósito diferente:

| Tipo de Anotação | Propósito | Feedback que a IA Recebe |
| --- | --- | --- |
| **Delete** | Excluir conteúdo desnecessário | "Excluir: [texto selecionado]" |
| **Replace** | Substituir por conteúdo melhor | "Substituir: [texto selecionado] por [texto que você digitou]" |
| **Comment** | Comentar uma seção, sem exigir modificação | "Comentário: [texto selecionado]. Nota: [seu comentário]" |
| **Global Comment** | Comentário global, não associado a texto específico | "Comentário Global: [seu comentário]" |

### Approve vs Request Changes

| Tipo de Decisão | Ação | Feedback que a IA Recebe | Cenário Aplicável |
| --- | --- | --- | --- |
| **Approve** | Clique no botão Approve | `{"behavior": "allow"}` | Plano está ok, aprovar diretamente |
| **Request Changes** | Clique no botão Request Changes | `{"behavior": "deny", "message": "..."}` | Há partes que precisam de modificação |

::: tip Diferenças entre Claude Code e OpenCode
- **Claude Code**: Ao aprovar, as anotações não são enviadas (anotações são ignoradas)
- **OpenCode**: Ao aprovar, as anotações podem ser enviadas como notas (opcional)

**Ao rejeitar o plano**: Em ambas as plataformas, as anotações são enviadas para a IA
:::

## Siga Comigo

### Passo 1: Acionar a Revisão de Planos

**Exemplo com Claude Code**:

No Claude Code, converse com a IA e peça para ela gerar um plano de implementação:

```
Usuário: Ajude-me a criar um plano de implementação para um módulo de autenticação de usuários

Claude: Ok, aqui está o plano de implementação:
1. Criar modelo de usuário
2. Implementar API de registro
3. Implementar API de login
...
(IA chama ExitPlanMode)
```

**Exemplo com OpenCode**:

No OpenCode, a IA automaticamente chama a ferramenta `submit_plan`.

**O que você deve ver**:
1. O navegador abre automaticamente a interface do Plannotator
2. Exibe o conteúdo do plano gerado pela IA (formato Markdown)
3. Na parte inferior da página há botões "Approve" e "Request Changes"

### Passo 2: Navegar pelo Conteúdo do Plano

Visualize o plano no navegador:

- O plano é renderizado em formato Markdown, incluindo títulos, parágrafos, listas, blocos de código
- Você pode rolar para ver o plano inteiro
- Suporta alternância entre modo claro/escuro (clique no botão de alternância de tema no canto superior direito)

### Passo 3: Selecionar Texto do Plano e Adicionar Anotações

**Adicionar anotação Delete**:

1. Use o mouse para selecionar o texto que precisa ser excluído no plano
2. Na barra de ferramentas que aparece, clique no botão **Delete**
3. O texto será marcado com estilo de exclusão (tachado vermelho)

**Adicionar anotação Replace**:

1. Use o mouse para selecionar o texto que precisa ser substituído no plano
2. Na barra de ferramentas que aparece, clique no botão **Replace**
3. Na caixa de entrada que aparece, digite o conteúdo de substituição
4. Pressione Enter ou clique em confirmar
5. O texto original será marcado com estilo de substituição (fundo amarelo), e o conteúdo de substituição aparecerá abaixo

**Adicionar anotação Comment**:

1. Use o mouse para selecionar o texto que precisa de comentário no plano
2. Na barra de ferramentas que aparece, clique no botão **Comment**
3. Na caixa de entrada que aparece, digite o conteúdo do comentário
4. Pressione Enter ou clique em confirmar
5. O texto será marcado com estilo de comentário (destaque azul), e o comentário aparecerá na barra lateral

**Adicionar Global Comment**:

1. Clique no botão **Add Global Comment** no canto superior direito da página
2. Na caixa de entrada que aparece, digite o conteúdo do comentário global
3. Pressione Enter ou clique em confirmar
4. O comentário aparecerá na seção "Global Comments" da barra lateral

**O que você deve ver**:
- Após selecionar o texto, uma barra de ferramentas aparece imediatamente (Delete, Replace, Comment)
- Após adicionar anotações, o texto exibe o estilo correspondente (tachado, cor de fundo, destaque)
- A barra lateral exibe a lista de todas as anotações, você pode clicar para ir à posição correspondente
- Você pode clicar no botão **excluir** ao lado da anotação para removê-la

### Passo 4: Aprovar o Plano

**Se o plano estiver ok**:

Clique no botão **Approve** na parte inferior da página.

**O que você deve ver**:
- O navegador fecha automaticamente (atraso de 1,5 segundos)
- O terminal do Claude Code/OpenCode mostra que o plano foi aprovado
- A IA continua a implementar o plano

::: info Comportamento do Approve
- **Claude Code**: Envia apenas `{"behavior": "allow"}`, anotações são ignoradas
- **OpenCode**: Envia `{"behavior": "allow"}`, anotações podem ser enviadas como notas (opcional)
:::

### Passo 5: Rejeitar o Plano (Request Changes)

**Se o plano precisar de modificações**:

1. Adicione as anotações necessárias (Delete, Replace, Comment)
2. Clique no botão **Request Changes** na parte inferior da página
3. O navegador exibirá um diálogo de confirmação

**O que você deve ver**:
- O diálogo de confirmação mostra "Send X annotations to AI?"
- Após confirmar, o navegador fecha automaticamente
- O terminal do Claude Code/OpenCode mostra o conteúdo do feedback
- A IA modificará o plano com base no feedback

::: tip Comportamento do Request Changes
- **Claude Code** e **OpenCode**: Ambos enviam `{"behavior": "deny", "message": "..."}`
- As anotações são convertidas em texto Markdown estruturado
- A IA modificará o plano e chamará ExitPlanMode/submit_plan novamente
:::

### Passo 6: Visualizar o Conteúdo do Feedback (Opcional)

Se você quiser ver o conteúdo do feedback que o Plannotator enviou para a IA, pode verificar no terminal:

**Claude Code**:
```
Plan rejected by user
Please modify the plan based on the following feedback:

[conteúdo estruturado das anotações]
```

**OpenCode**:
```
<feedback>
[conteúdo estruturado das anotações]
</feedback>
```

## Checkpoint ✅

Após completar os passos acima, você deve ser capaz de:

- [ ] Quando a IA aciona a revisão de planos, o navegador abre automaticamente a interface do Plannotator
- [ ] Selecionar texto do plano e adicionar anotações Delete, Replace, Comment
- [ ] Adicionar Global Comment
- [ ] Ver todas as anotações na barra lateral e ir às posições correspondentes
- [ ] Clicar em Approve, o navegador fecha, a IA continua a implementação
- [ ] Clicar em Request Changes, o navegador fecha, a IA modifica o plano

**Se algum passo falhar**, veja:
- [Problemas Comuns](../../faq/common-problems/)
- [Guia de Instalação do Claude Code](../../start/installation-claude-code/)
- [Guia de Instalação do OpenCode](../../start/installation-opencode/)

## Armadilhas Comuns

**Erro comum 1**: Após selecionar o texto, a barra de ferramentas não aparece

**Causa**: Pode ser porque você selecionou texto dentro de um bloco de código, ou o texto selecionado abrange múltiplos elementos.

**Solução**:
- Tente selecionar texto dentro de um único parágrafo ou item de lista
- Para blocos de código, use anotação Comment, não selecione múltiplas linhas

**Erro comum 2**: Após adicionar anotação Replace, o conteúdo de substituição não aparece

**Causa**: A caixa de entrada do conteúdo de substituição pode não ter sido enviada corretamente.

**Solução**:
- Após digitar o conteúdo de substituição, pressione Enter ou clique no botão de confirmação
- Verifique se o conteúdo de substituição aparece na barra lateral

**Erro comum 3**: Após clicar em Approve ou Request Changes, o navegador não fecha

**Causa**: Pode ser um erro do servidor ou problema de rede.

**Solução**:
- Verifique se há mensagens de erro no terminal
- Feche o navegador manualmente
- Se o problema persistir, veja [Solução de Problemas](../../faq/troubleshooting/)

**Erro comum 4**: Após a IA receber o feedback, ela não modifica de acordo com as anotações

**Causa**: A IA pode não ter entendido corretamente a intenção das anotações.

**Solução**:
- Tente usar anotações mais explícitas (Replace é mais explícito que Comment)
- Use Comment para adicionar explicações detalhadas
- Se o problema persistir, você pode rejeitar o plano novamente e ajustar o conteúdo das anotações

**Erro comum 5**: Após adicionar múltiplas anotações Delete, a IA só excluiu parte do conteúdo

**Causa**: Múltiplas anotações Delete podem ter sobreposição ou conflito.

**Solução**:
- Certifique-se de que o intervalo de texto de cada anotação Delete não se sobreponha
- Se precisar excluir uma grande seção de conteúdo, selecione o parágrafo inteiro de uma vez

## Resumo da Lição

A Revisão de Planos é a funcionalidade central do Plannotator, permitindo que você revise visualmente planos gerados por IA:

**Operações principais**:
1. **Acionar**: A IA chama `ExitPlanMode` ou `submit_plan`, o navegador abre automaticamente a interface
2. **Navegar**: Visualize o conteúdo do plano na interface visual (formato Markdown)
3. **Anotar**: Selecione texto, adicione Delete, Replace, Comment ou Global Comment
4. **Decidir**: Clique em Approve (aprovar) ou Request Changes (rejeitar)
5. **Feedback**: As anotações são convertidas em dados estruturados, a IA continua ou modifica o plano com base no feedback

**Tipos de anotações**:
- **Delete**: Excluir conteúdo desnecessário
- **Replace**: Substituir por conteúdo melhor
- **Comment**: Comentar uma seção, sem exigir modificação
- **Global Comment**: Comentário global, não associado a texto específico

**Tipos de decisão**:
- **Approve**: Plano está ok, aprovar diretamente (Claude Code ignora anotações)
- **Request Changes**: Há partes que precisam de modificação, anotações são enviadas para a IA

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Adicionar Anotações ao Plano](../plan-review-annotations/)**.
>
> Você aprenderá:
> - Como usar precisamente anotações Delete, Replace, Comment
> - Como adicionar anotações de imagem
> - Como editar e excluir anotações
> - Melhores práticas e cenários comuns de anotações

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Interface de Revisão de Planos | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Definição de Tipos de Anotação | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| Servidor de Revisão de Planos | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API: Obter Conteúdo do Plano | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API: Aprovar Plano | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API: Rejeitar Plano | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Componente Viewer | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| Componente AnnotationPanel | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**Tipos principais**:
- `AnnotationType`: Enum de tipos de anotação (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation`: Interface de anotação (`packages/ui/types.ts:11-33`)
- `Block`: Interface de bloco do plano (`packages/ui/types.ts:35-44`)

**Funções principais**:
- `startPlannotatorServer()`: Inicia o servidor de revisão de planos (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()`: Converte Markdown em Blocks (`packages/ui/utils/parser.ts`)

**Rotas da API**:
- `GET /api/plan`: Obter conteúdo do plano (`packages/server/index.ts:132`)
- `POST /api/approve`: Aprovar plano (`packages/server/index.ts:201`)
- `POST /api/deny`: Rejeitar plano (`packages/server/index.ts:280`)

**Regras de negócio**:
- Claude Code não envia anotações ao aprovar (`apps/hook/server/index.ts:132`)
- OpenCode pode enviar anotações como notas ao aprovar (`apps/opencode-plugin/index.ts:270`)
- Anotações são sempre enviadas ao rejeitar o plano (`apps/hook/server/index.ts:154`)

</details>
