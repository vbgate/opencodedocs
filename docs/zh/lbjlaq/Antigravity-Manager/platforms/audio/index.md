---
title: "音频 API: Whisper 兼容端点 | Antigravity-Manager"
subtitle: "音频 API: Whisper 兼容端点"
sidebarTitle: "5 分钟音频转文字"
description: "学习 Antigravity-Manager 音频转录 API 的使用。掌握 6 种格式支持、15MB 限制和大包体处理方法，快速实现音频转文本。"
tags:
  - "音频转录"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# 音频转录：/v1/audio/transcriptions 的限制与大包体处理

你可以用 **`POST /v1/audio/transcriptions` 音频转录端点**把音频文件转成文本。它长得像 OpenAI Whisper API，但会在本地网关里做格式校验、文件大小限制，并把音频作为 Gemini 的 `inlineData` 上游请求发送出去。

## 学完你能做什么

- 用 curl / OpenAI SDK 调用 `POST /v1/audio/transcriptions` 把音频转成 `{"text":"..."}`
- 弄清楚支持的 6 种音频格式，以及 **15MB 硬限制**的真实报错形态
- 知道 `model` / `prompt` 的默认值与透传方式（不猜测上游规则）
- 在 Proxy Monitor 里定位音频请求，并理解 `[Binary Request Data]` 的来源

## 你现在的困境

你想把会议录音、播客或客服通话转成文字，但经常卡在这些点：

- 不同工具对音频格式/接口形状不一样，脚本和 SDK 很难复用
- 上传失败时只看到“坏请求/网关错误”，不知道是格式不对还是文件太大
- 你想把转录放进 Antigravity Tools 的“本地网关”统一调度和监控，但不确定它到底兼容到什么程度

## 🎒 开始前的准备

::: warning 前置条件
- 你已经跑通 [启动本地反代并接入第一个客户端](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)，并知道反代端口（本页用 `8045` 举例）
- 你已经跑通 [添加账号](/zh/lbjlaq/Antigravity-Manager/start/add-account/)，至少有 1 个可用账号
:::

## 什么是音频转录端点（/v1/audio/transcriptions）？

**音频转录端点**是 Antigravity Tools 暴露的一条 OpenAI Whisper 兼容路由。客户端用 `multipart/form-data` 上传音频文件，服务端校验扩展名与大小后，把音频转成 Base64 的 `inlineData`，再调用上游 `generateContent`，最后只返回一个 `text` 字段。

## 端点与限制速览

| 项目 | 结论 | 代码证据 |
| --- | --- | --- |
| 入口路由 | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` 注册路由到 `handlers::audio::handle_audio_transcription` |
| 支持格式 | 通过文件扩展名识别：`mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| 文件大小 | **15MB 硬限制**（超过返回 413 + 文本错误信息） | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`；`src-tauri/src/proxy/handlers/audio.rs` |
| 反代总体 body limit | Axum 层面允许到 100MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| 默认参数 | `model="gemini-2.0-flash-exp"`；`prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## 跟我做

### 第 1 步：确认网关在跑（/healthz）

**为什么**
先把端口不对/服务没启动这类问题排掉。

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**你应该看到**：类似 `{"status":"ok"}` 的 JSON。

### 第 2 步：准备一个不超过 15MB 的音频文件

**为什么**
服务端会在处理器里做 15MB 校验，超过会直接返回 413。

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**你应该看到**：文件大小不超过 `15MB`。

### 第 3 步：用 curl 调用 /v1/audio/transcriptions

**为什么**
curl 最直接，方便你先验证协议形状和报错信息。

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**你应该看到**：返回 JSON，只有一个 `text` 字段。

```json
{
  "text": "..."
}
```

### 第 4 步：用 OpenAI Python SDK 调用

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # 如果开启了鉴权
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**你应该看到**：`print(transcript.text)` 输出一段转录文本。

## 支持的音频格式

Antigravity Tools 通过文件扩展名决定 MIME 类型（不是通过文件内容嗅探）。

| 格式 | MIME 类型 | 扩展名 |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning 不支持的格式
如果扩展名不在表里，会返回 `400`，响应体是一段文本，例如：`不支持的音频格式: txt`。
:::

## 检查点 ✅

- [ ] 返回体是 `{"text":"..."}`（没有 `segments`、`verbose_json` 等额外结构）
- [ ] 响应头包含 `X-Account-Email`（标记实际使用的账号）
- [ ] 在 “Monitor” 页面能看到这条请求记录

