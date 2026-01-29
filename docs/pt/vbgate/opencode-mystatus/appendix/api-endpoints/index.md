---
title: "Resumo de APIs: Endpoints e Autenticação | opencode-mystatus"
sidebarTitle: "Resumo de APIs"
subtitle: "Resumo de APIs"
description: "Aprenda as APIs oficiais do opencode-mystatus. Inclui autenticação, formatos de solicitação e respostas para OpenAI, Zhipu AI, Google Cloud e GitHub Copilot."
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 2
---

# Resumo de APIs

## O que você poderá fazer após concluir

- Entender todas as APIs oficiais chamadas pelo plugin
- Compreender os métodos de autenticação de cada plataforma (OAuth / API Key)
- Dominar formatos de solicitação e estruturas de dados de resposta
- Saber como chamar essas APIs independentemente

## O que é API

API (Application Programming Interface - Interface de Programação de Aplicativos) é a ponte de comunicação entre programas. O opencode-mystatus obtém seus dados de cota de conta chamando as APIs oficiais de cada plataforma.

::: info Por que entender essas APIs?
Entender essas APIs permite que você:
1. Verifique a fonte de dados do plugin, garantindo segurança
2. Chame manualmente as APIs para obter dados quando o plugin não estiver disponível
3. Aprenda como construir ferramentas semelhantes de consulta de cota
:::

## API OpenAI

### Consultar cota

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Método | GET |
| Autenticação | Bearer Token (OAuth) |
| Localização no código | `plugin/lib/openai.ts:127-155` |

**Cabeçalhos da solicitação**:

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // Opcional, necessário para contas de equipe
```

**Exemplo de resposta**:

```json
{
  "plan_type": "Plus",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9180
    },
    "secondary_window": {
      "used_percent": 5,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 82800
    }
  }
}
```

**Explicação dos campos de resposta**:

- `plan_type`: Tipo de assinatura (Plus / Team / Pro)
- `rate_limit.primary_window`: Limite da janela principal (geralmente 3 horas)
- `rate_limit.secondary_window`: Limite da janela secundária (geralmente 24 horas)
- `used_percent`: Porcentagem usada (0-100)
- `reset_after_seconds`: Segundos até a redefinição

---

## API Zhipu AI

### Consultar cota

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Método | GET |
| Autenticação | API Key |
| Localização no código | `plugin/lib/zhipu.ts:62-106` |

**Cabeçalhos da solicitação**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Exemplo de resposta**:

```json
{
  "code": 200,
  "msg": "success",
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "usage": 10000000,
        "currentValue": 500000,
        "percentage": 5,
        "nextResetTime": 1706200000000
      },
      {
        "type": "TIME_LIMIT",
        "usage": 100,
        "currentValue": 10,
        "percentage": 10
      }
    ]
  }
}
```

**Explicação dos campos de resposta**:

- `limits[].type`: Tipo de limite
  - `TOKENS_LIMIT`: Limite de tokens de 5 horas
  - `TIME_LIMIT`: Contagem de pesquisas MCP (cota mensal)
- `usage`: Cota total
- `currentValue`: Valor atual usado
- `percentage`: Porcentagem usada (0-100)
- `nextResetTime`: Carimbo de data/hora da próxima redefinição (apenas válido para TOKENS_LIMIT, em milissegundos)

---

## API Z.ai

### Consultar cota

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Método | GET |
| Autenticação | API Key |
| Localização no código | `plugin/lib/zhipu.ts:64, 85-106` |

**Cabeçalhos da solicitação**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Formato de resposta**: O mesmo que Zhipu AI, ver acima.

---

## API Google Cloud

### 1. Atualizar Access Token

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://oauth2.googleapis.com/token` |
| Método | POST |
| Autenticação | OAuth Refresh Token |
| Localização no código | `plugin/lib/google.ts:90, 162-184` |

**Cabeçalhos da solicitação**:

```http
Content-Type: application/x-www-form-urlencoded
```

