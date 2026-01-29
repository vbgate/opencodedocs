---
title: "Guia Completo de Configuração de Modelos de IA e Autenticação: Múltiplos Provedores, Métodos de Autenticação e Resolução de Problemas | Tutorial Clawdbot"
sidebarTitle: "Configure Sua Conta de IA"
subtitle: "Modelos de IA e Configuração de Autenticação"
description: "Aprenda a configurar provedores de modelos de IA para Clawdbot (Anthropic, OpenAI, OpenRouter, Ollama, etc.) e três métodos de autenticação (API Key, OAuth, Token). Este tutorial cobre gerenciamento de arquivos de autenticação, rotação de múltiplas contas, atualização automática de OAuth Token, configuração de aliases de modelos, failover e solução de erros comuns, incluindo exemplos de configuração práticos e comandos CLI para ajudá-lo a começar rapidamente."
tags:
  - "avançado"
  - "configuração"
  - "autenticação"
  - "modelos"
prerequisite:
  - "start-getting-started"
order: 190
---

# Modelos de IA e Configuração de Autenticação

## O Que Você Será Capaz de Fazer

- Configurar múltiplos provedores de modelos de IA (Anthropic, OpenAI, OpenRouter, etc.)
- Usar três métodos de autenticação (API Key, OAuth, Token)
- Gerenciar autenticação de múltiplas contas e rotação de autenticação
- Configurar seleção de modelos e modelos de backup
- Resolver problemas comuns de autenticação

## Sua Situação Atual

Clawdbot suporta dezenas de provedores de modelos, mas a configuração pode ser confusa:

- Devo usar API Key ou OAuth?
- Quais são as diferenças entre os métodos de autenticação de diferentes provedores?
- Como configurar múltiplas contas?
- Como os tokens OAuth são atualizados automaticamente?

## Quando Usar Este Guia

- Ao configurar modelos de IA pela primeira vez após a instalação
- Ao adicionar novos provedores de modelos ou contas de backup
- Ao encontrar erros de autenticação ou limites de cota
- Ao precisar configurar alternância de modelos e mecanismo de backup

## 🎒 Pré-requisitos

::: warning Pré-condições
Este tutorial assume que você já completou o [Início Rápido](../../start/getting-started/), instalou e iniciou o Gateway.
:::

- Certifique-se de que o Node ≥ 22 esteja instalado
- O daemon Gateway está em execução
- Prepare credenciais de pelo menos um provedor de modelos de IA (API Key ou conta de assinatura)

## Conceito Central

### Configuração de Modelos e Autenticação são Separados

No Clawdbot, **seleção de modelos** e **credenciais de autenticação** são dois conceitos independentes:

