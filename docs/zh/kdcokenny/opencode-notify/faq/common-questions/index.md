---
title: "opencode-notify 常见问题：性能影响、隐私安全与平台兼容性详解"
sidebarTitle: "搞懂关键问题"
subtitle: "常见问题：性能、隐私与兼容性"
description: "了解 opencode-notify 对 AI 上下文的影响和系统资源占用机制，确认插件完全本地运行无需上传数据，掌握智能通知过滤策略和静音时段配置方法，学习与其他 OpenCode 插件的兼容性以及 macOS/Windows/Linux 平台功能差异，全面解答通知频率、隐私安全、资源占用、终端检测失败处理、配置文件位置等用户最关心的常见疑问。"
tags:
  - "FAQ"
  - "性能"
  - "隐私"
prerequisite:
  - "start-quick-start"
order: 120
---

# 常见问题：性能、隐私与兼容性

## 学完你能做什么

- 了解插件的性能影响和资源占用
- 明确隐私安全保证
- 掌握通知策略和配置技巧
- 理解平台差异和兼容性

---

## 性能相关

### 会不会增加 AI 上下文？

**不会**。插件使用事件驱动模式，不向 AI 对话中添加任何工具或提示词。

从源码实现来看：

 | 组件 | 类型 | 实现 | 对上下文的影响 |
 | ---- | ---- | ---- | ------------ |
 | 事件监听 | 事件 | 监听 `session.idle`、`session.error`、`permission.updated` 事件 | ✅ 无影响 |
 | 工具钩子 | 钩子 | 通过 `tool.execute.before` 监听 `question` 工具 | ✅ 无影响 |
 | 对话内容 | - | 不读取、不修改、不注入任何对话内容 | ✅ 无影响 |

 源码中插件只负责**监听和通知**，AI 对话的上下文完全不受影响。

### 会占用多少系统资源？

**极低**。插件采用"启动时缓存 + 事件触发"的设计：

1. **配置加载**：插件启动时读取一次配置文件（`~/.config/opencode/kdco-notify.json`），后续不再读取
2. **终端检测**：启动时检测终端类型并缓存信息（名称、Bundle ID、进程名），后续事件直接使用缓存
3. **事件驱动**：只有当 AI 触发特定事件时，插件才会执行通知逻辑

资源占用特点：

| 资源类型 | 占用情况 | 说明 |
| -------- | -------- | ---- |
| CPU | 几乎为 0 | 仅在事件触发时短暂运行 |
| 内存 | < 5 MB | 启动后进入待机状态 |
| 磁盘 | < 100 KB | 配置文件和代码本身 |
| 网络 | 0 | 不进行任何网络请求 |

---

## 隐私与安全

### 数据会上传到服务器吗？

**不会**。插件完全在本地运行，不进行任何数据上传。

**隐私保证**：

| 数据类型 | 处理方式 | 是否上传 |
| -------- | -------- | -------- |
| AI 对话内容 | 不读取、不存储 | ❌ 否 |
| 会话信息（标题） | 仅用于通知文案 | ❌ 否 |
| 错误信息 | 仅用于通知文案（最多 100 字符） | ❌ 否 |
| 终端信息 | 本地检测并缓存 | ❌ 否 |
| 配置信息 | 本地文件（`~/.config/opencode/`） | ❌ 否 |
| 通知内容 | 通过系统原生通知 API 发送 | ❌ 否 |

**技术实现**：

插件使用系统原生通知：
- macOS：通过 `node-notifier` 调用 `NSUserNotificationCenter`
- Windows：通过 `node-notifier` 调用 `SnoreToast`
- Linux：通过 `node-notifier` 调用 `notify-send`

所有通知均在本地触发，不会通过 OpenCode 的云服务。

### 插件是否会窃取我的会话内容？

**不会**。插件只读取**必要的元数据**：

| 读取的数据 | 用途 | 限制 |
| ---------- | ---- | ---- |
| 会话标题（title） | 通知文案 | 只取前 50 字符 |
| 错误信息（error） | 通知文案 | 只取前 100 字符 |
| 终端信息 | 焦点检测和点击聚焦 | 不读取终端内容 |
| 配置文件 | 用户自定义设置 | 本地文件 |

源码中没有任何读取对话消息（messages）或用户输入（user input）的逻辑。

