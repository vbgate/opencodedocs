---
title: "Usar OpenAI Images con Imagen 3: Mapeo de Parámetros | Antigravity"
sidebarTitle: "Llamadas estilo OpenAI"
subtitle: "Generación de imágenes con Imagen 3: Mapeo automático de parámetros size/quality de OpenAI Images"
description: "Aprende a usar la API de OpenAI Images con Imagen 3, dominando el mapeo de parámetros. size(anchoxalto) controla la relación de aspecto, quality controla la calidad, soporta b64_json y url."
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "Generación de imágenes"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Generación de Imágenes con Imagen 3: Mapeo Automático de Parámetros size/quality de OpenAI

¿Quieres llamar a Imagen 3 usando la API de OpenAI Images? El proxy inverso local de Antigravity Tools proporciona `/v1/images/generations`, y mapea automáticamente `size` / `quality` a la relación de aspecto y configuración de resolución que necesita Imagen 3.

## Lo Que Podrás Hacer

- Generar imágenes de Imagen 3 usando `POST /v1/images/generations` sin cambiar tus hábitos de clientes/SDK de OpenAI existentes
- Controlar de manera estable `aspectRatio` (16:9, 9:16, etc.) usando `size: "WIDTHxHEIGHT"`
- Controlar `imageSize` (estándar/2K/4K) usando `quality: "standard" | "medium" | "hd"`
- Entender los campos devueltos `b64_json` / `url(data:...)` y confirmar la cuenta real utilizada a través de los encabezados de respuesta

## Tu Problema Actual

Podrías haber encontrado estas situaciones:

- Tu cliente solo puede llamar `/v1/images/generations` de OpenAI, pero quieres usar Imagen 3
- Con el mismo prompt, a veces obtienes imágenes cuadradas, a veces horizontales, el control de la relación de aspecto es inestable
- Escribiste `size` como `16:9`, pero el resultado sigue siendo 1:1 (y no sabes por qué)

## Cuándo Usar Esta Técnica

- Ya estás usando el proxy inverso local de Antigravity Tools y deseas unificar la "generación de imágenes" a través de la misma puerta de enlace
- Deseas que herramientas compatibles con la API de OpenAI Images (Cherry Studio, Kilo Code, etc.) generen directamente imágenes de Imagen 3

## 🎒 Preparativos Antes de Empezar

::: warning Verificación previa
Este curso asume que ya puedes iniciar el proxy inverso local y conoces tu Base URL (por ejemplo `http://127.0.0.1:<port>`). Si aún no lo has logrado, completa primero「Iniciar el proxy inverso local y conectar el primer cliente」.
:::

::: info Recordatorio de autenticación
Si habilitaste `proxy.auth_mode` (por ejemplo `strict` / `all_except_health`), al llamar a `/v1/images/generations` necesitas incluir:

- `Authorization: Bearer <proxy.api_key>`
:::

## Idea Central

### ¿Qué hace exactamente este "mapeo automático"?

El **mapeo de OpenAI Images a Imagen 3** significa: sigues enviando `prompt/size/quality` según la API de OpenAI Images, el proxy analiza `size` como una relación de aspecto estándar (como 16:9), analiza `quality` como un nivel de resolución (2K/4K), y luego llama al `gemini-3-pro-image` upstream usando el formato de solicitud interno.

::: info Nota sobre el modelo
`gemini-3-pro-image` es el nombre del modelo de generación de imágenes de Google Imagen 3 (según el documento README del proyecto). Por defecto, el código fuente usa este modelo para la generación de imágenes.
:::

### 1) size -> aspectRatio (cálculo dinámico)

- El proxy analiza `size` como `WIDTHxHEIGHT`, luego compara la relación ancho/alto con relaciones estándar.
- Si el análisis de `size` falla (por ejemplo, no está separado por `x`, o los números son ilegales), se retrocede a `1:1`.

### 2) quality -> imageSize (niveles de resolución)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"` (u otros valores) -> no se establece `imageSize` (mantiene el valor predeterminado)

### 3) n imágenes múltiples es "enviar concurrentemente n veces"

Esta implementación no depende del `candidateCount > 1` upstream, sino que divide `n` generaciones en múltiples solicitudes concurrentes, luego combina los resultados en el formato `data[]` de OpenAI y los devuelve.

## Sígueme

### Paso 1: Confirma que el proxy inverso está iniciado (opcional pero muy recomendado)

**Por qué**
Primero confirma tu Base URL y modo de autenticación, para evitar juzgar erróneamente el problema como "fallo en la generación de imágenes" más adelante.

::: code-group

