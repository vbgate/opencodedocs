---
title: "状态持久化: 跨会话保留历史 | opencode-dynamic-context-pruning"
subtitle: "状态持久化: 跨会话保留历史"
sidebarTitle: "重启后不丢失数据"
description: "学习 opencode-dynamic-context-pruning 的状态持久化机制。跨会话保留修剪历史，通过 /dcp stats 查看累计 Token 节省效果。"
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# 状态持久化：跨会话保留修剪历史

## 学完你能做什么

- 理解 DCP 如何跨 OpenCode 重启保留修剪状态
- 知道持久化文件的存储位置和内容格式
- 掌握会话切换和上下文压缩时的状态管理逻辑
- 通过 `/dcp stats` 查看所有会话的累计 Token 节省

## 你现在的困境

你关闭了 OpenCode，重新打开后发现之前的修剪记录不见了？或者想知道 `/dcp stats` 中的"所有会话累计节省"是从哪里来的？

DCP 的状态持久化机制会自动在后台保存你的修剪历史和统计数据，确保重启后依然可见。

## 什么时候用这一招

- 需要跨会话累计统计 Token 节省
- 重启 OpenCode 后继续修剪历史
- 长期使用 DCP，想看到整体效果

## 核心思路

**什么是状态持久化**

**状态持久化**是指 DCP 将修剪历史和统计数据保存到磁盘文件中，确保在 OpenCode 重启或会话切换后，这些信息不会丢失。

::: info 为什么需要持久化？

如果没有持久化，每次关闭 OpenCode 后：
- 修剪的工具 ID 列表会丢失
- Token 节省统计会清零
- AI 可能重复修剪同一个工具

持久化后，DCP 能够：
- 记住哪些工具已经被修剪
- 累计所有会话的 Token 节省
- 重启后继续之前的工作
:::

**持久化内容的两大部分**

DCP 保存的状态包含两类信息：

| 类型 | 内容 | 用途 |
| ---- | ---- | ---- |
| **修剪状态** | 已修剪工具的 ID 列表 | 避免重复修剪，跨会话追踪 |
| **统计数据** | Token 节省数量（当前会话 + 历史累计） | 展示 DCP 效果，长期趋势分析 |

这些数据按 OpenCode 会话 ID 分别存储，每个会话对应一个 JSON 文件。

## 数据流向

```mermaid
graph TD
    subgraph "修剪操作"
        A1[AI 调用 discard/extract]
        A2[用户执行 /dcp sweep]
    end

    subgraph "内存状态"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "持久化存储"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|异步保存| C1
    B2 -->|异步保存| C1
    C1 --> C2

    C2 -->|会话切换时加载| B1
    C2 -->|会话切换时加载| B2

    D[OpenCode summary 消息] -->|清空缓存| B1
```

## 跟我做

### 第 1 步：了解持久化存储位置

**为什么**
知道数据存在哪里，可以手动检查或删除（如果需要）

DCP 将状态保存在本地文件系统中，不会上传到云端。

```bash
# 持久化目录位置
~/.local/share/opencode/storage/plugin/dcp/

# 每个会话一个 JSON 文件，格式：{sessionId}.json
```

**你应该看到**：目录下可能有多个 `.json` 文件，每个对应一个 OpenCode 会话

::: tip 数据隐私

DCP 仅在本地保存修剪状态和统计数据，不涉及任何敏感信息。持久化文件包含：
- 工具 ID 列表（数字标识符）
- Token 节省数量（统计数据）
- 最后更新时间（时间戳）

不包含对话内容、工具输出或用户输入。
:::

### 第 2 步：查看持久化文件格式

**为什么**
了解文件结构，可以手动检查或调试问题

