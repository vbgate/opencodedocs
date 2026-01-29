---
title: "Audio: Transcription API | Antigravity-Manager"
sidebarTitle: "Audio"
subtitle: "Audio: Transcription API | Antigravity-Manager"
description: "Learn to use Antigravity-Manager's audio transcription API. Upload audio files via OpenAI Whisper-compatible endpoint, supporting 6 formats with 15MB limit and best practices for large payloads."
tags:
  - "Audio Transcription"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 999
---
# Audio Transcription: /v1/audio/transcriptions Limitations & Large Payload Handling

You can use the **`POST /v1/audio/transcriptions audio transcription endpoint`** to convert audio files into text. It looks like the OpenAI Whisper API, but performs format validation and file size limits in the local gateway, then sends the audio as `inlineData` to the upstream Gemini request.

## What You'll Learn

- Use curl / OpenAI SDK to call `POST /v1/audio/transcriptions` and convert audio to `{"text":"..."}`
- Understand the 6 supported audio formats and the real error behavior of the **15MB hard limit**
- Know the default values and pass-through behavior for `model` / `prompt` (no guessing of upstream rules)
- Locate audio requests in Proxy Monitor and understand the source of `[Binary Request Data]`

## Your Current Pain Points

You want to convert meeting recordings, podcasts, or customer service calls into text, but often get stuck on:

- Different tools have different audio formats and interface conventions, making scripts and SDKs hard to reuse
- When uploads fail, you only see "Bad Request/Gateway Error" without knowing if it's a format issue or file too large
- You want to integrate transcription into Antigravity Tools' "local gateway" for unified scheduling and monitoring, but aren't sure about the actual compatibility level

## 🎒 Prerequisites

::: warning Prerequisites
- You have completed [Start Local Reverse Proxy & Connect First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) and know the reverse proxy port (using `8045` as example on this page)
- You have completed [Add Account](/lbjlaq/Antigravity-Manager/start/add-account/) and have at least 1 available account
:::

## What is the Audio Transcription Endpoint (/v1/audio/transcriptions)?

The **audio transcription endpoint** is an OpenAI Whisper-compatible route exposed by Antigravity Tools. Clients upload audio files using `multipart/form-data`, the server validates the extension and size, converts the audio to Base64 `inlineData`, calls upstream `generateContent`, and finally returns only a `text` field.

## Endpoint and Limits Overview

| Item | Conclusion | Code Evidence |
|--- | --- | ---|
| Route | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` registers route to `handlers::audio::handle_audio_transcription` |
| Supported formats | Detected by file extension: `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| File size | **15MB hard limit** (returns 413 + text error message if exceeded) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`; `src-tauri/src/proxy/handlers/audio.rs` |
| Reverse proxy overall body limit | Axum layer allows up to 100MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| Default parameters | `model="gemini-2.0-flash-exp"`; `prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## Follow Along

### Step 1: Verify Gateway is Running (/healthz)

**Why**
First rule out issues like wrong port or service not started.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**Expected output**: JSON like `{"status":"ok"}`.

### Step 2: Prepare an Audio File No Larger Than 15MB

**Why**
The server performs 15MB validation in the handler. Exceeding this directly returns 413.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**Expected output**: File size not exceeding `15MB`.

### Step 3: Call /v1/audio/transcriptions with curl

**Why**
curl is the most direct way to verify protocol shape and error messages first.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**Expected output**: Returns JSON with only a `text` field.

```json
{
  "text": "..."
}
```

### Step 4: Call with OpenAI Python SDK

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # if authentication is enabled
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**Expected output**: `print(transcript.text)` outputs a transcribed text segment.

## Supported Audio Formats

Antigravity Tools determines MIME type by file extension (not by sniffing file content).

| Format | MIME Type | Extensions |
|--- | --- | ---|
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning Unsupported Formats
If the extension is not in the table, it returns `400` with a text response body, e.g.: `Unsupported audio format: txt`.
:::

## Checkpoint ✅

- [ ] Response body is `{"text":"..."}` (no extra structure like `segments`, `verbose_json`)
- [ ] Response headers include `X-Account-Email` (marks the actual account used)
- [ ] This request record is visible in the "Monitor" page