**Corpo da solicitação**:

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**Exemplo de resposta**:

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**Explicação dos campos**:

- `access_token`: Novo Access Token (válido por 1 hora)
- `expires_in`: Tempo de expiração (em segundos)

---

### 2. Consultar cota de modelos disponíveis

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Método | POST |
| Autenticação | Bearer Token (OAuth) |
| Localização no código | `plugin/lib/google.ts:65, 193-213` |

**Cabeçalhos da solicitação**:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**Corpo da solicitação**:

```json
{
  "project": "{project_id}"
}
```

**Exemplo de resposta**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.85,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T12:00:00Z"
      }
    }
  }
}
```

**Explicação dos campos de resposta**:

- `models`: Lista de modelos (chave é o nome do modelo)
- `quotaInfo.remainingFraction`: Fração restante (0.0-1.0)
- `quotaInfo.resetTime`: Tempo de redefinição (formato ISO 8601)

---

## API GitHub Copilot

### 1. API de cobrança pública (recomendado)

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Método | GET |
| Autenticação | Fine-grained PAT (Personal Access Token) |
| Localização no código | `plugin/lib/copilot.ts:157-177` |

**Cabeçalhos da solicitação**:

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip O que é Fine-grained PAT?
Fine-grained PAT (Personal Access Token de granularidade fina) é a nova geração de tokens do GitHub, suportando controle de permissões mais granular. Para consultar a cota do Copilot, é necessário conceder permissão de leitura "Plan".
:::

**Exemplo de resposta**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "username",
  "usageItems": [
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4",
      "unitType": "request",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3.5-sonnet",
      "unitType": "request",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

**Explicação dos campos de resposta**:

- `timePeriod`: Período de tempo (ano e mês)
- `user`: Nome de usuário do GitHub
- `usageItems`: Array de detalhes de uso
  - `sku`: Nome do SKU (`Copilot Premium Request` indica Premium Requests)
  - `model`: Nome do modelo
  - `grossQuantity`: Número total de solicitações (antes de descontos)
  - `netQuantity`: Número líquido de solicitações (após descontos)
  - `limit`: Limite

---

### 2. API de cota interna (versão antiga)

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/user` |
| Método | GET |
| Autenticação | Copilot Session Token |
| Localização no código | `plugin/lib/copilot.ts:242-304` |

**Cabeçalhos da solicitação**:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Exemplo de resposta**:

```json
{
  "copilot_plan": "pro",
  "quota_reset_date": "2026-02-01",
  "quota_snapshots": {
    "premium_interactions": {
      "entitlement": 300,
      "overage_count": 0,
      "overage_permitted": true,
      "percent_remaining": 24,
      "quota_id": "premium_interactions",
      "quota_remaining": 71,
      "remaining": 71,
      "unlimited": false
    },
    "chat": {
      "entitlement": 1000,
      "percent_remaining": 50,
      "quota_remaining": 500,
      "unlimited": false
    },
    "completions": {
      "entitlement": 2000,
      "percent_remaining": 80,
      "quota_remaining": 1600,
      "unlimited": false
    }
  }
}
```

**Explicação dos campos de resposta**:

