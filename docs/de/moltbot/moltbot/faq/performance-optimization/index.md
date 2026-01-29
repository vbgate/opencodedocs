---
title: "Leistungsoptimierung: Gateway-Antwortgeschwindigkeit und Speicherverwaltung verbessern | Clawdbot-Tutorial"
sidebarTitle: "Was tun bei langsamer Antwort"
subtitle: "Leistungsoptimierung: Gateway-Antwortgeschwindigkeit und Speicherverwaltung verbessern"
description: "Lernen Sie, wie Sie die Leistung von Clawdbot optimieren können, einschließlich Prompt-Caching (Prompt Caching), Session-Pruning (Session Pruning), Parallelitätssteuerung, Speicherverwaltung und Protokolloptimierung, um Latenz zu reduzieren, Kosten zu senken und die Antwortgeschwindigkeit zu verbessern."
tags:
  - "Leistungsoptimierung"
  - "Sitzungsverwaltung"
  - "Parallelitätssteuerung"
  - "Speicheroptimierung"
prerequisite:
  - "start-gateway-startup"
order: 330
---

---
title: "性能优化：提升 Gateway 响应速度与内存管理 | Clawdbot 教程"
sidebarTitle: "响应慢怎么办"
subtitle: "性能优化：提升 Gateway 响应速度与内存管理"
description: "学习如何优化 Clawdbot 性能，包括提示词缓存（Prompt Caching）、会话修剪（Session Pruning）、并发控制、内存管理和日志调优，降低延迟、减少成本并提升响应速度。"
tags:
  - "性能优化"
  - "会话管理"
  - "并发控制"
  - "内存优化"
prerequisite:
  - "start-gateway-startup"
order: 330
---

# 性能优化：提升 Gateway 响应速度与内存管理

**性能优化**是让 Clawdbot 保持快速响应、降低 API 成本和稳定运行的关键。本教程教你如何优化 Gateway 性能，包括提示词缓存、会话修剪、并发控制、内存管理和日志调优。

## 学完你能做什么

- 配置**提示词缓存**（Prompt Caching）以大幅减少 Anthropic API 调用成本
- 启用**会话修剪**（Session Pruning）防止上下文无限膨胀
- 调整**并发控制**（Concurrency）避免资源争用
- 优化**日志级别**和 **OpenTelemetry 采样率**减少 IO 开销
- 配置**内存刷新**（Memory Flush）和 **Compaction**保持对话流畅
- 使用**本地模型**时优化硬件配置

## 你现在的困境

::: info 典型症状
- **响应越来越慢**：早期对话很快，越往后越慢
- **API 成本飙升**：同样的对话重复计费
- **内存占用高**：Gateway 进程占用几百 MB 甚至 GB
- **队列积压**：消息处理延迟明显
- **上下文溢出**：频繁遇到"上下文已满"错误
:::

这些问题通常是因为：

1. **历史对话全量发送**：每次请求都带上完整的对话历史
2. **工具结果堆积**：长对话中每次工具调用都保留在上下文
3. **无并发控制**：多个会话同时竞争 CPU/内存/网络
4. **日志过于详细**：大量 debug 日志消耗磁盘 I/O

::: tip 一句话总结
> 优化核心就是：**减少重复计算**、**控制资源使用**、**利用缓存**。
:::

## 核心思路

Clawdbot 的性能优化围绕三个层面：

1. **Prompt 层面**：减少每次 API 调用的 token 数量
2. **Session 层面**：控制历史对话在内存中的增长
3. **Gateway 层面**：管理并发、日志、诊断开销

### 优化优先级

| 优化项             | 影响 | 难度 | 优先级 |
|--- | --- | --- | ---|
| 提示词缓存       | ⭐⭐⭐ | 简单   | P0（立即可用）   |
| 会话修剪         | ⭐⭐⭐ | 简单   | P0（立即可用）   |
| 并发控制         | ⭐⭐   | 中等   | P1（推荐配置）   |
| 内存刷新         | ⭐⭐   | 中等   | P1（推荐配置）   |
| 日志优化         | ⭐     | 简单   | P2（调试时启用）   |
| OpenTelemetry 采样 | ⭐     | 简单   | P2（生产环境）   |

## 🎒 开始前的准备