```bash
# 列出所有持久化文件
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# 查看某个会话的持久化内容
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**你应该看到**：类似这样的 JSON 结构

```json
{
  "sessionName": "我的会话名称",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**字段说明**：

| 字段 | 类型 | 含义 |
| ---- | ---- | ---- |
| `sessionName` | string (可选) | 会话名称，方便识别 |
| `prune.toolIds` | string[] | 已修剪工具的 ID 列表 |
| `stats.pruneTokenCounter` | number | 当前会话节省的 Token 数（未归档） |
| `stats.totalPruneTokens` | number | 历史累计节省的 Token 数 |
| `lastUpdated` | string | ISO 8601 格式的最后更新时间 |

### 第 3 步：查看累计统计

**为什么**
了解所有会话的累计效果，评估 DCP 的长期价值

```bash
# 在 OpenCode 中执行
/dcp stats
```

**你应该看到**：统计信息面板

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**统计数据含义**：

| 统计项 | 来源 | 说明 |
| ------ | ---- | ---- |
| **Session** | 当前内存状态 | 当前会话的修剪效果 |
| **All-time** | 所有持久化文件 | 所有历史会话的累计效果 |

::: info All-time 统计如何计算

DCP 会遍历 `~/.local/share/opencode/storage/plugin/dcp/` 目录下的所有 JSON 文件，累加：
- `totalPruneTokens`：所有会话节省的 Token 总数
- `toolIds.length`：所有会话修剪的工具总数
- 文件数量：会话总数

这样你就能看到 DCP 在长期使用中的整体效果。
:::

### 第 4 步：理解自动保存机制

**为什么**
知道 DCP 何时保存状态，避免误操作丢失数据

DCP 在以下时机自动保存状态到磁盘：

| 触发时机 | 保存内容 | 调用位置 |
| -------- | -------- | -------- |
| AI 调用 `discard`/`extract` 工具后 | 更新的修剪状态 + 统计 | `lib/strategies/tools.ts:148-150` |
| 用户执行 `/dcp sweep` 命令后 | 更新的修剪状态 + 统计 | `lib/commands/sweep.ts:234-236` |
| 修剪操作完成后 | 异步保存，不阻塞主流程 | `saveSessionState()` |

**保存流程**：

```typescript
// 1. 更新内存状态
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. 异步保存到磁盘
await saveSessionState(state, logger)
```

::: tip 异步保存的好处

DCP 使用异步保存机制，确保修剪操作不会被磁盘 I/O 阻塞。即使保存失败（如磁盘空间不足），也不会影响当前会话的修剪效果。

失败时会记录警告日志到 `~/.config/opencode/logs/dcp/`。
:::

### 第 5 步：理解自动加载机制

**为什么**
知道 DCP 何时加载持久化状态，理解会话切换的行为

DCP 在以下时机自动加载持久化状态：

| 触发时机 | 加载内容 | 调用位置 |
| -------- | -------- | -------- |
| OpenCode 启动或切换会话时 | 该会话的历史修剪状态 + 统计 | `lib/state/state.ts:104`（在 `ensureSessionInitialized` 函数内部） |

**加载流程**：

```typescript
// 1. 检测会话 ID 变化
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. 重置内存状态
resetSessionState(state)
state.sessionId = lastSessionId

// 3. 从磁盘加载持久化状态
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**你应该看到**：切换到之前的会话后，`/dcp stats` 显示的历史统计数据保留不变

### 第 6 步：理解上下文压缩时的状态清理

**为什么**
了解 OpenCode 自动压缩上下文时，DCP 如何处理状态

当 OpenCode 检测到对话过长时，会自动生成 summary 消息压缩上下文。DCP 会检测到这种压缩并清理相关状态。

```typescript
// 检测到 summary 消息时的处理
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // 清空工具缓存
    state.prune.toolIds = []       // 清空修剪状态
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info 为什么需要清空？

OpenCode 的 summary 消息会压缩整个对话历史，此时：
- 旧的工具调用已经被合并到 summary 中
- 保留工具 ID 列表已无意义（工具已不存在）
- 清空状态避免引用无效的工具 ID

这是设计上的权衡：牺牲部分修剪历史，保证状态一致性。
:::

## 检查点 ✅

确认你理解了以下要点：

- [ ] DCP 的持久化文件存储在 `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] 每个会话对应一个 `{sessionId}.json` 文件
- [ ] 持久化内容包含修剪状态（toolIds）和统计数据（totalPruneTokens）
- [ ] `/dcp stats` 的"All-time"统计来自所有持久化文件的累加
- [ ] 修剪操作后自动异步保存，不阻塞主流程
- [ ] 会话切换时自动加载该会话的历史状态
- [ ] 检测到 OpenCode summary 消息时清空工具缓存和修剪状态

## 踩坑提醒

### ❌ 误删持久化文件

**问题**：手动删除了 `~/.local/share/opencode/storage/plugin/dcp/` 目录下的文件

**后果**：
- 历史修剪状态丢失
- 累计统计归零
- 但不影响当前会话的修剪功能

**解决**：重新开始使用，DCP 会自动创建新的持久化文件

### ❌ 子代理状态不可见

**问题**：在子代理中修剪了工具，但回到主代理后看不到这些修剪记录

**原因**：子代理有独立的 `sessionId`，修剪状态会被持久化到独立的文件。但切换回主代理时，由于主代理的 `sessionId` 不同，不会加载子代理的持久化状态

**解决**：这是设计行为。子代理会话的状态是独立的，不会与主代理共享。如果你想统计所有修剪记录（包括子代理），可以使用 `/dcp stats` 的"All-time"统计（它会累加所有持久化文件的数据）

### ❌ 磁盘空间不足导致保存失败

**问题**：`/dcp stats` 显示的"All-time"统计没有增长

**原因**：可能是磁盘空间不足，保存失败

**解决**：检查日志文件 `~/.config/opencode/logs/dcp/`，查看是否有"Failed to save session state"错误

## 本课小结

**状态持久化的核心价值**：

1. **跨会话记忆**：记住哪些工具已被修剪，避免重复工作
2. **累计统计**：长期跟踪 DCP 的 Token 节省效果
3. **重启恢复**：OpenCode 重启后继续之前的工作

**数据流向总结**：

```
修剪操作 → 更新内存状态 → 异步保存到磁盘
                ↑
会话切换 → 从磁盘加载 → 恢复内存状态
                ↑
上下文压缩 → 清空内存状态（不删除磁盘文件）
```

**关键要点**：

- 持久化是本地文件操作，不影响修剪性能
- `/dcp stats` 的"All-time"来自所有历史会话的累加
- 子代理会话不持久化，这是设计行为
- 上下文压缩时会清空缓存，保证状态一致性

## 下一课预告

> 下一课我们学习 **[Prompt 缓存影响](/zh/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**。
>
> 你会学到：
> - DCP 修剪如何影响 Prompt Caching
> - 如何权衡缓存命中率和 Token 节省
> - 理解 Anthropic 的缓存计费机制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| ---- | ---- | ---- |
| 持久化接口定义 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| 保存会话状态 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| 加载会话状态 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| 加载所有会话统计 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| 存储目录常量 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| 会话状态初始化 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| 检测上下文压缩 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| 统计命令处理 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| 修剪工具保存状态 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**关键常量**：
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`：持久化文件存储根目录

**关键函数**：
- `saveSessionState(state, logger)`：异步保存会话状态到磁盘
- `loadSessionState(sessionId, logger)`：从磁盘加载指定会话的状态
- `loadAllSessionStats(logger)`：聚合所有会话的统计数据
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`：确保会话已初始化，会加载持久化状态

**关键接口**：
- `PersistedSessionState`：持久化状态的结构定义
- `AggregatedStats`：累计统计数据的结构定义

</details>
