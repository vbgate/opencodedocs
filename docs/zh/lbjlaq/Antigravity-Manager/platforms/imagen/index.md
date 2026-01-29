---
title: "用 OpenAI Images 调 Imagen 3: 参数映射 | Antigravity"
sidebarTitle: "按 OpenAI 习惯调用"
subtitle: "Imagen 3 图片生成：OpenAI Images 参数 size/quality 自动映射"
description: "学习用 OpenAI Images API 调 Imagen 3，掌握参数映射。size(宽x高)控制比例，quality控制画质，支持 b64_json 和 url 返回。"
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "图片生成"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Imagen 3 图片生成：OpenAI Images 参数 size/quality 自动映射

想用 OpenAI Images API 的习惯调用 Imagen 3？Antigravity Tools 的本地反代提供了 `/v1/images/generations`，并把 `size` / `quality` 自动映射成 Imagen 3 需要的图片比例与分辨率设置。

## 学完你能做什么

- 用 `POST /v1/images/generations` 生成 Imagen 3 图片，不改现有 OpenAI 客户端/SDK 的调用习惯
- 用 `size: "WIDTHxHEIGHT"` 稳定控制 `aspectRatio`（16:9、9:16 等）
- 用 `quality: "standard" | "medium" | "hd"` 控制 `imageSize`（标准/2K/4K）
- 看懂返回的 `b64_json` / `url(data:...)`，并通过响应头确认实际用到的账号

## 你现在的困境

你可能遇到过这些情况：

- 客户端只会调 OpenAI 的 `/v1/images/generations`，但你想用的是 Imagen 3
- 同样的 prompt，有时是方图、有时是横图，比例控制不稳定
- 你把 `size` 写成了 `16:9`，结果还是 1:1（而且不知道为什么）

## 什么时候用这一招

- 你已经用上了 Antigravity Tools 的本地反代，希望把“图片生成”也统一走同一套网关
- 你希望让支持 OpenAI Images API 的工具（Cherry Studio、Kilo Code 等）直接生成 Imagen 3 图片

## 🎒 开始前的准备

::: warning 前置检查
本课默认你已经能启动本地反代，并且知道自己的 Base URL（例如 `http://127.0.0.1:<port>`）。如果还没跑通，请先完成「启动本地反代并接入第一个客户端」。
:::

::: info 鉴权提醒
如果你开启了 `proxy.auth_mode`（例如 `strict` / `all_except_health`），调用 `/v1/images/generations` 时需要带：

- `Authorization: Bearer <proxy.api_key>`
:::

## 核心思路

### 这套“自动映射”到底做了什么？

**Imagen 3 的 OpenAI Images 映射**指的是：你仍然按 OpenAI Images API 发送 `prompt/size/quality`，代理把 `size` 解析为标准宽高比（如 16:9），把 `quality` 解析为分辨率档位（2K/4K），再用内部请求格式调用上游的 `gemini-3-pro-image`。

::: info 模型说明
`gemini-3-pro-image` 是 Google Imagen 3 图片生成的模型名称（来自项目 README 文档）。源码中默认使用此模型进行图片生成。
:::

### 1) size -> aspectRatio（动态计算）

- 代理会把 `size` 当作 `WIDTHxHEIGHT` 来解析，然后根据宽高比匹配到标准比例。
- 如果 `size` 解析失败（例如不是 `x` 分隔、或数字非法），会回退到 `1:1`。

### 2) quality -> imageSize（分辨率档位）

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"`（或其他值）-> 不设置 `imageSize`（保持默认）

### 3) n 多图是“并发发 n 次”

这个实现不会依赖上游的 `candidateCount > 1`，而是把 `n` 次生成拆成并发的多次请求，再把结果合并成 OpenAI 风格的 `data[]` 返回。

## 跟我做

### 第 1 步：确认反代已启动（可选但强烈建议）

**为什么**
先确认你的 Base URL 和鉴权模式，避免后面把问题误判成“图片生成失败”。

::: code-group

