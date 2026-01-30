---
title: "Especificación de API: Referencia Técnica de la Interfaz del Gateway Antigravity | antigravity-auth"
sidebarTitle: "Depurar Llamadas API"
subtitle: "Especificación de la API de Antigravity"
description: "Aprende la especificación de la API de Antigravity, domina la configuración de endpoints del gateway unificado, autenticación OAuth 2.0, formatos de solicitud/respuesta, reglas de llamada a funciones y mecanismos de manejo de errores."
tags:
  - "API"
  - "Especificación"
  - "Antigravity"
  - "Referencia Técnica"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Especificación de la API de Antigravity

> **⚠️ Aviso Importante**: Esta es la **especificación interna de la API** de Antigravity, no documentación pública. Este tutorial está basado en pruebas directas de la API y es adecuado para desarrolladores que necesitan comprender los detalles de la API en profundidad.

Si solo deseas usar el plugin, consulta [Inicio Rápido](/es/NoeFabris/opencode-antigravity-auth/start/quick-install/) y la [Guía de Configuración](/es/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## Qué Aprenderás

- Comprender cómo funciona la API del gateway unificado de Antigravity
- Dominar los formatos de solicitud/respuesta y las limitaciones del JSON Schema
- Saber cómo configurar modelos Thinking y llamadas a funciones
- Entender los mecanismos de límite de tasa y manejo de errores
- Ser capaz de depurar problemas de llamadas a la API

---

## Descripción General de la API de Antigravity

**Antigravity** es la API de gateway unificado de Google que accede a múltiples modelos de IA como Claude y Gemini a través de una interfaz estilo Gemini, proporcionando un formato único y una estructura de respuesta unificada.

::: info Diferencia con Vertex AI
Antigravity **no es** la API directa de modelos de Vertex AI. Es un gateway interno que proporciona:
- Formato de API único (todos los modelos usan el estilo Gemini)
- Acceso a nivel de proyecto (a través de autenticación de Google Cloud)
- Enrutamiento interno a backends de modelos (Vertex AI para Claude, Gemini API para Gemini)
- Formato de respuesta unificado (estructura `candidates[]`)
:::

**Características Principales**:

| Característica | Descripción |
|--- |---|
| **Formato de API Único** | Todos los modelos usan el array `contents` estilo Gemini |
| **Acceso a Nivel de Proyecto** | Requiere un Project ID válido de Google Cloud |
| **Enrutamiento Interno** | Enruta automáticamente al backend correcto (Vertex AI o Gemini API) |
| **Respuesta Unificada** | Todos los modelos devuelven estructura `candidates[]` |
| **Soporte de Thinking** | Claude y Gemini 3 soportan razonamiento extendido |

---

## Endpoints y Rutas

### Entornos de API

| Entorno | URL | Estado | Uso |
|--- | --- | --- | ---|
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Activo | Endpoint principal (consistente con CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Activo | Modelos Gemini CLI, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ No disponible | Obsoleto |

**Ubicación en el código fuente**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### Rutas de API

| Acción | Ruta | Descripción |
|--- | --- |---|
| Generar contenido | `/v1internal:generateContent` | Solicitud sin streaming |
| Generación en streaming | `/v1internal:streamGenerateContent?alt=sse` | Solicitud en streaming (SSE) |
| Cargar asistente de código | `/v1internal:loadCodeAssist` | Descubrimiento de proyecto (obtiene Project ID automáticamente) |
| Onboarding de usuario | `/v1internal:onboardUser` | Onboarding de usuario (generalmente no se usa) |

---

## Métodos de Autenticación

### Flujo OAuth 2.0

```
URL de Autorización: https://accounts.google.com/o/oauth2/auth
URL de Token: https://oauth2.googleapis.com/token
```

### Scopes Requeridos

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Ubicación en el código fuente**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Headers Requeridos

#### Endpoint de Antigravity (Por defecto)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Endpoint de Gemini CLI (Modelos sin sufijo `:antigravity`)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Header Adicional para Solicitudes en Streaming

```http
Accept: text/event-stream
```

**Ubicación en el código fuente**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Formato de Solicitud

### Estructura Básica

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Array Contents (Obligatorio)

::: warning Limitación Importante
Debes usar el **formato estilo Gemini**. El array `messages` estilo Anthropic **no está soportado**.
:::

**Formato Correcto**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Tu mensaje aquí" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Respuesta del asistente" }
      ]
    }
  ]
}
```

**Valores de Role**:
- `user` - Mensajes del usuario/humano
- `model` - Respuesta del modelo (**no** `assistant`)

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| Campo | Tipo | Descripción |
|--- | --- |---|
| `maxOutputTokens` | number | Número máximo de tokens en la respuesta |
| `temperature` | number | Aleatoriedad (0.0 - 2.0) |
| `topP` | number | Umbral de nucleus sampling |
| `topK` | number | Top-K sampling |
| `stopSequences` | string[] | Palabras que detienen la generación |
| `thinkingConfig` | object | Configuración de razonamiento extendido (modelos Thinking) |

### System Instructions

::: warning Limitación de Formato
System Instruction **debe ser un objeto que contenga `parts`**, **no puede** ser una cadena simple.
:::

```json
// ✅ Correcto
{
  "systemInstruction": {
    "parts": [
      { "text": "Eres un asistente útil." }
    ]
  }
}

