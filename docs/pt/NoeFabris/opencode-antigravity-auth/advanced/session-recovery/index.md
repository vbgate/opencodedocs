---
title: "Recuperação de Sessão: Reparo Automático de Interrupções | Antigravity"
sidebarTitle: "Reparo Automático de Interrupções"
subtitle: "Recuperação de Sessão: Tratamento Automático de Falhas e Interrupções em Chamadas de Ferramentas"
description: "Aprenda o mecanismo de recuperação de sessão para tratar automaticamente interrupções e erros de ferramentas. Abrange detecção de erros, injeção de tool_result sintético e configuração de auto_resume."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Recuperação de Sessão: Tratamento Automático de Falhas e Interrupções em Chamadas de Ferramentas

## O Que Você Vai Aprender

- Entender como o mecanismo de recuperação de sessão trata automaticamente interrupções na execução de ferramentas
- Configurar as opções session_recovery e auto_resume
- Solucionar erros de tool_result_missing e thinking_block_order
- Compreender como funciona o tool_result sintético

## O Problema Atual

Ao usar o OpenCode, você pode encontrar estes cenários de interrupção:

- Pressionar ESC durante a execução de uma ferramenta trava a sessão, exigindo retry manual
- Erros de ordem de blocos de pensamento (thinking_block_order) impedem o AI de continuar gerando
- Uso acidental de funcionalidade de pensamento em modelos sem suporte (thinking_disabled_violation)
- Necessidade de reparar manualmente estados de sessão corrompidos, desperdiçando tempo

## Quando Usar Esta Técnica

A recuperação de sessão é adequada para os seguintes cenários:

| Cenário | Tipo de Erro | Método de Recuperação |
| --- | --- | --- |
| Interrupção de ferramenta com ESC | `tool_result_missing` | Injeção automática de tool_result sintético |
| Erro de ordem de bloco de pensamento | `thinking_block_order` | Prefixação automática de bloco de pensamento vazio |
| Uso de pensamento em modelo incompatível | `thinking_disabled_violation` | Remoção automática de todos os blocos de pensamento |
| Todos os erros acima | Geral | Reparo automático + continue automático (se habilitado) |

::: warning Verificação Prévia
Antes de iniciar este tutorial, certifique-se de ter concluído:
- ✅ Instalação do plugin opencode-antigravity-auth
- ✅ Capacidade de fazer requisições usando modelos Antigravity
- ✅ Compreensão dos conceitos básicos de chamadas de ferramentas

[Tutorial de Instalação Rápida](../../start/quick-install/) | [Tutorial de Primeira Requisição](../../start/first-request/)
:::

## Conceito Central

O mecanismo central da recuperação de sessão:

1. **Detecção de Erros**: Identificação automática de três tipos de erros recuperáveis
   - `tool_result_missing`: Resultado ausente durante execução de ferramenta
   - `thinking_block_order`: Ordem incorreta de blocos de pensamento
   - `thinking_disabled_violation`: Pensamento proibido em modelos sem suporte

2. **Reparo Automático**: Injeção de mensagens sintéticas conforme o tipo de erro
   - Injeção de tool_result sintético (conteúdo: "Operation cancelled by user (ESC pressed)")
   - Prefixação de bloco de pensamento vazio (blocos thinking devem estar no início da mensagem)
   - Remoção de todos os blocos de pensamento (modelos sem suporte não permitem pensamento)

3. **Continuação Automática**: Se `auto_resume` estiver habilitado, envia automaticamente mensagem continue para retomar o diálogo

4. **Tratamento de Duplicatas**: Uso de `Set` para evitar processamento repetido do mesmo erro

::: info O Que São Mensagens Sintéticas?
Mensagens sintéticas são mensagens "virtuais" injetadas pelo plugin para reparar estados de sessão corrompidos. Por exemplo, quando uma ferramenta é interrompida, o plugin injeta um tool_result sintético informando ao AI "esta ferramenta foi cancelada", permitindo que o AI continue gerando novas respostas.
:::

## Passo a Passo

### Passo 1: Habilitar Recuperação de Sessão (Habilitado por Padrão)

**Por Quê**
A recuperação de sessão está habilitada por padrão, mas se foi desabilitada manualmente anteriormente, precisa ser reativada.

**Ação**

Edite o arquivo de configuração do plugin:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Confirme a seguinte configuração:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**O Que Você Deve Ver**:

1. `session_recovery` como `true` (valor padrão)
2. `auto_resume` como `false` (recomendado continue manual para evitar operações acidentais)
3. `quiet_mode` como `false` (exibe notificações toast para acompanhar o status de recuperação)

