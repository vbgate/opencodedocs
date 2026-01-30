---
title: "Otimização de Tokens: Janela de Contexto | Everything Claude Code"
sidebarTitle: "Janela de contexto saturada: o que fazer"
subtitle: "Otimização de Tokens: Janela de Contexto"
description: "Aprenda estratégias de otimização de tokens no Claude Code. Domine seleção de modelos, compactação estratégica e configuração de MCP para maximizar a eficiência da janela de contexto."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Estratégias de Otimização de Tokens: Gerenciamento da Janela de Contexto

## O que você vai aprender

- Selecionar o modelo adequado conforme o tipo de tarefa, equilibrando custo e desempenho
- Usar compactação estratégica para preservar contexto crítico em pontos lógicos
- Configurar servidores MCP de forma adequada, evitando consumo excessivo da janela de contexto
- Evitar saturação da janela de contexto e manter a qualidade das respostas

## Seu problema atual

Você já enfrentou esses problemas?

- No meio de uma conversa, o contexto é compactado repentinamente e informações críticas são perdidas
- Muitos servidores MCP habilitados, reduzindo a janela de contexto de 200k para 70k
- Durante grandes refatorações, o modelo "esquece" discussões anteriores
- Não saber quando compactar e quando não compactar

## Quando usar esta técnica

- **Ao processar tarefas complexas** - Escolher o modelo e a estratégia de gerenciamento de contexto adequados
- **Quando a janela de contexto está próxima da saturação** - Usar compactação estratégica para preservar informações críticas
- **Ao configurar servidores MCP** - Equilibrar quantidade de ferramentas e capacidade de contexto
- **Em sessões longas** - Compactar em pontos lógicos para evitar perda de informações por compactação automática

## Conceito central

O núcleo da otimização de tokens não é "usar menos", mas sim **preservar informações valiosas nos momentos críticos**.

### Três pilares da otimização

1. **Estratégia de seleção de modelo** - Usar modelos diferentes para tarefas diferentes, evitando "usar um canhão para matar uma mosca"
2. **Compactação estratégica** - Compactar em pontos lógicos, não em momentos arbitrários
3. **Gerenciamento de configuração MCP** - Controlar a quantidade de ferramentas habilitadas para proteger a janela de contexto

### Conceitos-chave

::: info O que é a janela de contexto?

A janela de contexto é o comprimento do histórico de conversas que o Claude Code consegue "lembrar". O modelo atual suporta aproximadamente 200k tokens, mas é afetado pelos seguintes fatores:

- **Servidores MCP habilitados** - Cada MCP consome espaço do prompt do sistema
- **Skills carregadas** - Definições de skills ocupam contexto
- **Histórico de conversas** - Registros de conversas entre você e o Claude

Quando o contexto se aproxima da saturação, o Claude compacta automaticamente o histórico, podendo perder informações críticas.
:::

::: tip Por que a compactação manual é melhor?

A compactação automática do Claude é acionada em momentos arbitrários, frequentemente interrompendo o fluxo no meio de uma tarefa. A compactação estratégica permite que você compacte proativamente em **pontos lógicos** (como após concluir o planejamento ou antes de mudar de tarefa), preservando o contexto importante.
:::

## Siga comigo

### Passo 1: Selecionar o modelo adequado

Escolha o modelo de acordo com a complexidade da tarefa, evitando desperdício de custo e contexto.

**Por quê**

Diferentes modelos têm grandes diferenças em capacidade de raciocínio e custo. Uma escolha adequada pode economizar muitos tokens.

**Guia de seleção de modelos**

| Modelo | Cenário de uso | Custo | Capacidade de raciocínio |
| --- | --- | --- | --- |
| **Haiku 4.5** | Agents leves, chamadas frequentes, geração de código | Baixo (1/3 do Sonnet) | 90% da capacidade do Sonnet |
| **Sonnet 4.5** | Trabalho principal de desenvolvimento, tarefas de codificação complexas, orquestração | Médio | Melhor modelo de codificação |
| **Opus 4.5** | Decisões de arquitetura, raciocínio profundo, análise de pesquisa | Alto | Capacidade de raciocínio mais forte |

**Método de configuração**

Configure no arquivo do agent no diretório `agents/`:

```markdown
---
name: planner
description: Planeja os passos de implementação de funcionalidades complexas
model: opus
---

Você é um planejador sênior...
```

**O que você deve ver**:
- Tarefas de alto raciocínio (como design de arquitetura) usando Opus, com maior qualidade
- Tarefas de codificação usando Sonnet, melhor custo-benefício
- Worker agents com chamadas frequentes usando Haiku, economizando custos

### Passo 2: Habilitar o Hook de compactação estratégica

Configure o Hook para lembrá-lo de compactar o contexto em pontos lógicos.

**Por quê**

A compactação automática é acionada em momentos arbitrários e pode perder informações críticas. A compactação estratégica permite que você decida o momento da compactação.

**Passos de configuração**

Certifique-se de que `hooks/hooks.json` tenha as configurações PreToolUse e PreCompact:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**Personalizar o limite**

Defina a variável de ambiente `COMPACT_THRESHOLD` para controlar a frequência de sugestões (padrão: 50 chamadas de ferramentas):

```json
// Adicione em ~/.claude/settings.json
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // Primeira sugestão após 50 chamadas de ferramentas
  }
}
```

**O que você deve ver**:
- Após cada edição ou escrita de arquivo, o Hook conta as chamadas de ferramentas
- Ao atingir o limite (padrão 50 vezes), você verá o aviso:
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- Depois, a cada 25 chamadas de ferramentas, você verá o aviso:
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### Passo 3: Compactar em pontos lógicos

Compacte manualmente no momento adequado, seguindo os avisos do Hook.

**Por quê**

Compactar após mudança de tarefa ou conclusão de marco permite preservar contexto crítico e limpar informações redundantes.

**Guia de momentos para compactação**

✅ **Momentos recomendados para compactar**:
- Após concluir o planejamento, antes de iniciar a implementação
- Após concluir um marco de funcionalidade, antes de iniciar o próximo
- Após concluir a depuração, antes de continuar o desenvolvimento
- Ao mudar para um tipo diferente de tarefa

❌ **Momentos para evitar compactação**:
- Durante a implementação de uma funcionalidade
- No meio da depuração de um problema
- Durante modificações de múltiplos arquivos relacionados

**Passos de operação**

Após ver o aviso do Hook:

1. Avalie a fase atual da tarefa
2. Se for adequado compactar, execute:
   ```bash
   /compact
   ```
3. Aguarde o Claude resumir o contexto
4. Verifique se as informações críticas foram preservadas

**O que você deve ver**:
- Após a compactação, a janela de contexto libera muito espaço
- Informações críticas (como plano de implementação, funcionalidades concluídas) são preservadas
- Novas interações começam com um contexto simplificado

### Passo 4: Otimizar a configuração MCP

Controle a quantidade de servidores MCP habilitados para proteger a janela de contexto.

**Por quê**

Cada servidor MCP consome espaço do prompt do sistema. Habilitar muitos reduz significativamente a janela de contexto.

**Princípios de configuração**

Com base na experiência do README:

```json
{
  "mcpServers": {
    // Você pode configurar 20-30 MCPs...
    "github": { ... },
    "supabase": { ... },
    // ...mais configurações
  },
  "disabledMcpServers": [
    "firecrawl",       // Desabilitar MCPs pouco usados
    "clickhouse",
    // ...desabilitar conforme necessidade do projeto
  ]
}
```

**Melhores práticas**:

- **Configure todos os MCPs** (20-30), alternando flexivelmente entre projetos
- **Habilite < 10 MCPs**, mantendo ferramentas ativas < 80
- **Escolha conforme o projeto**: habilite relacionados a banco de dados ao desenvolver backend, relacionados a build ao desenvolver frontend

**Método de verificação**

Verifique a quantidade de ferramentas:

```bash
// O Claude Code mostrará as ferramentas habilitadas atualmente
/tool list
```

**O que você deve ver**:
- Total de ferramentas < 80
- Janela de contexto mantida em 180k+ (evitar cair abaixo de 70k)
- Ajuste dinâmico da lista de habilitados conforme necessidade do projeto

### Passo 5: Combinar com Memory Persistence

Use Hooks para preservar estados críticos após a compactação.

**Por quê**

A compactação estratégica perde contexto, mas estados críticos (como plano de implementação, checkpoints) precisam ser preservados.

**Configurar Hooks**

