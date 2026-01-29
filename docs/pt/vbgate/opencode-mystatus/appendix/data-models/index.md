---
title: "Modelos de Dados: Autenticação e API | opencode-mystatus"
sidebarTitle: "Modelos de Dados"
subtitle: "Modelos de dados: estrutura de arquivo de autenticação e formato de resposta da API"
description: "Entenda a estrutura dos arquivos de autenticação e os formatos de resposta da API. Referência de modelos de dados para OpenAI, Zhipu AI, GitHub Copilot e Google Cloud."
tags:
  - "modelos de dados"
  - "arquivo de autenticação"
  - "resposta da API"
prerequisite:
  - "start-quick-start"
order: 1
---

# Modelos de dados: estrutura de arquivo de autenticação e formato de resposta da API

> 💡 **Este apêndice é para desenvolvedores**: Se você quiser entender como o plugin lê e analisa arquivos de autenticação ou deseja estender o suporte para mais plataformas, aqui está uma referência completa de modelos de dados.

## O que você poderá fazer após concluir

- Entender quais arquivos de autenticação o plugin lê
- Compreender os formatos de resposta da API de cada plataforma
- Saber como estender o plugin para suportar novas plataformas

## Conteúdo deste apêndice

- Estrutura de arquivos de autenticação (3 arquivos de configuração)
- Formatos de resposta da API (5 plataformas)
- Tipos de dados internos

---

## Estrutura de arquivos de autenticação

### Arquivo de autenticação principal: `~/.local/share/opencode/auth.json`

Armazenamento de autenticação oficial do OpenCode, o plugin lê as informações de autenticação do OpenAI, Zhipu AI, Z.ai e GitHub Copilot daqui.

```typescript
interface AuthData {
  /** Autenticação OpenAI OAuth */
  openai?: OpenAIAuthData;

  /** Autenticação de API Zhipu AI */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Autenticação de API Z.ai */
  "zai-coding-plan"?: ZhipuAuthData;

  /** Autenticação GitHub Copilot OAuth */
  "github-copilot"?: CopilotAuthData;
}
```

#### Dados de autenticação OpenAI

```typescript
interface OpenAIAuthData {
  type: string;        // Valor fixo "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // Carimbo de data/hora de expiração (milissegundos)
}
```

**Fonte de dados**: Fluxo de autenticação OAuth oficial do OpenCode

#### Dados de autenticação Zhipu AI / Z.ai

```typescript
interface ZhipuAuthData {
  type: string;   // Valor fixo "api"
  key?: string;    // API Key
}
```

**Fonte de dados**: API Key configurada pelo usuário no OpenCode

#### Dados de autenticação GitHub Copilot

```typescript
interface CopilotAuthData {
  type: string;        // Valor fixo "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token (opcional)
  expires?: number;    // Carimbo de data/hora de expiração (milissegundos)
}
```

**Fonte de dados**: Fluxo de autenticação OAuth oficial do OpenCode

---

### Configuração PAT Copilot: `~/.config/opencode/copilot-quota-token.json`

Fine-grained PAT (Personal Access Token) configurado opcionalmente pelo usuário, usado para consultar a cota por meio da API pública do GitHub (não requer permissões do Copilot).

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT (requer permissão de leitura "Plan") */
  token: string;

  /** Nome de usuário do GitHub (necessário para chamadas de API) */
  username: string;

  /** Tipo de assinatura Copilot (determina o limite mensal de cota) */
  tier: CopilotTier;
}

/** Enumeração de tipos de assinatura Copilot */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**Limites de cota para cada tipo de assinatura**:

| tier | Limite mensal (Premium Requests) |
|--- | ---|
| `free` | 50 |
| `pro` | 300 |
| `pro+` | 1.500 |
| `business` | 300 |
| `enterprise` | 1.000 |

---

### Contas Google Cloud: `~/.config/opencode/antigravity-accounts.json`

Arquivo de contas criado pelo plugin `opencode-antigravity-auth`, suporta múltiplas contas.