::: tip Descrição das Opções de Configuração
- `session_recovery`: Habilita/desabilita a funcionalidade de recuperação de sessão
- `auto_resume`: Envia automaticamente mensagem "continue" (use com cautela, pode causar execução inesperada do AI)
- `quiet_mode`: Oculta notificações toast (pode ser desabilitado durante depuração)
:::

### Passo 2: Testar Recuperação de tool_result_missing

**Por Quê**
Verificar se o mecanismo de recuperação de sessão funciona corretamente quando a execução de uma ferramenta é interrompida.

**Ação**

1. Abra o OpenCode e selecione um modelo que suporte chamadas de ferramentas (como `google/antigravity-claude-sonnet-4-5`)
2. Digite uma tarefa que requer chamada de ferramenta (por exemplo: "Liste os arquivos do diretório atual")
3. Pressione `ESC` durante a execução da ferramenta para interromper

**O Que Você Deve Ver**:

1. O OpenCode para imediatamente a execução da ferramenta
2. Aparece notificação toast: "Tool Crash Recovery - Injecting cancelled tool results..."
3. O AI continua gerando automaticamente, sem esperar pelo resultado da ferramenta

::: info Princípio do Erro tool_result_missing
Quando você pressiona ESC, o OpenCode interrompe a execução da ferramenta, resultando em `tool_use` na sessão sem o `tool_result` correspondente. A API Antigravity detecta essa inconsistência e retorna o erro `tool_result_missing`. O plugin captura esse erro, injeta um tool_result sintético e restaura a sessão a um estado consistente.
:::

### Passo 3: Testar Recuperação de thinking_block_order

**Por Quê**
Verificar se o mecanismo de recuperação de sessão pode reparar automaticamente erros de ordem de blocos de pensamento.

**Ação**

1. Abra o OpenCode e selecione um modelo que suporte pensamento (como `google/antigravity-claude-opus-4-5-thinking`)
2. Digite uma tarefa que requer pensamento profundo
3. Se encontrar erros "Expected thinking but found text" ou "First block must be thinking"

**O Que Você Deve Ver**:

1. Aparece notificação toast: "Thinking Block Recovery - Fixing message structure..."
2. A sessão é reparada automaticamente e o AI pode continuar gerando

::: tip Causas do Erro thinking_block_order
Este erro geralmente é causado por:
- Blocos de pensamento removidos acidentalmente (por exemplo, por outras ferramentas)
- Estado de sessão corrompido (por exemplo, falha de gravação em disco)
- Incompatibilidade de formato durante migração entre modelos
:::

### Passo 4: Testar Recuperação de thinking_disabled_violation

**Por Quê**
Verificar se a recuperação de sessão pode remover automaticamente blocos de pensamento quando a funcionalidade de pensamento é usada acidentalmente em modelos sem suporte.

**Ação**

1. Abra o OpenCode e selecione um modelo que não suporte pensamento (como `google/antigravity-claude-sonnet-4-5`)
2. Se o histórico de mensagens contiver blocos de pensamento

**O Que Você Deve Ver**:

1. Aparece notificação toast: "Thinking Strip Recovery - Stripping thinking blocks..."
2. Todos os blocos de pensamento são removidos automaticamente
3. O AI pode continuar gerando

::: warning Perda de Blocos de Pensamento
A remoção de blocos de pensamento resulta na perda do conteúdo de raciocínio do AI, o que pode afetar a qualidade das respostas. Certifique-se de usar a funcionalidade de pensamento em modelos que a suportam.
:::

### Passo 5: Configurar auto_resume (Opcional)

**Por Quê**
Com auto_resume habilitado, após a conclusão da recuperação de sessão, "continue" é enviado automaticamente, sem necessidade de operação manual.

**Ação**

Em `antigravity.json`, configure:

```json
{
  "auto_resume": true
}
```

Salve o arquivo e reinicie o OpenCode.

**O Que Você Deve Ver**:

1. Após a conclusão da recuperação de sessão, o AI continua gerando automaticamente
2. Não é necessário digitar "continue" manualmente

::: danger Riscos do auto_resume
O continue automático pode fazer com que o AI execute chamadas de ferramentas inesperadamente. Se você tiver preocupações sobre a segurança das chamadas de ferramentas, recomenda-se manter `auto_resume: false` e controlar manualmente o momento da recuperação.
:::

## Checklist ✅

Após concluir os passos acima, você deve ser capaz de:

- [ ] Ver a configuração session_recovery em `antigravity.json`
- [ ] Ver a notificação "Tool Crash Recovery" ao interromper uma ferramenta com ESC
- [ ] A sessão recupera automaticamente, sem necessidade de retry manual
- [ ] Entender como funciona o tool_result sintético
- [ ] Saber quando habilitar/desabilitar auto_resume

