---
title: "Referência de API: Documentação de Interface do Plugin | opencode-dynamic-context-pruning"
sidebarTitle: "Referência de API do Plugin"
subtitle: "Referência de API do DCP"
description: "Aprenda a documentação completa de referência de API do plugin OpenCode DCP, incluindo funções de entrada do plugin, interfaces de configuração, definições de ferramentas, manipuladores de hooks e interfaces de gerenciamento de estado de sessão."
tags:
  - "API"
  - "Desenvolvimento de Plugins"
  - "Referência de Interface"
prerequisite:
  - "start-configuration"
order: 3
---

# Referência de API do DCP

## O Que Você Vai Aprender

Esta seção fornece a referência completa de API do DCP para desenvolvedores de plugins, permitindo que você:

- Compreenda o ponto de entrada do plugin e o mecanismo de hooks do DCP
- Domine as interfaces de configuração e a função de todos os itens de configuração
- Entenda as especificações das ferramentas discard e extract
- Use a API de gerenciamento de estado para operações de estado de sessão

## Conceitos Fundamentais

O plugin DCP é baseado no OpenCode Plugin SDK, implementando a funcionalidade de poda de contexto através do registro de hooks, ferramentas e comandos.

**Ciclo de Vida do Plugin**:

```
1. OpenCode carrega o plugin
    ↓
2. Função Plugin é executada
    ↓
3. Registra hooks, ferramentas, comandos
    ↓
4. OpenCode chama hooks para processar mensagens
    ↓
5. Plugin executa lógica de poda
    ↓
6. Retorna mensagens modificadas
```

---

## API de Entrada do Plugin

### Função Plugin

A função de entrada principal do DCP, que retorna o objeto de configuração do plugin.

**Assinatura**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Lógica de inicialização do plugin
    return {
        // Hooks, ferramentas, comandos registrados
    }) satisfies Plugin

export default plugin
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| ctx | `PluginInput` | Contexto do plugin OpenCode, contendo informações como client e directory |

**Valor de Retorno**:

Objeto de configuração do plugin, contendo os seguintes campos:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `experimental.chat.system.transform` | `Handler` | Hook de injeção de prompt do sistema |
| `experimental.chat.messages.transform` | `Handler` | Hook de transformação de mensagens |
| `chat.message` | `Handler` | Hook de captura de mensagens |
| `command.execute.before` | `Handler` | Hook de execução de comandos |
| `tool` | `Record<string, Tool>` | Mapeamento de ferramentas registradas |
| `config` | `ConfigHandler` | Hook de mutação de configuração |

**Localização no Código-fonte**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## API de Configuração

### Interface PluginConfig

Definição completa do tipo de configuração do DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Localização no Código-fonte**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Detalhes dos Itens de Configuração

#### Configuração de Nível Superior

