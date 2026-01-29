---
title: "调试日志: 排查问题与监控运行状态 | opencode-antigravity-auth"
sidebarTitle: "日志帮你找问题"
subtitle: "调试日志：排查问题与监控运行状态"
description: "学习如何启用调试日志，排查 Antigravity Auth 插件问题。涵盖日志级别、内容解读、环境变量配置及日志文件管理方法。"
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# 调试日志：排查问题与监控运行状态

## 学完你能做什么

- 启用调试日志，记录所有请求和响应的详细信息
- 理解不同的日志级别和适用场景
- 解读日志内容，快速定位问题根源
- 使用环境变量临时启用调试，无需修改配置文件
- 管理日志文件，避免磁盘占用过大

## 你现在的困境

遇到问题时，你可能会：

- 看到模糊的错误提示，不知道具体原因
- 不知道请求是否成功到达 Antigravity API
- 怀疑是账户选择、速率限制或请求转换出了问题
- 向别人求助时，无法提供有价值的诊断信息

## 什么时候用这一招

调试日志适合以下场景：

| 场景 | 是否需要 | 原因 |
|--- | --- | ---|
| 排查 429 速率限制 | ✅ 需要 | 查看具体是哪个账户、哪个模型限速 |
| 排查认证失败 | ✅ 需要 | 检查令牌刷新、OAuth 流程 |
| 排查请求转换问题 | ✅ 需要 | 对比原始请求和转换后的请求 |
| 排查账户选择策略 | ✅ 需要 | 查看插件如何选择账户 |
| 监控日常运行状态 | ✅ 需要 | 统计请求频率、成功/失败率 |
| 长期运行 | ⚠️ 谨慎 | 日志会持续增长，需要管理 |

::: warning 前置检查
开始本教程前，请确保你已经完成：
- ✅ 安装了 opencode-antigravity-auth 插件
- ✅ 成功通过 OAuth 认证
- ✅ 可以使用 Antigravity 模型发起请求

[快速安装教程](../../start/quick-install/) | [首次请求教程](../../start/first-request/)
:::

## 核心思路

调试日志系统的工作原理：

1. **结构化日志**：每条日志都带时间戳和标签，便于过滤和分析
2. **分级记录**：
   - Level 1（basic）：记录请求/响应元信息、账户选择、速率限制事件
   - Level 2（verbose）：完整记录请求/响应 body（最多 50,000 字符）
3. **安全屏蔽**：自动隐藏敏感信息（如 Authorization header）
4. **独立文件**：每次启动创建新的日志文件，避免混乱

**日志内容概览**：

| 日志类型 | 标签 | 内容示例 |
|--- | --- | ---|
| 请求追踪 | `Antigravity Debug ANTIGRAVITY-1` | URL、headers、body 预览 |
| 响应追踪 | `Antigravity Debug ANTIGRAVITY-1` | 状态码、耗时、响应 body |
| 账户上下文 | `[Account]` | 选中账户、账户索引、模型族 |
| 速率限制 | `[RateLimit]` | 限速详情、重置时间、重试延迟 |
| 模型识别 | `[ModelFamily]` | URL 解析、模型提取、模型族判断 |

## 跟我做

### 第 1 步：启用基本调试日志

**为什么**
启用基本调试日志后，插件会记录所有请求的元信息，包括 URL、headers、账户选择、速率限制事件等，帮助你在不泄露敏感数据的情况下排查问题。

**操作**

编辑插件配置文件：

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

添加或修改以下配置：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

保存文件并重启 OpenCode。

**你应该看到**：