```bash [macOS/Linux]
 # 探活（auth_mode=all_except_health 时也能无鉴权访问）
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # 探活（auth_mode=all_except_health 时也能无鉴权访问）
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**你应该看到**：返回 JSON，包含 `"status": "ok"`。

### 第 2 步：发起一次最小可用的图片生成请求

**为什么**
先用最少字段把链路跑通，再叠加比例/画质/数量等参数。

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

**你应该看到**：响应 JSON 里有 `data` 数组，数组里包含 `b64_json` 字段（内容较长）。

### 第 3 步：确认你用到的是哪一个账号（看响应头）

**为什么**
图片生成也会走账号池调度；在排障时，确认“到底是哪一个账号在生成”很关键。

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

**你应该看到**：响应头里包含 `X-Account-Email: ...`。

### 第 4 步：用 size 控制宽高比（推荐只用 WIDTHxHEIGHT）

**为什么**
Imagen 3 上游接的是标准化 `aspectRatio`；你只要把 `size` 写成一组常见的宽高，就能稳定映射到标准比例。

| 你传的 size | 代理计算出的 aspectRatio |
|--- | ---|
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**你应该看到**：图片的比例随 `size` 改变而改变。

### 第 5 步：用 quality 控制分辨率档位（standard/medium/hd）

**为什么**
你不需要记 Imagen 3 的内部字段，只用 OpenAI Images 的 `quality` 就能切换分辨率档位。

| 你传的 quality | 代理写入的 imageSize |
|--- | ---|
| `"standard"` | 不设置（走上游默认） |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**你应该看到**：`hd` 的细节更丰富（同时更慢/更吃资源，这是上游行为，具体以实际返回为准）。

### 第 6 步：决定你要 b64_json 还是 url

**为什么**
这个实现里 `response_format: "url"` 并不会给你一个可公网访问的 URL，而是返回 `data:<mime>;base64,...` 的 Data URI；很多工具更适合直接用 `b64_json`。

| response_format | data[] 的字段 |
|--- | ---|
| `"b64_json"`（默认） | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## 检查点 ✅

- 你能用 `/v1/images/generations` 返回至少 1 张图（`data.length >= 1`）
- 你能在响应头里看到 `X-Account-Email`，并能在需要时复现同一账号问题
- 你把 `size` 改成 `1920x1080` 后，图片比例会变成横图（16:9）
- 你把 `quality` 改成 `hd` 后，代理会把它映射到 `imageSize: "4K"`

## 踩坑提醒

### 1) size 写成 16:9 不会得到 16:9

这里的 `size` 解析逻辑是按 `WIDTHxHEIGHT` 来拆分的；如果 `size` 不是这种格式，会直接回退到 `1:1`。

| 写法 | 结果 |
|--- | ---|
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | 回退 1:1 |

### 2) 没开鉴权却带了 Authorization，也不会导致成功

鉴权是“是否必须”的问题：

- `proxy.auth_mode=off`：带不带 `Authorization` 都行
- `proxy.auth_mode=strict/all_except_health`：不带 `Authorization` 会被拒绝

### 3) n > 1 时，可能出现“部分成功”

实现是并发请求并合并结果：如果部分请求失败，仍可能返回部分图片，并在日志里记录失败原因。

## 本课小结

- 用 `/v1/images/generations` 调 Imagen 3，关键是记住：`size` 用 `WIDTHxHEIGHT`，`quality` 用 `standard/medium/hd`
- `size` 控制的是 `aspectRatio`，`quality` 控制的是 `imageSize(2K/4K)`
- `response_format=url` 返回的是 Data URI，不是公网 URL

## 下一课预告

> 下一课我们学习 **[音频转录：/v1/audio/transcriptions 的限制与大包体处理](../audio/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 暴露 OpenAI Images 路由 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Images 生成端点：解析 prompt/size/quality + 拼装 OpenAI 响应 | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
|--- | --- | ---|
| OpenAIRequest 声明 size/quality（用于协议层兼容） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
|--- | --- | ---|

**关键字段（来自源码）**：
- `size`：按 `WIDTHxHEIGHT` 解析为 `aspectRatio`
- `quality`：`hd -> 4K`，`medium -> 2K`，其他不设置

</details>
