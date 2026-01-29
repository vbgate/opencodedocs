---
title: "API de OpenAI: configuración de integración | Antigravity-Manager"
sidebarTitle: "Conecta el SDK de OpenAI en 5 minutos"
subtitle: "API de OpenAI: configuración de integración"
description: "Aprende la configuración de integración de API compatible con OpenAI. Domina la conversión de rutas, la configuración de base_url y la solución de problemas de 401/404/429, para usar rápidamente Antigravity Tools."
tags:
  - "OpenAI"
  - "Proxy de API"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# API compatible con OpenAI: estrategia de implementación para /v1/chat/completions y /v1/responses

Usarás esta **API compatible con OpenAI** para conectar directamente el SDK o cliente de OpenAI existente al gateway local de Antigravity Tools. El objetivo principal es ejecutar `/v1/chat/completions` y `/v1/responses`, y aprender a solucionar problemas rápidamente usando los encabezados de respuesta.

## Qué podrás hacer al completar este tutorial

- Conectar directamente el SDK de OpenAI (o curl) al gateway local de Antigravity Tools
- Ejecutar `/v1/chat/completions` (incluyendo `stream: true`) y `/v1/responses`
- Entender la lista de modelos de `/v1/models` y el `X-Mapped-Model` en los encabezados de respuesta
- Saber qué verificar primero cuando encuentres errores 401/404/429

## Tu problema actual

Muchos clientes/SDK solo reconocen la forma de la interfaz de OpenAI: URL fija, campos JSON fijos y formato de flujo SSE fijo. El objetivo de Antigravity Tools no es que modifiques el cliente, sino que el cliente "cree que está llamando a OpenAI", mientras la solicitud se convierte en una llamada a upstream interna y el resultado se transforma de nuevo al formato de OpenAI.

## Cuándo usar este enfoque

- Ya tienes un conjunto de herramientas que solo soportan OpenAI (plugins de IDE, scripts, bots, SDK) y no quieres escribir una nueva integración para cada uno
- Deseas usar `base_url` para enviar todas las solicitudes al gateway local (o LAN), y dejar que el gateway gestione la programación de cuentas, reintentos y monitoreo

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- Ya has iniciado el servicio de proxy inverso en la página "API Proxy" de Antigravity Tools y anotado el puerto (por ejemplo, `8045`)
- Ya has agregado al menos una cuenta disponible, de lo contrario el proxy inverso no obtendrá el token de upstream
:::

::: info ¿Cómo llevar la autenticación?
Cuando habilitas `proxy.auth_mode` y configuras `proxy.api_key`, las solicitudes deben llevar una API Key.

El middleware de Antigravity Tools lee primero `Authorization`, y también es compatible con `x-api-key` y `x-goog-api-key`. (Ver implementación en `src-tauri/src/proxy/middleware/auth.rs`)
:::

## ¿Qué es la API compatible con OpenAI?

La **API compatible con OpenAI** es un conjunto de rutas HTTP y protocolos JSON/SSE que "se parecen a OpenAI". El cliente envía solicitudes al gateway local en el formato de OpenAI, el gateway convierte la solicitud en una llamada a upstream interna y convierte la respuesta de upstream de nuevo a la estructura de respuesta de OpenAI, permitiendo que el SDK de OpenAI existente se use casi sin modificaciones.

### Resumen de endpoints compatibles (relacionado con este tutorial)

| Endpoint | Propósito | Evidencia de código |
| --- | --- | --- |
| `POST /v1/chat/completions` | Chat Completions (incluye streaming) | `src-tauri/src/proxy/server.rs` registro de ruta; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions (reutiliza el mismo manejador) | `src-tauri/src/proxy/server.rs` registro de ruta |
| `POST /v1/responses` | Compatibilidad con Responses/Codex CLI (reutiliza el mismo manejador) | `src-tauri/src/proxy/server.rs` registro de ruta (comentario: compatible con Codex CLI) |
| `GET /v1/models` | Devuelve la lista de modelos (incluye mapeo personalizado + generación dinámica) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## Sígueme paso a paso

### Paso 1: Confirma que el servicio está activo con curl (/healthz + /v1/models)

**Por qué**
Primero elimina problemas básicos como "servicio no iniciado", "puerto incorrecto" o "bloqueado por firewall".

```bash
 # 1) Verificación de salud
curl -s http://127.0.0.1:8045/healthz

 # 2) Obtener lista de modelos
curl -s http://127.0.0.1:8045/v1/models
```

**Deberías ver**: `/healthz` devuelve algo como `{"status":"ok"}`; `/v1/models` devuelve `{"object":"list","data":[...]}`.

### Paso 2: Usa el SDK de OpenAI en Python para llamar a /v1/chat/completions

**Por qué**
Este paso demuestra que toda la cadena "SDK de OpenAI → gateway local → upstream → conversión de respuesta de OpenAI" funciona.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hola, por favor preséntate"}],
)

print(response.choices[0].message.content)
```

**Deberías ver**: la terminal imprime un texto de respuesta del modelo.

### Paso 3: Activa stream y confirma el retorno de flujo SSE

**Por qué**
Muchos clientes dependen del protocolo SSE de OpenAI (`Content-Type: text/event-stream`). Este paso confirma que el flujo de streaming y el formato de eventos están disponibles.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Explica en tres oraciones qué es un gateway de proxy inverso local"}
    ]
  }'
```

**Deberías ver**: la terminal continúa imprimiendo líneas que comienzan con `data: { ... }` y termina con `data: [DONE]`.

### Paso 4: Ejecuta una solicitud con /v1/responses (estilo Codex/Responses)

