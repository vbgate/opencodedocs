---
title: "Imagen 3: OpenAI API Mapping | Antigravity"
subtitle: "Imagen 3: OpenAI API Mapping"
description: "Learn Imagen 3 via OpenAI API with Antigravity Tools: automatic size/quality mapping, 2K/4K support, b64_json/url formats, auth handling."
sidebarTitle: "Imagen Mapping"
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "Image Generation"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 999
---

# Imagen 3 Image Generation: OpenAI Images Parameters size/quality Automatic Mapping

Want to call Imagen 3 using OpenAI Images API conventions? Antigravity Tools' local reverse proxy provides `/v1/images/generations`, automatically mapping `size` / `quality` to the image aspect ratio and resolution settings required by Imagen 3.

## What You'll Learn

- Generate Imagen 3 images using `POST /v1/images/generations` without changing your existing OpenAI client/SDK calling habits
- Use `size: "WIDTHxHEIGHT"` to stably control `aspectRatio` (16:9, 9:16, etc.)
- Use `quality: "standard" | "medium" | "hd"` to control `imageSize` (standard/2K/4K)
- Understand returned `b64_json` / `url(data:...)`, and confirm the actual account used via response headers

## Your Current Challenge

You may have encountered these situations:

- Your client only calls OpenAI's `/v1/images/generations`, but you want to use Imagen 3
- The same prompt sometimes produces square images, sometimes landscape—aspect ratio control is unstable
- You wrote `size` as `16:9`, but still got 1:1 (and don't know why)

## When to Use This

- You're already using Antigravity Tools' local reverse proxy and want to unify "image generation" through the same gateway
- You want tools that support the OpenAI Images API (Cherry Studio, Kilo Code, etc.) to directly generate Imagen 3 images

## 🎒 Prerequisites

::: warning Prerequisites
This lesson assumes you can already start the local reverse proxy and know your Base URL (e.g., `http://127.0.0.1:<port>`). If you haven't gotten this working yet, please complete "Start local reverse proxy and connect first client" first.
:::

::: info Authentication Reminder
If you've enabled `proxy.auth_mode` (e.g., `strict` / `all_except_health`), you need to include the following when calling `/v1/images/generations`:

- `Authorization: Bearer <proxy.api_key>`
:::

## Core Concepts

### What does "automatic mapping" actually do?

**Imagen 3's OpenAI Images mapping** means: You still send `prompt/size/quality` according to the OpenAI Images API, the proxy parses `size` as a standard aspect ratio (like 16:9), parses `quality` as a resolution tier (2K/4K), then calls upstream `gemini-3-pro-image` using the internal request format.

::: info Model Description
`gemini-3-pro-image` is the model name for Google Imagen 3 image generation (from the project README documentation). The source code uses this model by default for image generation.
:::

### 1) size -> aspectRatio (dynamic calculation)

- The proxy parses `size` as `WIDTHxHEIGHT`, then matches standard aspect ratios based on the width-to-height ratio.
- If `size` parsing fails (e.g., not separated by `x`, or invalid numbers), it falls back to `1:1`.

### 2) quality -> imageSize (resolution tier)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"` (or other values) -> don't set `imageSize` (keep default)

### 3) n multiple images = "concurrently request n times"

This implementation doesn't depend on upstream `candidateCount > 1`, but splits `n` generations into concurrent requests, then merges results into OpenAI-style `data[]` to return.

## Follow Along

### Step 1: Confirm Proxy is Running (optional but highly recommended)

**Why**
First confirm your Base URL and authentication mode to avoid later misdiagnosing issues as "image generation failure."

::: code-group

```bash [macOS/Linux]
 # Health check (accessible without authentication when auth_mode=all_except_health)
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # Health check (accessible without authentication when auth_mode=all_except_health)
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**You should see**: Returned JSON containing `"status": "ok"`.

### Step 2: Send a minimal viable image generation request

**Why**
First get the pipeline working with the fewest fields, then add aspect ratio/image quality/quantity parameters.

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

**You should see**: The response JSON contains a `data` array, where each element has a `b64_json` field (with long content).

### Step 3: Confirm which account you're using (check response headers)

**Why**
Image generation also goes through account pool scheduling; when troubleshooting, it's critical to confirm "which account is actually generating."

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

**You should see**: The response headers contain `X-Account-Email: ...`.

### Step 4: Control aspect ratio with size (recommended: only use WIDTHxHEIGHT)

**Why**
The Imagen 3 upstream receives standardized `aspectRatio`; as long as you write `size` as a common width-height pair, it will stably map to standard ratios.

| Your size | Proxy-calculated aspectRatio |
| --- | --- |
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**You should see**: The image's aspect ratio changes as `size` changes.

### Step 5: Control resolution tier with quality (standard/medium/hd)

**Why**
You don't need to remember Imagen 3's internal fields; just use OpenAI Images' `quality` to switch resolution tiers.

| Your quality | Proxy-written imageSize |
| --- | --- |
| `"standard"` | Not set (uses upstream default) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**You should see**: `hd` has richer details (and is slower/more resource-intensive—this is upstream behavior, actual results may vary).

### Step 6: Decide whether you want b64_json or url

**Why**
In this implementation, `response_format: "url"` doesn't give you a publicly accessible URL, but returns a Data URI in `data:<mime>;base64,...` format; many tools are better suited to use `b64_json` directly.

| response_format | data[] field |
| --- | --- |
| `"b64_json"` (default) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## Checkpoint ✅

- You can use `/v1/images/generations` to return at least 1 image (`data.length >= 1`)
- You can see `X-Account-Email` in response headers and reproduce the same account issue when needed
- After changing `size` to `1920x1080`, the image ratio becomes landscape (16:9)
- After changing `quality` to `hd`, the proxy maps it to `imageSize: "4K"`

## Common Pitfalls

### 1) Writing size as 16:9 won't get you 16:9

Here's the `size` parsing logic: it splits by `WIDTHxHEIGHT`. If `size` isn't in this format, it falls back directly to `1:1`.

| Writing style | Result |
| --- | --- |
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | Falls back to 1:1 |

### 2) Enabling Authorization but not sending it won't cause success

Authentication is a question of "whether it's required":

- `proxy.auth_mode=off`: With or without `Authorization` is fine
- `proxy.auth_mode=strict/all_except_health`: Not sending `Authorization` will be rejected

### 3) When n > 1, "partial success" may occur

The implementation uses concurrent requests and merges results: if some requests fail, it may still return partial images and log the failure reasons.

## Lesson Summary

- To call Imagen 3 using `/v1/images/generations`, the key is: use `size` as `WIDTHxHEIGHT`, use `quality` as `standard/medium/hd`
- `size` controls `aspectRatio`, `quality` controls `imageSize(2K/4K)`
- `response_format=url` returns Data URI, not a public URL

## Coming Up Next

> In the next lesson, we'll learn about **[Audio Transcription: Limits and Large Payload Handling for /v1/audio/transcriptions](../audio/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
| --- | --- | --- |
| Expose OpenAI Images route | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Images generation endpoint: parse prompt/size/quality + assemble OpenAI response | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
| size/quality parsing and mapping (size->aspectRatio, quality->imageSize) | [`src-tauri/src/proxy/mappers/common_utils.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/common_utils.rs#L19-L222) | 19-222 |
| OpenAIRequest declaration for size/quality (for protocol layer compatibility) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
| OpenAI->Gemini request conversion: pass size/quality to unified parsing function | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L19-L27) | 19-27 |

**Key fields (from source code)**:
- `size`: Parsed as `WIDTHxHEIGHT` to `aspectRatio`
- `quality`: `hd -> 4K`, `medium -> 2K`, others not set

</details>
