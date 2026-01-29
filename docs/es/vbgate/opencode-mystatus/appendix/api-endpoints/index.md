---
title: "API: Resumen de endpoints | opencode-mystatus"
sidebarTitle: "API endpoints"
subtitle: "API: Resumen de endpoints | opencode-mystatus"
description: "Aprende todos los endpoints de API oficiales usados por opencode-mystatus. Incluye métodos de autenticación, formatos de solicitud y estructuras de respuesta para OpenAI, Zhipu AI, Z.ai, Google Cloud y GitHub Copilot."
tags:
  - "api"
  - "endpoints"
  - "referencia"
prerequisite:
  - "appendix-data-models"
order: 2
---

# Resumen de endpoints de API

## Lo que aprenderás

- Conocer todos los endpoints de API oficiales llamados por el plugin
- Comprender los métodos de autenticación de cada plataforma (OAuth / API Key)
- Dominar los formatos de solicitud y las estructuras de datos de respuesta
- Saber cómo llamar independientemente a estas APIs

## Qué es un endpoint de API

Los endpoints de API (Interfaz de Programación de Aplicaciones) son puentes de comunicación entre programas. opencode-mystatus obtiene los datos de cuota de tu cuenta llamando a los endpoints de API oficiales de cada plataforma.

::: info ¿Por qué conocer estos endpoints?
Conocer estos endpoints te permite:
1. Verificar el origen de los datos del plugin, asegurando la seguridad
2. Llamar manualmente a los endpoints para obtener datos cuando el plugin no esté disponible
3. Aprender cómo construir herramientas similares de consulta de cuota
:::

## Endpoint de OpenAI

### Consulta de cuota

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Método | GET |
| Método de autenticación | Bearer Token (OAuth) |
| Ubicación en código fuente | `plugin/lib/openai.ts:127-155` |

**Encabezados de solicitud**:

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // Opcional, necesario para cuentas de equipo
```

**Ejemplo de respuesta**:

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

**Explicación de campos de respuesta**:

- `plan_type`: Tipo de suscripción (Plus / Team / Pro）
- `rate_limit.primary_window`: Límite de ventana principal (generalmente 3 horas)
- `rate_limit.secondary_window`: Límite de ventana secundaria (generalmente 24 horas)
- `used_percent`: Porcentaje de uso (0-100)
- `reset_after_seconds`: Segundos restantes hasta el restablecimiento

---

## Endpoint de Zhipu AI

### Consulta de cuota

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Método | GET |
| Método de autenticación | API Key |
| Ubicación en código fuente | `plugin/lib/zhipu.ts:62-106` |

**Encabezados de solicitud**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

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

**Explicación de campos de respuesta**:

- `limits[].type`: Tipo de límite
  - `TOKENS_LIMIT`: Límite de tokens de 5 horas
  - `TIME_LIMIT`: Cuota mensual de MCP (búsqueda)
- `usage`: Cuota total
- `currentValue`: Uso actual
- `percentage`: Porcentaje de uso (0-100)
- `nextResetTime`: Marca de tiempo del siguiente restablecimiento (solo válida para TOKENS_LIMIT, unidad: milisegundos)

---

## Endpoint de Z.ai

### Consulta de cuota

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Método | GET |
| Método de autenticación | API Key |
| Ubicación en código fuente | `plugin/lib/zhipu.ts:64, 85-106` |

**Encabezados de solicitud**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Formato de respuesta**: Igual que Zhipu AI, ver arriba.

---

## Endpoint de Google Cloud

### 1. Refrescar Access Token

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://oauth2.googleapis.com/token` |
| Método | POST |
| Método de autenticación | OAuth Refresh Token |
| Ubicación en código fuente | `plugin/lib/google.ts:90, 162-184` |

**Encabezados de solicitud**:

```http
Content-Type: application/x-www-form-urlencoded
```

**Cuerpo de solicitud**:

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**Ejemplo de respuesta**:

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**Explicación de campos**:

- `access_token`: Nuevo Access Token (válido por 1 hora)
- `expires_in`: Tiempo de expiración (segundos)

---

### 2. Consultar cuota de modelos disponibles

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Método | POST |
| Método de autenticación | Bearer Token (OAuth) |
| Ubicación en código fuente | `plugin/lib/google.ts:65, 193-213` |

**Encabezados de solicitud**:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**Cuerpo de solicitud**:

```json
{
  "project": "{project_id}"
}
```

**Ejemplo de respuesta**:

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

**Explicación de campos de respuesta**:

- `models`: Lista de modelos (la clave es el nombre del modelo)
- `quotaInfo.remainingFraction`: Porción restante (0.0-1.0)
- `quotaInfo.resetTime`: Tiempo de restablecimiento (formato ISO 8601)

---

## Endpoint de GitHub Copilot

### 1. API pública de Billing (recomendado)

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Método | GET |
| Método de autenticación | Fine-grained PAT (Personal Access Token) |
| Ubicación en código fuente | `plugin/lib/copilot.ts:157-177` |

**Encabezados de solicitud**:

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip ¿Qué es un Fine-grained PAT?
Un Fine-grained PAT (Fine-grained Personal Access Token) es el nuevo tipo de token de GitHub que permite un control de permisos más granular. Para consultar la cuota de Copilot, necesitas otorgar el permiso de lectura de "Plan".
:::

**Ejemplo de respuesta**:

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

**Explicación de campos de respuesta**:

- `timePeriod`: Período de tiempo (año, mes)
- `user`: Nombre de usuario de GitHub
- `usageItems`: Array de detalles de uso
  - `sku`: Nombre del SKU (`Copilot Premium Request` indica Premium Requests)
  - `model`: Nombre del modelo
  - `grossQuantity`: Solicitudes totales (antes de descuentos)
  - `netQuantity`: Solicitudes netas (después de aplicar descuentos)
  - `limit`: Cuota

---

### 2. API interna de cuota (versión antigua)

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/user` |
| Método | GET |
| Método de autenticación | Copilot Session Token |
| Ubicación en código fuente | `plugin/lib/copilot.ts:242-304` |

**Encabezados de solicitud**:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Ejemplo de respuesta**:

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

**Explicación de campos de respuesta**:

- `copilot_plan`: Tipo de suscripción (`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: Fecha de restablecimiento de cuota (formato YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests (cuota principal)
- `quota_snapshots.chat`: Cuota de Chat (si se calcula por separado)
- `quota_snapshots.completions`: Cuota de Completions (si se calcula por separado)

---

### 3. API de intercambio de Token

**Información del endpoint**:

| Artículo | Valor |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/v2/token` |
| Método | POST |
| Método de autenticación | OAuth Token (obtenido de OpenCode) |
| Ubicación en código fuente | `plugin/lib/copilot.ts:183-208` |

**Encabezados de solicitud**:

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Ejemplo de respuesta**:

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

**Explicación de campos de respuesta**:

- `token`: Copilot Session Token (usado para llamar a la API interna)
- `expires_at`: Marca de tiempo de expiración (segundos)
- `refresh_in`: Tiempo recomendado para refrescar (segundos)

::: warning Advertencia
Este endpoint solo es aplicable al flujo de autenticación OAuth antiguo de GitHub. El nuevo flujo oficial de partners de OpenCode (a partir de enero de 2026) puede necesitar usar Fine-grained PAT.
:::

---

## Comparación de métodos de autenticación

| Plataforma | Método de autenticación | Fuente de credencial | Archivo de credenciales |
| --- | --- | --- | --- |
| **OpenAI** | OAuth Bearer Token | OAuth de OpenCode | `~/.local/share/opencode/auth.json` |
| **Zhipu AI** | API Key | Configuración manual del usuario | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | Configuración manual del usuario | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | Plugin opencode-antigravity-auth | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | Configuración manual o OAuth | `~/.config/opencode/copilot-quota-token.json` o `~/.local/share/opencode/auth.json` |

---

## Tiempo de espera de solicitud

Todas las solicitudes de API establecen un límite de tiempo de espera de 10 segundos para evitar esperas prolongadas:

| Configuración | Valor | Ubicación en código fuente |
| --- | --- | --- |
| Tiempo de espera | 10 segundos | `plugin/lib/types.ts:114` |
| Implementación de tiempo de espera | Función `fetchWithTimeout` | `plugin/lib/utils.ts:84-100` |

---

## Seguridad

### Enmascaramiento de API Key

El plugin enmascara automáticamente las API Key al mostrar, solo muestra los primeros y últimos 2 caracteres:

```typescript
// Ejemplo: sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**Ubicación en código fuente**: `plugin/lib/utils.ts:130-139`

### Almacenamiento de datos

- Todos los archivos de autenticación son **solo lectura**, el plugin no modifica ningún archivo
- Los datos de respuesta de la API **no se almacenan en caché**, **no se guardan**
- La información sensible (API Key, Token) se enmascara en memoria al mostrar

**Ubicaciones en código fuente**:
- `plugin/mystatus.ts:35-46` (lectura de archivo de autenticación)
- `plugin/lib/utils.ts:130-139` (función de enmascaramiento)

---

## Resumen de esta lección

Esta lección presentó todos los endpoints de API oficiales llamados por el plugin opencode-mystatus:

| Plataforma | Número de API | Método de autenticación |
| --- | --- | --- |
| OpenAI | 1 | OAuth Bearer Token |
| Zhipu AI | 1 | API Key |
| Z.ai | 1 | API Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

Todos los endpoints son interfaces oficiales de cada plataforma, asegurando que el origen de los datos sea confiable y seguro. El plugin obtiene las credenciales leyendo archivos locales de solo lectura, sin subir ningún dato.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| --- | --- | --- |
| API de consulta de cuota de OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| API de consulta de cuota de Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| API de consulta de cuota de Z.ai | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64 (compartido) |
| Refresco de Token OAuth de Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| API de consulta de cuota de Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| API pública de Billing de GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| API interna de cuota de GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| API de intercambio de Token de GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Función de enmascaramiento de API Key | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| Configuración de tiempo de espera de solicitud | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**Constantes clave**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：Endpoint de API de consulta de cuota de OpenAI
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`：Endpoint de API de consulta de cuota de Zhipu AI
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`：Endpoint de API de consulta de cuota de Z.ai
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`：Endpoint de API de consulta de cuota de Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`：Endpoint de refresco de Token OAuth de Google Cloud

**Funciones clave**:

- `fetchOpenAIUsage()`：Llama a la API de cuota de OpenAI
- `fetchUsage()`：Llama a la API de cuota de Zhipu AI / Z.ai (genérica)
- `refreshAccessToken()`：Refresca el Access Token de Google
- `fetchGoogleUsage()`：Llama a la API de cuota de Google Cloud
- `fetchPublicBillingUsage()`：Llama a la API pública de Billing de GitHub Copilot
- `fetchCopilotUsage()`：Llama a la API interna de cuota de GitHub Copilot
- `exchangeForCopilotToken()`：Intercambia OAuth Token por Session Token de Copilot
- `maskString()`：Enmascara la API Key

</details>