- **Configuração de modelos**: Informa ao Clawdbot qual modelo usar (como `anthropic/claude-opus-4-5`), armazenado em `~/.clawdbot/models.json`
- **Configuração de autenticação**: Fornece credenciais para acessar o modelo (como API Key ou OAuth token), armazenado em `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info Por que separar?
Este design permite alternar flexivelmente entre múltiplos provedores e contas sem precisar reconfigurar parâmetros de modelo repetidamente.
:::

### Três Métodos de Autenticação

Clawdbot suporta três métodos de autenticação, adequados para diferentes cenários:

| Método de Autenticação | Formato de Armazenamento | Cenário Típico | Provedores Suportados |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | Início rápido, teste | Anthropic, OpenAI, OpenRouter, DeepSeek, etc. |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | Longa duração, atualização automática | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | Bearer token estático | GitHub Copilot, certos proxies personalizados |

### Provedores de Modelos Suportados

Clawdbot suporta nativamente os seguintes provedores de modelos:

::: details Lista de provedores internos
| Provedor | Método de Autenticação | Modelo Recomendado | Observações |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Recomenda Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | Suporta OpenAI padrão e versão Codex |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | Agrega centenas de modelos |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | Modelos locais, sem necessidade de API Key |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | Amigável para China |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | OAuth Qwen |
| **Venice** | API Key | `venice/<model>` | Privacidade em primeiro lugar |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | Modelos hospedados pela AWS |
| **Antigravity** | API Key | `google-antigravity/<model>` | Serviço de proxy de modelos |
:::

::: tip Combinação Recomendada
Para a maioria dos usuários, recomenda-se configurar **Anthropic Opus 4.5** como modelo principal e **OpenAI GPT-5.2** como backup. Opus tem melhor desempenho em contexto longo e segurança.
:::

## Siga Comigo

### Passo 1: Configurar Anthropic (Recomendado)

**Por quê**
Anthropic Claude é o modelo recomendado do Clawdbot, especialmente Opus 4.5, que se destaca no processamento de contexto longo e segurança.

**Opção A: Usar Anthropic API Key (Mais rápido)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**Você deveria ver**:
- Gateway recarrega a configuração
- Modelo padrão definido como `anthropic/claude-opus-4-5`
- Arquivo de autenticação `~/.clawdbot/agents/default/agent/auth-profiles.json` criado

**Opção B: Usar OAuth (Recomendado para Longa Duração)**

OAuth é adequado para Gateways de longa duração, os tokens são atualizados automaticamente.

1. Gerar setup-token (precisa executar Claude Code CLI em qualquer máquina):
```bash
claude setup-token
```

2. Copiar o token de saída

3. Executar no host Gateway:
```bash
clawdbot models auth paste-token --provider anthropic
# Colar o token
```

**Você deveria ver**:
- Prompt "Auth profile added: anthropic:claude-cli"
- Tipo de autenticação é `oauth` (não `api_key`)

::: tip Vantagem do OAuth
Tokens OAuth são atualizados automaticamente, sem necessidade de atualização manual. Adequado para daemon Gateway de execução contínua.
:::

### Passo 2: Configurar OpenAI como Backup

**Por quê**
Configurar modelos de backup permite alternância automática quando o modelo principal (como Anthropic) encontra limites de cota ou erros.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

Ou usar OpenAI Codex OAuth:

```bash
clawdbot onboard --openai-codex
```

**Você deveria ver**:
- Configuração do provedor OpenAI adicionada em `~/.clawdbot/clawdbot.json`
- Configuração `openai:default` ou `openai-codex:codex-cli` adicionada ao arquivo de autenticação

### Passo 3: Configurar Seleção de Modelos e Backup

**Por quê**
Configurar estratégia de seleção de modelos, definindo modelo principal, modelos de backup e aliases.

Editar `~/.clawdbot/clawdbot.json`:

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Descrição dos campos**:
- `primary`: Modelo usado por padrão
- `fallbacks`: Modelos de backup tentados em ordem (alternância automática em caso de falha)
- `alias`: Alias de modelo (como `/model opus` é equivalente a `/model anthropic/claude-opus-4-5`)

**Você deveria ver**:
- Após reiniciar o Gateway, o modelo principal muda para Opus 4.5
- Configuração de modelo de backup entra em vigor

### Passo 4: Adicionar OpenRouter (Opcional)

**Por quê**
OpenRouter agrega centenas de modelos, adequado para acessar modelos especiais ou modelos gratuitos.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

Em seguida configurar o modelo:

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**Você deveria ver**:
- O formato de referência do modelo é `openrouter/<provider>/<model>`
- Pode usar `clawdbot models scan` para ver modelos disponíveis

### Passo 5: Configurar Ollama (Modelos Locais)

**Por quê**
Ollama permite executar modelos localmente, sem necessidade de API Key, adequado para cenários sensíveis à privacidade.

Editar `~/.clawdbot/clawdbot.json`:

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**Você deveria ver**:
- Modelos Ollama não exigem API Key
- Necessário garantir que o serviço Ollama esteja rodando em `http://localhost:11434`

### Passo 6: Verificar Configuração

**Por quê**
Garantir que a autenticação e configuração de modelo estejam corretas, e que o Gateway possa chamar a IA normalmente.

```bash
clawdbot doctor
```

**Você deveria ver**:
- Sem erros de autenticação
- Lista de modelos inclui os provedores que você configurou
- Status exibe "OK"

Ou enviar mensagem de teste:

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**Você deveria ver**:
- Resposta da IA normal
- Sem erro "No credentials found"

## Checkpoint ✅

- [ ] Pelo menos um provedor de modelos configurado (Anthropic ou OpenAI)
- [ ] Arquivo de autenticação `auth-profiles.json` criado
- [ ] Arquivo de configuração de modelo `models.json` gerado
- [ ] Pode alternar modelos via `/model <alias>`
- [ ] Logs do Gateway sem erros de autenticação
- [ ] Mensagem de teste recebe resposta da IA com sucesso