- 确保 **Gateway 正在运行**：`clawdbot status`
- 备份当前配置：`cp ~/.clawdbot/clawdbot.json ~/.clawdbot/clawdbot.json.backup`
- 准备测试场景：找一个需要 AI 长对话的案例（如"帮我总结过去 7 天的工作"）

---

## 优化 1：启用提示词缓存（Prompt Caching）

### 什么是提示词缓存

Anthropic API 支持**提示词缓存**（Prompt Caching）：相同的对话历史可以缓存，避免重复计费。

::: info 适用条件
- 仅适用于 **Anthropic 模型**（Claude）
- 需要 **会话粘性**（Session Stickiness）：即同一个会话保持使用同一个认证配置
- 默认**已启用**（通过 `auth.json` 自动管理）
:::

### 为什么重要

假设你让 AI 做一个需要 10 轮对话的任务：

| 场景               | 无缓存                          | 有缓存                          |
|--- | --- | ---|
| 每轮都发送全历史 | 200,000 tokens × 10 轮 = 2M tokens | 第 1 轮 200K，后续 9 轮 ~100K（缓存命中） |
| 成本（Anthropic） | ≈$30                          | ≈$3.5（省 88%）           |
| 延迟             | 每轮都需全历史                 | 缓存命中只需发送增量内容     |

### 默认配置

**好消息**：如果你使用 **OAuth** 或 **setup-token** 方式配置 Anthropic，Clawdbot 默认已启用缓存。

查看当前缓存状态：

```bash
clawdbot models status --provider anthropic
```

你应该看到 `cacheEnabled: true`。

### 自定义缓存 TTL（可选）

如果你想控制缓存过期时间，可以在模型配置中设置：

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5",
    params: {
      cacheControlTtl: "1h"  // 1 小时缓存
    }
  }
}
```

::: warning 注意事项
- API Key 配置也支持缓存，但需要手动设置 `cacheControlTtl`
- 缓存只在 **Anthropic API** 上有效，其他提供商不支持
:::

---

## 优化 2：启用会话修剪（Session Pruning）

### 什么是会话修剪

长对话会产生大量**工具调用结果**（如 `web_search`、`browser`、`read`），这些结果会不断累积在上下文中。

**Session Pruning** 会在每次 API 调用前，自动清理过时的工具结果，只保留最新相关的部分。

### 如何启用

编辑 `~/.clawdbot/clawdbot.json`：

```json5
{
  agent: {
    contextPruning: {
      mode: "cache-ttl",     // 使用 Anthropic 的缓存 TTL 作为修剪时机
      ttl: "5m",              // 5 分钟后开始修剪
      keepLastAssistants: 3,  // 保留最后 3 条助手消息作为保护
      tools: {
        allow: ["exec", "read", "browser"],  // 只修剪这些工具的结果
        deny: ["*image*"]  // 图片结果从不修剪（因为可能被引用）
      }
    }
  }
}
```

### 修剪逻辑

```mermaid
flowchart LR
    A[新工具结果] --> B{是否超过 TTL?}
    B -- 是 --> C[修剪旧结果]
    B -- 否 --> D[保留完整结果]
    C --> E[添加"..."]占位符]
    D --> E[保持不变]