## Handling Large Payloads: Why You See 100MB but Still Stuck at 15MB

The server sets the request body limit to 100MB at the Axum layer (preventing some large requests from being directly rejected by the framework), but the audio transcription handler performs an additional **15MB validation**.

That is to say:

- `15MB < file <= 100MB`: Request can reach handler, but returns `413` + text error message
- `file > 100MB`: Request may fail directly at framework layer (specific error shape not guaranteed)

### What You See When Exceeding 15MB

Returns status code `413 Payload Too Large` with a text response body (not JSON), content similar to:

```
Audio file too large (18.5 MB). Maximum supported size is 15 MB (approximately 16 minutes of MP3). Suggestions: 1) Compress audio quality 2) Upload in segments
```

### Two Executable Splitting Methods

1) Compress audio quality (convert WAV to smaller MP3)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) Segment (cut long audio into multiple segments)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## Log Collection Notes

### Why Real Request Bodies Often Can't Be Seen in Monitor

Monitor middleware reads **POST request body** first for logging:

- If request body can be parsed as UTF-8 text, it records the original text
- Otherwise it records as `[Binary Request Data]`

Audio transcription uses `multipart/form-data`, containing binary audio content, so it easily falls into the second case.

### What You Should See in Monitor

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info Log Limitation Note
Audio itself is not visible in logs, but you can still use `status/duration/X-Account-Email` to quickly determine: is it protocol incompatibility, file too large, or upstream failure.
:::

## Parameter Description (No "Implicit Completion")

This endpoint only reads 3 form fields:

| Field | Required | Default Value | Handling |
|--- | --- | --- | ---|
| `file` | ✅ | None | Must be provided; missing returns `400` + text `缺少音频文件` |
| `model` | ❌ | `gemini-2.0-flash-exp` | Passed through as string and participates in token acquisition (specific upstream rules subject to actual response) |
| `prompt` | ❌ | `Generate a transcript of the speech.` | Sent as first `text` segment to upstream, used to guide transcription |

## Common Pitfalls

### ❌ Error 1: Wrong curl Parameters, Not multipart

```bash
# Wrong: using -d directly
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

Correct approach:

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ Error 2: File Extension Not in Supported List

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

Correct approach: Only upload audio files (`.mp3`, `.wav`, etc.).

### ❌ Error 3: Treating 413 as "Gateway Broken"

`413` here usually means 15MB validation was triggered. Perform compression/segmentation first—it's faster than blind retries.

## Lesson Summary

- **Core endpoint**: `POST /v1/audio/transcriptions` (Whisper-compatible shape)
- **Format support**: mp3, wav, m4a, ogg, flac, aiff (aif)
- **Size limit**: 15MB (exceeding returns `413` + text error message)
- **Log behavior**: When multipart contains binary content, Monitor shows `[Binary Request Data]`
- **Key parameters**: `file` / `model` / `prompt` (see table above for defaults)

## Next Lesson Preview

> In the next lesson, we'll learn about **[MCP Endpoint: Exposing Web Search/Reader/Vision as Callable Tools](/lbjlaq/Antigravity-Manager/platforms/mcp/)**.
>
> You'll learn:
> - MCP endpoint routing shape and authentication strategy
> - Whether Web Search/Web Reader/Vision use "upstream forwarding" or "built-in tools"
> - Which capabilities are experimental—avoid stepping on landmines in production

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Route registration (/v1/audio/transcriptions + body limit) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Audio transcription handler (multipart/15MB/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
|--- | --- | ---|
| Monitor middleware (Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**Key constants**:
- `MAX_SIZE = 15 * 1024 * 1024`: Audio file size limit (15MB)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: Monitor limit for reading POST request body (100MB)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: Monitor limit for reading response body (100MB)

**Key functions**:
- `handle_audio_transcription()`: Parse multipart, validate extension and size, assemble `inlineData` and call upstream
- `AudioProcessor::detect_mime_type()`: Extension -> MIME
- `AudioProcessor::exceeds_size_limit()`: 15MB validation
- `monitor_middleware()`: Fall request/response body to Proxy Monitor (only fully logged if UTF-8)

</details>