## Avisos de Armadilhas

### Incompatibilidade de Modo de Autenticação

**Problema**: Configuração OAuth não corresponde ao modo de autenticação

```yaml
# ❌ Erro: Credenciais OAuth mas modo é token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # Deveria ser "oauth"
```

**Correção**:

```yaml
# ✅ Correto
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot define automaticamente a configuração importada do Claude Code CLI como `mode: "oauth"`, sem necessidade de modificação manual.
:::

### Falha na Atualização do Token OAuth

**Problema**: Ver erro "OAuth token refresh failed for anthropic"

**Causa**:
- Credenciais do Claude Code CLI expiraram em outra máquina
- Token OAuth expirou

**Correção**:
```bash
# Regenerar setup-token
claude setup-token

# Colar novamente
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` é um Bearer token estático que não é atualizado automaticamente. `type: "oauth"` suporta atualização automática.
:::

### Limites de Cota e Failover

**Problema**: Modelo principal encontra limite de cota (erro 429)

**Sintoma**:
```
HTTP 429: rate_limit_error
```

**Tratamento Automático**:
- Clawdbot tentará automaticamente o próximo modelo em `fallbacks`
- Se todos os modelos falharem, retorna erro

**Configurar Período de Resfriamento** (opcional):

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # Desabilitar provedor por 24 horas após erro de cota
    failureWindowHours: 1      # Falhas dentro de 1 hora contam para resfriamento
```

### Substituição de Variáveis de Ambiente

**Problema**: Arquivo de configuração usa variáveis de ambiente, mas não estão definidas

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # Erro se não definido
```

**Correção**:
```bash
# Definir variável de ambiente
export OPENAI_KEY="sk-..."

# Ou adicionar em .zshrc/.bashrc
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## Configuração Avançada

### Múltiplas Contas e Rotação de Autenticação

**Por quê**
Configurar múltiplas contas para o mesmo provedor, permitindo balanceamento de carga e gerenciamento de cota.