```

### 修剪效果对比

| 场景           | 无修剪                          | 有修剪                          |
|--- | --- | ---|
| 工具调用次数     | 20 次都保留在上下文          | 只保留最近 5 次有效结果      |
| 上下文大小       | 200,000 tokens                | ~80,000 tokens（减少 60%）     |
| API 调用延迟     | 随时间增长明显                   | 相对稳定                        |

---

## 优化 3：配置压缩与内存刷新（Compaction + Memory Flush）

### 什么是压缩（Compaction）

当**上下文窗口接近上限**时，Clawdbot 会自动**压缩**（Compact）历史对话：

- 将旧对话**总结为一条摘要**
- 保留**最近消息**不变
- 摘要存储在会话历史中

### 什么是内存刷新（Memory Flush）

在压缩之前，Clawdbot 可以执行一个**静默的内存刷新**（Memory Flush）：

- 触发 Agent 主动"写入记忆"
- 将持久化笔记保存到磁盘（`memory/YYYY-MM-DD.md`）
- 避免摘要后丢失关键信息

### 配置压缩与刷新

```json5
{
  agent: {
    compaction: {
      autoCompact: true,           // 自动压缩（默认启用）
      memoryFlush: {
        enabled: true,              // 启用内存刷新
        softThresholdTokens: 4000, // 上下文达到 4K tokens 时触发
        prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
      }
    }
  }
}
```

### 手动触发压缩

如果感觉对话"卡住了"或上下文已满，可以手动压缩：

```bash
# 在聊天中发送命令
/compact Focus on decisions and open questions
```

你应该看到：

```
🧹 Auto-compaction complete
📊 Compactions: 5
```

---

## 优化 4：调整并发控制（Concurrency）

### 队列架构

Clawdbot 使用**车道队列**（Lane Queue）管理并发：

- **主车道**（`main`）：所有会话共享
- **子车道**（`cron`、`subagent`）：独立并发池
- **会话车道**：每个会话有独立队列，保证顺序执行

### 配置全局并发

```json5
{
  agent: {
    maxConcurrent: 4,           // 全局最大并发（默认：4）
    maxConcurrentPerSession: 1  // 每会话最大并发（默认：1）
  }
}
```

### 并发选择建议

| 使用场景         | 推荐并发 | 原因                             |
|--- | --- | ---|
| 轻量使用（个人助手） | 2-4      | 充分利用多核，减少响应时间       |
| 高频消息（群聊）     | 4-8      | 防止队列积压，保持低延迟       |
| 资源受限（低配设备） | 1-2      | 避免内存溢出，系统卡顿         |
| 大模型（本地 200B）  | 1-2      | GPU 内存有限，单任务更稳定         |

### 配置消息队列模式

如果你在群聊或频道中使用 Clawdbot，可以调整队列策略：

```json5
{
  messages: {
    queue: {
      mode: "collect",        // "collect" | "followup" | "steer" | "interrupt"
      debounceMs: 1000,      // 防抖：等待 1 秒再处理
      cap: 20,                // 队列上限
      drop: "summarize"       // 超限策略："old" | "new" | "summarize"
    }
  }
}
```

::: tip 队列模式对比
| 模式       | 行为                           | 适用场景                 |
|--- | --- | ---|
| `collect`  | 合并为单次 followup            | 避免重复响应             |
| `followup` | 每条消息独立处理              | 保持线程独立               |
| `steer`   | 立即注入到当前对话（取消待处理） | 快速响应追加内容          |
:::

---

## 优化 5：优化日志与诊断（Logging + Diagnostics）

### 调整日志级别

**生产环境**不建议使用 `debug` 或 `trace` 级别，会产生大量磁盘写入。

```json5
{
  logging: {
    level: "info",              // 文件日志级别
    consoleLevel: "warn",        // 终端日志级别（更少输出）
    consoleStyle: "compact"     // 紧凑输出，减少终端渲染开销
  }
}
```

| 级别   | 用途                         | 性能影响 |
|--- | --- | ---|
| `error` | 仅错误                        | 最小     |
| `warn`  | 警告和错误                    | 小       |
| `info`  | 正常运行信息                   | 中       |
| `debug` | 调试详情                      | 大       |
| `trace` | 最详细的跟踪（每个函数调用）        | 极大     |

### 配置 OpenTelemetry 采样

**OpenTelemetry** 会导出遥测数据（metrics、traces、logs），但如果采样率过高会增加网络和 CPU 开销。

```json5
{
  diagnostics: {
    enabled: true,
    otl: {
      enabled: true,
      endpoint: "http://otel-collector:4318",
      sampleRate: 0.2,           // 采样率 20%（默认：0.2）
      traces: true,             // 导出 traces（链路追踪）
      metrics: true,            // 导出 metrics（指标）
      logs: false              // 生产环境建议关闭日志导出
    }
  }
}
```

::: warning 生产环境建议
- 设置 `sampleRate` 为 `0.1` - `0.3`（10%-30% 采样）
- 将 `logs` 设为 `false`（日志量大，建议通过文件日志分析）
- 保留 `metrics` 和 `traces` 用于监控
:::

### 使用诊断标志（Diagnostics Flags）

如果你需要临时调试特定模块，可以启用**诊断标志**而不是全局 debug：

```bash
# 环境变量（一次性）
CLAWDBOT_DIAGNOSTICS=telegram.http,web.fetch

