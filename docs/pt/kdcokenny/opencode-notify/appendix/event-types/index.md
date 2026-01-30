---
title: "Explicação dos Tipos de Eventos: Entenda Quando as Notificações do OpenCode São Acionadas | opencode-notify"
sidebarTitle: "Quando as Notificações São Enviadas"
subtitle: "Explicação dos Tipos de Eventos: Entenda Quando as Notificações do OpenCode São Acionadas"
description: "Aprenda os tipos de eventos do OpenCode monitorados pelo plugin opencode-notify, domine as condições de acionamento e regras de filtragem de session.idle, session.error, permission.updated e tool.execute.before."
tags:
  - "Apêndice"
  - "Tipos de Eventos"
  - "OpenCode"
prerequisite: []
order: 130
---

# Explicação dos Tipos de Eventos: Entenda Quando as Notificações do OpenCode São Acionadas

Esta página lista os **tipos de eventos do OpenCode** monitorados pelo plugin `opencode-notify` e suas condições de acionamento. O plugin monitora quatro eventos: session.idle, session.error, permission.updated e tool.execute.before. Compreender quando esses eventos são acionados e suas regras de filtragem ajuda a configurar melhor o comportamento das notificações.

## Visão Geral dos Tipos de Eventos

| Tipo de Evento | Quando é Acionado | Título da Notificação | Som Padrão | Verifica Sessão Pai | Verifica Foco do Terminal |
| --- | --- | --- | --- | --- | --- |
| `session.idle` | Sessão de IA entra em estado ocioso | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | Erro durante execução da sessão de IA | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | IA precisa de autorização do usuário | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | IA faz uma pergunta (ferramenta question) | "Question for you" | Submarine* | ❌ | ❌ |

> *Nota: O evento question usa por padrão o som de permission, pode ser personalizado via configuração

## Descrição Detalhada dos Eventos

### session.idle

**Condição de Acionamento**: Sessão de IA entra em estado ocioso após completar uma tarefa

**Conteúdo da Notificação**:
- Título: `Ready for review`
- Mensagem: Título da sessão (máximo 50 caracteres)

**Lógica de Processamento**:
1. Verifica se é uma sessão pai (quando `notifyChildSessions=false`)
2. Verifica se está no horário silencioso
3. Verifica se o terminal está em foco (suprime notificação quando focado)
4. Envia notificação nativa

**Localização no Código-fonte**: `src/notify.ts:249-284`

---

### session.error

**Condição de Acionamento**: Erro durante o processo de execução da sessão de IA

**Conteúdo da Notificação**:
- Título: `Something went wrong`
- Mensagem: Resumo do erro (máximo 100 caracteres)

**Lógica de Processamento**:
1. Verifica se é uma sessão pai (quando `notifyChildSessions=false`)
2. Verifica se está no horário silencioso
3. Verifica se o terminal está em foco (suprime notificação quando focado)
4. Envia notificação nativa

**Localização no Código-fonte**: `src/notify.ts:286-313`

---

### permission.updated

**Condição de Acionamento**: IA precisa de autorização do usuário para executar uma operação

**Conteúdo da Notificação**:
- Título: `Waiting for you`
- Mensagem: `OpenCode needs your input`

**Lógica de Processamento**:
1. **Não verifica sessão pai** (solicitações de permissão sempre precisam de intervenção manual)
2. Verifica se está no horário silencioso
3. Verifica se o terminal está em foco (suprime notificação quando focado)
4. Envia notificação nativa

**Localização no Código-fonte**: `src/notify.ts:315-334`

---

### tool.execute.before

**Condição de Acionamento**: Antes da IA executar uma ferramenta, quando o nome da ferramenta é `question`

**Conteúdo da Notificação**:
- Título: `Question for you`
- Mensagem: `OpenCode needs your input`

**Lógica de Processamento**:
1. **Não verifica sessão pai**
2. **Não verifica foco do terminal** (suporta fluxo de trabalho com tmux)
3. Verifica se está no horário silencioso
4. Envia notificação nativa

**Observação Especial**: Este evento não faz detecção de foco, para permitir receber notificações normalmente em fluxos de trabalho com múltiplas janelas tmux.

**Localização no Código-fonte**: `src/notify.ts:336-351`

## Condições de Acionamento e Regras de Filtragem

### Verificação de Sessão Pai

Por padrão, o plugin notifica apenas a sessão pai (sessão raiz), evitando um grande número de notificações de subtarefas.

**Lógica de Verificação**:
- Obtém informações da sessão via `client.session.get()`
- Se a sessão tiver `parentID`, pula a notificação

**Opções de Configuração**:
- `notifyChildSessions: false` (padrão) - Notifica apenas sessão pai
- `notifyChildSessions: true` - Notifica todas as sessões

**Eventos Aplicáveis**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌ (não verifica)
- `tool.execute.before` ❌ (não verifica)

### Verificação de Horário Silencioso

Durante o horário silencioso configurado, nenhuma notificação é enviada.

**Lógica de Verificação**:
- Lê `quietHours.enabled`, `quietHours.start`, `quietHours.end`
- Suporta períodos que atravessam a meia-noite (ex: 22:00-08:00)

**Eventos Aplicáveis**:
- Todos os eventos ✅

### Verificação de Foco do Terminal

Quando o usuário está visualizando o terminal, suprime notificações para evitar lembretes redundantes.

**Lógica de Verificação**:
- macOS: Obtém o nome do processo do aplicativo em primeiro plano via `osascript`
- Compara `frontmostApp` com o `processName` do terminal

**Eventos Aplicáveis**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌ (não verifica, suporta tmux)

## Diferenças entre Plataformas

| Funcionalidade | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificação nativa | ✅ | ✅ | ✅ |
| Detecção de foco do terminal | ✅ | ❌ | ❌ |
| Focar terminal ao clicar na notificação | ✅ | ❌ | ❌ |
| Sons personalizados | ✅ | ❌ | ❌ |

## Impacto da Configuração

O comportamento das notificações pode ser personalizado através do arquivo de configuração:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Tutoriais Relacionados**:
- [Referência de Configuração](../../advanced/config-reference/)
- [Horário Silencioso em Detalhes](../../advanced/quiet-hours/)

---

## Prévia da Próxima Lição

> Na próxima lição aprenderemos sobre **[Exemplos de Arquivo de Configuração](../config-file-example/)**.
>
> Você vai aprender:
> - Template completo do arquivo de configuração
> - Comentários detalhados de todos os campos de configuração
> - Explicação dos valores padrão do arquivo de configuração

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização no código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Tipo de Evento | Caminho do Arquivo | Linhas | Função de Processamento |
| --- | --- | --- | --- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| Configuração dos listeners de eventos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**Constantes-chave**:
- `DEFAULT_CONFIG` (L56-68): Configuração padrão, incluindo sons e configurações de horário silencioso
- `TERMINAL_PROCESS_NAMES` (L71-84): Mapeamento de nomes de terminal para nomes de processo do macOS

**Funções-chave**:
- `sendNotification()` (L227-243): Envia notificação nativa, processa funcionalidade de foco no macOS
- `isParentSession()` (L205-214): Verifica se é uma sessão pai
- `isQuietHours()` (L181-199): Verifica se está no horário silencioso
- `isTerminalFocused()` (L166-175): Verifica se o terminal está em foco (apenas macOS)

</details>