**Por qué**
Algunas herramientas usan `/v1/responses` o usan campos como `instructions` e `input` en el cuerpo de la solicitud. Este proyecto "normaliza" este tipo de solicitudes a `messages` y luego reutiliza la misma lógica de conversión. (Ver manejador en `src-tauri/src/proxy/handlers/openai.rs`)

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "Eres un revisor de código riguroso.",
    "input": "Por favor señala el bug más probable en el siguiente código:\n\nfunction add(a, b) { return a - b }"
  }'
```

**Deberías ver**: el cuerpo de respuesta es un objeto de respuesta estilo OpenAI (este proyecto convierte la respuesta de Gemini a `choices[].message.content` de OpenAI).

### Paso 5: Confirma que el enrutamiento de modelos funciona (ve el encabezado de respuesta X-Mapped-Model)

**Por qué**
El `model` que escribes en el cliente no es necesariamente el "modelo físico" que se llama realmente. El gateway primero realiza el mapeo de modelos (incluye mapeo personalizado/comodines, ver [Enrutamiento de modelos: mapeo personalizado, prioridad de comodines y estrategias predefinidas](/es/lbjlaq/Antigravity-Manager/advanced/model-router/)), y pone el resultado final en los encabezados de respuesta para facilitar la solución de problemas.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

**Deberías ver**: los encabezados de respuesta contienen `X-Mapped-Model: ...` (por ejemplo, mapeado a `gemini-2.5-flash`), y también pueden contener `X-Account-Email: ...`.

## Punto de control ✅

- `GET /healthz` devuelve `{"status":"ok"}` (o JSON equivalente)
- `GET /v1/models` devuelve `object=list` y `data` es un array
- Las solicitudes no streaming de `/v1/chat/completions` pueden obtener `choices[0].message.content`
- Cuando `stream: true`, se recibe SSE y termina con `[DONE]`
- `curl -i` puede ver el encabezado de respuesta `X-Mapped-Model`

## Advertencias de problemas comunes

### 1) Base URL incorrecta causa 404 (el más común)

- En los ejemplos del SDK de OpenAI, `base_url` debe terminar con `/v1` (ver ejemplo de Python en README del proyecto).
- Algunos clientes "apilan rutas". Por ejemplo, README menciona explícitamente: Kilo Code en modo OpenAI puede construir rutas no estándar como `/v1/chat/completions/responses`, lo que activa 404.

### 2) 401: no es que upstream esté caído, es que no llevaste key o el modo es incorrecto

Cuando el "modo efectivo" de la estrategia de autenticación no es `off`, el middleware verifica los encabezados de solicitud: `Authorization: Bearer <proxy.api_key>`, y también es compatible con `x-api-key` y `x-goog-api-key`. (Ver implementación en `src-tauri/src/proxy/middleware/auth.rs`)

::: tip Sugerencia sobre modo de autenticación
`auth_mode = auto` decidirá automáticamente según `allow_lan_access`:
- `allow_lan_access = true` → modo efectivo es `all_except_health` (todas las rutas excepto `/healthz` requieren autenticación)
- `allow_lan_access = false` → modo efectivo es `off` (acceso local no requiere autenticación)
:::

### 3) 429/503/529: el proxy reintentará + rotará cuentas, pero también puede "agotar el pool"

El manejador de OpenAI tiene incorporado hasta 3 intentos (y limitado por el tamaño del pool de cuentas), y esperará/rotará cuentas para reintentar ante ciertos errores. (Ver implementación en `src-tauri/src/proxy/handlers/openai.rs`)

## Resumen de este tutorial

- `/v1/chat/completions` es el punto de integración más universal, `stream: true` usará SSE
- `/v1/responses` y `/v1/completions` usan el mismo manejador compatible, el núcleo es primero normalizar la solicitud a `messages`
- `X-Mapped-Model` te ayuda a confirmar el resultado del mapeo "nombre del modelo del cliente → modelo físico final"

## Próximo tutorial

> En el siguiente tutorial veremos **API compatible con Anthropic: contratos clave de /v1/messages y Claude Code** (capítulo correspondiente: `platforms-anthropic`).

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Registro de rutas OpenAI (incluye /v1/responses) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Manejador de Chat Completions (incluye detección de formato Responses) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| Manejador de /v1/completions y /v1/responses (normalización Codex/Responses + reintentos/rotación) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| Retorno de /v1/models (lista de modelos dinámica) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| Estructura de datos de solicitud de OpenAI (messages/instructions/input/size/quality) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
| Conversión de solicitud OpenAI → Gemini (systemInstruction/thinkingConfig/tools) | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L6-L553) | 6-553 |
| Conversión de respuesta Gemini → OpenAI (choices/usageMetadata) | [`src-tauri/src/proxy/mappers/openai/response.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/response.rs#L5-L214) | 5-214 |
| Mapeo de modelos y prioridad de comodines (exacto > comodín > predeterminado) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Middleware de autenticación (Authorization/x-api-key/x-goog-api-key) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |

**Constantes clave**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de intentos para el protocolo OpenAI (incluye rotación) (ver `src-tauri/src/proxy/handlers/openai.rs`)

**Funciones clave**:
- `transform_openai_request(...)`: convierte el cuerpo de solicitud de OpenAI en solicitud a upstream interno (ver `src-tauri/src/proxy/mappers/openai/request.rs`)
- `transform_openai_response(...)`: convierte la respuesta de upstream en `choices`/`usage` de OpenAI (ver `src-tauri/src/proxy/mappers/openai/response.rs`)

</details>
