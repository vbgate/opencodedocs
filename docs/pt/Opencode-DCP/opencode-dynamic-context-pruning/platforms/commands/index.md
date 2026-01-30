---
title: "Comandos: Monitoramento e Poda | opencode-dynamic-context-pruning"
sidebarTitle: "Monitorar Tokens, Poda Manual"
subtitle: "Guia de Comandos DCP: Monitoramento e Poda Manual"
description: "Aprenda a usar os 4 comandos do DCP para monitorar e podar manualmente. Veja como usar /dcp context para visualizar sessões, /dcp stats para estatísticas e /dcp sweep para acionar poda manual."
tags:
  - "Comandos DCP"
  - "Monitoramento de Tokens"
  - "Poda Manual"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# Guia de Comandos DCP: Monitoramento e Poda Manual

## O Que Você Será Capaz de Fazer

- Usar `/dcp context` para visualizar a distribuição de Tokens da sessão atual
- Usar `/dcp stats` para ver estatísticas acumuladas de poda
- Usar `/dcp sweep [n]` para acionar poda manual
- Entender o mecanismo de proteção de ferramentas e arquivos protegidos
- Compreender a estratégia de cálculo de Tokens e os efeitos de economia

## Seu Dilema Atual

Em conversas longas, o consumo de Tokens cresce cada vez mais rápido, mas você não sabe:
- Onde estão sendo gastos os Tokens da sessão atual?
- Quanto o DCP realmente economizou para você?
- Como limpar manualmente as saídas de ferramentas que não são mais necessárias?
- Quais ferramentas são protegidas e não serão podadas?

Sem esclarecer essas questões, você pode não aproveitar totalmente os efeitos de otimização do DCP, ou até mesmo excluir acidentalmente informações importantes em momentos críticos.

## Quando Usar Esta Técnica

Quando você:
- Quer entender a composição de Tokens da sessão atual
- Precisa limpar rapidamente o histórico de conversas
- Quer verificar os efeitos de poda do DCP
- Está se preparando para uma nova tarefa e quer fazer uma limpeza de contexto

## Conceito Central

O DCP fornece 4 comandos Slash para ajudá-lo a monitorar e controlar o uso de Tokens:

| Comando | Função | Cenário de Uso |
| --- | --- | --- |
| `/dcp` | Exibir ajuda | Consultar quando esquecer os comandos |
| `/dcp context` | Analisar distribuição de Tokens da sessão atual | Entender a composição do contexto |
| `/dcp stats` | Ver estatísticas acumuladas de poda | Verificar efeitos a longo prazo |
| `/dcp sweep [n]` | Poda manual de ferramentas | Reduzir rapidamente o tamanho do contexto |

**Mecanismo de Proteção**:

Todas as operações de poda pulam automaticamente:
- **Ferramentas protegidas**: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **Arquivos protegidos**: Caminhos de arquivos que correspondem aos `protectedFilePatterns` na configuração

::: info
As configurações de ferramentas protegidas e arquivos protegidos podem ser personalizadas através do arquivo de configuração. Veja detalhes em [Configuração Completa](../../start/configuration/).
:::

## Siga Comigo

### Passo 1: Ver Informações de Ajuda

Digite `/dcp` na caixa de diálogo do OpenCode.

**Você deve ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**Ponto de verificação ✅**: Confirme que você vê a descrição dos 3 subcomandos.

### Passo 2: Analisar Distribuição de Tokens da Sessão Atual

Digite `/dcp context` para ver o uso de Tokens da sessão atual.

**Você deve ver**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Explicação das Categorias de Tokens**:

| Categoria | Método de Cálculo | Descrição |
| --- | --- | --- |
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | Prompt do sistema |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | Chamadas de ferramentas (já descontada a parte podada) |
| **User** | `tokenizer(all user messages)` | Todas as mensagens do usuário |
| **Assistant** | `total - system - user - tools` | Saída de texto da IA + Tokens de raciocínio |

**Ponto de verificação ✅**: Confirme que você vê a porcentagem e quantidade de Tokens de cada categoria.

### Passo 3: Ver Estatísticas Acumuladas de Poda

Digite `/dcp stats` para ver os efeitos acumulados de poda histórica.

**Você deve ver**:

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**Explicação das Estatísticas**:
- **Session**: Dados de poda da sessão atual (em memória)
- **All-time**: Dados acumulados de todas as sessões históricas (persistidos em disco)

**Ponto de verificação ✅**: Confirme que você vê as estatísticas de poda da sessão atual e acumuladas históricas.

### Passo 4: Poda Manual de Ferramentas

Existem duas formas de usar `/dcp sweep`:

#### Forma 1: Podar todas as ferramentas após a última mensagem do usuário

Digite `/dcp sweep` (sem parâmetros).

**Você deve ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### Forma 2: Podar as últimas N ferramentas

Digite `/dcp sweep 5` para podar as últimas 5 ferramentas.

