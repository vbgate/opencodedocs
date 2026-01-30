---
title: "Tratamento de Sub-agentes: Mecanismo de Desativação Automática | opencode-dynamic-context-pruning"
subtitle: "Tratamento de Sub-agentes: Mecanismo de Desativação Automática"
sidebarTitle: "Sub-agentes não são podados? Agora entendo"
description: "Aprenda o comportamento e limitações do DCP em sessões de sub-agentes. Entenda por que o DCP desativa automaticamente o pruning de sub-agentes e as diferentes estratégias de uso de tokens entre sub-agentes e agente principal."
tags:
  - "Sub-agentes"
  - "Gestão de Sessão"
  - "Limitações de Uso"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# Tratamento de Sub-agentes

## O que você vai aprender

- Entender por que o DCP desativa automaticamente em sessões de sub-agentes
- Conhecer as diferentes estratégias de uso de tokens entre sub-agentes e agente principal
- Evitar problemas ao usar recursos do DCP em sub-agentes

## Sua situação atual

Você pode ter notado: em algumas conversas do OpenCode, a função de pruning do DCP parece "não estar funcionando" — as chamadas de ferramentas não são limpas e as estatísticas de economia de tokens não mudam. Isso pode acontecer quando você usa recursos específicos do OpenCode, como revisão de código ou análise profunda.

Não é que o DCP esteja com problemas, mas sim que esses recursos usam o mecanismo de **sub-agentes (Subagent)** e o DCP tem tratamento especial para sub-agentes.

## O que é um sub-agente

::: info O que é um Sub-agente (Subagent)?

Um **sub-agente** é o mecanismo interno de IA do OpenCode. O agente principal delega tarefas complexas ao sub-agente, que retorna os resultados em forma de resumo.

**Cenários típicos de uso**:
- Revisão de código: o agente principal inicia um sub-agente, que lê cuidadosamente vários arquivos, analisa problemas e retorna uma lista concisa de questões
- Análise profunda: o agente principal inicia um sub-agente, que realiza muitas chamadas de ferramentas e raciocínios, retornando as descobertas principais

Do ponto de vista técnico, uma sessão de sub-agente tem uma propriedade `parentID` que aponta para sua sessão pai.
:::

## Comportamento do DCP com sub-agentes

O DCP **desativa automaticamente todas as funções de pruning** em sessões de sub-agentes.

### Por que o DCP não poda sub-agentes?

Há uma importante filosofia de design por trás disso:

| Papel | Estratégia de Uso de Tokens | Objetivo Principal |
| --- | --- | ---|
| **Agente Principal** | Uso eficiente de tokens | Manter contexto em conversas longas, reduzir custos |
| **Sub-agente** | Uso livre de tokens | Gerar informações ricas, facilitar agregação pelo agente principal |

**O valor do sub-agente** está em "trocar tokens por qualidade de informação" — através de muitas chamadas de ferramentas e análises detalhadas, fornecer agregação de alta qualidade para o agente pai. Se o DCP podasse as chamadas de ferramentas no sub-agente, poderia causar:

1. **Perda de informação**: o processo detalhado de análise do sub-agente é deletado, impossibilitando a geração de um resumo completo
2. **Degradação da qualidade do resumo**: o agente principal recebe um resumo incompleto, afetando a decisão final
3. **Violação da intenção do design**: o sub-agente foi projetado para "usar tokens sem economizar para garantir qualidade"

**Conclusão**: o sub-agente não precisa de pruning, porque no final retorna apenas um resumo conciso ao agente pai.

### Como o DCP detecta sub-agentes

O DCP detecta se a sessão atual é um sub-agente através dos seguintes passos:

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // Se tiver parentID, é sub-agente
    } catch (error: any) {
        return false
    }
}
```

**Momento da detecção**:
- Durante a inicialização da sessão (`ensureSessionInitialized()`)
- Antes de cada conversão de mensagem (`createChatMessageTransformHandler()`)

### Comportamento do DCP em sessões de sub-agentes

Ao detectar um sub-agente, o DCP pula as seguintes funções:

| Função | Sessão Normal | Sessão Sub-agente | Local do Pulo |
| --- | --- | --- | ---|
| Injeção de prompt do sistema | ✅ Executar | ❌ Pular | `hooks.ts:26-28` |
| Estratégia de auto-pruning | ✅ Executar | ❌ Pular | `hooks.ts:64-66` |
| Injeção de lista de ferramentas | ✅ Executar | ❌ Pular | `hooks.ts:64-66` |

**Implementação do código** (`lib/hooks.ts`):

```typescript
// Processador de prompt do sistema
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← Detecção de sub-agente
            return               // ← Retorna direto, não injeta instruções de pruning
        }
        // ... lógica normal
    }
}

// Processador de conversão de mensagens
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← Detecção de sub-agente
            return               // ← Retorna direto, não executa nenhum pruning
        }

        // ... lógica normal: desduplicação, sobrescrita, limpeza de erros, injeção de lista de ferramentas, etc.
    }
}
```

## Comparação de casos práticos

### Caso 1: Sessão de Agente Principal

**Cenário**: você está conversando com o agente principal, pedindo para analisar código

**Comportamento do DCP**:
```
Entrada do usuário: "Analisar as funções utilitárias em src/utils.ts"
    ↓
