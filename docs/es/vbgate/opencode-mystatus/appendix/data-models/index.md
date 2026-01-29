---
title: "Modelos de datos: estructura y formatos | opencode-mystatus"
sidebarTitle: "Modelos de datos"
subtitle: "Modelos de datos: estructura de archivos y formatos de respuesta"
description: "Conoce cómo el plugin opencode-mystatus lee archivos de autenticación (auth.json, antigravity-accounts.json, copilot-quota-token.json) y analiza formatos de respuesta de API de OpenAI, Zhipu AI, Z.ai, GitHub Copilot y Google Cloud."
tags:
  - "modelos de datos"
  - "archivos de autenticación"
  - "respuesta de API"
prerequisite:
  - "start-quick-start"
order: 1
---

# Modelos de datos: estructura de archivos de autenticación y formatos de respuesta de API

> 💡 **Este apéndice es para desarrolladores**: Si quieres comprender cómo el plugin lee y analiza los archivos de autenticación, o quieres extender el soporte para más plataformas, aquí encontrarás una referencia completa de los modelos de datos.

## Lo que aprenderás

- Conocer qué archivos de autenticación lee el plugin
- Comprender los formatos de respuesta de API de cada plataforma
- Saber cómo extender el plugin para soportar nuevas plataformas

## Contenido de este apéndice

- Estructura de archivos de autenticación (3 archivos de configuración)
- Formatos de respuesta de API (5 plataformas)
- Tipos de datos internos

---

## Estructura de archivos de autenticación

### Archivo de autenticación principal: `~/.local/share/opencode/auth.json`

Almacenamiento oficial de autenticación de OpenCode, el plugin lee desde aquí la información de autenticación de OpenAI、Zhipu AI、Z.ai y GitHub Copilot.

```typescript
interface AuthData {
  /** Autenticación OAuth de OpenAI */
  openai?: OpenAIAuthData;

  /** Autenticación API de Zhipu AI */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Autenticación API de Z.ai */
  "zai-coding-plan"?: ZhipuAuthData;

  /** Autenticación OAuth de GitHub Copilot */
  "github-copilot"?: CopilotAuthData;
}
```

#### Datos de autenticación de OpenAI

```typescript
interface OpenAIAuthData {
  type: string;        // Valor fijo "oauth"
  access?: string;     // Token de acceso OAuth
  refresh?: string;    // Token de actualización OAuth
  expires?: number;    // Marca de tiempo de expiración (milisegundos)
}
```

**Fuente de datos**: Flujo de autenticación OAuth oficial de OpenCode

#### Datos de autenticación de Zhipu AI / Z.ai

```typescript
interface ZhipuAuthData {
  type: string;   // Valor fijo "api"
  key?: string;    // API Key
}
```

**Fuente de datos**: API Key configurada manualmente por el usuario en OpenCode

#### Datos de autenticación de GitHub Copilot

```typescript
interface CopilotAuthData {
  type: string;        // Valor fijo "oauth"
  refresh?: string;     // Token OAuth
  access?: string;      // Token de sesión de Copilot (opcional)
  expires?: number;    // Marca de tiempo de expiración (milisegundos)
}
```

**Fuente de datos**: Flujo de autenticación OAuth oficial de OpenCode

---

### Configuración de PAT de Copilot: `~/.config/opencode/copilot-quota-token.json`

Configuración opcional de Fine-grained PAT del usuario, usada para consultar la cuota a través de la API pública de GitHub (no necesita permiso de Copilot).

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT (necesita permiso de lectura de "Plan") */
  token: string;

  /** Nombre de usuario de GitHub (necesario para llamadas a la API) */
  username: string;

  /** Tipo de suscripción de Copilot (determina el límite mensual) */
  tier: CopilotTier;
}

/** Enumeración de tipos de suscripción de Copilot */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**Límites de cuota por cada tipo de suscripción**:

| tier      | Cuota mensual (Premium Requests) |
| --------- | --------------------------- |
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Cuentas de Google Cloud: `~/.config/opencode/antigravity-accounts.json`

Archivo de cuentas creado por el plugin `opencode-antigravity-auth`, soporta múltiples cuentas.

