---
title: "Persistência de Estado: Preservar Histórico Entre Sessões | opencode-dynamic-context-pruning"
subtitle: "Persistência de Estado: Preservar Histórico Entre Sessões"
sidebarTitle: "Dados Preservados Após Reinício"
description: "Aprenda o mecanismo de persistência de estado do opencode-dynamic-context-pruning. Preserve o histórico de poda entre sessões e visualize a economia acumulada de tokens com /dcp stats."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# Persistência de Estado: Preservar Histórico de Poda Entre Sessões

## O Que Você Vai Aprender

- Entender como o DCP preserva o estado de poda entre reinícios do OpenCode
- Conhecer a localização e o formato dos arquivos de persistência
- Dominar a lógica de gerenciamento de estado durante troca de sessões e compactação de contexto
- Visualizar a economia acumulada de tokens de todas as sessões com `/dcp stats`

## Seu Problema Atual

Você fechou o OpenCode, reabriu e descobriu que os registros de poda anteriores desapareceram? Ou quer saber de onde vem a "economia acumulada de todas as sessões" no `/dcp stats`?

O mecanismo de persistência de estado do DCP salva automaticamente seu histórico de poda e dados estatísticos em segundo plano, garantindo que permaneçam visíveis após reinícios.

## Quando Usar Esta Técnica

- Quando precisar acumular estatísticas de economia de tokens entre sessões
- Para continuar o histórico de poda após reiniciar o OpenCode
- Para uso prolongado do DCP, quando quiser ver o efeito geral

## Conceito Central

**O Que é Persistência de Estado**

**Persistência de estado** significa que o DCP salva o histórico de poda e dados estatísticos em arquivos no disco, garantindo que essas informações não sejam perdidas após reinícios do OpenCode ou trocas de sessão.

::: info Por Que a Persistência é Necessária?

Sem persistência, cada vez que você fechar o OpenCode:
- A lista de IDs de ferramentas podadas será perdida
- As estatísticas de economia de tokens serão zeradas
- A IA pode podar repetidamente a mesma ferramenta

Com persistência, o DCP consegue:
- Lembrar quais ferramentas já foram podadas
- Acumular a economia de tokens de todas as sessões
- Continuar o trabalho anterior após reinícios
:::

**Duas Partes do Conteúdo Persistido**

O estado salvo pelo DCP contém dois tipos de informação:

| Tipo | Conteúdo | Finalidade |
| --- | --- | --- |
| **Estado de Poda** | Lista de IDs das ferramentas podadas | Evitar poda duplicada, rastrear entre sessões |
| **Dados Estatísticos** | Quantidade de tokens economizados (sessão atual + histórico acumulado) | Mostrar eficácia do DCP, análise de tendências de longo prazo |

Esses dados são armazenados separadamente por ID de sessão do OpenCode, com cada sessão correspondendo a um arquivo JSON.

## Fluxo de Dados

```mermaid
graph TD
    subgraph "Operação de Poda"
        A1[IA chama discard/extract]
        A2[Usuário executa /dcp sweep]
    end

    subgraph "Estado em Memória"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "Armazenamento Persistente"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|Salvamento assíncrono| C1
    B2 -->|Salvamento assíncrono| C1
    C1 --> C2

    C2 -->|Carrega ao trocar sessão| B1
    C2 -->|Carrega ao trocar sessão| B2

    D[Mensagem summary do OpenCode] -->|Limpa cache| B1
```

## Siga Comigo

### Passo 1: Conhecer a Localização do Armazenamento Persistente

**Por Quê**
Saber onde os dados estão armazenados permite verificar ou excluir manualmente (se necessário)

O DCP salva o estado no sistema de arquivos local, sem upload para a nuvem.

```bash
# Localização do diretório de persistência
~/.local/share/opencode/storage/plugin/dcp/

# Um arquivo JSON por sessão, formato: {sessionId}.json
```

**O Que Você Deve Ver**: O diretório pode conter vários arquivos `.json`, cada um correspondendo a uma sessão do OpenCode

::: tip Privacidade dos Dados

O DCP salva apenas o estado de poda e dados estatísticos localmente, sem envolver informações sensíveis. Os arquivos persistidos contêm:
- Lista de IDs de ferramentas (identificadores numéricos)
- Quantidade de tokens economizados (dados estatísticos)
- Hora da última atualização (timestamp)

Não contém conteúdo de conversas, saídas de ferramentas ou entradas do usuário.
:::

### Passo 2: Visualizar o Formato do Arquivo Persistido

**Por Quê**
Entender a estrutura do arquivo permite verificar manualmente ou depurar problemas

