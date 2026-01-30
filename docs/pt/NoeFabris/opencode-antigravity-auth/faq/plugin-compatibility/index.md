---
title: "Compatibilidade de Plugins: Resolvendo Conflitos Comuns | Antigravity Auth"
sidebarTitle: "O que fazer com conflitos de plugins"
subtitle: "Resolvendo problemas de compatibilidade com outros plugins"
description: "Aprenda a resolver problemas de compatibilidade do Antigravity Auth com plugins como oh-my-opencode e DCP. Configure a ordem correta de carregamento de plugins e desabilite métodos de autenticação conflitantes."
tags:
  - "FAQ"
  - "Configuração de Plugins"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# Resolvendo Problemas de Compatibilidade com Outros Plugins

**Compatibilidade de plugins** é um problema comum ao usar o Antigravity Auth. Diferentes plugins podem conflitar entre si, causando falhas de autenticação, perda de thinking blocks ou erros no formato das requisições. Este tutorial ajuda você a resolver problemas de compatibilidade com plugins como oh-my-opencode e DCP.

## O Que Você Vai Aprender

- Configurar corretamente a ordem de carregamento de plugins para evitar problemas com DCP
- Desabilitar métodos de autenticação conflitantes no oh-my-opencode
- Identificar e remover plugins desnecessários
- Habilitar deslocamento de PID para cenários de agentes paralelos

## Problemas Comuns de Compatibilidade

### Problema 1: Conflito com oh-my-opencode

**Sintomas**:
- Falha na autenticação ou janela de autorização OAuth aparecendo repetidamente
- Requisições de modelo retornando erros 400 ou 401
- Configuração de modelo do Agent não sendo aplicada

**Causa**: O oh-my-opencode habilita por padrão a autenticação Google integrada, que conflita com o fluxo OAuth do Antigravity Auth.

::: warning Problema Central
O oh-my-opencode intercepta todas as requisições de modelos Google e usa seu próprio método de autenticação. Isso impede que os tokens OAuth do Antigravity Auth sejam utilizados.
:::

**Solução**:

Edite `~/.config/opencode/oh-my-opencode.json` e adicione a seguinte configuração:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Explicação da Configuração**:

| Configuração | Valor | Descrição |
| --- | --- | --- |
| `google_auth` | `false` | Desabilita a autenticação Google integrada do oh-my-opencode |
| `agents.<agent-name>.model` | `google/antigravity-*` | Substitui o modelo do Agent por um modelo Antigravity |

**Checkpoint ✅**:

- Reinicie o OpenCode após salvar a configuração
- Teste se o Agent está usando o modelo Antigravity
- Verifique se a janela de autorização OAuth não aparece mais

---

### Problema 2: Conflito com DCP (@tarquinen/opencode-dcp)

**Sintomas**:
- Modelo Claude Thinking retorna erro: `thinking must be first block in message`
- Thinking blocks ausentes no histórico de conversas
- Conteúdo de pensamento não é exibido

**Causa**: As synthetic assistant messages (mensagens sintéticas de assistente) criadas pelo DCP não incluem thinking blocks, o que conflita com os requisitos da API Claude.

::: info O que são synthetic messages?
Synthetic messages são mensagens geradas automaticamente por plugins ou pelo sistema para corrigir o histórico de conversas ou completar mensagens ausentes. O DCP cria essas mensagens em certos cenários, mas não adiciona thinking blocks.
:::

**Solução**:

Certifique-se de que o Antigravity Auth seja carregado **antes** do DCP. Edite `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**Por que essa ordem é necessária**:

- O Antigravity Auth processa e corrige thinking blocks
- O DCP cria synthetic messages (que podem não ter thinking blocks)
- Se o DCP for carregado primeiro, o Antigravity Auth não consegue corrigir as mensagens criadas pelo DCP

**Checkpoint ✅**:

- Verifique se `opencode-antigravity-auth` está antes de `@tarquinen/opencode-dcp`
- Reinicie o OpenCode
- Teste se o modelo Thinking exibe corretamente o conteúdo de pensamento

---

### Problema 3: Distribuição de Contas em Cenários de Agentes Paralelos

**Sintomas**:
- Múltiplos agentes paralelos usando a mesma conta
- Quando ocorre limite de taxa, todos os agentes falham simultaneamente
- Baixa utilização de cota

**Causa**: Por padrão, múltiplos agentes paralelos compartilham a mesma lógica de seleção de conta, fazendo com que possam usar a mesma conta simultaneamente.

::: tip Cenário de Agentes Paralelos
Quando você usa a funcionalidade paralela do Cursor (como executar múltiplos Agents simultaneamente), cada Agent faz requisições de modelo independentemente. Sem a distribuição correta de contas, eles podem "colidir".
:::

**Solução**:

Edite `~/.config/opencode/antigravity.json` e habilite o deslocamento de PID:

```json
{
  "pid_offset_enabled": true
}
```

**O que é Deslocamento de PID?**

O deslocamento de PID (Process ID) faz com que cada agente paralelo use um índice inicial de conta diferente:

```
Agente 1 (PID 100) → Conta 0
Agente 2 (PID 101) → Conta 1
Agente 3 (PID 102) → Conta 2
```

Assim, mesmo que façam requisições simultaneamente, não usarão a mesma conta.

**Pré-requisitos**:
- Necessário ter pelo menos 2 contas Google
- Recomenda-se habilitar `account_selection_strategy: "round-robin"` ou `"hybrid"`

**Checkpoint ✅**:

- Confirme que múltiplas contas estão configuradas (execute `opencode auth list`)
- Habilite `pid_offset_enabled: true`
- Teste se os agentes paralelos estão usando contas diferentes (verifique os logs de debug)

---

### Problema 4: Plugins Desnecessários

**Sintomas**:
- Conflitos de autenticação ou autenticação duplicada
- Falha no carregamento de plugins ou mensagens de aviso
- Configuração confusa, sem saber quais plugins estão ativos

**Causa**: Plugins com funcionalidades sobrepostas foram instalados.

::: tip Verificação de Plugins Redundantes
Verifique periodicamente a lista de plugins em `config.json`. Remover plugins desnecessários pode evitar conflitos e problemas de desempenho.
:::

**Plugins Desnecessários**:

| Tipo de Plugin | Exemplo | Motivo |
| --- | --- | --- |
| **Plugins gemini-auth** | `opencode-gemini-auth`, `@username/gemini-auth` | O Antigravity Auth já gerencia toda a autenticação Google OAuth |
| **Plugins de autenticação Claude** | `opencode-claude-auth` | O Antigravity Auth não usa autenticação Claude |

**Solução**:

Remova esses plugins de `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // Remova estes:
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**Checkpoint ✅**:

- Verifique a lista de plugins em `~/.config/opencode/config.json`
- Remova todos os plugins relacionados a gemini-auth
- Reinicie o OpenCode e confirme que não há conflitos de autenticação

---

## Solução de Erros Comuns

### Erro 1: `thinking must be first block in message`

**Possíveis Causas**:
- DCP carregado antes do Antigravity Auth
- Session recovery do oh-my-opencode conflitando com o Antigravity Auth

**Passos de Diagnóstico**:

1. Verifique a ordem de carregamento dos plugins:
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Certifique-se de que o Antigravity Auth está antes do DCP

3. Se o problema persistir, tente desabilitar o session recovery do oh-my-opencode (se existir)

### Erro 2: `invalid_grant` ou Falha na Autenticação

**Possíveis Causas**:
- `google_auth` do oh-my-opencode não foi desabilitado
- Múltiplos plugins de autenticação tentando processar a requisição simultaneamente

**Passos de Diagnóstico**:

1. Verifique a configuração do oh-my-opencode:
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. Certifique-se de que o valor é `false`

3. Remova outros plugins gemini-auth

### Erro 3: Agentes Paralelos Usando a Mesma Conta

**Possíveis Causas**:
- `pid_offset_enabled` não está habilitado
- Número de contas menor que o número de agentes

**Passos de Diagnóstico**:

1. Verifique a configuração do Antigravity:
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. Certifique-se de que o valor é `true`

3. Verifique o número de contas:
   ```bash
   opencode auth list
   ```

4. Se houver menos contas que agentes, considere adicionar mais contas

---

## Exemplo de Configuração

### Exemplo Completo de Configuração (incluindo oh-my-opencode)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## Resumo da Aula

Problemas de compatibilidade de plugins geralmente surgem de conflitos de autenticação, ordem de carregamento de plugins ou funcionalidades sobrepostas. Com a configuração correta:

- ✅ Desabilite a autenticação Google integrada do oh-my-opencode (`google_auth: false`)
- ✅ Certifique-se de que o Antigravity Auth seja carregado antes do DCP
- ✅ Habilite o deslocamento de PID para agentes paralelos (`pid_offset_enabled: true`)
- ✅ Remova plugins gemini-auth redundantes

Essas configurações podem evitar a maioria dos problemas de compatibilidade, mantendo seu ambiente OpenCode funcionando de forma estável.

## Próxima Aula

> Na próxima aula aprenderemos **[Guia de Migração](../migration-guide/)**.
>
> Você vai aprender:
> - Migrar configurações de conta entre diferentes máquinas
> - Lidar com alterações de configuração durante atualizações de versão
> - Fazer backup e restaurar dados de conta

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Processamento de Thinking blocks | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| Cache de assinatura de blocos de pensamento | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | Arquivo completo |
| Configuração de deslocamento de PID | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Session recovery (baseado em oh-my-opencode) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | Arquivo completo |

**Configurações Chave**:
- `pid_offset_enabled: true`: Habilita deslocamento de ID de processo, distribuindo contas diferentes para agentes paralelos
- `account_selection_strategy: "hybrid"`: Estratégia inteligente híbrida de seleção de conta

**Funções Chave**:
- `deepFilterThinkingBlocks()`: Remove todos os thinking blocks (request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()`: Filtra thinking blocks com base no cache de assinatura (request-helpers.ts:1183)

</details>