**Você deve ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**Aviso de Ferramentas Protegidas**:

Se ferramentas protegidas foram puladas, a saída mostrará:

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
Ferramentas protegidas (como `write`, `edit`) e caminhos de arquivos protegidos são automaticamente pulados e não serão podados.
:::

**Ponto de verificação ✅**: Confirme que você vê a lista de ferramentas podadas e a quantidade de Tokens economizados.

### Passo 5: Verificar Novamente os Efeitos da Poda

Após a poda, digite `/dcp context` novamente para ver a nova distribuição de Tokens.

**Você deve ver**:
- A porcentagem da categoria `Tools` diminuiu
- O `Summary` mostra aumento no número de ferramentas podadas
- O total de `Current context` diminuiu

**Ponto de verificação ✅**: Confirme que o uso de Tokens diminuiu visivelmente.

## Alertas de Armadilhas

### ❌ Erro: Excluir acidentalmente ferramentas importantes

**Cenário**: Você acabou de usar a ferramenta `write` para criar um arquivo crítico, e então executa `/dcp sweep`.

**Resultado errado**: A ferramenta `write` é podada, e a IA pode não saber que o arquivo foi criado.

**Abordagem correta**:
- Ferramentas como `write`, `edit` são protegidas por padrão
- Não modifique manualmente a configuração `protectedTools` para remover essas ferramentas
- Após concluir tarefas críticas, aguarde alguns turnos antes de limpar

### ❌ Erro: Momento inadequado para poda

**Cenário**: A conversa acabou de começar, com apenas algumas chamadas de ferramentas, e você executa `/dcp sweep`.

**Resultado errado**: Poucos Tokens economizados, e pode afetar a continuidade do contexto.

**Abordagem correta**:
- Aguarde a conversa progredir até certo ponto (como 10+ chamadas de ferramentas) antes de limpar
- Limpe as saídas de ferramentas da rodada anterior antes de iniciar uma nova tarefa
- Use `/dcp context` para avaliar se vale a pena limpar

### ❌ Erro: Dependência excessiva de poda manual

**Cenário**: Executar manualmente `/dcp sweep` em cada conversa.

**Resultado errado**:
- As estratégias de poda automática (deduplicação, substituição de escritas, limpeza de erros) são desperdiçadas
- Aumenta a carga operacional

**Abordagem correta**:
- Mantenha as estratégias de poda automática habilitadas por padrão (configuração: `strategies.*.enabled`)
- Use a poda manual como complemento, apenas quando necessário
- Verifique os efeitos da poda automática através de `/dcp stats`

## Resumo da Lição

Os 4 comandos do DCP ajudam você a monitorar e controlar o uso de Tokens:

| Comando | Função Principal |
| --- | --- |
| `/dcp` | Exibir informações de ajuda |
| `/dcp context` | Analisar distribuição de Tokens da sessão atual |
| `/dcp stats` | Ver estatísticas acumuladas de poda |
| `/dcp sweep [n]` | Poda manual de ferramentas |

**Estratégia de Cálculo de Tokens**:
- System: Prompt do sistema (inferido da primeira resposta)
- Tools: Entradas e saídas de ferramentas (descontada a parte podada)
- User: Todas as mensagens do usuário (estimativa)
- Assistant: Saída da IA + Tokens de raciocínio (residual)

**Mecanismo de Proteção**:
- Ferramentas protegidas: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- Arquivos protegidos: Padrões glob configurados
- Todas as operações de poda pulam automaticamente esses conteúdos

**Melhores Práticas**:
- Verifique regularmente `/dcp context` para entender a composição de Tokens
- Execute `/dcp sweep` antes de novas tarefas para limpar o histórico
- Confie na poda automática, use a poda manual como complemento
- Verifique os efeitos a longo prazo através de `/dcp stats`

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Mecanismo de Proteção](../../advanced/protection/)**.
>
> Você aprenderá:
> - Como a proteção de turnos previne poda acidental
> - Como personalizar a lista de ferramentas protegidas
> - Métodos de configuração de padrões de arquivos protegidos
> - Tratamento especial de sessões de subagentes

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Comando de ajuda /dcp | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| Comando /dcp context | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Estratégia de cálculo de Tokens | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| Comando /dcp stats | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Comando /dcp sweep | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| Configuração de ferramentas protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| Lista padrão de ferramentas protegidas | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**Constantes-chave**:
- `DEFAULT_PROTECTED_TOOLS`: Lista padrão de ferramentas protegidas

**Funções-chave**:
- `handleHelpCommand()`: Processa o comando de ajuda /dcp
- `handleContextCommand()`: Processa o comando /dcp context
- `analyzeTokens()`: Calcula a quantidade de Tokens de cada categoria
- `handleStatsCommand()`: Processa o comando /dcp stats
- `handleSweepCommand()`: Processa o comando /dcp sweep
- `buildToolIdList()`: Constrói a lista de IDs de ferramentas

</details>
