---
title: "流式中断: 0 Token 排查 | Antigravity-Manager"
sidebarTitle: "自愈还是手动介入"
subtitle: "流式中断/0 Token/签名失效：自愈机制与排查路径"
description: "学习 Antigravity Tools 流式中断、0 Token 与签名失效的排查路径。确认 /v1/messages 或 Gemini 流式调用，读懂 peek 预读与退避重试，结合 Proxy Monitor 和日志快速定位原因并判断是否需要轮换账号。"
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 5
---

# 流式中断/0 Token/签名失效：自愈机制与排查路径

在 Antigravity Tools 里调用 `/v1/messages`（Anthropic 兼容）或 Gemini 原生流式接口时，如果你遇到“流式输出中断”“200 OK 但 0 Token”“Invalid `signature`”这类问题，本课给你一条从 UI 到日志的排查路径。

## 学完你能做什么

- 知道 0 Token/中断问题在代理里通常会先被“peek 预读”拦下来
- 能从 Proxy Monitor 里确认本次请求的账号与映射模型（`X-Account-Email` / `X-Mapped-Model`）
- 能通过日志判断是“上游流早夭”“退避重试”“轮换账号”还是“签名修复重试”
- 知道哪些情况该等代理自愈，哪些情况要手动介入

## 你现在的困境

你可能看到这些“现象”，但不知道要从哪里下手：

- 流式输出到一半断掉，客户端像“卡死”一样不再继续
- 200 OK，但 `usage.output_tokens=0` 或内容为空
- 400 错误里出现 `Invalid \`signature\``、`Corrupted thought signature`、`must be \`thinking\`` 等

这类问题大多不是“你请求写错了”，而是流式传输、上游限流/波动、或历史消息里携带的签名块触发了上游校验。Antigravity Tools 在代理层做了多道防线，你只需要按固定路径验证它到底卡在哪一步。

## 什么是 0 Token？

**0 Token**通常指一次请求最终返回的 `output_tokens=0`，并且看起来“没生成内容”。在 Antigravity Tools 里，它更常见的成因是“流式响应在真正输出前就结束/报错”，而不是模型真的生成了 0 个 token。代理会尝试用 peek 预读把这类空响应拦下来并触发重试。

## 代理在背后做的三件事（先有心智模型）

### 1) 非流式请求可能被自动转换为流式

`/v1/messages` 路径里，代理会在内部把“客户端非流式请求”转换为流式请求来请求上游，并在收到 SSE 后再收集成 JSON 返回（这样做的原因在日志里写明是“better quota”）。

源码证据：`src-tauri/src/proxy/handlers/claude.rs#L665-L913`。

### 2) Peek 预读：先等到“第一块有效数据”再把流交给客户端

对 `/v1/messages` 的 SSE 输出，代理会先 `timeout + next()` 预读，跳过心跳/注释行（以 `:` 开头），直到拿到第一块“不是空、不是心跳”的数据再开始正式转发。如果 peek 阶段就报错/超时/流结束，会直接进入下一轮尝试（下一轮通常会触发账号轮换）。

源码证据：`src-tauri/src/proxy/handlers/claude.rs#L812-L926`；Gemini 原生流式也有类似 peek：`src-tauri/src/proxy/handlers/gemini.rs#L117-L149`。

### 3) 统一退避重试 + 按状态码决定“要不要轮换账号”

代理对常见状态码做了明确的退避策略，并定义了哪些状态码会触发轮换账号。

源码证据：`src-tauri/src/proxy/handlers/claude.rs#L117-L236`。

## 🎒 开始前的准备

- 你能打开 Proxy Monitor（见 [Proxy Monitor：请求日志、筛选、详情还原与导出](../../advanced/monitoring/)）
- 你知道日志在数据目录的 `logs/` 下（见 [首次启动必懂：数据目录、日志、托盘与自动启动](../../start/first-run-data/)）

## 跟我做

### 第 1 步：确认你调用的是哪条接口路径

**为什么**
`/v1/messages`（claude handler）和 Gemini 原生（gemini handler）的自愈细节不同，先确认路径能避免你在错的日志关键字上浪费时间。

打开 Proxy Monitor，找到那条失败的请求，先记下 Path：

- `/v1/messages`：看 `src-tauri/src/proxy/handlers/claude.rs` 的逻辑
- `/v1beta/models/...:streamGenerateContent`：看 `src-tauri/src/proxy/handlers/gemini.rs` 的逻辑

**你应该看到**：请求记录里能看到 URL/方法/状态码（以及请求耗时）。

### 第 2 步：从响应 Header 里抓住“账号 + 映射模型”

**为什么**
同一个请求失败/成功，很多时候取决于“这次选到哪个账号”“被路由到哪个上游模型”。代理会把这两个信息写到响应头，先记下来，后面看日志能对上号。

在失败的那条请求里，找这些响应头：

- `X-Account-Email`
- `X-Mapped-Model`

这两项在 `/v1/messages` 和 Gemini handler 里都会设置（例如 `/v1/messages` 的 SSE 响应里：`src-tauri/src/proxy/handlers/claude.rs#L887-L896`；Gemini SSE：`src-tauri/src/proxy/handlers/gemini.rs#L235-L245`）。