---

## 通知策略

### 会不会被通知轰炸？

**不会**。插件内置多重智能过滤机制，避免通知轰炸。

**默认通知策略**：

 | 类型 | 事件/工具 | 是否通知 | 理由 |
 | ---- | --------- | -------- | ---- |
 | 事件 | 父会话完成（session.idle） | ✅ 是 | 主要任务完成 |
 | 事件 | 子会话完成（session.idle） | ❌ 否 | 父会话会统一通知 |
 | 事件 | 会话错误（session.error） | ✅ 是 | 需要立即处理 |
 | 事件 | 权限请求（permission.updated） | ✅ 是 | AI 阻塞等待 |
 | 工具钩子 | 问题询问（tool.execute.before - question） | ✅ 是 | AI 需要输入 |

**智能过滤机制**：

 1. **只通知父会话**
    - 源码：`notify.ts:256-259`
    - 默认配置：`notifyChildSessions: false`
    - 避免 AI 拆解任务时每个子任务都通知

 2. **终端聚焦时抑制**（macOS）
    - 源码：`notify.ts:265`
    - 逻辑：当终端是前台窗口时，不发送通知（内置行为，无需配置）
    - 避免"正在看终端时还要通知"的重复提醒
    - **注意**：此功能仅在 macOS 可用（需要终端信息才能检测）

 3. **静音时段**
    - 源码：`notify.ts:262`、`notify.ts:181-199`
    - 默认配置：`quietHours: { enabled: false, start: "22:00", end: "08:00" }`
    - 可配置，避免夜间打扰

 4. **权限请求始终通知**
    - 源码：`notify.ts:319`
    - 理由：AI 阻塞等待用户授权，必须及时通知
    - 不做父会话检查

 ### 能否只接收特定类型的通知？

 **可以**。虽然插件没有单独的通知开关，但可以通过静音时段和终端聚焦检测来实现：

 - **只接收紧急通知**：终端聚焦检测是内置行为，当你在终端时不会收到通知（macOS）
 - **只接收夜间通知**：启用静音时段（如 09:00-18:00），反向使用

 如果需要更细粒度的控制，可以考虑提交 Feature Request。

---

## 插件兼容性

### 会与其他 OpenCode 插件冲突吗？

**不会**。插件通过标准 OpenCode Plugin API 集成，不修改 AI 行为或干扰其他插件。

**集成方式**：

| 组件 | 集成方式 | 冲突风险 |
| ---- | -------- | -------- |
| 事件监听 | OpenCode SDK 的 `event` 钩子 | ❌ 无冲突 |
| 工具钩子 | OpenCode Plugin API 的 `tool.execute.before` 钩子 | ❌ 无冲突（只监听 `question` 工具） |
| 会话查询 | OpenCode SDK 的 `client.session.get()` | ❌ 无冲突（只读不写） |
| 通知发送 | `node-notifier` 独立进程 | ❌ 无冲突 |

**可能共存的其他插件**：

- OpenCode 官方插件（如 `opencode-coder`）
- 第三方插件（如 `opencode-db`、`opencode-browser`）
- 自定义插件

所有插件通过标准的 Plugin API 并行运行，互不干扰。

### 支持哪些平台？功能有差异吗？

**支持 macOS、Windows、Linux 三大平台，但功能有差异**。

| 功能 | macOS | Windows | Linux |
| ---- | ----- | ------- | ----- |
| 原生通知 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 自定义音效 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| 终端焦点检测 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| 点击通知聚焦 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| 终端自动检测 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 静音时段 | ✅ 支持 | ✅ 支持 | ✅ 支持 |

**平台差异原因**：

| 平台 | 差异说明 |
| ---- | -------- |
| macOS | 系统提供了丰富的通知 API 和应用管理接口（如 `osascript`），支持音效、焦点检测、点击聚焦 |
| Windows | 系统通知 API 功能有限，不支持应用级别的前台检测和音效自定义 |
| Linux | 依赖 `notify-send` 标准，功能与 Windows 类似 |

**跨平台核心功能**：

无论使用哪个平台，以下核心功能均可用：
- 任务完成通知（session.idle）
- 错误通知（session.error）
- 权限请求通知（permission.updated）
- 问题询问通知（tool.execute.before）
- 静音时段配置

---

## 终端与系统