// ❌ Incorrecto - Devolverá error 400
{
  "systemInstruction": "Eres un asistente útil."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Obtener el clima de una ubicación",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Nombre de la ciudad"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Reglas de Nomenclatura de Funciones

| Regla | Descripción |
|--- |---|
| Primer carácter | Debe ser una letra (a-z, A-Z) o guion bajo (_) |
| Caracteres permitidos | `a-zA-Z0-9`, guion bajo (_), punto (.), dos puntos (:), guion (-) |
| Longitud máxima | 64 caracteres |
| No permitido | Barra (/), espacios, otros caracteres especiales |

**Ejemplos**:
- ✅ `get_weather` - Válido
- ✅ `mcp:mongodb.query` - Válido (se permiten dos puntos y puntos)
- ✅ `read-file` - Válido (se permiten guiones)
- ❌ `mcp/query` - Inválido (no se permiten barras)
- ❌ `123_tool` - Inválido (debe comenzar con letra o guion bajo)

---

## Soporte de JSON Schema

### Funcionalidades Soportadas

| Funcionalidad | Estado | Descripción |
|--- | --- |---|
| `type` | ✅ Soportado | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ Soportado | Propiedades del objeto |
| `required` | ✅ Soportado | Array de campos obligatorios |
| `description` | ✅ Soportado | Descripción del campo |
| `enum` | ✅ Soportado | Valores de enumeración |
| `items` | ✅ Soportado | Schema de elementos del array |
| `anyOf` | ✅ Soportado | Se convierte internamente a `any_of` |
| `allOf` | ✅ Soportado | Se convierte internamente a `all_of` |
| `oneOf` | ✅ Soportado | Se convierte internamente a `one_of` |
| `additionalProperties` | ✅ Soportado | Schema de propiedades adicionales |

### Funcionalidades No Soportadas (Causan Error 400)

::: danger Los siguientes campos causan error 400
- `const` - Usa `enum: [value]` en su lugar
- `$ref` - Define el schema inline
- `$defs` / `definitions` - Define inline
- `$schema` - Elimina estos campos de metadatos
- `$id` - Elimina estos campos de metadatos
- `default` - Elimina estos campos de documentación
- `examples` - Elimina estos campos de documentación
- `title` (anidado) - ⚠️ Puede causar problemas en objetos anidados
:::

```json
// ❌ Incorrecto - Devolverá error 400
{ "type": { "const": "email" } }

// ✅ Correcto - Usa enum en su lugar
{ "type": { "enum": ["email"] } }
```

**Procesamiento Automático del Plugin**: El plugin maneja automáticamente estas conversiones a través de la función `cleanJSONSchemaForAntigravity()` en `request-helpers.ts`.

---

## Formato de Respuesta

### Respuesta Sin Streaming

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Texto de respuesta aquí" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### Respuesta en Streaming (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hola"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " mundo"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Descripción de Campos de Respuesta

| Campo | Descripción |
|--- |---|
| `response.candidates` | Array de candidatos de respuesta |
| `response.candidates[].content.role` | Siempre es `"model"` |
| `response.candidates[].content.parts` | Array de partes de contenido |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | Número de tokens de entrada |
| `response.usageMetadata.candidatesTokenCount` | Número de tokens de salida |
| `response.usageMetadata.totalTokenCount` | Número total de tokens |
| `response.usageMetadata.thoughtsTokenCount` | Número de tokens de Thinking (Gemini) |
| `response.modelVersion` | Modelo realmente utilizado |
| `response.responseId` | ID de solicitud (formato varía según el modelo) |
| `traceId` | ID de rastreo para depuración |

### Formato de Response ID

| Tipo de Modelo | Formato | Ejemplo |
|--- | --- |---|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Estilo Base64 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Estilo Base64 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Respuesta de Function Call

Cuando el modelo quiere llamar a una función:

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "París"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Proporcionar Resultado de Function

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "¿Cómo está el clima?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / Razonamiento Extendido

### Configuración de Thinking

Para modelos que soportan Thinking (`*-thinking`):

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning Limitación Importante
`maxOutputTokens` debe ser **mayor que** `thinkingBudget`
:::

### Respuesta de Thinking (Gemini)

Los modelos Gemini devuelven thinking con firma:

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Déjame pensar en esto..."
    },
    {
      "text": "La respuesta es..."
    }
  ]
}
```

### Respuesta de Thinking (Claude)

Los modelos thinking de Claude pueden incluir partes con `thought: true`:

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Proceso de razonamiento...",
      "thoughtSignature": "..."
    },
    {
      "text": "Respuesta final..."
    }
  ]
}
```

**Procesamiento del Plugin**: El plugin almacena automáticamente en caché las firmas de thinking para evitar errores de firma en conversaciones de múltiples turnos. Ver [advanced/session-recovery/](/es/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/) para más detalles.

---

## Respuestas de Error

### Estructura de Error