**你应该看到**：`X-Account-Email` 是邮箱，`X-Mapped-Model` 是实际请求的模型名。

### 第 3 步：在 app.log 里判断是不是“peek 阶段就失败”

**为什么**
peek 失败通常意味着“上游根本没开始吐有效数据”。这类问题最常见的处理方式是重试/轮换账号，你需要确认代理有没有触发。

先定位日志文件（日志目录来自数据目录的 `logs/`，并按天滚动写入 `app.log*`）。

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

然后在最新的 `app.log*` 里搜这些关键字：

- `/v1/messages`（claude handler）：`Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data`（`src-tauri/src/proxy/handlers/claude.rs#L828-L864`）
- Gemini 原生流式：`[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately`（`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`）

**你应该看到**：如果触发了 peek 重试，日志里会出现类似 “retrying...” 的告警，并且随后会进入下一轮 attempt（通常会带来账号轮换）。

### 第 4 步：如果是 400/Invalid `signature`，确认代理是否做了“签名修复重试”

**为什么**
签名类错误经常来自历史消息里的 Thinking 块/签名块不符合上游要求。Antigravity Tools 会尝试“降级历史 thinking 块 + 注入修复提示词”再重试，你应该先让它自愈跑完。

你可以用 2 个信号判断它是否进入了修复逻辑：

1. 日志里出现 `Unexpected thinking signature error ... Retrying with all thinking blocks removed.`（`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`）
2. 随后会把历史 `Thinking` 块转换为 `Text`，并在最后一条 user message 追加修复提示词（`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`；Gemini handler 也会对 `contents[].parts` 追加同样的提示词：`src-tauri/src/proxy/handlers/gemini.rs#L300-L325`）

**你应该看到**：代理会在短延迟后自动重试（`FixedDelay`），并可能进入下一轮尝试。

## 检查点 ✅

- [ ] 你能在 Proxy Monitor 里确认请求路径（`/v1/messages` 或 Gemini 原生）
- [ ] 你能拿到本次请求的 `X-Account-Email` 与 `X-Mapped-Model`
- [ ] 你能在 `logs/app.log*` 里搜到 peek/重试相关关键字
- [ ] 遇到 400 签名错误时，你能确认代理是否进入“修复提示词 + 清理 thinking 块”的重试逻辑

## 踩坑提醒

| 场景 | 你可能会怎么做（❌） | 推荐做法（✓） |
| --- | --- | --- |
| 看到 0 Token 就立刻手动重试很多次 | 一直按客户端重试按钮，完全不看日志 | 先看一次 Proxy Monitor + app.log，确认是否是 peek 阶段早夭（会自动重试/轮换） |
| 遇到 `Invalid \`signature\`` 就直接清空数据目录 | 把 `.antigravity_tools` 整个删掉，账号/统计全没了 | 先让代理执行一次“签名修复重试”；只有在日志明确提示不可恢复时，再考虑手动介入 |
| 把“服务端波动”当成“账号坏了” | 400/503/529 一律轮换账号 | 轮换是否有效取决于状态码；代理本身有 `should_rotate_account(...)` 规则（`src-tauri/src/proxy/handlers/claude.rs#L226-L236`） |

## 本课小结

- 0 Token/流式中断在代理里通常先经过 peek 预读；peek 阶段失败会触发重试并进入下一轮 attempt
- `/v1/messages` 可能会把非流式请求内部转换为流式再收集回 JSON，这会影响你理解“为什么看起来像流式问题”
- 签名失效类 400 错误，代理会尝试“修复提示词 + 清理 thinking 块”再重试，你优先验证这条自愈路径是否走通

## 下一课预告

> 下一课我们学习 **[端点速查表](../../appendix/endpoints/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Claude handler：退避重试策略 + 轮换规则 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler：内部把非流式转换为流式（better quota） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler：peek 预读（跳过心跳/注释，避免空流） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler：400 签名/块顺序错误的修复重试 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler：peek 预读（防止空流 200 OK） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler：400 签名错误的修复提示词注入 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| 签名缓存（三层：tool/family/session，含 TTL/最小长度） | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Claude SSE 转换：捕获签名并写入签名缓存 | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**关键常量**：
- `MAX_RETRY_ATTEMPTS = 3`：最大重试次数（`src-tauri/src/proxy/handlers/claude.rs#L27`）
- `SIGNATURE_TTL = 2 * 60 * 60` 秒：签名缓存 TTL（`src-tauri/src/proxy/signature_cache.rs#L6`）
- `MIN_SIGNATURE_LENGTH = 50`：签名最小长度（`src-tauri/src/proxy/signature_cache.rs#L7`）

**关键函数**：
- `determine_retry_strategy(...)`：按状态码选择退避策略（`src-tauri/src/proxy/handlers/claude.rs#L117-L167`）
- `should_rotate_account(...)`：按状态码决定是否轮换账号（`src-tauri/src/proxy/handlers/claude.rs#L226-L236`）
- `SignatureCache::cache_session_signature(...)`：缓存会话签名（`src-tauri/src/proxy/signature_cache.rs#L149-L188`）

</details>