```typescript
interface AntigravityAccountsFile {
  version: number;               // Número da versão do formato do arquivo
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** E-mail do Google (para exibição) */
  email?: string;

  /** OAuth Refresh Token (obrigatório) */
  refreshToken: string;

  /** ID do projeto Google (um dos dois) */
  projectId?: string;

  /** ID do projeto gerenciado (um dos dois) */
  managedProjectId?: string;

  /** Carimbo de data/hora de adição da conta (milissegundos) */
  addedAt: number;

  /** Carimbo de data/hora do último uso (milissegundos) */
  lastUsed: number;

  /** Tempos de redefinição de cada modelo (chave do modelo → carimbo de data/hora) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**Fonte de dados**: Fluxo de autenticação OAuth do plugin `opencode-antigravity-auth`

---

## Formatos de resposta da API

### Formato de resposta OpenAI

**Endpoint da API**: `GET https://chatgpt.com/backend-api/wham/usage`

**Autenticação**: Bearer Token (OAuth Access Token)

```typescript
interface OpenAIUsageResponse {
  /** Tipo de plano: plus, team, pro, etc. */
  plan_type: string;

  /** Informações de limite de cota */
  rate_limit: {
    /** Se o limite foi atingido */
    limit_reached: boolean;

    /** Janela principal (3 horas) */
    primary_window: RateLimitWindow;

    /** Janela secundária (24 horas, opcional) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** Informações da janela de limite */
interface RateLimitWindow {
  /** Porcentagem usada */
  used_percent: number;

  /** Duração da janela de limite (segundos) */
  limit_window_seconds: number;

  /** Segundos até a redefinição */
  reset_after_seconds: number;
}
```

**Exemplo de resposta**:

```json
{
  "plan_type": "team",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9000
    },
    "secondary_window": {
      "used_percent": 23,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 43200
    }
  }
}
```

---

### Formato de resposta Zhipu AI / Z.ai

**Endpoints da API**:
- Zhipu AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Autenticação**: Header de autorização (API Key)

```typescript
interface QuotaLimitResponse {
  code: number;   // 200 em caso de sucesso
  msg: string;    // Mensagem de erro ("success" em caso de sucesso)
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** Item de limite único */
interface UsageLimitItem {
  /** Tipo de limite */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** Valor atual */
  currentValue: number;

  /** Valor total */
  usage: number;

  /** Porcentagem usada */
  percentage: number;

  /** Carimbo de data/hora da próxima redefinição (milissegundos, apenas válido para TOKENS_LIMIT) */
  nextResetTime?: number;
}
```

**Explicação dos tipos de limite**:

| type | Descrição | Ciclo de redefinição |
|--- | --- | ---|
| `TOKENS_LIMIT` | Limite de tokens de 5 horas | 5 horas |
| `TIME_LIMIT` | Cota mensal de MCP | 1 mês |

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
        "currentValue": 500000,
        "usage": 10000000,
        "percentage": 5,
        "nextResetTime": 1737926400000
      },
      {
        "type": "TIME_LIMIT",
        "currentValue": 120,
        "usage": 2000,
        "percentage": 6
      }
    ]
  }
}
```

---

### Formato de resposta GitHub Copilot

O Copilot suporta dois métodos de consulta de API, com formatos de resposta diferentes.

#### Método 1: API interna (requer permissões do Copilot)

**Endpoint da API**: `GET https://api.github.com/copilot_internal/user`

**Autenticação**: Bearer Token (OAuth ou Token após a troca de Token)

```typescript
interface CopilotUsageResponse {
  /** Tipo de SKU (para distinguir assinaturas) */
  access_type_sku: string;

  /** ID de rastreamento de análise */
  analytics_tracking_id: string;

  /** Data de atribuição */
  assigned_date: string;

  /** Se pode se inscrever em planos limitados */
  can_signup_for_limited: boolean;

  /** Se o chat está habilitado */
  chat_enabled: boolean;

  /** Tipo de plano Copilot */
  copilot_plan: string;

  /** Data de redefinição da cota (formato: YYYY-MM) */
  quota_reset_date: string;

  /** Snapshot de cota */
  quota_snapshots: QuotaSnapshots;
}

/** Snapshot de cota */
interface QuotaSnapshots {
  /** Cota de chat (opcional) */
  chat?: QuotaDetail;

  /** Cota de completions (opcional) */
  completions?: QuotaDetail;

  /** Premium Interactions (obrigatório) */
  premium_interactions: QuotaDetail;
}

/** Detalhes da cota */
interface QuotaDetail {
  /** Limite de cota */
  entitlement: number;

  /** Contagem de excesso */
  overage_count: number;

  /** Se o excesso é permitido */
  overage_permitted: boolean;

  /** Porcentagem restante */
  percent_remaining: number;

  /** ID da cota */
  quota_id: string;

  /** Cota restante */
  quota_remaining: number;

  /** Quantidade restante (igual a quota_remaining) */
  remaining: number;

  /** Se é ilimitado */
  unlimited: boolean;
}
```

