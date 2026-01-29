---
title: "Referencia rápida de endpoints: Visión general de rutas HTTP | Antigravity-Manager"
sidebarTitle: "Consulta todas las rutas al instante"
subtitle: "Tabla de referencia rápida de endpoints: Visión general de rutas HTTP externas"
description: "Aprende la distribución de endpoints HTTP del gateway de Antigravity. Domina los modos de autenticación y el uso de API Key Header comparando las rutas de OpenAI/Anthropic/Gemini/MCP."
tags:
  - "Referencia rápida de endpoints"
  - "Referencia de API"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# Tabla de referencia rápida de endpoints: Visión general de rutas HTTP externas

## Qué podrás hacer al completar este tutorial

- Localizar rápidamente la ruta del endpoint que necesitas invocar
- Entender la distribución de endpoints de diferentes protocolos
- Conocer los modos de autenticación y las reglas especiales para health checks

## Visión general de endpoints

El servicio de proxy inverso local de Antigravity Tools proporciona los siguientes tipos de endpoints:

| Clasificación de protocolo | Uso | Clientes típicos |
|--- | --- | ---|
| **Protocolo OpenAI** | Compatibilidad con aplicaciones de IA generales | OpenAI SDK / Clientes compatibles |
| **Protocolo Anthropic** | Invocaciones de la serie Claude | Claude Code / Anthropic SDK |
| **Protocolo Gemini** | SDK oficial de Google | Google Gemini SDK |
| **Endpoints de MCP** | Mejoras de invocación de herramientas | Clientes de MCP |
| **Interno/Auxiliar** | Health checks, capacidades de interceptación/internas | Scripts de automatización / Monitoreo de actividad |

---

## Endpoints de protocolo OpenAI

Estos endpoints son compatibles con el formato de API de OpenAI y son adecuados para la mayoría de clientes que soportan el SDK de OpenAI.

| Método | Ruta | Punto de entrada del router (handler Rust) | Notas |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | Compatible con OpenAI: Lista de modelos |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | Compatible con OpenAI: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | Compatible con OpenAI: Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | Compatible con OpenAI: Solicitudes de Codex CLI (mismo handler que `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | Compatible con OpenAI: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | Compatible con OpenAI: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | Compatible con OpenAI: Audio Transcriptions |

::: tip Nota de compatibilidad
El endpoint `/v1/responses` está diseñado específicamente para Codex CLI y usa la misma lógica de procesamiento que `/v1/completions`.
:::

---

## Endpoints de protocolo Anthropic

Estos endpoints están organizados según las rutas y formatos de solicitud de la API de Anthropic, para ser invocados por Claude Code / Anthropic SDK.

| Método | Ruta | Punto de entrada del router (handler Rust) | Notas |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Compatible con Anthropic: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Compatible con Anthropic: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Compatible con Anthropic: Lista de modelos |

---

## Endpoints de protocolo Gemini

Estos endpoints son compatibles con el formato de API de Google Gemini y se pueden usar directamente con el SDK oficial de Google.

| Método | Ruta | Punto de entrada del router (handler Rust) | Notas |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Nativo de Gemini: Lista de modelos |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Nativo de Gemini: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Nativo de Gemini: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Nativo de Gemini: countTokens |

::: warning Nota sobre rutas
`/v1beta/models/:model` registra tanto GET como POST en la misma ruta (ver definición del router).
:::

---

## Endpoints de MCP

Los endpoints de MCP (Model Context Protocol) se usan para exponer interfaces de "invocación de herramientas" al exterior (procesados por `handlers::mcp::*`). Si están habilitados y su comportamiento específico se basan en la configuración; para más detalles, consulta [Endpoints de MCP](../../platforms/mcp/).

| Método | Ruta | Punto de entrada del router (handler Rust) | Notas |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details Notas relacionadas con MCP
Para conocer el alcance y los límites de disponibilidad de MCP, consulta [Límites de capacidades de integración de z.ai (implementado vs. no implementado explícitamente)](../zai-boundaries/).
:::

---

## Endpoints internos y auxiliares

Estos endpoints se usan para funciones internas del sistema y monitoreo externo.

| Método | Ruta | Punto de entrada del router (handler Rust) | Notas |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Endpoint interno de warmup |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Interceptación de logs de telemetría: devuelve 200 directamente |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Interceptación de logs de telemetría: devuelve 200 directamente |
| GET | `/healthz` | `health_check_handler` | Health check: devuelve `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Detección automática de modelos |

::: tip Procesamiento silencioso
Los endpoints de logs de eventos devuelven `200 OK` directamente sin realizar procesamiento real, para interceptar informes de telemetría de los clientes.
:::

::: warning ¿Estos endpoints requieren API Key?
Excepto que `GET /healthz` pueda estar exento, si las demás rutas requieren key o no lo determina el "modo efectivo" de `proxy.auth_mode` (para más detalles, consulta "Modos de autenticación" abajo y `auth_middleware` en el código fuente).
:::

---

## Modos de autenticación

Los permisos de acceso de todos los endpoints están controlados por `proxy.auth_mode`:

| Modo | Descripción | `/healthz` requiere autenticación? | ¿Otros endpoints requieren autenticación? |
|--- | --- | --- | ---|
| `off` | Completamente abierto | ❌ No | ❌ No |
| `strict` | Todos requieren autenticación | ✅ Sí | ✅ Sí |
| `all_except_health` | Solo health check abierto | ❌ No | ✅ Sí |
| `auto` | Determinación automática (predeterminado) | ❌ No | Depende de `allow_lan_access` |

::: info Lógica del modo auto
`auto` no es una estrategia independiente, sino que se deriva de la configuración: cuando `proxy.allow_lan_access=true` es equivalente a `all_except_health`, de lo contrario es equivalente a `off` (ver `docs/proxy/auth.md`).
:::

**Formato de solicitudes autenticadas**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (estilo OpenAI)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (estilo Gemini)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (estilo OpenAI)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (estilo Gemini)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Resumen de esta sección

Antigravity Tools proporciona un conjunto completo de endpoints compatibles con múltiples protocolos, soportando los tres formatos principales de API: OpenAI, Anthropic y Gemini, además de extensiones de invocación de herramientas de MCP.

- **Integración rápida**: Usa prioritariamente los endpoints de protocolo OpenAI, que ofrecen la mayor compatibilidad
- **Funciones nativas**: Usa los endpoints de protocolo Anthropic cuando necesites funciones completas de Claude Code
- **Ecosistema de Google**: Selecciona los endpoints de protocolo Gemini al usar el SDK oficial de Google
- **Configuración de seguridad**: Elige el modo de autenticación adecuado según el escenario de uso (local/LAN/red pública)

---

## Próximo tutorial

> En el siguiente tutorial aprenderemos **[Datos y modelos](../storage-models/)**.
>
> Aprenderás:
> - Estructura de almacenamiento de archivos de cuenta
> - Estructura de tablas de la base de datos estadística SQLite
> - Definiciones de campos clave y estrategias de backup

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Registro de rutas (todos los endpoints) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Middleware de autenticación (compatibilidad de headers + exención `/healthz` + permitir OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Modos auth_mode y reglas de derivación auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| Valor de retorno de `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Interceptación de logs de telemetría (silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Funciones clave**:
- `AxumServer::start()`: inicia el servidor Axum y registra rutas (líneas 79-254)
- `health_check_handler()`: procesamiento de health check (líneas 266-272)
- `silent_ok_handler()`: procesamiento silencioso exitoso (líneas 274-277)

</details>