```typescript
interface AntigravityAccountsFile {
  version: number;               // Número de versión del formato del archivo
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Correo de Google (usado para mostrar) */
  email?: string;

  /** Token de actualización OAuth (obligatorio) */
  refreshToken: string;

  /** ID del proyecto de Google (opcional, uno de los dos) */
  projectId?: string;

  /** ID del proyecto administrado (opcional, uno de los dos) */
  managedProjectId?: string;

  /** Marca de tiempo de agregación de la cuenta (milisegundos) */
  addedAt: number;

  /** Marca de tiempo del último uso (milisegundos) */
  lastUsed: number;

  /** Tiempos de restablecimiento de cada modelo (key de modelo → marca de tiempo) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**Fuente de datos**: Flujo de autenticación OAuth del plugin `opencode-antigravity-auth`

---

## Formatos de respuesta de API

### Formato de respuesta de OpenAI

**Endpoint de API**: `GET https://chatgpt.com/backend-api/wham/usage`

**Método de autenticación**: Token de portador (Token de acceso OAuth)

```typescript
interface OpenAIUsageResponse {
  /** Tipo de plan: plus, team, pro, etc. */
  plan_type: string;

  /** Información de límites de cuota */
  rate_limit: {
    /** Si se ha alcanzado el límite */
    limit_reached: boolean;

    /** Ventana principal (3 horas) */
    primary_window: RateLimitWindow;

    /** Ventana secundaria (24 horas, opcional) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** Información de ventana de límite */
interface RateLimitWindow {
  /** Porcentaje de uso */
  used_percent: number;

  /** Duración de la ventana de límite (segundos) */
  limit_window_seconds: number;

  /** Segundos hasta el restablecimiento */
  reset_after_seconds: number;
}
```

**Ejemplo de respuesta**:

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

### Formato de respuesta de Zhipu AI / Z.ai

**Endpoint de API**:
- Zhipu AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Método de autenticación**: Encabezado de Authorization (API Key)

```typescript
interface QuotaLimitResponse {
  code: number;   // Éxito: 200
  msg: string;    // Mensaje de error (éxito: "success")
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** Elemento individual de límite */
interface UsageLimitItem {
  /** Tipo de límite */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** Valor actual */
  currentValue: number;

  /** Valor total */
  usage: number;

  /** Porcentaje de uso */
  percentage: number;

  /** Marca de tiempo del siguiente restablecimiento (milisegundos, solo válido para TOKENS_LIMIT) */
  nextResetTime?: number;
}
```

**Explicación de tipos de límite**:

| type          | Descripción               | Ciclo de restablecimiento  |
| ------------- | ------------------ | --------- |
| `TOKENS_LIMIT` | Límite de tokens de 5 horas  | 5 horas   |
| `TIME_LIMIT`   | Cuota mensual de MCP      | 1 mes   |

**Ejemplo de respuesta**:

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

### Formato de respuesta de GitHub Copilot

Copilot soporta dos métodos de consulta de API, con diferentes formatos de respuesta.

#### Método 1: API interna (necesita permiso de Copilot)

**Endpoint de API**: `GET https://api.github.com/copilot_internal/user`

**Método de autenticación**: Token de portador (Token OAuth o Token intercambiado)

```typescript
interface CopilotUsageResponse {
  /** Tipo de SKU (usado para distinguir suscripciones) */
  access_type_sku: string;

  /** ID de seguimiento de análisis */
  analytics_tracking_id: string;

  /** Fecha de asignación */
  assigned_date: string;

  /** Si se puede registrar para planes limitados */
  can_signup_for_limited: boolean;

  /** Si el chat está habilitado */
  chat_enabled: boolean;

  /** Tipo de plan de Copilot */
  copilot_plan: string;

  /** Fecha de restablecimiento de cuota (formato: YYYY-MM-DD) */
  quota_reset_date: string;

  /** Instantáneas de cuota */
  quota_snapshots: QuotaSnapshots;
}

/** Instantáneas de cuota */
interface QuotaSnapshots {
  /** Cuota de chat (opcional) */
  chat?: QuotaDetail;

  /** Cuota de completions (opcional) */
  completions?: QuotaDetail;

  /** Premium Interactions (obligatorio) */
  premium_interactions: QuotaDetail;
}

/** Detalles de cuota */
interface QuotaDetail {
  /** Límite de cuota */
  entitlement: number;

  /** Recuento de uso excesivo */
  overage_count: number;

  /** Si se permite uso excesivo */
  overage_permitted: boolean;

  /** Porcentaje restante */
  percent_remaining: number;

  /** ID de cuota */
  quota_id: string;

  /** Cuota restante */
  quota_remaining: number;

  /** Cantidad restante (igual a quota_remaining) */
  remaining: number;

  /** Si es ilimitado */
  unlimited: boolean;
}
```