| Item de Configuração | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se o plugin está habilitado |
| `debug` | `boolean` | `false` | Se os logs de depuração estão habilitados, logs são escritos em `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Modo de exibição de notificações |
| `protectedFilePatterns` | `string[]` | `[]` | Lista de padrões glob de proteção de arquivos, arquivos correspondentes não serão podados |

#### Configuração de Commands

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se o comando `/dcp` está habilitado |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de ferramentas protegidas por comando, essas ferramentas não serão podadas pelo `/dcp sweep` |

#### Configuração de TurnProtection

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | Se a proteção de turnos está habilitada |
| `turns` | `number` | `4` | Número de turnos protegidos, ferramentas dos últimos N turnos não serão podadas |

#### Configuração de Tools

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `nudgeEnabled` | `boolean` | `true` | Se os lembretes de IA estão habilitados |
| `nudgeFrequency` | `number` | `10` | Frequência de lembretes, lembra a IA de usar ferramentas de poda a cada N resultados de ferramentas |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de proteção de ferramentas |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se a ferramenta discard está habilitada |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se a ferramenta extract está habilitada |
| `showDistillation` | `boolean` | `false` | Se o conteúdo extraído deve ser exibido nas notificações |

#### Configuração de Strategies

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se a estratégia de deduplicação está habilitada |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de ferramentas que não participam da deduplicação |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | Se a estratégia de sobrescrita está habilitada |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Campo | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Se a estratégia de limpeza de erros está habilitada |
| `turns` | `number` | `4` | Limite de limpeza de erros (número de turnos) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de ferramentas que não participam da limpeza |

### Função getConfig

Carrega e mescla configurações de múltiplos níveis.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| ctx | `PluginInput` | Contexto do plugin OpenCode |

**Valor de Retorno**:

Objeto de configuração mesclado, prioridade da mais alta para a mais baixa:

1. Configuração do projeto (`.opencode/dcp.jsonc`)
2. Configuração de variável de ambiente (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Configuração global (`~/.config/opencode/dcp.jsonc`)
4. Configuração padrão (definida no código)

**Localização no Código-fonte**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## API de Ferramentas

### createDiscardTool

Cria a ferramenta discard, usada para remover tarefas concluídas ou saídas de ferramentas ruidosas.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| ctx | `PruneToolContext` | Contexto da ferramenta, contendo client, state, logger, config, workingDirectory |

**Especificação da Ferramenta**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `ids` | `string[]` | O primeiro elemento é o motivo (`'completion'` ou `'noise'`), seguido por IDs numéricos |

**Localização no Código-fonte**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Cria a ferramenta extract, usada para extrair descobertas importantes e depois excluir a saída original da ferramenta.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| ctx | `PruneToolContext` | Contexto da ferramenta, contendo client, state, logger, config, workingDirectory |

**Especificação da Ferramenta**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `ids` | `string[]` | Array de IDs numéricos |
| `distillation` | `string[]` | Array de conteúdo extraído, comprimento corresponde aos ids |

**Localização no Código-fonte**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## API de Estado

### Interface SessionState

Objeto de estado de sessão, gerencia o estado de tempo de execução de uma única sessão.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Descrição dos Campos**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `sessionId` | `string \| null` | ID de sessão do OpenCode |
| `isSubAgent` | `boolean` | Se é uma sessão de sub-agente |
| `prune` | `Prune` | Estado de poda |
| `stats` | `SessionStats` | Dados estatísticos |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Cache de chamadas de ferramentas (callID → metadados) |
| `nudgeCounter` | `number` | Contagem acumulada de chamadas de ferramentas (usado para acionar lembretes) |
| `lastToolPrune` | `boolean` | Se a última operação foi uma ferramenta de poda |
| `lastCompaction` | `number` | Timestamp da última compactação de contexto |
| `currentTurn` | `number` | Número do turno atual |
| `variant` | `string \| undefined` | Variante do modelo (ex: claude-3.5-sonnet) |

**Localização no Código-fonte**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### Interface SessionStats

Estatísticas de poda de tokens no nível da sessão.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Descrição dos Campos**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `pruneTokenCounter` | `number` | Número de tokens podados na sessão atual (acumulado) |
| `totalPruneTokens` | `number` | Número total histórico de tokens podados |

**Localização no Código-fonte**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Interface Prune

Objeto de estado de poda.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Descrição dos Campos**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `toolIds` | `string[]` | Lista de IDs de chamadas de ferramentas marcadas para poda |

**Localização no Código-fonte**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### Interface ToolParameterEntry

Cache de metadados de uma única chamada de ferramenta.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Descrição dos Campos**:

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `tool` | `string` | Nome da ferramenta |
| `parameters` | `any` | Parâmetros da ferramenta |
| `status` | `ToolStatus \| undefined` | Status de execução da ferramenta |
| `error` | `string \| undefined` | Mensagem de erro (se houver) |
| `turn` | `number` | Número do turno em que a chamada foi criada |

**Enumeração ToolStatus**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Localização no Código-fonte**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Cria um novo objeto de estado de sessão.

```typescript
export function createSessionState(): SessionState
```

**Valor de Retorno**: Objeto SessionState inicializado

---

## API de Hooks

### createSystemPromptHandler

Cria o manipulador de hook de injeção de prompt do sistema.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| state | `SessionState` | Objeto de estado de sessão |
| logger | `Logger` | Instância do sistema de logs |
| config | `PluginConfig` | Objeto de configuração |

**Comportamento**:

- Verifica se é uma sessão de sub-agente, se sim, pula
- Verifica se é um agente interno (como gerador de resumos), se sim, pula
- Carrega o template de prompt correspondente com base na configuração (both/discard/extract)
- Injeta instruções da ferramenta de poda no prompt do sistema

**Localização no Código-fonte**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Cria o manipulador de hook de transformação de mensagens, executa a lógica de poda automática.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| client | `any` | Instância do cliente OpenCode |
| state | `SessionState` | Objeto de estado de sessão |
| logger | `Logger` | Instância do sistema de logs |
| config | `PluginConfig` | Objeto de configuração |

**Fluxo de Processamento**:

1. Verifica o estado da sessão (se é sub-agente)
2. Sincroniza o cache de ferramentas
3. Executa estratégias automáticas (deduplicação, sobrescrita, limpeza de erros)
4. Poda o conteúdo das ferramentas marcadas
5. Injeta a lista `<prunable-tools>`
6. Salva o snapshot do contexto (se configurado)

**Localização no Código-fonte**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Cria o manipulador de hook de execução de comandos, processa a série de comandos `/dcp`.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Parâmetros**:

| Nome do Parâmetro | Tipo | Descrição |
|--- | --- | ---|
| client | `any` | Instância do cliente OpenCode |
| state | `SessionState` | Objeto de estado de sessão |
| logger | `Logger` | Instância do sistema de logs |
| config | `PluginConfig` | Objeto de configuração |
| workingDirectory | `string` | Caminho do diretório de trabalho |

**Comandos Suportados**:

- `/dcp` - Exibe informações de ajuda
- `/dcp context` - Exibe análise de uso de tokens da sessão atual
- `/dcp stats` - Exibe estatísticas acumuladas de poda
- `/dcp sweep [n]` - Poda manual de ferramentas (opcionalmente especifica quantidade)

**Localização no Código-fonte**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Resumo da Lição

Esta seção forneceu a referência completa de API do plugin DCP, cobrindo:

- Função de entrada do plugin e mecanismo de registro de hooks
- Interfaces de configuração e descrição detalhada de todos os itens de configuração
- Especificações e métodos de criação das ferramentas discard e extract
- Definições de tipo para estado de sessão, dados estatísticos e cache de ferramentas
- Manipuladores de hook para prompt do sistema, transformação de mensagens e execução de comandos

Se você precisar entender profundamente os detalhes de implementação interna do DCP, recomendamos ler a [Visão Geral da Arquitetura](/pt/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) e os [Princípios de Cálculo de Tokens](/pt/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver as localizações no código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Função de entrada do plugin | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Definição de interface de configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| Função getConfig | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Criação da ferramenta discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| Criação da ferramenta extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Definição de tipos de estado | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| Hook de prompt do sistema | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Hook de transformação de mensagens | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Hook de execução de comandos | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Tipos Principais**:
- `Plugin`: Assinatura da função do plugin OpenCode
- `PluginConfig`: Interface de configuração do DCP
- `SessionState`: Interface de estado de sessão
- `ToolStatus`: Enumeração de status de ferramenta (pending | running | completed | error)

**Funções Principais**:
- `plugin()`: Função de entrada do plugin
- `getConfig()`: Carrega e mescla configuração
- `createDiscardTool()`: Cria ferramenta discard
- `createExtractTool()`: Cria ferramenta extract
- `createSessionState()`: Cria estado de sessão

</details>