# 或配置文件
{
  diagnostics: {
    flags: ["telegram.http", "web.fetch"]
  }
}
```

::: tip 标志列表
- `telegram.http`：Telegram HTTP 请求
- `web.search`：Web 搜索工具
- `web.fetch`：网页抓取工具
- `browser.*`：浏览器操作
- `memory.*`：记忆系统
- `*`：所有诊断（慎用）
:::

---

## 优化 6：工具和网络缓存优化

### Web 搜索和抓取缓存

`web_search` 和 `web_fetch` 工具会缓存结果，减少重复请求。

```json5
{
  tools: {
    web: {
      search: {
        cacheTtlMinutes: 15    // 搜索结果缓存 15 分钟（默认）
      },
      fetch: {
        cacheTtlMinutes: 15    // 抓取内容缓存 15 分钟（默认）
      }
    }
  }
}
```

### 浏览器性能

Browser 工具会启动独立的 Chrome/Chromium 进程，默认有 2 个并发实例。

```json5
{
  browser: {
    enabled: true,
    controlUrl: "http://127.0.0.1:18791",
    concurrency: 2,               // 并发数（默认：2）
    headless: true              // 无头模式（更省资源）
    snapshotTimeoutMs: 30000    // 截图超时 30 秒
  }
}
```

::: tip 浏览器优化建议
- 使用 `headless: true`（不渲染 UI）
- 设置合理的 `snapshotTimeoutMs`（防止卡住）
- 如果不需要频繁截图，减少浏览器启动次数
:::

---

## 优化 7：本地模型硬件配置

如果你运行**本地模型**（Ollama 等），需要确保硬件配置合理。

### 内存要求

| 模型大小   | GPU 内存（推荐） | 系统内存（推荐） | CPU（最低） |
|--- | --- | --- | ---|
| 小型（7B）  | 8 GB               | 16 GB          | 4 核      |
| 中型（13B） | 16 GB              | 32 GB          | 8 核      |
| 大型（34B） | 24 GB              | 64 GB          | 16 核     |

### Docker 内存配置

```json5
{
  // fly.toml 示例
  [vm]
  memory = "2048mb"    // 每个实例 2GB
  cpus = 2

  // 或者
  memory = "4096mb"    // 4GB（推荐中型模型）
}
```

::: warning 常见问题
- **内存不足（OOM）：日志显示 `Out of memory`，需要增加内存
- **Swap 导致卡顿**：尽量避免 swap，使用足够 RAM
- **GPU 未利用**：检查 Docker 是否映射了 GPU
:::

---

## 优化 8：监控与诊断

### 实时监控

```bash
# 查看实时队列深度
clawdbot logs --follow | grep "queue.depth"

# 监控会话数
clawdbot status | grep "Sessions"
```

### 定期诊断

```bash
# 运行完整诊断
clawdbot doctor

# 查看 API 使用统计
clawdbot models status --provider anthropic
```

你应该看到：

```
✓ Gateway is running
✓ 3 active sessions
✓ Last Anthropic call: 2m ago
✓ Cache hits: 85% (cost savings)
```

### 性能基线

建议记录以下指标，建立性能基线：

| 指标           | 正常范围        | 异常阈值     |
|--- | --- | ---|
| 首字响应延迟     | < 2 秒     | > 5 秒      |
| 会话上下文大小     | < 100K tokens | > 150K tokens |
| 队列等待时间       | < 2 秒     | > 10 秒      |
| CPU 使用率（持续） | < 50%      | > 80%       |
| 内存使用率（持续） | < 70%      | > 90%       |

---

## 踩坑提醒

### ❌ 不要过度修剪

**问题**：将 `keepLastAssistants` 设得太小，导致重要上下文丢失。

**错误示例**：
```json5
{
  agent: {
    contextPruning: {
      keepLastAssistants: 0  // ❌ 会导致连续对话中断
    }
  }
}
```

**正确做法**：保留 2-5 条助手消息作为"记忆锚点"。

### ❌ 不要禁用压缩

**问题**：关闭 `autoCompact` 会导致上下文无限膨胀。

**错误示例**：
```json5
{
  agent: {
    compaction: {
      autoCompact: false  // ❌ 长对话会崩溃
    }
  }
}
```

**正确做法**：保持 `autoCompact: true`，必要时手动 `/compact`。

### ❌ 不要使用过高的并发

**问题**：在低配设备上设置 `maxConcurrent: 10` 会导致内存溢出。

**正确做法**：根据硬件限制合理设置，建议不超过 CPU 核心数的 2 倍。

### ❌ 不要在生产环境启用 trace 日志

**问题**：`trace` 级别会产生大量日志，导致：

- 磁盘 I/O 爆满
- 日志轮转频繁
- 查询困难

**正确做法**：生产环境使用 `info` 或 `warn`，调试时才用 `debug`。

---

## 本课小结

本课我们学习了 Clawdbot 的**完整性能优化策略**：

### 核心优化点

1. ✅ **提示词缓存**：减少 Anthropic API 成本 70%+
2. ✅ **会话修剪**：控制上下文增长，避免溢出
3. ✅ **压缩与刷新**：自动总结历史，保存持久记忆
4. ✅ **并发控制**：平衡资源使用，防止队列积压
5. ✅ **日志优化**：调整级别，减少 I/O 开销
6. ✅ **OpenTelemetry 采样**：监控而不影响性能
7. ✅ **工具缓存**：减少重复网络请求
8. ✅ **硬件配置**：本地模型的内存和 CPU 优化

### 推荐配置模板

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5",
    params: {
      cacheControlTtl: "1h"
    },
    maxConcurrent: 4,
    contextPruning: {
      mode: "cache-ttl",
      ttl: "5m",
      keepLastAssistants: 3
    },
    compaction: {
      autoCompact: true,
      memoryFlush: {
        enabled: true,
        softThresholdTokens: 4000
      }
    }
  },
  logging: {
    level: "info",
    consoleLevel: "warn",
    consoleStyle: "compact"
  },
  diagnostics: {
    enabled: true,
    otl: {
      enabled: true,
      sampleRate: 0.2,
      traces: true,
      metrics: true,
      logs: false
    }
  }
}
```