1. OpenCode 启动后，配置目录下会生成新的日志文件
2. 日志文件命名格式：`antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. 发起任意请求后，日志文件中会出现新的记录

::: tip 日志文件位置
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### 第 2 步：解读日志内容

**为什么**
了解日志的格式和内容，才能快速定位问题。

**操作**

发起一个测试请求，然后查看日志文件：

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**你应该看到**：

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**日志解读**：

1. **时间戳**：`[2026-01-23T10:30:15.123Z]` - ISO 8601 格式，精确到毫秒
2. **账户选择**：`[Account]` - 插件选择了账户 1，总共 2 个账户，模型族为 claude
3. **请求开始**：`Antigravity Debug ANTIGRAVITY-1` - 请求 ID 为 1
4. **请求方法**：`POST https://...` - HTTP 方法和目标 URL
5. **是否流式**：`Streaming: yes/no` - 是否使用 SSE 流式响应
6. **请求头**：`Headers: {...}` - 自动隐藏 Authorization（显示 `[redacted]`）
7. **请求体**：`Body Preview: {...}` - 请求内容（最多 12,000 字符，超出部分截断）
8. **响应状态**：`Response 200 OK (3330ms)` - HTTP 状态码和耗时
9. **响应头**：`Response Headers: {...}` - 响应 headers

### 第 3 步：启用详细日志（Verbose）

**为什么**
详细日志会记录完整的请求/响应 body（最多 50,000 字符），适合排查请求转换、响应解析等深层问题。

**操作**

修改配置为 verbose 级别：

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

或者使用环境变量（推荐，无需修改配置文件）：

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**你应该看到**：

1. 日志文件中会出现完整的请求/响应 body（不再是截断的 preview）
2. 对于大型响应，会显示前 50,000 字符并标记截断字符数

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning 磁盘空间警告
详细日志会记录完整的请求/响应内容，可能导致日志文件快速增长。调试完成后，务必关闭 verbose 模式。
:::

### 第 4 步：排查速率限制问题

**为什么**
速率限制（429 错误）是最常见的问题之一，日志可以告诉你具体是哪个账户、哪个模型限速，以及需要等待多久。

**操作**

发起多个并发请求触发速率限制：

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

查看日志中的速率限制事件：

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**你应该看到**：

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**日志解读**：

1. **限速详情**：`429 on Account 1 family=claude retryAfterMs=60000`
   - 账户 1（claude 模型族）遇到 429 错误
   - 需要等待 60,000 毫秒（60 秒）后重试
2. **错误消息**：`message: Resource has been exhausted` - 配额耗尽
3. **重置时间**：`quotaResetTime: 2026-01-23T10:31:00.000Z` - 配额重置的精确时间
4. **账户切换**：插件自动切换到账户 2
5. **全局快照**：`snapshot` - 显示所有账户的限速状态

### 第 5 步：自定义日志目录

**为什么**
默认情况下，日志文件存储在 `~/.config/opencode/antigravity-logs/` 目录。如果你希望将日志存储到其他位置（例如项目目录），可以自定义日志目录。

**操作**

在配置文件中添加 `log_dir` 配置项：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

或者使用环境变量：

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**你应该看到**：

1. 日志文件写入到指定的目录
2. 如果目录不存在，插件会自动创建
3. 日志文件命名格式不变

::: tip 路径建议
- 开发调试：存储在项目根目录（`.logs/`）
- 生产环境：存储在系统日志目录（`/var/log/` 或 `~/Library/Logs/`）
- 临时调试：存储在 `/tmp/` 目录，方便清理
:::

### 第 6 步：清理和管理日志文件

**为什么**
长期运行时，日志文件会持续增长，占用大量磁盘空间。定期清理是必要的。

**操作**

查看日志目录大小：

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

清理旧日志：

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**你应该看到**：

1. 日志目录的大小减少
2. 只保留最近 7 天的日志文件

::: tip 自动化清理
可以将清理脚本添加到 cron（Linux/macOS）或任务计划程序（Windows），定期执行清理。
:::

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 通过配置文件启用调试日志
- [ ] 使用环境变量临时启用调试
- [ ] 解读日志内容，找到请求/响应详情
- [ ] 理解不同日志级别的作用
- [ ] 自定义日志目录
- [ ] 管理和清理日志文件

## 踩坑提醒

### 日志文件持续增长

**症状**：磁盘空间被日志文件占用

**原因**：长期启用调试日志，尤其是 verbose 模式

