---
title: "Windows 平台使用指南：原生通知、终端检测与配置详解 | opencode-notify 教程"
sidebarTitle: "Windows 上用通知"
subtitle: "Windows 平台特性：原生通知与终端检测"
description: "学习 opencode-notify 在 Windows 平台的功能和限制。掌握 Windows 原生通知和终端检测能力，了解与 macOS 平台的功能差异，配置最佳通知策略以提升效率，避免通知打扰并保持专注工作状态。"
tags:
  - "Windows"
  - "平台特性"
  - "终端检测"
prerequisite:
  - "start-quick-start"
order: 40
---

# Windows 平台特性：原生通知与终端检测

## 学完你能做什么

- 了解 opencode-notify 在 Windows 平台支持的功能
- 掌握 Windows 终端检测的工作方式
- 理解与 macOS 平台的功能差异
- 配置适合 Windows 的通知策略

## 你现在的困境

你在 Windows 上使用 OpenCode，发现某些功能不像 macOS 上那么智能。终端聚焦时通知还是会弹出，点击通知也不能回到终端窗口。这是正常现象吗？Windows 平台有哪些限制？

## 什么时候用这一招

**在以下场景下了解 Windows 平台特性**：
- 你在 Windows 系统上使用 opencode-notify
- 你发现某些 macOS 功能在 Windows 上不可用
- 你想知道如何最大化利用 Windows 平台的可用功能

## 核心思路

opencode-notify 在 Windows 平台上提供**基础通知能力**，但相比 macOS 有一些功能限制。这是由操作系统特性决定的，不是插件的问题。

::: info 为什么 macOS 功能更丰富？

macOS 提供了更强大的系统 API：
- NSUserNotificationCenter 支持点击聚焦
- AppleScript 可以检测前台应用
- 系统音效 API 允许自定义声音

Windows 和 Linux 的系统通知 API 相对基础，opencode-notify 在这些平台上通过 `node-notifier` 调用系统原生通知。
:::

## Windows 平台功能一览

| 功能 | Windows | 说明 |
| ---- | ------- | ---- |
| **原生通知** | ✅ 支持 | 通过 Windows Toast 发送通知 |
| **终端检测** | ✅ 支持 | 自动识别 37+ 终端模拟器 |
| **焦点检测** | ❌ 不支持 | 无法检测终端是否为前台窗口 |
| **点击聚焦** | ❌ 不支持 | 点击通知不会切换到终端 |
| **自定义音效** | ❌ 不支持 | 使用系统默认通知声音 |

### Windows 通知机制

opencode-notify 在 Windows 上使用 **Windows Toast** 通知，通过 `node-notifier` 库调用系统原生 API。

**通知触发时机**：
- AI 任务完成时（session.idle）
- AI 执行出错时（session.error）
- AI 需要权限时（permission.updated）
- AI 询问问题时（tool.execute.before）

::: tip Windows Toast 通知特点
- 通知显示在屏幕右下角
- 自动消失（约 5 秒）
- 使用系统默认通知声音
- 点击通知会打开通知中心（不会切换到终端）
:::

## 终端检测

### 自动识别终端

opencode-notify 使用 `detect-terminal` 库自动检测你使用的终端模拟器。

**Windows 支持的终端**：
- Windows Terminal（推荐）
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code 集成终端

::: details 终端检测原理
插件启动时，`detect-terminal()` 会扫描系统进程，识别当前终端类型。

源码位置：`src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows 不需要 bundleId
		processName: null,  // Windows 不需要进程名
	}
}
```
:::

### 手动指定终端

如果自动检测失败，你可以在配置文件中手动指定终端类型。

**配置示例**：

```json
{
  "terminal": "Windows Terminal"
}
```

