---
title: "Anthropic: API Compatible | Antigravity-Manager"
sidebarTitle: "Haz que Claude Code use el gateway local"
subtitle: "Anthropic: API Compatible"
description: "Aprende la API compatible con Anthropic de Antigravity-Manager. Configura el Base URL de Claude Code, usa /v1/messages para realizar solicitudes, entiende la autenticación y la intercepción de warmup."
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# API Compatible con Anthropic: /v1/messages y el contrato clave con Claude Code

Para hacer que Claude Code use el gateway local pero sin cambiar su uso del protocolo Anthropic, solo necesitas apuntar el Base URL a Antigravity Tools y luego ejecutar una solicitud con `/v1/messages`.

## ¿Qué es la API compatible con Anthropic?

La **API compatible con Anthropic** se refiere al endpoint del protocolo Anthropic Messages que Antigravity Tools expone externamente. Recibe solicitudes `/v1/messages`, realiza limpieza de mensajes, encapsulación de streaming y rotación de reintentos localmente, y luego reenvía la solicitud a proveedores upstream que proporcionan capacidades de modelo reales.

## Lo que podrás hacer después de esta lección

- Usar el endpoint `/v1/messages` de Antigravity Tools para ejecutar Claude Code (o cualquier cliente Anthropic Messages)
- Diferenciar claramente cómo configurar el Base URL y los headers de autenticación para evitar intentos ciegos 401/404
- Obtener SSE estándar cuando necesites streaming; obtener JSON cuando no necesites streaming
- Saber qué "correcciones de protocolo" realiza el proxy en segundo plano (intercepción de warmup, limpieza de mensajes, respaldo de firma)

## Tu situación actual

Quieres usar Claude Code/Anthropic SDK, pero problemas de red, cuenta, cuota y limitación de velocidad hacen que las conversaciones sean inestables; ya has ejecutado Antigravity Tools como gateway local, pero a menudo te encuentras atascado en estos tipos de problemas:

- Escribiste el Base URL como `.../v1` o el cliente "concatenó rutas", resultando directamente en 404
- Habilitaste la autenticación del proxy pero no sabes qué header usa el cliente para pasar la key, resultando en 401
- Las tareas de warmup/resumen en segundo plano de Claude Code consumen silenciosamente tu cuota

## Cuándo usar este enfoque

- Vas a conectar el **CLI de Claude Code** y quieres que se conecte directamente al gateway local "según el protocolo Anthropic"
- Tu cliente solo soporta la API Anthropic Messages (`/v1/messages`) y no quieres cambiar el código

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
Esta lección asume que ya has ejecutado el ciclo básico del reverse proxy local (puedes acceder a `/healthz`, conoces el puerto del proxy y si la autenticación está habilitada). Si aún no lo has logrado, primero ve a **[Iniciar el reverse proxy local y conectar el primer cliente](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Necesitas preparar tres cosas:

1. Dirección del proxy (ejemplo: `http://127.0.0.1:8045`)
2. Si la autenticación del proxy está habilitada (y el `proxy.api_key` correspondiente)
3. Un cliente capaz de enviar solicitudes Anthropic Messages (Claude Code / curl funcionan)

## Idea central

La **API compatible con Anthropic** en Antigravity Tools corresponde a un conjunto de rutas fijas: `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude` (consulta la definición del Router en `src-tauri/src/proxy/server.rs`).

Entre estas, `/v1/messages` es el "punto de entrada principal", y el proxy realizará un montón de procesamiento de compatibilidad antes de enviar realmente la solicitud upstream:

- Limpia campos en los mensajes históricos que no son aceptados por el protocolo (por ejemplo `cache_control`)
- Fusiona mensajes consecutivos del mismo rol para evitar fallas en la validación de "alternancia de roles"
- Detecta mensajes de warmup de Claude Code y devuelve directamente una respuesta simulada, reduciendo el desperdicio de cuota
- Realiza reintentos y rotación de cuentas según el tipo de error (máximo 3 intentos), mejorando la estabilidad de sesiones largas

## Sígueme paso a paso

### Paso 1: Confirma que el Base URL solo se escribe hasta el puerto

**Por qué**
`/v1/messages` es una ruta fija en el lado del proxy; si el Base URL se escribe como `.../v1`, es fácil que el cliente concatene `/v1/messages` una vez más, resultando finalmente en `.../v1/v1/messages`.

Puedes usar curl para verificar primero directamente:

```bash
# Deberías ver: {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### Paso 2: Si habilitaste la autenticación, recuerda estos 3 tipos de header

**Por qué**
El middleware de autenticación del proxy tomará la key de `Authorization`, `x-api-key`, `x-goog-api-key`; si habilitaste la autenticación pero el header no coincide, obtendrás 401 de forma estable.

::: info ¿Qué headers de autenticación acepta el proxy?
`Authorization: Bearer <key>`, `x-api-key: <key>`, `x-goog-api-key: <key>` todos funcionan (consulta `src-tauri/src/proxy/middleware/auth.rs`).
:::

### Paso 3: Conecta Claude Code CLI directamente al gateway local

**Por qué**
Claude Code usa el protocolo Anthropic Messages; apuntar su Base URL al gateway local permite reutilizar este conjunto de contratos `/v1/messages`.

Configura las variables de entorno según el ejemplo del README:

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**Lo que deberías ver**: Claude Code puede iniciarse normalmente y recibir una respuesta después de enviar un mensaje.

### Paso 4: Primero lista los modelos disponibles (para usar con curl/SDK)

**Por qué**
Diferentes clientes pasarán el `model` tal como está; obtener la lista de modelos primero hace que la solución de problemas sea mucho más rápida.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**Lo que deberías ver**: Devuelve un JSON con `object: "list"`, donde `data[].id` son los IDs de modelo disponibles.

### Paso 5: Usa curl para llamar a `/v1/messages` (no streaming)

**Por qué**
Este es el flujo mínimo reproducible: sin usar Claude Code, también puedes confirmar exactamente dónde falla "ruta + autenticación + cuerpo de solicitud".

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<elige uno de /v1/models/claude>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "Hola, preséntate brevemente"}
    ]
  }'
```

**Lo que deberías ver**:

- HTTP 200
- Los headers de respuesta pueden contener `X-Account-Email` y `X-Mapped-Model` (para solución de problemas)
- El cuerpo de respuesta es un JSON estilo Anthropic Messages (`type: "message"`)

### Paso 6: Cuando necesites streaming, abre `stream: true`

**Por qué**
Claude Code usará SSE; tú mismo puedes hacer que SSE funcione con curl, confirmando que no hay problemas de proxy/búfer en el medio.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<elige uno de /v1/models/claude>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Explica qué es un reverse proxy local en 3 oraciones"}
    ]
  }'