## Armadilhas Comuns

### Recuperação de Sessão Não Acionada

**Sintoma**: Encontra erro mas não há recuperação automática

**Causa**: `session_recovery` está desabilitado ou o tipo de erro não corresponde

**Solução**:

1. Confirme `session_recovery: true`:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Verifique se o tipo de erro é recuperável:

```bash
# Habilite logs de depuração para ver informações detalhadas do erro
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Verifique se há logs de erro no console:

```bash
# Localização dos logs
~/.config/opencode/antigravity-logs/session-recovery.log
```

### tool_result Sintético Não Injetado

**Sintoma**: Após interrupção da ferramenta, o AI ainda espera pelo resultado

**Causa**: Caminho de armazenamento do OpenCode configurado incorretamente

**Solução**:

1. Confirme que o caminho de armazenamento do OpenCode está correto:

```bash
# Verifique a configuração do OpenCode
cat ~/.config/opencode/opencode.json | grep storage
```

2. Verifique se os diretórios de armazenamento de mensagens e partes existem:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. Se os diretórios não existirem, verifique a configuração do OpenCode

### Auto Resume Acionado Inesperadamente

**Sintoma**: O AI continua automaticamente em momentos inadequados

**Causa**: `auto_resume` está definido como `true`

**Solução**:

1. Desabilite auto_resume:

```json
{
  "auto_resume": false
}
```

2. Controle manualmente o momento da recuperação

### Notificações Toast Muito Frequentes

**Sintoma**: Notificações de recuperação aparecem frequentemente, afetando a experiência de uso

**Causa**: `quiet_mode` não está habilitado

**Solução**:

1. Habilite quiet_mode:

```json
{
  "quiet_mode": true
}
```

2. Se precisar depurar, pode desabilitar temporariamente

## Resumo da Lição

- O mecanismo de recuperação de sessão trata automaticamente três tipos de erros recuperáveis: tool_result_missing, thinking_block_order, thinking_disabled_violation
- O tool_result sintético é a chave para reparar o estado da sessão, com conteúdo "Operation cancelled by user (ESC pressed)"
- session_recovery está habilitado por padrão, auto_resume está desabilitado por padrão (recomendado controle manual)
- A recuperação de thinking_block_order prefixa um bloco de pensamento vazio, permitindo que o AI regenere o conteúdo de pensamento
- A remoção de thinking_disabled_violation resulta na perda do conteúdo de pensamento; certifique-se de usar a funcionalidade de pensamento em modelos que a suportam

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Mecanismo de Transformação de Requisições](../request-transformation/)**.
>
> Você aprenderá:
> - Diferenças entre formatos de requisição Claude e Gemini
> - Regras de limpeza e transformação de Tool Schema
> - Mecanismo de injeção de assinatura de bloco de pensamento
> - Método de configuração do Google Search Grounding

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Lógica principal de recuperação de sessão | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Completo |
| Detecção de tipo de erro | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| Recuperação de tool_result_missing | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| Recuperação de thinking_block_order | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| Recuperação de thinking_disabled_violation | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Funções utilitárias de armazenamento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Completo |
| Leitura de mensagens | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Leitura de partes (part) | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Prefixação de bloco de pensamento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Remoção de blocos de pensamento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Definições de tipos | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Completo |

**Constantes Principais**:

| Nome da Constante | Valor | Descrição |
| --- | --- | --- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Texto de recuperação enviado durante Auto Resume |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Conjunto de tipos de blocos de pensamento |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Conjunto de tipos de metadados |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Conjunto de tipos de conteúdo |

**Funções Principais**:

- `detectErrorType(error: unknown): RecoveryErrorType`: Detecta o tipo de erro, retorna `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` ou `null`
- `isRecoverableError(error: unknown): boolean`: Determina se o erro é recuperável
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: Cria hook de recuperação de sessão
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: Recupera erro tool_result_missing
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: Recupera erro thinking_block_order
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: Recupera erro thinking_disabled_violation
- `readMessages(sessionID): StoredMessageMeta[]`: Lê todas as mensagens da sessão
- `readParts(messageID): StoredPart[]`: Lê todas as partes (parts) de uma mensagem
- `prependThinkingPart(sessionID, messageID): boolean`: Prefixa bloco de pensamento vazio no início da mensagem
- `stripThinkingParts(messageID): boolean`: Remove todos os blocos de pensamento de uma mensagem

**Opções de Configuração** (de schema.ts):

| Opção | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `session_recovery` | boolean | `true` | Habilita funcionalidade de recuperação de sessão |
| `auto_resume` | boolean | `false` | Envia automaticamente mensagem "continue" |
| `quiet_mode` | boolean | `false` | Oculta notificações toast |

</details>