**Configurar arquivo de autenticação** (`~/.clawdbot/agents/default/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**Campo `order`**:
- Define a ordem de rotação de autenticação
- Clawdbot tentará cada conta em ordem
- Contas com falha serão ignoradas automaticamente

**Gerenciar ordem via comandos CLI**:

```bash
# Ver ordem atual
clawdbot models auth order get --provider anthropic

# Definir ordem
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# Limpar ordem (usar rotação padrão)
clawdbot models auth order clear --provider anthropic
```

### Autenticação Específica de Sessão

**Por quê**
Bloquear configuração de autenticação para sessão específica ou sub-Agent.

**Usar sintaxe `/model <alias>@<profileId>`**:

```bash
# Bloquear conta específica para sessão atual
/model opus@anthropic:work

# Especificar autenticação ao criar sub-Agent
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**Bloqueio em arquivo de configuração** (`~/.clawdbot/clawdbot.json`):

```yaml
auth:
  order:
    # Bloquear ordem anthropic para Agent main
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### Atualização Automática de Token OAuth

Clawdbot suporta atualização automática para os seguintes provedores OAuth:

| Provedor | Fluxo OAuth | Mecanismo de Atualização |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | Código de autorização padrão | Atualização via pi-mono RPC |
| **OpenAI** (Codex) | Código de autorização padrão | Atualização via pi-mono RPC |
| **Qwen Portal** | OAuth personalizado | `refreshQwenPortalCredentials` |
| **Chutes** | OAuth personalizado | `refreshChutesTokens` |

**Lógica de atualização automática**:

1. Verificar tempo de expiração do token (campo `expires`)
2. Se não expirado, usar diretamente
3. Se expirado, usar token `refresh` para solicitar novo token `access`
4. Atualizar credenciais armazenadas

::: tip Sincronização com Claude Code CLI
Se usar Anthropic OAuth (`anthropic:claude-cli`), Clawdbot sincronizará de volta ao armazenamento do Claude Code CLI ao atualizar o token, garantindo consistência em ambos os lados.
:::

### Aliases de Modelos e Atalhos

**Por quê**
Aliases de modelos permitem alternar modelos rapidamente sem precisar lembrar o ID completo.

**Aliases pré-definidos** (configuração recomendada):

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Como usar**:

```bash
# Alternar rapidamente para Opus
/model opus

# Equivalente a
/model anthropic/claude-opus-4-5

# Usar autenticação específica
/model opus@anthropic:work
```

::: tip Aliases e autenticação separados
Aliases são apenas atalhos para IDs de modelo e não afetam a seleção de autenticação. Para especificar autenticação, use a sintaxe `@<profileId>`.
:::

### Configurar Provedores Implícitos

Certos provedores não requerem configuração explícita, Clawdbot detectará automaticamente:

| Provedor | Método de Detecção | Arquivo de Configuração |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | Sem configuração necessária |
| **AWS Bedrock** | Variáveis de ambiente ou credenciais AWS SDK | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | Sem configuração necessária |

::: tip Prioridade de configuração implícita
Configurações implícitas são mescladas automaticamente em `models.json`, mas configurações explícitas podem sobrescrevê-las.
:::

## Perguntas Frequentes

### OAuth vs API Key: Qual a diferença?

**OAuth**:
- Adequado para Gateways de longa duração
- Tokens são atualizados automaticamente
- Requer conta de assinatura (Claude Pro/Max, OpenAI Codex)

**API Key**:
- Adequado para início rápido e testes
- Não é atualizado automaticamente
- Pode ser usado em contas de nível gratuito

::: info Escolha recomendada
- Longa duração → Use OAuth (Anthropic, OpenAI)
- Teste rápido → Use API Key
- Sensível à privacidade → Use modelos locais (Ollama)
:::

### Como ver configuração de autenticação atual?

```bash
# Ver arquivo de autenticação
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# Ver configuração de modelo
cat ~/.clawdbot/models.json

# Ver arquivo de configuração principal
cat ~/.clawdbot/clawdbot.json
```

Ou usar CLI:

```bash
# Listar modelos
clawdbot models list

# Ver ordem de autenticação
clawdbot models auth order get --provider anthropic
```

### Como remover uma autenticação específica?

```bash
# Editar arquivo de autenticação, remover profile correspondente
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# Ou usar CLI (operação manual)
clawdbot doctor  # Ver configurações com problemas
```

::: warning Confirme antes de remover
Remover configuração de autenticação fará com que modelos usando esse provedor parem de funcionar. Certifique-se de ter configuração de backup.
:::

### Como recuperar após limite de cota?

**Recuperação automática**:
- Clawdbot tentará novamente automaticamente após o período de resfriamento
- Verifique logs para saber quando ocorrerá a nova tentativa

**Recuperação manual**:
```bash
# Limpar estado de resfriamento
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# Ou reiniciar Gateway
clawdbot gateway restart
```

## Resumo da Lição

- Clawdbot suporta três métodos de autenticação: API Key, OAuth, Token
- Configuração de modelos e autenticação são separadas, armazenadas em arquivos diferentes
- Recomenda-se configurar Anthropic Opus 4.5 como modelo principal, OpenAI GPT-5.2 como backup
- OAuth suporta atualização automática, adequado para longa duração
- Pode configurar múltiplas contas e rotação de autenticação, realizando balanceamento de carga
- Use aliases de modelos para alternar rapidamente

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Gerenciamento de Sessões e Multi-Agent](../session-management/)**.
>
> Você aprenderá:
> - Modelos de sessão e isolamento de sessões
> - Colaboração de sub-Agentes
> - Compressão de contexto
> - Configuração de roteamento multi-Agent

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Definição de tipos de credenciais de autenticação | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| Análise e atualização de Token OAuth | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| Gerenciamento de arquivo de configuração de autenticação | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| Tipos de configuração de modelo | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| Geração de configuração de modelo | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Configuração do Schema Zod | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**Tipos-chave**:
- `AuthProfileCredential`: Tipo de união de credenciais de autenticação (`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig`: Estrutura de configuração do provedor de modelo
- `ModelDefinitionConfig`: Estrutura de definição de modelo

**Funções-chave**:
- `resolveApiKeyForProfile()`: Analisa credenciais de autenticação e retorna API Key
- `refreshOAuthTokenWithLock()`: Atualização de Token OAuth com bloqueio
- `ensureClawdbotModelsJson()`: Gera e mescla configuração de modelos

**Localizações de arquivos de configuração**:
- `~/.clawdbot/clawdbot.json`: Arquivo de configuração principal
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`: Credenciais de autenticação
- `~/.clawdbot/models.json`: Configuração de modelos gerada

</details>
