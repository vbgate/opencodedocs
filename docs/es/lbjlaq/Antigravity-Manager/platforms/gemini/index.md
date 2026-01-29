---
title: "API de Gemini: acceso a gateway local | Antigravity-Manager"
subtitle: "Acceso a API de Gemini: conectar el SDK de Google directamente al gateway local"
sidebarTitle: "Conectar Gemini local"
description: "Aprende el acceso al gateway local de Gemini en Antigravity-Manager. A través del endpoint /v1beta/models, domina las llamadas generateContent y streamGenerateContent, y valida con cURL y Python."
tags:
  - "Gemini"
  - "SDK de Google"
  - "Proxy de API"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# API de Gemini: conectar el SDK de Google directamente al gateway local

## Qué podrás hacer al completar este tutorial

- Conectar tus clientes usando los endpoints nativos de Gemini expuestos por Antigravity Tools (`/v1beta/models/*`)
- Llamar al gateway local con rutas de estilo Google `:generateContent` / `:streamGenerateContent`
- Entender por qué `x-goog-api-key` se puede usar directamente cuando la autenticación del proxy está habilitada

## Tu problema actual

Es posible que ya hayas iniciado el proxy inverso local, pero te atasques cuando llega a Gemini:

- El SDK de Google llama por defecto a `generativelanguage.googleapis.com`, ¿cómo cambiarlo a `http://127.0.0.1:<port>`?
- Las rutas de Gemini incluyen dos puntos (`models/<model>:generateContent`), muchos clientes obtienen 404 al concatenarlas
- Habilitaste la autenticación del proxy, pero el cliente de Google no envía `x-api-key`, por lo que siempre obtienes 401

## Cuándo usar este enfoque

- Deseas usar el "protocolo nativo de Gemini" en lugar de la capa compatible con OpenAI/Anthropic
- Ya tienes clientes de estilo Google/de terceros de Gemini y quieres migrar al gateway local con el menor costo

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- Ya has agregado al menos 1 cuenta en la App (de lo contrario, el backend no obtendrá el token de acceso de upstream)
- Ya has iniciado el servicio de proxy inverso local y conoces el puerto de escucha (por defecto se usará `8045`)
:::

## Idea central

Antigravity Tools expone rutas nativas de Gemini en el servidor Axum local:

- Lista: `GET /v1beta/models`
- Llamada: `POST /v1beta/models/<model>:generateContent`
- Streaming: `POST /v1beta/models/<model>:streamGenerateContent`