## 处理大包体：为什么你看到的是 100MB，但还是卡在 15MB

服务端在 Axum 层面把请求 body 上限放到了 100MB（防止一些大请求直接被框架拒绝），但音频转录处理器会额外做一次 **15MB 校验**。

也就是说：

- `15MB < 文件 <= 100MB`：请求能进到处理器，但会返回 `413` + 文本错误信息
- `文件 > 100MB`：请求可能会在框架层直接失败（不保证具体错误形态）

### 超过 15MB 时你会看到什么

返回状态码 `413 Payload Too Large`，响应体是一段文本（不是 JSON），内容类似：

```
音频文件过大 (18.5 MB)。最大支持 15 MB (约 16 分钟 MP3)。建议: 1) 压缩音频质量 2) 分段上传
```

### 两个可执行的拆分办法

1) 压缩音频质量（把 WAV 转成更小的 MP3）

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) 分段（把长音频切成多段）

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## 日志采集注意事项

### 为什么 Monitor 里经常看不到真实请求体

Monitor 中间件会把 **POST 请求体**先读出来做日志记录：

- 如果请求体能被当作 UTF-8 文本解析，就记录原始文本
- 否则记录为 `[Binary Request Data]`

音频转录走 `multipart/form-data`，里面有二进制音频内容，所以很容易落到第二种情况。

### 你在 Monitor 里应该看到什么

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info 日志限制说明
日志里看不到音频本体，但你仍然能用 `status/duration/X-Account-Email` 快速判断：是协议不兼容、文件太大、还是上游失败。
:::

## 参数说明（不做“经验性补全”）

这个端点只显式读取 3 个表单字段：

| 字段 | 是否必需 | 默认值 | 处理方式 |
| --- | --- | --- | --- |
| `file` | ✅ | 无 | 必须提供；缺失会返回 `400` + 文本 `缺少音频文件` |
| `model` | ❌ | `gemini-2.0-flash-exp` | 作为字符串透传，并参与 token 获取（具体上游规则以实际响应为准） |
| `prompt` | ❌ | `Generate a transcript of the speech.` | 作为第一段 `text` 发送给上游，用来引导转录 |

## 踩坑提醒

### ❌ 错误 1：用错了 curl 参数，导致不是 multipart

```bash
#错误：直接用 -d
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

正确做法：

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ 错误 2：文件扩展名不在支持列表里

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

正确做法：只上传音频文件（`.mp3`、`.wav` 等）。

### ❌ 错误 3：把 413 当成“网关坏了”

`413` 在这里通常就是 15MB 校验触发了。先做压缩/分段，比盲目重试更快。

## 本课小结

- **核心端点**：`POST /v1/audio/transcriptions`（Whisper 兼容形状）
- **格式支持**：mp3、wav、m4a、ogg、flac、aiff（aif）
- **大小限制**：15MB（超过返回 `413` + 文本错误信息）
- **日志行为**：multipart 里有二进制内容时，Monitor 会显示 `[Binary Request Data]`
- **关键参数**：`file` / `model` / `prompt`（默认值见上表）

## 下一课预告

> 下一课我们学习 **[MCP 端点：把 Web Search/Reader/Vision 作为可调用工具暴露出去](/zh/lbjlaq/Antigravity-Manager/platforms/mcp/)**。
>
> 你会学到：
> - MCP 端点的路由形态与鉴权策略
> - Web Search/Web Reader/Vision 走的是“上游转发”还是“内置工具”
> - 哪些能力是实验性的，别在生产里踩雷

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 路由注册（/v1/audio/transcriptions + body limit） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 音频转录处理器（multipart/15MB/inlineData） | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| 支持格式（扩展名 -> MIME + 15MB） | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Monitor 中间件（Binary Request Data） | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**关键常量**：
- `MAX_SIZE = 15 * 1024 * 1024`：音频文件大小限制（15MB）
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`：Monitor 读取 POST 请求体的上限（100MB）
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`：Monitor 读取响应体的上限（100MB）

**关键函数**：
- `handle_audio_transcription()`：解析 multipart、校验扩展名与大小、拼 `inlineData` 并调用上游
- `AudioProcessor::detect_mime_type()`：扩展名 -> MIME
- `AudioProcessor::exceeds_size_limit()`：15MB 校验
- `monitor_middleware()`：将请求/响应体落到 Proxy Monitor（UTF-8 才会完整记录）

</details>
