---
title: "API de Audio: endpoints compatibles con Whisper | Antigravity-Manager"
subtitle: "API de Audio: endpoints compatibles con Whisper"
sidebarTitle: "Audio a texto en 5 minutos"
description: "Aprende el uso de la API de transcripción de audio de Antigravity-Manager. Domina 6 formatos compatibles, límite de 15MB y métodos de manejo de payloads grandes, para convertir audio a texto rápidamente."
tags:
  - "Transcripción de audio"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "Proxy de API"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# Transcripción de audio: restricciones y manejo de payloads grandes de /v1/audio/transcriptions

Puedes usar el **endpoint de transcripción de audio `POST /v1/audio/transcriptions`** para convertir archivos de audio en texto. Tiene la forma de la API de Whisper de OpenAI, pero realiza validaciones de formato y límite de tamaño de archivo en el gateway local, y envía el audio como `inlineData` en una solicitud upstream a Gemini.

## Qué podrás hacer al completar este tutorial

- Llamar a `POST /v1/audio/transcriptions` con curl / SDK de OpenAI para convertir audio en `{"text":"..."}`
- Comprender los 6 formatos de audio compatibles y la forma real del error de **límite estricto de 15MB**
- Conocer los valores predeterminados y el método de transmisión de `model` / `prompt` (sin adivinar reglas upstream)
- Localizar solicitudes de audio en Proxy Monitor y entender el origen de `[Binary Request Data]`

## Tu problema actual

Quieres convertir grabaciones de reuniones, podcasts o llamadas de atención al cliente en texto, pero a menudo te atascas en estos puntos:

- Diferentes herramientas tienen diferentes formatos de audio y formas de API, dificultando la reutilización de scripts y SDKs
- Cuando falla la carga, solo ves "bad request/gateway error", sin saber si el formato es incorrecto o el archivo es demasiado grande
- Quieres integrar la transcripción en el "gateway local" de Antigravity Tools para una programación y monitoreo unificados, pero no estás seguro de hasta qué punto es compatible

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- Ya has ejecutado [Iniciar proxy inverso local y conectar el primer cliente](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) y conoces el puerto del proxy inverso (en esta página usaremos `8045` como ejemplo)
- Ya has ejecutado [Agregar cuenta](/es/lbjlaq/Antigravity-Manager/start/add-account/), con al menos 1 cuenta disponible
:::

## ¿Qué es el endpoint de transcripción de audio (/v1/audio/transcriptions)?

El **endpoint de transcripción de audio** es una ruta compatible con Whisper de OpenAI expuesta por Antigravity Tools. El cliente carga el archivo de audio mediante `multipart/form-data`, el servidor valida la extensión y el tamaño, convierte el audio en `inlineData` Base64, llama a `generateContent` upstream y finalmente devuelve solo un campo `text`.

## Resumen de endpoint y restricciones

| Elemento | Conclusión | Evidencia en código |
| --- | --- | --- |
| Ruta de entrada | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` registra la ruta en `handlers::audio::handle_audio_transcription` |
| Formatos compatibles | Identificados por extensión de archivo: `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| Tamaño de archivo | **Límite estricto de 15MB** (si excede, devuelve 413 + mensaje de error de texto) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`;`src-tauri/src/proxy/handlers/audio.rs` |
| Límite general de body del proxy inverso | Axum permite hasta 100MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| Parámetros predeterminados | `model="gemini-2.0-flash-exp"`;`prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## Sígueme paso a paso

### Paso 1: Confirma que el gateway está en ejecución (/healthz)

**Por qué**
Primero descarta problemas como puerto incorrecto o servicio no iniciado.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**Deberías ver**: un JSON similar a `{"status":"ok"}`.

### Paso 2: Prepara un archivo de audio que no exceda 15MB

**Por qué**
El servidor realiza una validación de 15MB en el procesador, y si excede, devuelve 413 directamente.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**Deberías ver**: el tamaño del archivo no supera `15MB`.

### Paso 3: Llama a /v1/audio/transcriptions con curl

**Por qué**
curl es el más directo, conveniente para que primero verifiques la forma del protocolo y los mensajes de error.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**Deberías ver**: devuelve JSON, con solo un campo `text`.

```json
{
  "text": "..."
}
```

### Paso 4: Llama con el SDK de Python de OpenAI

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # si la autenticación está habilitada
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**Deberías ver**: `print(transcript.text)` genera un texto de transcripción.

## Formatos de audio compatibles

Antigravity Tools determina el tipo MIME por extensión de archivo (no mediante detección de contenido de archivo).

| Formato | Tipo MIME | Extensión |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning Formatos no compatibles
Si la extensión no está en la tabla, devolverá `400`, el cuerpo de la respuesta es un texto, por ejemplo: `不支持的音频格式: txt`。
:::

## Punto de control ✅

- [ ] El cuerpo de respuesta es `{"text":"..."}` (sin estructuras adicionales como `segments`, `verbose_json`)
- [ ] El encabezado de respuesta contiene `X-Account-Email` (marca la cuenta real utilizada)
- [ ] En la página "Monitor" puedes ver este registro de solicitud

