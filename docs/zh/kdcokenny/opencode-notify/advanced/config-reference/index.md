---
title: "opencode-notify 配置参考：完整配置项说明与平台差异 | 教程"
sidebarTitle: "自定义通知行为"
subtitle: "配置参考：完整配置项说明"
description: "学习 opencode-notify 的完整配置项说明，包括子会话通知开关、自定义音效、静音时段和终端类型覆盖。本教程提供详细的配置参数说明、默认值、平台差异和完整示例，帮你自定义通知行为，优化工作流程，掌握 macOS、Windows、Linux 的配置技巧。"
tags:
  - "配置参考"
  - "高级配置"
prerequisite:
  - "start-quick-start"
order: 70
---

# 配置参考

## 学完你能做什么

- ✅ 了解所有可配置的参数及其含义
- ✅ 根据需求自定义通知行为
- ✅ 配置静音时段避免特定时间打扰
- ✅ 理解平台差异对配置的影响

## 你现在的困境

默认配置已经够用了，但你的工作流程可能比较特殊：
- 你需要在夜间也收到重要通知，但平时不想被打扰
- 你使用多会话并行工作，希望所有会话都通知
- 你在 tmux 中工作，发现焦点检测不符合预期
- 你想知道某个配置项到底有什么作用

## 什么时候用这一招

- **你需要自定义通知行为** - 默认配置不满足你的工作习惯
- **你想减少通知打扰** - 配置静音时段或子会话开关
- **你想调试插件行为** - 理解每个配置项的作用
- **你在多个平台使用** - 了解平台差异对配置的影响

## 核心思路

配置文件让你在不修改代码的情况下调整插件行为，就像给插件"设置菜单"。配置文件是一个 JSON 格式，放在 `~/.config/opencode/kdco-notify.json`。

**配置加载流程**：

```
插件启动
    ↓
读取用户配置文件
    ↓
与默认配置合并（用户配置优先）
    ↓
使用合并后的配置运行
```

::: info 配置文件路径
`~/.config/opencode/kdco-notify.json`
:::

## 📋 配置项说明

