---
title: "Linux 平台使用指南：notify-send 通知与终端检测 | opencode-notify 教程"
sidebarTitle: "Linux 上也能发通知"
subtitle: "Linux 平台特性：notify-send 通知与终端检测"
description: "学习 opencode-notify 在 Linux 平台的功能和限制。掌握 Linux 原生通知和终端检测能力，了解与 macOS/Windows 平台的功能差异，配置适合 Linux 的通知策略以提升效率，避免通知打扰并保持专注工作状态，解决 notify-send 安装、通知显示和常见配置问题。"
tags:
  - "Linux"
  - "平台特性"
  - "终端检测"
prerequisite:
  - "start-quick-start"
order: 50
---

# Linux 平台特性：notify-send 通知与终端检测

## 学完你能做什么

- 了解 opencode-notify 在 Linux 平台支持的功能
- 掌握 Linux 原生通知和终端检测的工作方式
- 理解与 macOS/Windows 平台的功能差异
- 配置适合 Linux 的通知策略

## 你现在的困境

你在 Linux 上使用 OpenCode，发现某些功能不像 macOS 上那么智能。终端聚焦时通知还是会弹出，点击通知也不能回到终端窗口。这是正常现象吗？Linux 平台有哪些限制？

## 什么时候用这一招

**在以下场景下了解 Linux 平台特性**：
- 你在 Linux 系统上使用 opencode-notify
- 你发现某些 macOS 功能在 Linux 上不可用
- 你想知道如何最大化利用 Linux 平台的可用功能

## 核心思路

opencode-notify 在 Linux 平台上提供**基础通知能力**，但相比 macOS 有一些功能限制。这是由操作系统特性决定的，不是插件的问题。

::: info 为什么 macOS 功能更丰富？

macOS 提供了更强大的系统 API：
- NSUserNotificationCenter 支持点击聚焦
- AppleScript 可以检测前台应用
- 系统音效 API 允许自定义声音

Linux 和 Windows 的系统通知 API 相对基础，opencode-notify 在这些平台上通过 `node-notifier` 调用系统原生通知。
:::

## Linux 平台功能一览

| 功能 | Linux | 说明 |
| ---- | ----- | ---- |
| **原生通知** | ✅ 支持 | 通过 notify-send 发送通知 |
| **终端检测** | ✅ 支持 | 自动识别 37+ 终端模拟器 |
| **焦点检测** | ❌ 不支持 | 无法检测终端是否为前台窗口 |
| **点击聚焦** | ❌ 不支持 | 点击通知不会切换到终端 |
| **自定义音效** | ❌ 不支持 | 使用系统默认通知声音 |

### Linux 通知机制

opencode-notify 在 Linux 上使用 **notify-send** 命令发送系统通知，通过 `node-notifier` 库调用系统原生 API。

**通知触发时机**：
- AI 任务完成时（session.idle）
- AI 执行出错时（session.error）
- AI 需要权限时（permission.updated）
- AI 询问问题时（tool.execute.before）

::: tip notify-send 通知特点
- 通知显示在屏幕右上角（GNOME/Ubuntu）
- 自动消失（约 5 秒）
- 使用系统默认通知声音
- 点击通知会打开通知中心（不会切换到终端）
:::

## 终端检测

### 自动识别终端

opencode-notify 使用 `detect-terminal` 库自动检测你使用的终端模拟器。

**Linux 支持的终端**：
- gnome-terminal（GNOME 桌面默认）
- konsole（KDE 桌面）
- xterm
- lxterminal（LXDE 桌面）
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code 集成终端
- 以及其他 37+ 终端模拟器

::: details 终端检测原理

插件启动时，`detect-terminal()` 会扫描系统进程，识别当前终端类型。

源码位置：`src/notify.ts:145-164`

`detectTerminalInfo()` 函数会：
1. 读取配置中的 `terminal` 字段（如果有手动指定）
2. 调用 `detectTerminal()` 自动检测终端类型
3. 获取进程名称（用于 macOS 焦点检测）
4. 在 macOS 上获取 bundle ID（用于点击聚焦）

在 Linux 平台上，`bundleId` 和 `processName` 会是 `null`，因为 Linux 不需要这些信息。
:::

### 手动指定终端

如果自动检测失败，你可以在配置文件中手动指定终端类型。

**配置示例**：

```json
{
  "terminal": "gnome-terminal"
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

### 为什么 Linux 不支持焦点检测？

源码中，`isTerminalFocused()` 函数在 Linux 上直接返回 `false`：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux 直接返回 false
	// ... macOS 的焦点检测逻辑
}
```

**原因**：
- Linux 桌面环境多样（GNOME、KDE、XFCE 等），没有统一的前台应用查询 API
- Linux DBus 可以获取活动窗口，但实现复杂且依赖桌面环境
- 当前版本优先保证稳定性，暂未实现 Linux 焦点检测

### 为什么 Linux 不支持点击聚焦？

源码中，`sendNotification()` 函数只在 macOS 上设置 `activate` 选项：

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**原因**：
- notify-send 不支持 `activate` 参数
- Linux 通知只能通过应用 ID 关联，无法动态指定目标窗口
- 点击通知会打开通知中心，而不是聚焦到特定窗口

### 为什么 Linux 不支持自定义音效？

::: details 音效配置原理