**解决方案**：

1. 调试完成后，立即关闭 `debug: false`
2. 设置定期清理脚本（如第 6 步）
3. 监控日志目录大小，设置阈值告警

### 找不到日志文件

**症状**：启用了 `debug: true`，但日志目录为空

**原因**：
- 配置文件路径错误
- 权限问题（无法写入日志目录）
- 环境变量覆盖了配置

**解决方案**：

1. 确认配置文件路径正确：
   ```bash
   # 查找配置文件
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. 检查环境变量是否覆盖了配置：
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. 检查日志目录权限：
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### 日志内容不完整

**症状**：日志中看不到请求/响应 body

**原因**：默认使用 basic 级别（Level 1），只记录 body preview（最多 12,000 字符）

**解决方案**：

1. 启用 verbose 级别（Level 2）：
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. 或者使用环境变量：
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### 敏感信息泄露

**症状**：担心日志中包含敏感数据（如 Authorization token）

**原因**：插件会自动屏蔽 `Authorization` header，但其他 headers 可能包含敏感信息

**解决方案**：

1. 插件已自动屏蔽 `Authorization` header（显示 `[redacted]`）
2. 分享日志时，检查是否有其他敏感 headers（如 `Cookie`、`Set-Cookie`）
3. 如果发现敏感信息，手动删除后再分享

### 日志文件无法打开

**症状**：日志文件被其他进程占用，无法查看

**原因**：OpenCode 正在写入日志文件

**解决方案**：

1. 使用 `tail -f` 命令查看实时日志（不会锁文件）
2. 如果需要编辑，先关闭 OpenCode
3. 使用 `cat` 命令查看内容（不会锁文件）

## 本课小结

- 调试日志是排查问题的利器，可以记录请求/响应详情、账户选择、速率限制事件
- 有两个日志级别：basic（Level 1）和 verbose（Level 2）
- 环境变量可以临时启用调试，无需修改配置文件
- 插件会自动屏蔽敏感信息（如 Authorization header）
- 长期运行时需要定期清理日志文件

## 下一课预告

> 下一课我们学习 **[速率限制处理](../rate-limit-handling/)**。
>
> 你会学到：
> - 速率限制的检测机制和重试策略
> - 指数退避算法的工作原理
> - 如何配置最大等待时间和重试次数
> - 多账户场景下的速率限制处理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| Debug 模块 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全文   |
| 调试初始化 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| 请求追踪 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| 响应记录 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header 屏蔽 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| 速率限制日志 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| 配置 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**关键常量**：

| 常量名 | 值 | 说明 |
|--- | --- | ---|
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Basic 级别的 body 预览长度 |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Verbose 级别的 body 预览长度 |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | 调试日志前缀 |

**关键函数**：

- `initializeDebug(config)`：初始化调试状态，读取配置和环境变量
- `parseDebugLevel(flag)`：解析调试级别字符串（"0"/"1"/"2"/"true"/"verbose"）
- `getLogsDir(customLogDir?)`：获取日志目录，支持自定义路径
- `createLogFilePath(customLogDir?)`：生成带时间戳的日志文件路径
- `startAntigravityDebugRequest(meta)`：开始请求追踪，记录请求元信息
- `logAntigravityDebugResponse(context, response, meta)`：记录响应详情
- `logAccountContext(label, info)`：记录账户选择上下文
- `logRateLimitEvent(...)`：记录速率限制事件
- `maskHeaders(headers)`：屏蔽敏感 headers（Authorization）

**配置项**（来自 schema.ts）：

| 配置项 | 类型 | 默认值 | 说明 |
|--- | --- | --- | ---|
| `debug` | boolean | `false` | 启用调试日志 |
| `log_dir` | string? | undefined | 自定义日志目录 |

**环境变量**：

| 环境变量 | 值 | 说明 |
|--- | --- | ---|
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | 覆盖 debug 配置，控制日志级别 |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | 覆盖 log_dir 配置，指定日志目录 |

</details>