[Agente Principal] Lê src/utils.ts
    ↓
[Agente Principal] Analisa o código
    ↓
Entrada do usuário: "Verifique também src/helpers.ts"
    ↓
DCP detecta padrão de leitura repetida
    ↓
DCP marca a primeira leitura de src/utils.ts como podável ✅
    ↓
Quando o contexto é enviado ao LLM, o conteúdo da primeira leitura é substituído por placeholder
    ↓
✅ Economia de tokens
```

### Caso 2: Sessão de Sub-agente

**Cenário**: o agente principal inicia um sub-agente para revisão profunda de código

**Comportamento do DCP**:
```
Entrada do usuário: "Revisão profunda de todos os arquivos em src/"
    ↓
[Agente Principal] Detecta tarefa complexa, inicia sub-agente
    ↓
[Sub-agente] Lê src/utils.ts
    ↓
[Sub-agente] Lê src/helpers.ts
    ↓
[Sub-agente] Lê src/config.ts
    ↓
[Sub-agente] Lê mais arquivos...
    ↓
DCP detecta sessão de sub-agente
    ↓
DCP pula todas as operações de pruning ❌
    ↓
[Sub-agente] Gera resultado detalhado da revisão
    ↓
[Sub-agente] Retorna resumo conciso ao agente principal
    ↓
[Agente Principal] Gera resposta final com base no resumo
```

## Perguntas Frequentes

### P: Como confirmar se a sessão atual é um sub-agente?

**R**: Você pode confirmar das seguintes formas:

1. **Verificar logs do DCP** (se o modo debug estiver ativado):
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

2. **Observar características da conversa**:
   - Sub-agentes são geralmente iniciados ao processar tarefas complexas (como análise profunda, revisão de código)
   - O agente principal indicará "Iniciando sub-agente" ou mensagem similar

3. **Usar o comando /dcp stats**:
   - Em sessões de sub-agente, as chamadas de ferramentas não serão podadas
   - As estatísticas de tokens mostram "podado" igual a 0

### P: Sub-agentes não fazem pruning nenhum, não é desperdício de tokens?

**R**: Não. Os motivos são:

1. **Sub-agentes são de curta duração**: após completar a tarefa, terminam, ao contrário do agente principal que mantém conversas longas
2. **Sub-agentes retornam resumos**: o que é transmitido ao agente principal é um resumo conciso, não aumentando a carga de contexto do agente principal
3. **Objetivos de design diferentes**: o propósito do sub-agente é "trocar tokens por qualidade", não "economizar tokens"

### P: Posso forçar o DCP a podar sub-agentes?

**R**: **Não, e não deveria**. O DCP foi projetado para permitir que sub-agentes preservem o contexto completo, gerando resumos de alta qualidade. Se forçar o pruning, pode:

- Causar informações incompletas no resumo
- Afetar a qualidade das decisões do agente principal
- Violar a filosofia de design dos sub-agentes do OpenCode

### P: O uso de tokens em sessões de sub-agentes é contabilizado?

**R**: As próprias sessões de sub-agentes não são estatisticamente rastreadas pelo DCP. A estatística do DCP apenas rastreia a economia de tokens em sessões do agente principal.

## Resumo da Lição

- **Detecção de sub-agentes**: O DCP identifica sessões de sub-agentes verificando `session.parentID`
- **Desativação automática**: Em sessões de sub-agentes, o DCP automaticamente pula todas as funções de pruning
- **Razão do design**: Sub-agentes precisam de contexto completo para gerar resumos de alta qualidade, o que o pruning interferiria
- **Limite de uso**: Sub-agentes não buscam eficiência de tokens, mas qualidade de informação, o que difere do objetivo do agente principal

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Problemas Comuns e Solução de Problemas](/pt/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**.
>
> Você aprenderá:
> - Como corrigir erros de configuração
> - Como habilitar logs de debug
> - Causas comuns de tokens não reduzidos
> - Limitações de sessões de sub-agentes

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Função | Caminho do Arquivo | Linha |
| --- | --- | ---|
| Função de detecção de sub-agente | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts) | 1-8 |
| Inicialização de estado da sessão | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Processador de prompt do sistema (pula sub-agente) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 26-28 |
| Processador de transformação de mensagens (pula sub-agente) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 64-66 |
| Definição de tipo SessionState | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts) | 27-38 |

**Funções-chave**:
- `isSubAgentSession()`: detecta sub-agente através de `session.parentID`
- `ensureSessionInitialized()`: detecta sub-agente ao inicializar estado da sessão
- `createSystemPromptHandler()`: sessão de sub-agente pula injeção de prompt do sistema
- `createChatMessageTransformHandler()`: sessão de sub-agente pula todas as operações de pruning

**Constantes-chave**:
- `state.isSubAgent`: flag de sub-agente no estado da sessão

</details>