```

**Lo que deberías ver**: Eventos SSE línea por línea (`event: message_start`, `event: content_block_delta`, etc.).

## Puntos de control ✅

- `GET /healthz` devuelve `{"status":"ok"}`
- `GET /v1/models/claude` puede obtener `data[].id`
- `POST /v1/messages` puede devolver 200 (ya sea JSON no streaming o SSE streaming)

## Alertas de problemas comunes

### 1) No escribas el Base URL como `.../v1`

El ejemplo de Claude Code es `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`, porque la ruta del lado del proxy ya incluye `/v1/messages`.

### 2) Si habilitaste la autenticación pero `proxy.api_key` está vacío, será rechazado directamente

Cuando la autenticación del proxy está habilitada pero `api_key` está vacío, el middleware devolverá directamente 401 (consulta la lógica de protección en `src-tauri/src/proxy/middleware/auth.rs`).

### 3) `/v1/messages/count_tokens` es una implementación de marcador de posición en la ruta predeterminada

Cuando el reenvío de z.ai no está habilitado, este endpoint devolverá directamente `input_tokens: 0, output_tokens: 0` (consulta `handle_count_tokens`). No lo uses para juzgar tokens reales.

### 4) No habilitaste streaming, pero ves que el servidor está "usando internamente SSE"

El proxy tiene una estrategia de compatibilidad para `/v1/messages`: cuando el cliente no requiere streaming, el servidor puede **forzar internamente el uso de streaming** y luego recopilar los resultados en JSON para devolverlos (consulta la lógica de `force_stream_internally` en `handle_messages`).

## Resumen de esta lección

- Para que Claude Code/Anthropic clients funcionen, esencialmente son 3 cosas: Base URL, header de autenticación, cuerpo de solicitud `/v1/messages`
- Para que "el protocolo funcione + sesiones largas sean estables", el proxy limpia mensajes históricos, intercepta warmups, y reintentas/rotas cuentas cuando falla
- `count_tokens` actualmente no se puede usar como medida real (a menos que hayas habilitado la ruta de reenvío correspondiente)

## Próxima lección

> En la siguiente lección aprenderemos **[API nativa de Gemini: /v1beta/models y conexión de endpoints del SDK de Google](/es/lbjlaq/Antigravity-Manager/platforms/gemini/)**.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Líneas |
|--- | --- | ---|
| Rutas del proxy: `/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Punto de entrada principal de Anthropic: `handle_messages` (incluye intercepción de warmup y bucle de reintento) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| Lista de modelos: `GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens` (devuelve 0 cuando z.ai no está habilitado) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Detección de Warmup y respuesta simulada | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| Limpieza de solicitudes: eliminar `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| Limpieza de solicitudes: fusionar mensajes consecutivos del mismo rol | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**Constantes clave**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de reintentos para `/v1/messages`

</details>