```bash
# Listar todos os arquivos persistidos
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# Visualizar o conteúdo persistido de uma sessão
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**O Que Você Deve Ver**: Uma estrutura JSON semelhante a esta

```json
{
  "sessionName": "Nome da minha sessão",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**Descrição dos Campos**:

| Campo | Tipo | Significado |
| --- | --- | --- |
| `sessionName` | string (opcional) | Nome da sessão, para fácil identificação |
| `prune.toolIds` | string[] | Lista de IDs das ferramentas podadas |
| `stats.pruneTokenCounter` | number | Tokens economizados na sessão atual (não arquivados) |
| `stats.totalPruneTokens` | number | Tokens economizados acumulados historicamente |
| `lastUpdated` | string | Hora da última atualização no formato ISO 8601 |

### Passo 3: Visualizar Estatísticas Acumuladas

**Por Quê**
Entender o efeito acumulado de todas as sessões para avaliar o valor de longo prazo do DCP

```bash
# Executar no OpenCode
/dcp stats
```

**O Que Você Deve Ver**: Painel de informações estatísticas

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**Significado dos Dados Estatísticos**:

| Item Estatístico | Origem | Descrição |
| --- | --- | --- |
| **Session** | Estado atual em memória | Efeito de poda da sessão atual |
| **All-time** | Todos os arquivos persistidos | Efeito acumulado de todas as sessões históricas |

::: info Como as Estatísticas All-time São Calculadas

O DCP percorre todos os arquivos JSON no diretório `~/.local/share/opencode/storage/plugin/dcp/`, somando:
- `totalPruneTokens`: Total de tokens economizados em todas as sessões
- `toolIds.length`: Total de ferramentas podadas em todas as sessões
- Quantidade de arquivos: Total de sessões

Assim você pode ver o efeito geral do DCP no uso de longo prazo.
:::

### Passo 4: Entender o Mecanismo de Salvamento Automático

**Por Quê**
Saber quando o DCP salva o estado evita perda de dados por operações incorretas

O DCP salva automaticamente o estado no disco nos seguintes momentos:

| Momento de Disparo | Conteúdo Salvo | Local da Chamada |
| --- | --- | --- |
| Após a IA chamar a ferramenta `discard`/`extract` | Estado de poda atualizado + estatísticas | `lib/strategies/tools.ts:148-150` |
| Após o usuário executar o comando `/dcp sweep` | Estado de poda atualizado + estatísticas | `lib/commands/sweep.ts:234-236` |
| Após conclusão da operação de poda | Salvamento assíncrono, não bloqueia o fluxo principal | `saveSessionState()` |

**Fluxo de Salvamento**:

```typescript
// 1. Atualizar estado em memória
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. Salvar assincronamente no disco
await saveSessionState(state, logger)
```

::: tip Benefícios do Salvamento Assíncrono

O DCP usa mecanismo de salvamento assíncrono, garantindo que as operações de poda não sejam bloqueadas por I/O de disco. Mesmo se o salvamento falhar (como falta de espaço em disco), não afetará o efeito de poda da sessão atual.

Em caso de falha, um log de aviso é registrado em `~/.config/opencode/logs/dcp/`.
:::

### Passo 5: Entender o Mecanismo de Carregamento Automático

**Por Quê**
Saber quando o DCP carrega o estado persistido ajuda a entender o comportamento de troca de sessões

O DCP carrega automaticamente o estado persistido nos seguintes momentos:

| Momento de Disparo | Conteúdo Carregado | Local da Chamada |
| --- | --- | --- |
| Ao iniciar o OpenCode ou trocar de sessão | Histórico de estado de poda + estatísticas dessa sessão | `lib/state/state.ts:104` (dentro da função `ensureSessionInitialized`) |

**Fluxo de Carregamento**:

```typescript
// 1. Detectar mudança de ID de sessão
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. Resetar estado em memória
resetSessionState(state)
state.sessionId = lastSessionId

// 3. Carregar estado persistido do disco
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**O Que Você Deve Ver**: Após trocar para uma sessão anterior, `/dcp stats` mostra os dados estatísticos históricos preservados

### Passo 6: Entender a Limpeza de Estado na Compactação de Contexto

**Por Quê**
Entender como o DCP lida com o estado quando o OpenCode compacta automaticamente o contexto

Quando o OpenCode detecta que a conversa está muito longa, gera automaticamente uma mensagem summary para compactar o contexto. O DCP detecta essa compactação e limpa o estado relacionado.

```typescript
// Tratamento ao detectar mensagem summary
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // Limpar cache de ferramentas
    state.prune.toolIds = []       // Limpar estado de poda
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info Por Que é Necessário Limpar?

A mensagem summary do OpenCode compacta todo o histórico da conversa, neste momento:
- As chamadas de ferramentas antigas já foram mescladas no summary
- Manter a lista de IDs de ferramentas não faz mais sentido (as ferramentas não existem mais)
- Limpar o estado evita referências a IDs de ferramentas inválidos

Este é um trade-off de design: sacrificar parte do histórico de poda para garantir consistência de estado.
:::

## Checkpoint ✅

Confirme que você entendeu os seguintes pontos:

- [ ] Os arquivos de persistência do DCP são armazenados em `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] Cada sessão corresponde a um arquivo `{sessionId}.json`
- [ ] O conteúdo persistido inclui estado de poda (toolIds) e dados estatísticos (totalPruneTokens)
- [ ] As estatísticas "All-time" do `/dcp stats` vêm da soma de todos os arquivos persistidos
- [ ] Após operações de poda, o salvamento é automático e assíncrono, sem bloquear o fluxo principal
- [ ] Ao trocar de sessão, o estado histórico dessa sessão é carregado automaticamente
- [ ] Ao detectar mensagem summary do OpenCode, o cache de ferramentas e o estado de poda são limpos

## Armadilhas Comuns

### ❌ Exclusão Acidental de Arquivos Persistidos

**Problema**: Excluiu manualmente arquivos no diretório `~/.local/share/opencode/storage/plugin/dcp/`

**Consequências**:
- Histórico de estado de poda perdido
- Estatísticas acumuladas zeradas
- Mas não afeta a funcionalidade de poda da sessão atual

**Solução**: Comece a usar novamente, o DCP criará automaticamente novos arquivos de persistência

### ❌ Estado de Subagente Não Visível

**Problema**: Podou ferramentas em um subagente, mas ao voltar ao agente principal não vê esses registros de poda

**Causa**: Subagentes têm `sessionId` independente, o estado de poda é persistido em arquivo separado. Mas ao voltar ao agente principal, como o `sessionId` do agente principal é diferente, o estado persistido do subagente não é carregado

**Solução**: Este é o comportamento esperado. O estado da sessão do subagente é independente e não é compartilhado com o agente principal. Se quiser estatísticas de todos os registros de poda (incluindo subagentes), use as estatísticas "All-time" do `/dcp stats` (que soma os dados de todos os arquivos persistidos)

### ❌ Falha de Salvamento por Falta de Espaço em Disco

**Problema**: As estatísticas "All-time" do `/dcp stats` não estão crescendo

**Causa**: Pode ser falta de espaço em disco, causando falha no salvamento

**Solução**: Verifique os arquivos de log em `~/.config/opencode/logs/dcp/` para ver se há erros "Failed to save session state"

## Resumo da Lição

**Valor Central da Persistência de Estado**:

1. **Memória Entre Sessões**: Lembrar quais ferramentas já foram podadas, evitando trabalho duplicado
2. **Estatísticas Acumuladas**: Rastrear a economia de tokens do DCP a longo prazo
3. **Recuperação Após Reinício**: Continuar o trabalho anterior após reiniciar o OpenCode

**Resumo do Fluxo de Dados**:

```
Operação de poda → Atualizar estado em memória → Salvar assincronamente no disco
                ↑
Troca de sessão → Carregar do disco → Restaurar estado em memória
                ↑
Compactação de contexto → Limpar estado em memória (não exclui arquivo do disco)
```

**Pontos-Chave**:

- A persistência é operação de arquivo local, não afeta o desempenho de poda
- "All-time" do `/dcp stats` vem da soma de todas as sessões históricas
- Sessões de subagentes não são persistidas, este é o comportamento esperado
- Na compactação de contexto, o cache é limpo para garantir consistência de estado

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Impacto no Cache de Prompt](/pt/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**.
>
> Você aprenderá:
> - Como a poda do DCP afeta o Prompt Caching
> - Como equilibrar taxa de acerto do cache e economia de tokens
> - Entender o mecanismo de cobrança de cache da Anthropic

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Definição da interface de persistência | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| Salvar estado da sessão | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| Carregar estado da sessão | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| Carregar estatísticas de todas as sessões | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| Constante do diretório de armazenamento | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| Inicialização do estado da sessão | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Detecção de compactação de contexto | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| Processamento do comando de estatísticas | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Salvar estado da ferramenta de poda | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**Constantes-Chave**:
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`: Diretório raiz de armazenamento dos arquivos persistidos

**Funções-Chave**:
- `saveSessionState(state, logger)`: Salvar assincronamente o estado da sessão no disco
- `loadSessionState(sessionId, logger)`: Carregar o estado de uma sessão específica do disco
- `loadAllSessionStats(logger)`: Agregar dados estatísticos de todas as sessões
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`: Garantir que a sessão foi inicializada, carrega o estado persistido

**Interfaces-Chave**:
- `PersistedSessionState`: Definição da estrutura do estado persistido
- `AggregatedStats`: Definição da estrutura dos dados estatísticos acumulados

</details>