### 完整配置结构

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": ""
}
```

### 逐项说明

#### notifyChildSessions

| 配置项 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| `notifyChildSessions` | boolean | `false` | 是否通知子会话 |

**作用**：控制是否为子会话（sub-session）发送通知。

**什么是子会话**：
当你使用 OpenCode 的多会话功能时，会话可以分为父会话和子会话。子会话通常是父会话启动的辅助任务，比如文件读写、网络请求等。

**默认行为**（`false`）：
- 只通知父会话的完成、错误、权限请求事件
- 不通知子会话的任何事件
- 这样可以避免在多任务并行时收到大量通知

**启用后**（`true`）：
- 所有会话（父会话和子会话）都会通知
- 适合需要追踪所有子任务进度的场景

::: tip 推荐设置
保持默认 `false`，除非你确实需要追踪每个子任务的状态。
:::

#### 焦点检测（macOS）

插件会自动检测终端是否在前台，如果终端是当前活动窗口，则抑制通知发送，避免重复提醒。

**工作原理**：
- 使用 macOS 的 `osascript` 检测当前前台应用
- 对比前台应用进程名与你的终端进程名
- 如果终端在前台，不发送通知
- **问题询问通知除外**（支持 tmux 工作流）

::: info 平台差异
焦点检测功能仅在 macOS 上生效。Windows 和 Linux 不支持此特性。
:::

#### sounds

| 配置项 | 类型 | 默认值 | 平台支持 | 说明 |
| ------ | ---- | ------ | -------- | ---- |
| `sounds.idle` | string | `"Glass"` | ✅ macOS | 任务完成音效 |
| `sounds.error` | string | `"Basso"` | ✅ macOS | 错误通知音效 |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | 权限请求音效 |
| `sounds.question` | string | 未设置 | ✅ macOS | 问题询问音效（可选） |

**作用**：为不同类型的通知设置不同的系统音效（仅 macOS）。

**可用音效列表**：

| 音效名 | 听感特点 | 推荐场景 |
| ------ | -------- | -------- |
| Glass | 轻快、清脆 | 任务完成（默认） |
| Basso | 低沉、警告 | 错误通知（默认） |
| Submarine | 提醒、柔和 | 权限请求（默认） |
| Blow | 强劲 | 重要事件 |
| Bottle | 清脆 | 子任务完成 |
| Frog | 轻松 | 非正式提醒 |
| Funk | 节奏感 | 多任务完成 |
| Hero | 宏伟 | 里程碑完成 |
| Morse | 摩尔斯电码 | 调试相关 |
| Ping | 清脆 | 轻量级提醒 |
| Pop | 短促 | 快速任务 |
| Purr | 柔和 | 不打扰提醒 |
| Sosumi | 独特 | 特殊事件 |
| Tink | 清亮 | 小任务完成 |

**question 字段说明**：
`sounds.question` 是可选字段，用于 AI 询问问题的通知。如果未设置，会使用 `permission` 的音效。

::: tip 音效配置技巧
- 用轻快的音效表示成功（idle）
- 用低沉的音效表示错误（error）
- 用柔和的音效表示需要你的注意（permission、question）
- 不同音效组合让你不看通知也能大致了解情况
:::

::: warning 平台差异
`sounds` 配置仅在 macOS 上有效。Windows 和 Linux 会使用系统默认通知声音，无法自定义。
:::

#### quietHours

| 配置项 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| `quietHours.enabled` | boolean | `false` | 是否启用静音时段 |
| `quietHours.start` | string | `"22:00"` | 静音开始时间（HH:MM 格式） |
| `quietHours.end` | string | `"08:00"` | 静音结束时间（HH:MM 格式） |

**作用**：在指定时间段内抑制所有通知的发送。

**默认行为**（`enabled: false`）：
- 不启用静音时段
- 任何时间都可能收到通知

**启用后**（`enabled: true`）：
- 在 `start` 到 `end` 时间段内，不发送任何通知
- 支持跨午夜时段（如 22:00-08:00）

**时间格式**：
- 使用 24 小时制的 `HH:MM` 格式
- 示例：`"22:30"` 表示晚上 10 点 30 分

**跨午夜时段**：
- 如果 `start > end`（如 22:00-08:00），表示跨午夜
- 从晚上 22:00 到次日早上 08:00 都在静音时段内

::: info 静音时段的优先级
静音时段的优先级最高。即使其他条件都满足，只要在静音时段内，就不会发送通知。
:::

#### terminal

| 配置项 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| `terminal` | string | 未设置 | 手动指定终端类型（覆盖自动检测） |

**作用**：手动指定你使用的终端模拟器类型，覆盖插件的自动检测。

**默认行为**（未设置）：
- 插件使用 `detect-terminal` 库自动检测你的终端
- 支持 37+ 终端模拟器

**设置后**：
- 插件使用指定的终端类型
- 用于焦点检测和点击聚焦功能（macOS）

**常用终端值**：

| 终端应用 | 配置值 |
| -------- | ------ |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code 集成终端 | `"vscode"` |

::: tip 何时需要手动设置
- 自动检测失败，焦点检测不工作
- 你使用多个终端，需要指定特定终端
- 你的终端名称不在常用列表中
:::

## 平台差异总结

不同平台对配置项的支持程度不同：

| 配置项 | macOS | Windows | Linux |
| ------ | ----- | ------- | ----- |
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| 焦点检测（硬编码） | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Windows/Linux 用户注意
`sounds` 配置和焦点检测功能在 Windows 和 Linux 上无效。
- Windows/Linux 会使用系统默认通知声音
- Windows/Linux 不支持焦点检测（无法通过配置控制）
:::

## 配置示例

### 基础配置（推荐）

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

这个配置适合大多数用户：
- 只通知父会话，避免子任务噪音
- macOS 上终端在前台时会自动抑制通知（无需配置）
- 使用默认的音效组合
- 不启用静音时段

### 启用静音时段

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

适合希望夜间不受打扰的用户：
- 晚上 10 点到早上 8 点不发送任何通知
- 其他时间正常通知

### 追踪所有子任务

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

适合需要追踪所有任务进度的用户：
- 所有会话（父会话和子会话）都通知
- 为问题询问设置独立音效（Ping）

### 手动指定终端

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

适合自动检测失败或使用多个终端的用户：
- 手动指定使用 Ghostty 终端
- 确保焦点检测和点击聚焦功能正常工作

### Windows/Linux 最小配置

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

适合 Windows/Linux 用户（简化配置）：
- 只保留平台支持的配置项
- `sounds` 配置和焦点检测功能在 Windows/Linux 上无效，无需设置

## 配置文件管理

### 创建配置文件

**macOS/Linux**：

```bash
# 创建配置目录（如果不存在）
mkdir -p ~/.config/opencode

# 创建配置文件
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**：