Certifique-se de que os seguintes Hooks estejam habilitados:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**Fluxo de trabalho**:

1. Após concluir a tarefa, use `/checkpoint` para salvar o estado
2. Antes de compactar o contexto, o Hook PreCompact salva automaticamente
3. Ao iniciar uma nova sessão, o Hook SessionStart carrega automaticamente
4. Informações críticas (planos, estados) são persistidas, não afetadas pela compactação

**O que você deve ver**:
- Após a compactação, estados importantes ainda estão disponíveis
- Novas sessões restauram automaticamente o contexto anterior
- Decisões críticas e planos de implementação não são perdidos

## Checkpoint ✅

- [ ] Hook `strategic-compact` configurado
- [ ] Modelo adequado selecionado conforme a tarefa (Haiku/Sonnet/Opus)
- [ ] MCPs habilitados < 10, total de ferramentas < 80
- [ ] Compactação em pontos lógicos (após planejamento/marcos)
- [ ] Hooks de Memory Persistence habilitados, estados críticos preservados

## Armadilhas comuns

### ❌ Erro comum 1: Usar Opus para todas as tarefas

**Problema**: Embora o Opus seja o mais poderoso, seu custo é 10 vezes o do Sonnet e 30 vezes o do Haiku.

**Correção**: Selecione o modelo conforme o tipo de tarefa:
- Agents com chamadas frequentes (como revisão de código, formatação) usam Haiku
- Trabalho principal de desenvolvimento usa Sonnet
- Decisões de arquitetura, raciocínio profundo usam Opus

### ❌ Erro comum 2: Ignorar os avisos de compactação do Hook

**Problema**: Continuar trabalhando após ver o aviso `[StrategicCompact]`, até que o contexto seja compactado automaticamente, perdendo informações críticas.

**Correção**: Avalie a fase da tarefa e execute `/compact` no momento adequado em resposta ao aviso.

### ❌ Erro comum 3: Habilitar todos os servidores MCP

**Problema**: Configurou 20+ MCPs e habilitou todos, reduzindo a janela de contexto de 200k para 70k.

**Correção**: Use `disabledMcpServers` para desabilitar MCPs pouco usados, mantendo < 10 MCPs ativos.

### ❌ Erro comum 4: Compactar durante a implementação

**Problema**: Compactou o contexto de uma funcionalidade em implementação, e o modelo "esqueceu" discussões anteriores.

**Correção**: Compacte apenas em pontos lógicos (após planejamento, mudança de tarefa, conclusão de marco).

## Resumo da lição

O núcleo da otimização de tokens é **preservar informações valiosas nos momentos críticos**:

1. **Seleção de modelo** - Haiku/Sonnet/Opus têm cenários de uso adequados, escolha correta economiza custos
2. **Compactação estratégica** - Compacte manualmente em pontos lógicos, evitando perda de informações por compactação automática
3. **Gerenciamento de MCP** - Controle a quantidade habilitada, proteja a janela de contexto
4. **Memory Persistence** - Mantenha estados críticos disponíveis após a compactação

Seguindo essas estratégias, você pode maximizar a eficiência de contexto do Claude Code e evitar degradação de qualidade causada por saturação de contexto.

## Prévia da próxima lição

> Na próxima lição, aprenderemos **[Ciclo de Verificação: Checkpoint e Evals](../verification-loop/)**.
>
> Você vai aprender:
> - Como usar Checkpoint para salvar e restaurar estados de trabalho
> - Método Eval Harness para verificação contínua
> - Tipos de Grader e métricas Pass@K
> - Aplicação do ciclo de verificação em TDD

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Skill de compactação estratégica | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hook de sugestão de compactação | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Hook de salvamento pré-compactação | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Regras de otimização de desempenho | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Configuração de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Explicação da janela de contexto | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**Constantes-chave**:
- `COMPACT_THRESHOLD = 50`: Limite de chamadas de ferramentas (valor padrão)
- `MCP_LIMIT = 10`: Limite recomendado de MCPs habilitados
- `TOOL_LIMIT = 80`: Limite recomendado de total de ferramentas

**Funções-chave**:
- `suggest-compact.js:main()`: Conta chamadas de ferramentas e sugere compactação
- `pre-compact.js:main()`: Salva estado da sessão antes da compactação

</details>