### 预期效果

| 指标           | 优化前   | 优化后   | 改善     |
|--- | --- | --- | ---|
| 平均响应延迟     | 3-5 秒  | 1-2 秒  | -50%     |
| 单次 API 成本   | $0.50   | $0.15    | -70%     |
| 内存占用（稳定）   | 1.2 GB   | 400 MB    | -67%     |
| 会话稳定性       | 85%      | 98%      | +13%     |

---

## 下一课预告

> 下一课我们将学习 **[完整配置参考](../../appendix/config-reference/)**，深入了解 Clawdbot 所有配置项的详细说明和高级用法。
>
> 你会学到：
> - 所有配置节的结构和层次关系
> - 每个配置项的取值范围和默认值
> - 高级配置：Sandbox、Security、Gateway Network 等
> - 配置验证和最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能                    | 文件路径                                                                                                       | 行号      |
|--- | --- | ---|
| Session Pruning         | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts#L1750-L1800) | 1750-1800 |
| Compaction             | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts#L1830-L1900) | 1830-1900 |
| Memory Flush            | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts#L1840-L1870) | 1840-1870 |
| Queue + Concurrency   | [`src/gateway/server-lanes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-lanes.ts#L1-L78)           | 1-78     |
| Prompt Cache          | [`src/agents/auth-profiles.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles.ts#L1-L500)   | 1-500     |
| Logging               | [`src/logging/index.ts`](https://github.com/moltbot/moltbot/blob/main/src/logging/index.ts#L1-L200)             | 1-200     |
| Diagnostics + OpenTelemetry | [`src/diagnostics/index.ts`](https://github.com/moltbot/moltbot/blob/main/src/diagnostics/index.ts#L1-L300)   | 1-300     |
| Web Search Cache      | [`src/agents/tools/web-search.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-search.ts#L1-L200)     | 1-200     |
| Web Fetch Cache       | [`src/agents/tools/web-fetch.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-fetch.ts#L1-L150)       | 1-150     |
| Browser Concurrency     | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts#L1970-L1980) | 1970-1980 |

**关键配置常量**：
- `DEFAULT_MAX_CONCURRENT = 4`：全局最大并发数
- `DEFAULT_CACHE_TTL_MINUTES = 15`：Web 工具默认缓存时间
- `DEFAULT_OTEL_SAMPLE_RATE = 0.2`：OpenTelemetry 默认采样率

**关键函数**：
- `pruneContext()`：修剪工具结果的函数
- `compactHistory()`：压缩历史对话的函数
- `flushMemory()`：执行内存刷新的函数
- `drainLane()`：队列处理函数
- `updateSampleRate()`：动态调整采样率的函数

</details>