### 支持哪些终端？如何检测？

**支持 37+ 终端模拟器**。

插件使用 [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) 库自动识别终端，支持的终端包括：

**macOS 终端**：
- Ghostty、Kitty、iTerm2、WezTerm、Alacritty
- macOS Terminal、Hyper、Warp
- VS Code 集成终端（Code / Code - Insiders）

**Windows 终端**：
- Windows Terminal、Git Bash、ConEmu、Cmder
- PowerShell、CMD（通过默认检测）

**Linux 终端**：
- gnome-terminal、konsole、xterm、lxterminal
- terminator、tilix、alacritty、kitty

**检测机制**：

1. **自动检测**：插件启动时调用 `detectTerminal()` 库
2. **手动覆盖**：用户可在配置文件中指定 `terminal` 字段覆盖自动检测
3. **macOS 映射**：终端名称映射到进程名（如 `ghostty` → `Ghostty`），用于焦点检测

**配置示例**：

```json
{
  "terminal": "ghostty"
}
```

### 如果终端检测失败会怎样？

**插件仍可正常工作，只是焦点检测功能失效**。

**失败处理逻辑**：

| 失败场景 | 表现 | 影响 |
| -------- | ---- | ---- |
| `detectTerminal()` 返回 `null` | 终端信息为 `{ name: null, bundleId: null, processName: null }` | 无焦点检测，但通知正常发送 |
| macOS `osascript` 执行失败 | Bundle ID 获取失败 | macOS 点击聚焦功能失效，但通知正常 |
| 配置文件中 `terminal` 值无效 | 使用自动检测结果 | 如果自动检测也失败，则无焦点检测 |

源码中相关逻辑（`notify.ts:149-150`）：

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**解决方法**：

如果终端检测失败，可以手动指定终端类型：

```json
{
  "terminal": "iterm2"
}
```

---

## 配置与故障

### 配置文件在哪里？如何修改？

**配置文件路径**：`~/.config/opencode/kdco-notify.json`

**完整配置示例**：

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
     "enabled": true,
     "start": "22:00",
     "end": "08:00"
   },
   "terminal": "ghostty"
 }
```

**修改配置步骤**：

1. 打开终端，编辑配置文件：
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. 修改配置项（参考上面的示例）

3. 保存文件，配置自动生效（无需重启）

### 配置文件损坏会怎样？

**插件会使用默认配置，并静默处理错误**。

**错误处理逻辑**（`notify.ts:110-113`）：

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**解决方法**：

如果配置文件损坏（JSON 格式错误），插件会回退到默认配置。修复步骤：

1. 删除损坏的配置文件：
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. 插件会使用默认配置继续工作

3. 如需自定义配置，重新创建配置文件

---

## 本课小结

 本课解答了用户最关心的常见问题：

 - **性能影响**：插件不增加 AI 上下文，资源占用极低（CPU 几乎为 0，内存 < 5 MB）
 - **隐私安全**：完全本地运行，不上传任何数据，只读取必要的元数据
 - **通知策略**：智能过滤机制（只通知父会话、macOS 终端聚焦时抑制、静音时段）
 - **插件兼容性**：不与其他插件冲突，支持三大平台但功能有差异
 - **终端支持**：支持 37+ 终端，自动检测失败时仍可正常工作

---

## 下一课预告

> 下一课我们学习 **[事件类型说明](../../appendix/event-types/)**。
>
> 你会学到：
> - 插件监听的四种 OpenCode 事件类型
> - 每种事件的触发时机和通知内容
> - 事件的过滤规则（父会话检查、静音时段、终端焦点）
> - 不同平台的事件处理差异

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 插件启动与配置加载 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| 事件监听逻辑 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| 父会话检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 静音时段检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 终端焦点检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 配置文件加载 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 终端信息检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 默认配置定义 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**关键常量**：
- `DEFAULT_CONFIG`：默认配置（只通知父会话、Glass/Basso/Submarine 音效、静音时段默认禁用）

**关键函数**：
- `loadConfig()`：加载用户配置并合并默认值
- `detectTerminalInfo()`：检测终端信息并缓存
- `isQuietHours()`：检查当前时间是否在静音时段
- `isTerminalFocused()`：检查终端是否为前台窗口（macOS）
- `isParentSession()`：检查会话是否为父会话

</details>