**可用终端名称**：参考 [`detect-terminal` 支持的终端列表](https://github.com/jonschlinkert/detect-terminal#supported-terminals)。

## 平台功能对比

| 功能 | macOS | Windows | Linux |
| ---- | ----- | ------- | ----- |
| **原生通知** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **自定义音效** | ✅ 系统音效列表 | ❌ 系统默认 | ❌ 系统默认 |
| **焦点检测** | ✅ AppleScript API | ❌ 不支持 | ❌ 不支持 |
| **点击聚焦** | ✅ activate bundleId | ❌ 不支持 | ❌ 不支持 |
| **终端检测** | ✅ 37+ 终端 | ✅ 37+ 终端 | ✅ 37+ 终端 |

### 为什么 Windows 不支持焦点检测？

源码中，`isTerminalFocused()` 函数在 Windows 上直接返回 `false`：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux 直接返回 false
	// ... macOS 的焦点检测逻辑
}
```

**原因**：
- Windows 不提供类似 macOS AppleScript 的前台应用查询 API
- Windows PowerShell 可以获取前台窗口，但需要调用 COM 接口，实现复杂
- 当前版本优先保证稳定性，暂未实现 Windows 焦点检测

### 为什么 Windows 不支持点击聚焦？

源码中，`sendNotification()` 函数只在 macOS 上设置 `activate` 选项：

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**原因**：
- Windows Toast 不支持 `activate` 参数
- Windows 通知只能通过应用 ID 关联，无法动态指定目标窗口
- 点击通知会打开通知中心，而不是聚焦到特定窗口

## Windows 平台的最佳实践

### 配置建议

由于 Windows 不支持焦点检测，建议调整配置以减少通知噪音。

**推荐配置**：

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**配置说明**：
- `notifyChildSessions: false` - 只通知父会话，避免子任务噪音
- `quietHours.enabled: true` - 启用静音时段，避免夜间打扰

### 不支持的配置项

以下配置项在 Windows 上无效：

| 配置项 | macOS 效果 | Windows 效果 |
| ------ | ---------- | ------------ |
| `sounds.idle` | 播放 Glass 音效 | 使用系统默认声音 |
| `sounds.error` | 播放 Basso 音效 | 使用系统默认声音 |
| `sounds.permission` | 播放 Submarine 音效 | 使用系统默认声音 |

### 使用技巧

**技巧 1：手动关闭通知**

如果你正在查看终端，不想被打扰：

1. 点击任务栏的「操作中心」图标（Windows + A）
2. 关闭 opencode-notify 的通知

**技巧 2：使用静音时段**

设置工作时间和休息时间，避免非工作时间被打扰：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**技巧 3：临时禁用插件**

如果需要完全禁用通知，可以删除配置文件或设置静音时段为全天：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## 跟我做

### 验证 Windows 通知

**第 1 步：触发测试通知**

在 OpenCode 中输入一个简单任务：

```
请计算 1+1 的结果。
```

**你应该看到**：
- 右下角弹出 Windows Toast 通知
- 通知标题为 "Ready for review"
- 播放系统默认通知声音

**第 2 步：测试焦点抑制（验证不支持）**

保持终端窗口在前台，再次触发任务。

**你应该看到**：
- 通知仍然弹出（因为 Windows 不支持焦点检测）

**第 3 步：测试点击通知**

点击弹出的通知。

**你应该看到**：
- 通知中心展开，而不是切换到终端窗口

### 配置静音时段

**第 1 步：创建配置文件**

编辑配置文件（PowerShell）：

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**第 2 步：添加静音时段配置**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**第 3 步：保存并测试**

等待当前时间进入静音时段，然后触发一个任务。

**你应该看到**：
- 不弹出通知（静音时段生效）

## 检查点 ✅

完成上述步骤后，请确认：

- [ ] Windows Toast 通知正常显示
- [ ] 通知显示正确的任务标题
- [ ] 静音时段配置生效
- [ ] 了解 Windows 平台不支持的功能

## 踩坑提醒

### 常见问题 1：通知不显示

**原因**：Windows 通知权限未授予

**解决方法**：

1. 打开「设置」→「系统」→「通知」
2. 确保「获取来自应用和其他发送者的通知」已开启
3. 找到 OpenCode，确保通知权限已开启

### 常见问题 2：终端检测失败

**原因**：`detect-terminal` 无法识别你的终端

**解决方法**：

在配置文件中手动指定终端类型：

```json
{
  "terminal": "Windows Terminal"
}
```

### 常见问题 3：自定义音效不生效

**原因**：Windows 平台不支持自定义音效

**说明**：这是正常现象。Windows Toast 通知使用系统默认声音，无法通过配置文件更改。

### 常见问题 4：点击通知不聚焦终端

**原因**：Windows Toast 不支持 `activate` 参数

**说明**：这是 Windows API 的限制。点击通知会打开通知中心，需要手动切换到终端窗口。

## 本课小结

本课我们了解了：

- ✅ Windows 平台支持原生通知和终端检测
- ✅ Windows 不支持焦点检测和点击聚焦
- ✅ Windows 不支持自定义音效
- ✅ 推荐配置（静音时段、只通知父会话）
- ✅ 常见问题的解决方法

**关键要点**：
1. Windows 平台功能相对基础，但核心通知能力完整
2. 焦点检测和点击聚焦是 macOS 独有功能
3. 通过静音时段配置可以减少通知噪音
4. 终端检测支持手动指定，提高兼容性

## 下一课预告

> 下一课我们学习 **[Linux 平台特性](../linux/)**。
>
> 你会学到：
> - Linux 平台的通知机制（notify-send）
> - Linux 终端检测能力
> - 与 Windows 平台的功能对比
> - Linux 发行版的兼容性问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| Windows 平台限制检查（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows 平台限制检查（焦点检测） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 特定：点击聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知发送（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 终端检测（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 配置加载（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**关键函数**：
- `runOsascript()`：只在 macOS 上执行，Windows 返回 null
- `isTerminalFocused()`：Windows 直接返回 false
- `sendNotification()`：只在 macOS 上设置 `activate` 参数
- `detectTerminalInfo()`：跨平台终端检测

**平台判断**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

</details>