#### Método 2: API de cobrança pública (requer Fine-grained PAT)

**Endpoint da API**: `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**Autenticação**: Bearer Token (Fine-grained PAT, requer permissão de leitura "Plan")

```typescript
interface BillingUsageResponse {
  /** Período de tempo */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** Nome de usuário */
  user: string;

  /** Lista de itens de uso */
  usageItems: BillingUsageItem[];
}

/** Item de uso */
interface BillingUsageItem {
  /** Nome do produto */
  product: string;

  /** Identificador SKU */
  sku: string;

  /** Nome do modelo (opcional) */
  model?: string;

  /** Tipo de unidade (como "requests") */
  unitType: string;

  /** Quantidade total de solicitações (antes de descontos) */
  grossQuantity: number;

  /** Quantidade líquida de solicitações (após descontos) */
  netQuantity: number;

  /** Limite de cota (opcional) */
  limit?: number;
}
```

**Exemplo de resposta**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "octocat",
  "usageItems": [
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4o",
      "unitType": "requests",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3-5-sonnet",
      "unitType": "requests",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

---

### Formato de resposta Google Cloud

**Endpoint da API**: `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**Autenticação**: Bearer Token (OAuth Access Token)

**Corpo da solicitação**:

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** Lista de modelos (chave é o ID do modelo) */
  models: Record<
    string,
    {
      /** Informações de cota (opcional) */
      quotaInfo?: {
        /** Fração restante (0-1) */
        remainingFraction?: number;

        /** Tempo de redefinição (formato ISO 8601) */
        resetTime?: string;
      };
    }
  >;
}
```

**Exemplo de resposta**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 0.83,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.91,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-flash": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T00:00:00Z"
      }
    }
  }
}
```

**4 modelos exibidos**:

| Nome de exibição | Chave do modelo | Chave alternativa |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

---

## Tipos de dados internos

### Tipo de resultado de consulta

Todas as funções de consulta de plataforma retornam um formato de resultado unificado.

```typescript
interface QueryResult {
  /** Se foi bem-sucedido */
  success: boolean;

  /** Conteúdo de saída em caso de sucesso */
  output?: string;

  /** Informação de erro em caso de falha */
  error?: string;
}
```

### Configurações de constantes

```typescript
/** Limiar de aviso de alto uso (porcentagem) */
export const HIGH_USAGE_THRESHOLD = 80;

/** Tempo limite de solicitação de API (milissegundos) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Tipos de dados de autenticação | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104) | 99-104 |
| Autenticação OpenAI | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |
| Autenticação Zhipu AI | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41) | 38-41 |
| Autenticação Copilot | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51) | 46-51 |
| Configuração PAT Copilot | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73) | 66-73 |
| Contas Antigravity | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94) | 78-94 |
| Formato de resposta OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36) | 29-36 |
| Formato de resposta Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50) | 43-50 |
| API interna Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58) | 47-58 |
| API de cobrança Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84) | 80-84 |
| Resposta Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37) | 27-37 |

**Constantes principais**:
- `HIGH_USAGE_THRESHOLD = 80`: Limiar de aviso de alto uso (types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000`: Tempo limite de solicitação de API (types.ts:114)

**Tipos principais**:
- `QueryResult`: Tipo de resultado de consulta (types.ts:15-19)
- `CopilotTier`: Enumeração de tipos de assinatura Copilot (types.ts:57)

</details>