- `copilot_plan`: Tipo de assinatura (`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: Data de redefinição da cota (YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests (cota principal)
- `quota_snapshots.chat`: Cota de Chat (se calculada separadamente)
- `quota_snapshots.completions`: Cota de Completions (se calculada separadamente)

---

### 3. API de troca de Token

**Informações da API**:

| Item | Valor |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/v2/token` |
| Método | POST |
| Autenticação | OAuth Token (obtido do OpenCode) |
| Localização no código | `plugin/lib/copilot.ts:183-208` |

**Cabeçalhos da solicitação**:

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Exemplo de resposta**:

```json
{
  "token": "gho_xxx_copilot_session",
  "expires_at": 1706203600,
  "refresh_in": 3600,
  "endpoints": {
    "api": "https://api.github.com"
  }
}
```

**Explicação dos campos de resposta**:

- `token`: Copilot Session Token (usado para chamar a API interna)
- `expires_at`: Carimbo de data/hora de expiração (em segundos)
- `refresh_in`: Tempo sugerido para atualização (em segundos)

::: warning Atenção
Esta API se aplica apenas ao fluxo de autenticação OAuth antigo do GitHub. O novo fluxo de autenticação de parceiros oficiais do OpenCode (a partir de janeiro de 2026) pode exigir o uso de Fine-grained PAT.
:::

---

## Comparação de métodos de autenticação

| Plataforma | Método de autenticação | Fonte de credencial | Arquivo de credencial |
|--- | --- | --- | ---|
| **OpenAI** | OAuth Bearer Token | OpenCode OAuth | `~/.local/share/opencode/auth.json` |
| **Zhipu AI** | API Key | Configuração manual do usuário | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | Configuração manual do usuário | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | Plugin opencode-antigravity-auth | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | Configuração manual do usuário ou OAuth | `~/.config/opencode/copilot-quota-token.json` ou `~/.local/share/opencode/auth.json` |

---

## Tempo limite de solicitação

Todas as solicitações de API têm um limite de tempo de 10 segundos para evitar longas esperas:

| Configuração | Valor | Localização no código |
|--- | --- | ---|
| Tempo limite | 10 segundos | `plugin/lib/types.ts:114` |
| Implementação de tempo limite | Função `fetchWithTimeout` | `plugin/lib/utils.ts:84-100` |

---

## Segurança

### Mascaramento de API Key

O plugin mascara automaticamente a API Key ao exibi-la, mostrando apenas os primeiros e últimos 2 caracteres:

```typescript
// Exemplo: sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**Localização no código**: `plugin/lib/utils.ts:130-139`

### Armazenamento de dados

- Todos os arquivos de autenticação são **apenas leitura**, o plugin não modifica nenhum arquivo
- Os dados de resposta da API **não são armazenados em cache**, **não são salvos**
- Informações sensíveis (API Key, Token) são mascaradas na memória antes de serem exibidas

**Localização no código**:
- `plugin/mystatus.ts:35-46` (leitura de arquivos de autenticação)
- `plugin/lib/utils.ts:130-139` (função de mascaramento)

---

## Resumo desta seção

Esta seção apresentou todas as APIs oficiais chamadas pelo plugin opencode-mystatus:

| Plataforma | Número de APIs | Método de autenticação |
|--- | --- | ---|
| OpenAI | 1 | OAuth Bearer Token |
| Zhipu AI | 1 | API Key |
| Z.ai | 1 | API Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

Todas as APIs são APIs oficiais de cada plataforma, garantindo fontes de dados confiáveis e seguras. O plugin obtém credenciais por meio de arquivos de autenticação local apenas leitura e não carrega nenhum dado.

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| API de consulta de cota OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| API de consulta de cota Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| API de consulta de cota Z.ai | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64 (API compartilhada) |
| Atualização de token OAuth Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| API de consulta de cota Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| API de cobrança pública GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| API de cota interna GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| API de troca de token GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Função de mascaramento de API Key | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| Configuração de tempo limite de solicitação | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**Constantes principais**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: API de consulta de cota OpenAI
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`: API de consulta de cota Zhipu AI
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`: API de consulta de cota Z.ai
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: API de consulta de cota Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: API de atualização de token OAuth Google Cloud

**Funções principais**:

- `fetchOpenAIUsage()`: Chama a API de cota OpenAI
- `fetchUsage()`: Chama a API de cota Zhipu AI / Z.ai (genérica)
- `refreshAccessToken()`: Atualiza o Google Access Token
- `fetchGoogleUsage()`: Chama a API de cota Google Cloud
- `fetchPublicBillingUsage()`: Chama a API de cobrança pública GitHub Copilot
- `fetchCopilotUsage()`: Chama a API de cota interna GitHub Copilot
- `exchangeForCopilotToken()`: Troca OAuth Token por Copilot Session Token
- `maskString()`: Mascarar API Key

</details>