```bash [macOS/Linux]
 # Verificar estado (acceso sin autenticación cuando auth_mode=all_except_health)
 curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # Verificar estado (acceso sin autenticación cuando auth_mode=all_except_health)
 curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**Lo que deberías ver**: JSON devuelto, conteniendo `"status": "ok"`.

### Paso 2: Inicia una solicitud mínima de generación de imágenes

**Por qué**
Primero verifica la ruta completa con el mínimo de campos, luego superpón parámetros como relación/claridad/cantidad.

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**Lo que deberías ver**: en el JSON de respuesta hay un array `data`, que contiene el campo `b64_json` (el contenido es bastante largo).

### Paso 3: Confirma qué cuenta estás usando (mira los encabezados de respuesta)

**Por qué**
La generación de imágenes también pasa por la programación del pool de cuentas; al solucionar problemas, confirmar "qué cuenta exactamente está generando" es crucial.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**Lo que deberías ver**: los encabezados de respuesta contienen `X-Account-Email: ...`.

### Paso 4: Controla la relación ancho/alto con size (recomendado usar solo WIDTHxHEIGHT)

**Por qué**
El upstream de Imagen 3 recibe `aspectRatio` estandarizado; siempre que escribas `size` como un conjunto de anchos y altos comunes, se mapeará de manera estable a relaciones estándar.

| size que pasas | aspectRatio calculado por el proxy |
| --- | --- |
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**Lo que deberías ver**: la relación de aspecto de la imagen cambia con `size`.

### Paso 5: Controla el nivel de resolución con quality (standard/medium/hd)

**Por qué**
No necesitas recordar los campos internos de Imagen 3, solo usa `quality` de OpenAI Images para cambiar niveles de resolución.

| quality que pasas | imageSize escrito por el proxy |
| --- | --- |
| `"standard"` | No se establece (usa el predeterminado upstream) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**Lo que deberías ver**: `hd` tiene más detalles (y es más lento/consume más recursos, esto es comportamiento upstream, verifícalo con lo que realmente devuelva).

### Paso 6: Decide si quieres b64_json o url

**Por qué**
En esta implementación, `response_format: "url"` no te dará una URL accesible públicamente, sino que devuelve Data URI `data:<mime>;base64,...`; muchas herramientas son más adecuadas para usar directamente `b64_json`.

| response_format | campo en data[] |
| --- | --- |
| `"b64_json"` (predeterminado) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## Punto de Verificación ✅

- Puedes usar `/v1/images/generations` para devolver al menos 1 imagen (`data.length >= 1`)
- Puedes ver `X-Account-Email` en los encabezados de respuesta y puedes reproducir el mismo problema de cuenta cuando sea necesario
- Cuando cambias `size` a `1920x1080`, la relación de aspecto de la imagen se convierte en horizontal (16:9)
- Cuando cambias `quality` a `hd`, el proxy lo mapeará a `imageSize: "4K"`

## Advertencias sobre Problemas Comunes

### 1) Escribir size como 16:9 no obtendrá 16:9

La lógica de análisis de `size` aquí se divide según `WIDTHxHEIGHT`; si `size` no está en este formato, se retrocederá directamente a `1:1`.

| Escritura | Resultado |
| --- | --- |
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | Retrocede a 1:1 |

### 2) No abrir autenticación pero enviar Authorization tampoco causará éxito

La autenticación es una cuestión de "si es obligatorio":

- `proxy.auth_mode=off`: enviar o no `Authorization` está bien
- `proxy.auth_mode=strict/all_except_health`: no enviar `Authorization` será rechazado

### 3) Cuando n > 1, puede aparecer "éxito parcial"

La implementación hace solicitudes concurrentes y combina resultados: si algunas solicitudes fallan, aún pueden devolver algunas imágenes y registrar el motivo del fallo en los registros.

## Resumen de Esta Lección

- Para llamar a Imagen 3 con `/v1/images/generations`, la clave es recordar: `size` usa `WIDTHxHEIGHT`, `quality` usa `standard/medium/hd`
- `size` controla `aspectRatio`, `quality` controla `imageSize(2K/4K)`
- `response_format=url` devuelve Data URI, no URL pública

## Vista Previa de la Siguiente Lección

> En la siguiente lección aprenderemos **[Transcripción de Audio: Limitaciones de /v1/audio/transcriptions y manejo de cuerpos grandes](../audio/)**.

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Exponer ruta de OpenAI Images | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Endpoint de generación de Images: analizar prompt/size/quality + ensamblar respuesta de OpenAI | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
| Análisis y mapeo de size/quality (size->aspectRatio, quality->imageSize) | [`src-tauri/src/proxy/mappers/common_utils.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/common_utils.rs#L19-L222) | 19-222 |
| Declaración de size/quality en OpenAIRequest (para compatibilidad de capa de protocolo) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
| Conversión de solicitud OpenAI->Gemini: pasar size/quality a función de análisis unificada | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L19-L27) | 19-27 |

**Campos clave (del código fuente)**:
- `size`: analizado como `aspectRatio` según `WIDTHxHEIGHT`
- `quality`: `hd -> 4K`, `medium -> 2K`, otros no se establecen

</details>