El backend envolverá tu cuerpo de solicitud nativo de Gemini en una estructura v1internal (inyectando `project`, `requestId`, `requestType`, etc.), y luego lo reenviará al endpoint upstream de Google v1internal (junto con el token de acceso de la cuenta).(Código fuente: `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info ¿Por qué el ejemplo de integración rápida recomienda usar 127.0.0.1 como base URL?
El ejemplo de integración rápida de la App recomienda explícitamente `127.0.0.1` para "evitar problemas de latencia de resolución de IPv6 en algunos entornos".(Código fuente: `src/pages/ApiProxy.tsx`)
:::

## Sígueme paso a paso

### Paso 1: Confirma que el gateway está en línea (/healthz)

**Por qué**
Primero confirma que el servicio está en línea, ahorrarás mucho tiempo al solucionar problemas de protocolo/autenticación.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**Deberías ver**: devuelve JSON, contiene `{"status":"ok"}` (Código fuente: `src-tauri/src/proxy/server.rs`).

### Paso 2: Lista los modelos de Gemini (/v1beta/models)

**Por qué**
Necesitas confirmar primero cuál es el "ID de modelo expuesto externamente", todos los `<model>` posteriores se basarán en esto.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**Deberías ver**: la respuesta tiene un array `models`, cada elemento `name` es similar a `models/<id>` (Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip Importante
¿Qué campo del ID de modelo usar?
- ✅ Usa el campo `displayName` (como `gemini-2.0-flash`)
- ✅ O elimina el prefijo `models/` del campo `name`
- ❌ No copies el valor completo del campo `name` directamente (causará error de ruta)

Si copias el campo `name` (como `models/gemini-2.0-flash`) como ID de modelo, la ruta de solicitud se convertirá en `/v1beta/models/models/gemini-2.0-flash:generateContent`, lo cual es incorrecto。(Código fuente: `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning Importante
Actualmente `/v1beta/models` es un retorno que "disfraza la lista de modelos dinámica local como lista de modelos de Gemini", no se extrae de upstream en tiempo real。(Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Paso 3: Llama a generateContent (ruta con dos puntos)

**Por qué**
La clave de la API REST nativa de Gemini es la "acción con dos puntos" como `:generateContent`. El backend analizará `model:method` en la misma ruta。(Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**Deberías ver**: la respuesta JSON contiene `candidates` (o la capa externa tiene `response.candidates`, el proxy lo desempaquetará).

### Paso 4: Llama a streamGenerateContent (SSE)

**Por qué**
El streaming es más estable para "salidas largas/modelos grandes"; el proxy reenviará el SSE de upstream a tu cliente y establecerá `Content-Type: text/event-stream`。(Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Tell me a short story"}]}
    ]
  }'
```

**Deberías ver**: el terminal sigue imprimiendo líneas en forma de `data: {...}`; en circunstancias normales, finalmente aparecerá `data: [DONE]` (indicando que el flujo ha terminado).

::: tip Nota
`data: [DONE]` es el marcador de finalización estándar de SSE, pero **no necesariamente siempre aparece**:
- Si upstream termina normalmente y envía `[DONE]`, el proxy lo reenviará
- Si upstream se desconecta anormalmente, agota el tiempo o envía otra señal de finalización, el proxy no complementará `[DONE]`

El código del cliente debe procesarse según el estándar SSE: encontrar `data: [DONE]` o que la conexión se desconecte debe considerarse como el final del flujo。(Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Paso 5: Usa el SDK de Google Python para conectar directamente al gateway local

**Por qué**
Esta es la ruta de ejemplo de "integración rápida" proporcionada en la UI del proyecto: usa el paquete Google Generative AI Python para apuntar `api_endpoint` a tu dirección de proxy inverso local。(Código fuente: `src/pages/ApiProxy.tsx`)

```python
# Necesitas instalar: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**Deberías ver**: el programa imprime un texto de respuesta del modelo.

## Punto de control ✅

- `/healthz` puede devolver `{"status":"ok"}`
- `/v1beta/models` puede listar modelos (al menos 1)
- `:generateContent` puede devolver `candidates`
- `:streamGenerateContent` devuelve `Content-Type: text/event-stream` y puede continuar fluyendo

## Advertencias de problemas comunes

- **401 que no se puede resolver**: si habilitaste la autenticación, pero `proxy.api_key` está vacío, el backend rechazará la solicitud directamente。(Código fuente: `src-tauri/src/proxy/middleware/auth.rs`)
- **¿Qué key llevar en Header**: el proxy reconocerá simultáneamente `Authorization`, `x-api-key`, `x-goog-api-key`. Por lo tanto, "el cliente de estilo Google solo envía `x-goog-api-key`" también puede pasar。(Código fuente: `src-tauri/src/proxy/middleware/auth.rs`)
- **El resultado de countTokens siempre es 0**: actualmente `POST /v1beta/models/<model>/countTokens` devuelve un valor fijo `{"totalTokens":0}`, que es una implementación de marcador de posición。(Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)

## Resumen de este tutorial

- Lo que debes conectar es `/v1beta/models/*`, no `/v1/*`
- La forma clave de escribir rutas es `models/<modelId>:generateContent` / `:streamGenerateContent`
- Cuando la autenticación está habilitada, `x-goog-api-key` es un encabezado de solicitud admitido explícitamente por el proxy

## Próximo tutorial

> En el siguiente tutorial aprenderemos **[Imagen 3 generación de imágenes: mapeo automático de parámetros size/quality de Imágenes de OpenAI](/es/lbjlaq/Antigravity-Manager/platforms/imagen/)**.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Registro de rutas de Gemini (/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| Análisis de ID de modelo y enrutamiento (por qué el prefijo `models/` causa error de enrutamiento) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| Analizar `model:method` + lógica principal de generate/stream | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| Lógica de salida de SSE (reenviar `[DONE]` en lugar de complementar automáticamente) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| Estructura de retorno de `/v1beta/models` (disfraz de lista de modelos dinámica) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| Implementación de marcador de posición de `countTokens` (valor fijo 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| Compatibilidad de Header de autenticación (incluye `x-goog-api-key`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Ejemplo de SDK de Google Python (`api_endpoint` apunta al gateway local) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Huella de sesión de Gemini (session_id para adhesividad/caché) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Envoltura v1internal de solicitud de Gemini (inyecta project/requestId/requestType, etc.) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| Endpoint v1internal upstream y fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**Constantes clave**:
- `MAX_RETRY_ATTEMPTS = 3`: límite superior del número máximo de rotaciones para solicitudes de Gemini (Código fuente: `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