```powershell
# 创建配置目录（如果不存在）
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# 创建配置文件
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### 验证配置文件

**检查文件是否存在**：

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**检查配置是否生效**：

1. 修改配置文件
2. 重启 OpenCode（或触发配置重新加载）
3. 观察通知行为是否符合预期

### 配置文件错误处理

如果配置文件格式错误：
- 插件会忽略错误的配置文件
- 使用默认配置继续运行
- 在 OpenCode 日志中输出警告信息

**常见 JSON 错误**：

| 错误类型 | 示例 | 修正方法 |
| ------ | ---- | ------ |
| 缺少逗号 | `"key1": "value1" "key2": "value2"` | 添加逗号：`"key1": "value1",` |
| 多余逗号 | `"key1": "value1",}` | 删除最后一个逗号：`"key1": "value1"}` |
| 引号未闭合 | `"key": value` | 添加引号：`"key": "value"` |
| 使用单引号 | `'key': 'value'` | 改用双引号：`"key": "value"` |
| 注释语法错误 | `{"key": "value" /* comment */}` | JSON 不支持注释，删除注释 |

::: tip 使用 JSON 验证工具
可以使用在线 JSON 验证工具（如 jsonlint.com）检查配置文件格式是否正确。
:::

## 本课小结

本课提供了 opencode-notify 的完整配置参考：

**核心配置项**：

| 配置项 | 作用 | 默认值 | 平台支持 |
| ------ | ---- | ------ | -------- |
| `notifyChildSessions` | 子会话通知开关 | `false` | 全平台 |
| 焦点检测 | 终端聚焦抑制（硬编码） | 无配置 | 仅 macOS |
| `sounds.*` | 自定义音效 | 见各字段 | 仅 macOS |
| `quietHours.*` | 静音时段配置 | 见各字段 | 全平台 |
| `terminal` | 手动指定终端 | 未设置 | 全平台 |

**配置原则**：
- **大多数用户**：使用默认配置即可
- **需要静音**：启用 `quietHours`
- **需要追踪子任务**：启用 `notifyChildSessions`
- **macOS 用户**：可自定义 `sounds`，享受自动焦点检测
- **Windows/Linux 用户**：配置项较少，关注 `notifyChildSessions` 和 `quietHours`

**配置文件路径**：`~/.config/opencode/kdco-notify.json`

## 下一课预告

> 下一课我们学习 **[静音时段详解](../quiet-hours/)**。
>
> 你会学到：
> - 静音时段的详细工作原理
> - 跨午夜时段的配置方法
> - 静音时段与其他配置的优先级
> - 常见问题和解决方案

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| 配置接口定义 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| 默认配置 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 配置文件加载 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| 子会话检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 终端焦点检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 静音时段检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 音效配置使用 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README 配置示例 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**配置接口** (NotifyConfig)：

```typescript
interface NotifyConfig {
  /** Notify for child/sub-session events (default: false) */
  notifyChildSessions: boolean
  /** Sound configuration per event type */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" format
    end: string // "HH:MM" format
  }
  /** Override terminal detection (optional) */
  terminal?: string
}
```

**注意**：配置接口中**没有** `suppressWhenFocused` 字段。焦点检测是 macOS 平台的硬编码行为，用户无法通过配置文件控制。

**默认配置** (DEFAULT_CONFIG)：

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // 任务完成音效
    error: "Basso",     // 错误音效
    permission: "Submarine",  // 权限请求音效
  },
  quietHours: {
    enabled: false,     // 默认不启用静音时段
    start: "22:00",    // 晚上 10 点
    end: "08:00",      // 早上 8 点
  },
}
```

**配置加载函数** (loadConfig)：

- 路径：`~/.config/opencode/kdco-notify.json`
- 使用 `fs.readFile()` 读取配置文件
- 与 `DEFAULT_CONFIG` 合并（用户配置优先）
- 嵌套对象（`sounds`、`quietHours`）也会合并
- 配置文件不存在或格式错误时，使用默认配置

**子会话检查** (isParentSession)：

- 检查 `sessionID` 是否包含 `/`（子会话标识）
- 如果 `notifyChildSessions` 为 `false`，跳过子会话通知
- 权限请求通知（`permission.updated`）始终发送，不受此限制

**终端焦点检查** (isTerminalFocused)：

- 使用 `osascript` 获取当前前台应用进程名
- 与终端的 `processName` 进行对比（不区分大小写）
- 仅在 macOS 平台启用，**无法通过配置关闭**
- 问题询问通知（`question`）不做焦点检查（支持 tmux 工作流）

**静音时段检查** (isQuietHours)：

- 将当前时间转换为分钟数（从午夜 0 点开始）
- 与配置的 `start` 和 `end` 进行比较
- 支持跨午夜时段（如 22:00-08:00）
- 如果 `start > end`，表示跨午夜

**音效配置使用** (sendNotification)：

- 从配置中读取对应事件的音效名称
- 传递给 `node-notifier` 的 `sound` 选项
- 仅在 macOS 平台生效
- `question` 事件如果未配置音效，使用 `permission` 的音效

</details>