## Manejo de payloads grandes: por qué ves 100MB pero aún así estás limitado a 15MB

El servidor eleva el límite del body de solicitud a 100MB a nivel de Axum (para evitar que algunas solicitudes grandes sean rechazadas directamente por el framework), pero el procesador de transcripción de audio realiza una validación adicional de **15MB**.

Es decir:

- `15MB < archivo <= 100MB`: la solicitud puede ingresar al procesador, pero devolverá `413` + mensaje de error de texto
- `archivo > 100MB`: la solicitud puede fallar directamente a nivel de framework (no se garantiza la forma específica del error)

### Qué verás cuando excedas 15MB

Devuelve el código de estado `413 Payload Too Large`, el cuerpo de la respuesta es un texto (no JSON), el contenido es similar a:

```
音频文件过大 (18.5 MB)。最大支持 15 MB (约 16 分钟 MP3)。建议: 1) 压缩音频质量 2) 分段上传
```

### Dos métodos ejecutables de división

1) Comprimir la calidad del audio (convertir WAV a MP3 más pequeño)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) Segmentar (cortar audio largo en varios segmentos)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## Notas sobre la recopilación de registros

### Por qué a menudo no puedes ver el cuerpo de solicitud real en Monitor

El middleware Monitor lee primero el **body de solicitud POST** para el registro:

- Si el cuerpo puede analizarse como texto UTF-8, registra el texto original
- De lo contrario, registra como `[Binary Request Data]`

La transcripción de audio usa `multipart/form-data`, que contiene contenido binario de audio, por lo que fácilmente cae en el segundo caso.

### Qué deberías ver en Monitor

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info Explicación de limitación de registro
No puedes ver el audio en sí en el registro, pero aún puedes usar `status/duration/X-Account-Email` para juzgar rápidamente: es incompatibilidad de protocolo, archivo demasiado grande o falla upstream.
:::

## Explicación de parámetros (sin "completitud empírica")

Este endpoint lee explícitamente solo 3 campos de formulario:

| Campo | ¿Obligatorio? | Valor predeterminado | Método de procesamiento |
| --- | --- | --- | --- |
| `file` | ✅ | Ninguno | Debe proporcionarse; si falta, devuelve `400` + texto `缺少音频文件` |
| `model` | ❌ | `gemini-2.0-flash-exp` | Se transmite como cadena y participa en la obtención de tokens (las reglas upstream específicas se basan en la respuesta real) |
| `prompt` | ❌ | `Generate a transcript of the speech.` | Se envía como primer `text` al upstream para guiar la transcripción |

## Advertencias de problemas comunes

### ❌ Error 1: Usaste los parámetros de curl incorrectos, resultando en que no sea multipart

```bash
#Error: usar -d directamente
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

Forma correcta:

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ Error 2: La extensión del archivo no está en la lista de compatibilidad

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

Forma correcta: solo carga archivos de audio (`.mp3`, `.wav`, etc.).

### ❌ Error 3: Tratar 413 como "el gateway está roto"

`413` aquí generalmente significa que se activó la validación de 15MB. Primero haz compresión/segmentación, en lugar de reintentar a ciegas.

## Resumen de este tutorial

- **Endpoint central**: `POST /v1/audio/transcriptions` (forma compatible con Whisper)
- **Soporte de formatos**: mp3, wav, m4a, ogg, flac, aiff (aif)
- **Límite de tamaño**: 15MB (si excede, devuelve `413` + mensaje de error de texto)
- **Comportamiento de registro**: cuando multipart contiene contenido binario, Monitor mostrará `[Binary Request Data]`
- **Parámetros clave**: `file` / `model` / `prompt` (valores predeterminados ver tabla anterior)

## Próximo tutorial

> En el siguiente tutorial aprenderemos **[Endpoint MCP: exponer Web Search/Reader/Vision como herramientas invocables](/es/lbjlaq/Antigravity-Manager/platforms/mcp/)**.
>
> Aprenderás:
> - La forma de ruta y estrategia de autenticación del endpoint MCP
> - Web Search/Web Reader/Vision usan "reenvío upstream" o "herramientas integradas"
> - Qué capacidades son experimentales, no las uses en producción para evitar problemas

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Registro de ruta (/v1/audio/transcriptions + límite de body) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Procesador de transcripción de audio (multipart/15MB/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| Formatos compatibles (extensión -> MIME + 15MB) | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Middleware Monitor (Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**Constantes clave**:
- `MAX_SIZE = 15 * 1024 * 1024`: límite de tamaño de archivo de audio (15MB)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: límite superior para que Monitor lea el cuerpo de solicitud POST (100MB)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: límite superior para que Monitor lea el cuerpo de respuesta (100MB)

**Funciones clave**:
- `handle_audio_transcription()`: analiza multipart, valida extensión y tamaño, construye `inlineData` y llama al upstream
- `AudioProcessor::detect_mime_type()`: extensión -> MIME
- `AudioProcessor::exceeds_size_limit()`: validación de 15MB
- `monitor_middleware()`: envía el cuerpo de solicitud/respuesta a Proxy Monitor (solo se registra completamente si es UTF-8)

</details>