在 macOS 上，`sendNotification()` 会传递 `sound` 参数给系统通知：

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS 接受此参数
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send 不支持自定义声音参数，因此 `sounds` 配置在 Linux 上无效。
:::

## Linux 平台的最佳实践

### 配置建议

由于 Linux 不支持焦点检测，建议调整配置以减少通知噪音。

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

以下配置项在 Linux 上无效：

| 配置项 | macOS 效果 | Linux 效果 |
| ------ | ---------- | ----------- |
| `sounds.idle` | 播放 Glass 音效 | 使用系统默认声音 |
| `sounds.error` | 播放 Basso 音效 | 使用系统默认声音 |
| `sounds.permission` | 播放 Submarine 音效 | 使用系统默认声音 |

### 使用技巧

**技巧 1：手动关闭通知**

如果你正在查看终端，不想被打扰：

1. 点击屏幕右上角的通知图标
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

如需完全禁用通知，建议使用 `quietHours` 配置设置全天静音，或删除/重命名配置文件以禁用插件。

**技巧 4：配置系统通知声音**

虽然 opencode-notify 不支持自定义音效，你可以在系统设置中更改默认通知声音：

- **GNOME**：设置 → 声音 → 提示音
- **KDE**：系统设置 → 通知 → 默认声音
- **XFCE**：设置 → 外观 → 通知 → 声音

## 跟我做

### 验证 Linux 通知

**第 1 步：触发测试通知**

在 OpenCode 中输入一个简单任务：

```
请计算 1+1 的结果。
```

**你应该看到**：
- 屏幕右上角弹出 notify-send 通知（GNOME/Ubuntu）
- 通知标题为 "Ready for review"
- 播放系统默认通知声音

**第 2 步：测试焦点抑制（验证不支持）**

保持终端窗口在前台，再次触发任务。

**你应该看到**：
- 通知仍然弹出（因为 Linux 不支持焦点检测）

**第 3 步：测试点击通知**

点击弹出的通知。

**你应该看到**：
- 通知中心展开，而不是切换到终端窗口

### 配置静音时段

**第 1 步：创建配置文件**

编辑配置文件（bash）：

```bash
nano ~/.config/opencode/kdco-notify.json
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

- [ ] notify-send 通知正常显示
- [ ] 通知显示正确的任务标题
- [ ] 静音时段配置生效
- [ ] 了解 Linux 平台不支持的功能

## 踩坑提醒

### 常见问题 1：通知不显示

**原因 1**：notify-send 未安装

**解决方法**：

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**原因 2**：Linux 通知权限未授予

**解决方法**：

1. 打开系统设置
2. 找到「通知」或「隐私」→「通知」
3. 确保启用了「允许应用发送通知」
4. 找到 OpenCode，确保通知权限已开启

### 常见问题 2：终端检测失败

**原因**：`detect-terminal` 无法识别你的终端

**解决方法**：

在配置文件中手动指定终端类型：

```json
{
  "terminal": "gnome-terminal"
}
```

### 常见问题 3：自定义音效不生效

**原因**：Linux 平台不支持自定义音效

**说明**：这是正常现象。notify-send 使用系统默认声音，无法通过配置文件更改。

**解决方法**：在系统设置中更改默认通知声音。

### 常见问题 4：点击通知不聚焦终端

**原因**：notify-send 不支持 `activate` 参数

**说明**：这是 Linux API 的限制。点击通知会打开通知中心，需要手动切换到终端窗口。

### 常见问题 5：不同桌面环境的通知行为差异

**现象**：在不同桌面环境（GNOME、KDE、XFCE）中，通知显示位置和行为可能不同。

**说明**：这是正常的，每个桌面环境都有自己的通知系统实现。

**解决方法**：根据你使用的桌面环境，调整系统设置中的通知行为。

## 本课小结

本课我们了解了：

- ✅ Linux 平台支持原生通知和终端检测
- ✅ Linux 不支持焦点检测和点击聚焦
- ✅ Linux 不支持自定义音效
- ✅ 推荐配置（静音时段、只通知父会话）
- ✅ 常见问题的解决方法

**关键要点**：
1. Linux 平台功能相对基础，但核心通知能力完整
2. 焦点检测和点击聚焦是 macOS 独有功能
3. 通过静音时段配置可以减少通知噪音
4. 终端检测支持手动指定，提高兼容性
5. notify-send 需要预先安装（部分发行版默认包含）

## 下一课预告

> 下一课我们学习 **[支持的终端](../terminals/)**。
>
> 你会学到：
> - opencode-notify 支持的 37+ 终端列表
> - 不同终端的检测机制
> - 终端类型覆盖配置方法
> - VS Code 集成终端的使用技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| Linux 平台限制检查（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linux 平台限制检查（焦点检测） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 特定：点击聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知发送（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 终端检测（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 配置加载（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**关键函数**：
- `runOsascript()`：只在 macOS 上执行，Linux 返回 null
- `isTerminalFocused()`：Linux 直接返回 false
- `sendNotification()`：只在 macOS 上设置 `activate` 参数
- `detectTerminalInfo()`：跨平台终端检测

**平台判断**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

**Linux 通知依赖**：
- 外部依赖：`node-notifier` → `notify-send` 命令
- 系统要求：libnotify-bin 或等效包

</details>