```json
{
  "error": {
    "code": 400,
    "message": "Descripción del error",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### Códigos de Error Comunes

| Código | Estado | Descripción |
|--- | --- |---|
| 400 | `INVALID_ARGUMENT` | Formato de solicitud inválido |
| 401 | `UNAUTHENTICATED` | Token inválido o expirado |
| 403 | `PERMISSION_DENIED` | Sin permiso de acceso al recurso |
| 404 | `NOT_FOUND` | Modelo no encontrado |
| 429 | `RESOURCE_EXHAUSTED` | Límite de tasa excedido |

### Respuesta de Límite de Tasa

```json
{
  "error": {
    "code": 429,
    "message": "Has agotado tu capacidad en este modelo. Tu cuota se restablecerá después de 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**Procesamiento del Plugin**: El plugin detecta automáticamente errores 429, cambia de cuenta o espera el tiempo de restablecimiento. Ver [advanced/rate-limit-handling/](/es/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/) para más detalles.

---

## Funcionalidades No Soportadas

Las siguientes funcionalidades de Anthropic/Vertex AI **no están soportadas**:

| Funcionalidad | Error |
|--- |---|
| `anthropic_version` | Campo desconocido |
| Array `messages` | Campo desconocido (debe usar `contents`) |
| `max_tokens` | Campo desconocido (debe usar `maxOutputTokens`) |
| `systemInstruction` como cadena simple | Valor inválido (debe usar formato de objeto) |
| `system_instruction` (snake_case a nivel raíz) | Campo desconocido |
| JSON Schema `const` | Campo desconocido (usar `enum: [value]` en su lugar) |
| JSON Schema `$ref` | No soportado (definir inline) |
| JSON Schema `$defs` | No soportado (definir inline) |
| Nombre de Tool con `/` | Inválido (usar `_` o `:` en su lugar) |
| Nombre de Tool comenzando con número | Inválido (debe comenzar con letra o guion bajo) |

---

## Ejemplo de Solicitud Completa

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hola, ¿cómo estás?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "Eres un asistente útil." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## Headers de Respuesta

| Header | Descripción |
|--- |---|
| `x-cloudaicompanion-trace-id` | ID de rastreo para depuración |
| `server-timing` | Duración de la solicitud |

---

## Comparación: Antigravity vs Vertex AI Anthropic

| Característica | Antigravity | Vertex AI Anthropic |
|--- | --- |---|
| Endpoint | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Formato de solicitud | `contents` estilo Gemini | `messages` de Anthropic |
| `anthropic_version` | No se usa | Requerido |
| Nombre del modelo | Simple (`claude-sonnet-4-5`) | Versionado (`claude-4-5@date`) |
| Formato de respuesta | `candidates[]` | `content[]` de Anthropic |
| Soporte multi-modelo | Sí (Claude, Gemini, etc.) | Solo Anthropic |

---

## Resumen de la Lección

Este tutorial cubrió en detalle la especificación interna de la API del gateway unificado de Antigravity:

- **Endpoints**: Tres entornos (Daily, Production, Autopush), Daily Sandbox es el endpoint principal
- **Autenticación**: OAuth 2.0 + Bearer Token, scopes y headers requeridos
- **Formato de solicitud**: Array `contents` estilo Gemini, soporta System Instruction y Tools
- **JSON Schema**: Soporta funcionalidades comunes, pero no soporta `const`, `$ref`, `$defs`
- **Formato de respuesta**: Estructura `candidates[]`, soporta streaming SSE
- **Thinking**: Claude y Gemini 3 soportan razonamiento extendido, requiere `thinkingConfig`
- **Manejo de errores**: Formato de error estándar, 429 incluye retraso de reintento

Si estás depurando problemas de llamadas a la API, puedes usar el modo de depuración del plugin:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Próxima Lección

> Esta es la última lección del apéndice. Si deseas conocer más detalles técnicos, puedes consultar:
> - [Descripción General de la Arquitectura](/es/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - Conoce la arquitectura de módulos y la cadena de llamadas del plugin
> - [Formato de Almacenamiento](/es/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - Conoce el formato del archivo de almacenamiento de cuentas
> - [Opciones de Configuración](/es/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - Manual de referencia completo de todas las opciones de configuración

Si necesitas volver a la etapa inicial, puedes comenzar de nuevo desde [¿Qué es Antigravity Auth?](/es/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/).

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
|--- | --- |---|
| Constantes de endpoints de API | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Headers de Antigravity | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Headers de Gemini CLI | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Lógica principal de transformación de solicitudes | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| Limpieza de JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Archivo completo |
| Caché de firmas de thinking | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Archivo completo |

**Constantes Clave**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Endpoint Daily Sandbox
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Endpoint de Producción
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - Project ID por defecto
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Valor centinela para omitir validación de firma de thinking

**Funciones Clave**:
- `cleanJSONSchemaForAntigravity(schema)` - Limpia JSON Schema para cumplir con los requisitos de la API de Antigravity
- `prepareAntigravityRequest(request)` - Prepara y envía solicitudes a la API de Antigravity
- `createStreamingTransformer()` - Crea transformador de respuestas en streaming

</details>