#### Método 2: API pública de Billing (necesita Fine-grained PAT)

**Endpoint de API**: `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**Método de autenticación**: Token de portador (Fine-grained PAT, necesita permiso de lectura de "Plan")

```typescript
interface BillingUsageResponse {
  /** Período de tiempo */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** Nombre de usuario */
  user: string;

  /** Lista de elementos de uso */
  usageItems: BillingUsageItem[];
}

/** Elemento de uso */
interface BillingUsageItem {
  /** Nombre del producto */
  product: string;

  /** Identificador de SKU */
  sku: string;

  /** Nombre del modelo (opcional) */
  model?: string;

  /** Tipo de unidad (como "requests") */
  unitType: string;

  /** Cantidad bruta de solicitudes (antes de descuentos) */
  grossQuantity: number;

  /** Cantidad neta de solicitudes (después de aplicar descuentos) */
  netQuantity: number;

  /** Límite de cuota (opcional) */
  limit?: number;
}
```

**Ejemplo de respuesta**:

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
      "model": "claude-3.5-sonnet",
      "unitType": "requests",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

---

### Formato de respuesta de Google Cloud

**Endpoint de API**: `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**Método de autenticación**: Token de portador (Token de acceso OAuth)

**Cuerpo de solicitud**:

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** Lista de modelos (clave es el nombre del modelo) */
  models: Record<
    string,
    {
      /** Información de cuota (opcional) */
      quotaInfo?: {
        /** Porción restante (0-1) */
        remainingFraction?: number;

        /** Tiempo de restablecimiento (formato ISO 8601) */
        resetTime?: string;
      };
    }
  >;
}
```

**Ejemplo de respuesta**:

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

**4 modelos mostrados**:

| Nombre de visualización     | Modelo Key                                  | Key alternativo              |
| ------------ | ----------------------------------------- | --------------------- |
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## Tipos de datos internos

### Tipo de resultado de consulta

Todas las funciones de consulta de plataforma devuelven un formato de resultado unificado.

```typescript
interface QueryResult {
  /** Si fue exitoso */
  success: boolean;

  /** Contenido de salida cuando es exitoso */
  output?: string;

  /** Mensaje de error cuando falla */
  error?: string;
}
```

### Constantes de configuración

```typescript
/** Umbral de advertencia de uso alto (porcentaje) */
export const HIGH_USAGE_THRESHOLD = 80;

/** Tiempo de espera de solicitud de API (milisegundos) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función              | Ruta de archivo                                                                                              | Línea    |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------- |
| Tipos de datos de autenticación      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| Autenticación de OpenAI       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| Autenticación de Zhipu AI      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Autenticación de Copilot      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Configuración de PAT de Copilot  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Cuentas de Antigravity     | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| Respuesta de OpenAI        | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| Respuesta de Zhipu AI       | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| API interna de Copilot     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| API pública de Billing      | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Respuesta de Google Cloud  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**Constantes clave**:
- `HIGH_USAGE_THRESHOLD = 80`：Umbral de advertencia de uso alto (types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000`：Tiempo de espera de solicitud de API en milisegundos (types.ts:114)

**Tipos clave**:
- `QueryResult`：Tipo de resultado de consulta (types.ts:15-19)
- `CopilotTier`：Enumeración de tipos de suscripción de Copilot (types.ts:57)

</details>
