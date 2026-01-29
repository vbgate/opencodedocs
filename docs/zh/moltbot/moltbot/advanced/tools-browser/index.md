---
title: "浏览器自动化工具：网页控制与 UI 自动化 | Clawdbot 教程"
sidebarTitle: "5 分钟控制浏览器"
subtitle: "浏览器自动化工具：网页控制与 UI 自动化 | Clawdbot 教程"
description: "学习如何使用 Clawdbot 的浏览器工具进行网页自动化、截图、操作表单和控制 UI。本教程涵盖浏览器启动、页面快照、UI 交互（click/type/drag 等）、文件上传、对话框处理和远程浏览器控制。掌握完整的工作流程，包括 Chrome 扩展中继模式和独立浏览器配置，以及在 iOS/Android 节点上执行浏览器操作。"
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# 浏览器自动化工具：网页控制与 UI 自动化

## 学完你能做什么

- 启动和控制 Clawdbot 管理的浏览器
- 使用 Chrome 扩展中继接管你现有的 Chrome 标签页
- 拍摄网页快照（AI/ARIA 格式）和截图（PNG/JPEG）
- 执行 UI 自动化操作：点击、输入文本、拖拽、选择、填表
- 处理文件上传和对话框（alert/confirm/prompt）
- 通过远程浏览器控制服务器操作分布式浏览器
- 使用节点代理在 iOS/Android 设备上执行浏览器操作

## 你现在的困境

你已经运行了 Gateway，配置了 AI 模型，但浏览器工具的使用还有一些困惑：

- AI 无法访问网页内容，只能靠你描述页面结构？
- 想让 AI 自动填表、点击按钮，但不知道怎么做？
- 想截图或保存网页，但每次都需要手动操作？
- 想用你自己的 Chrome 标签页（已登录的会话），而不是启动一个新浏览器？
- 想在远程设备（如 iOS/Android 节点）上执行浏览器操作？

## 什么时候用这一招

**浏览器工具适用场景**：

| 场景 | Action | 示例 |
|--- | --- | ---|
| 自动化表单 | `act` + `fill` | 填写注册表单、提交订单 |
| 网页抓取 | `snapshot` | 提取网页结构、抓取数据 |
| 截图保存 | `screenshot` | 保存网页截图、保存证据 |
| 文件上传 | `upload` | 上传简历、上传附件 |
| 对话框处理 | `dialog` | 接受/拒绝 alert/confirm |
| 使用现有会话 | `profile="chrome"` | 在已登录的 Chrome 标签页上操作 |
| 远程控制 | `target="node"` | 在 iOS/Android 节点上执行 |

## 🎒 开始前的准备

::: warning 前置检查

在使用浏览器工具前，请确保：

1. ✅ Gateway 已启动（`clawdbot gateway start`）
2. ✅ AI 模型已配置（Anthropic / OpenAI / OpenRouter 等）
3. ✅ 浏览器工具已启用（`browser.enabled=true`）
4. ✅ 了解你要使用的 target（sandbox/host/custom/node）
5. ✅ 如使用 Chrome 扩展中继，已安装并启用扩展

:::

## 核心思路

**浏览器工具是什么？**

浏览器工具是 Clawdbot 内置的自动化工具，允许 AI 通过 CDP（Chrome DevTools Protocol）控制浏览器：

- **控制服务器**：`http://127.0.0.1:18791`（默认）
- **UI 自动化**：基于 Playwright 的元素定位和操作
- **快照机制**：AI 格式或 ARIA 格式，返回页面结构和元素引用
- **多目标支持**：sandbox（默认）、host（Chrome 中继）、custom（远程）、node（设备节点）

**两种浏览器模式**：

| 模式 | Profile | 驱动 | 说明 |
|--- | --- | --- | ---|
| **独立浏览器** | `clawd`（默认） | clawd | Clawdbot 启动一个独立的 Chrome/Chromium 实例 |
| **Chrome 中继** | `chrome` | extension | 接管你现有的 Chrome 标签页（需安装扩展） |

**工作流程**：

```
1. 启动浏览器（start）
   ↓
2. 打开标签页（open）
   ↓
3. 获取页面快照（snapshot）→ 得到元素引用（ref）
   ↓
4. 执行 UI 操作（act：click/type/fill/drag）
   ↓
5. 验证结果（screenshot/snapshot）
```

## 跟我做

### 第 1 步：启动浏览器

**为什么**

第一次使用浏览器工具时，需要先启动浏览器控制服务器。

```bash
# 在聊天中告诉 AI 启动浏览器
请启动浏览器

# 或使用浏览器工具
action: start
profile: clawd  # 或 chrome（Chrome 扩展中继）
target: sandbox
```

**你应该看到**：

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip 检查点

- 看到 `Browser control server` 表示启动成功
- 默认使用 `clawd` profile（独立浏览器）
- 如需使用 Chrome 扩展中继，使用 `profile="chrome"`
- 浏览器窗口会自动打开（非 headless 模式）

:::

### 第 2 步：打开网页

**为什么**

打开目标网页，准备进行自动化操作。

```bash
# 在聊天中
请打开 https://example.com

# 或使用浏览器工具
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**你应该看到**：

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip 元素引用（targetId）

每次打开或聚焦标签页时，都会返回 `targetId`，这个 ID 用于后续操作（snapshot/act/screenshot）。

:::

### 第 3 步：获取页面快照

**为什么**

快照让 AI 理解页面结构，返回可操作的元素引用（ref）。

```bash
# 获取 AI 格式快照（默认）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # 使用 Playwright aria-ref ids（跨调用稳定）

# 或获取 ARIA 格式快照（结构化输出）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**你应该看到**（AI 格式）：

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip 快照格式选择

| 格式 | 用途 | 特点 |
|--- | --- | ---|
| `ai` | 默认，AI 理解 | 可读性好，适合 AI 解析 |
| `aria` | 结构化输出 | 适合需要精确结构的场景 |
| `refs="aria"` | 跨调用稳定 | 推荐用于多步操作（snapshot → act） |

:::

### 第 4 步：执行 UI 操作（act）

**为什么**

使用快照中返回的元素引用（ref）执行自动化操作。

```bash
# 点击按钮
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 输入文本
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 填写表单（多个字段）
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 点击提交按钮
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**你应该看到**：

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip 常用 UI 操作

| 操作 | Kind | 参数 |
|--- | --- | ---|
| 点击 | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| 输入文本 | `type` | `ref`, `text`, `submit`, `slowly` |
| 按键 | `press` | `key`, `targetId` |
| 悬停 | `hover` | `ref`, `targetId` |
| 拖拽 | `drag` | `startRef`, `endRef`, `targetId` |
| 选择 | `select` | `ref`, `values` |
| 填表 | `fill` | `fields`（数组） |
| 等待 | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| 执行 JS | `evaluate` | `fn`, `ref`, `targetId` |

:::

### 第 5 步：截取网页截图

**为什么**

验证操作结果或保存网页截图。

```bash
# 截取当前标签页
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# 截取全页
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# 截取指定元素
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # 使用快照中的 ref
type: jpeg
```

**你应该看到**：

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip 截图格式

| 格式 | 用途 |
|--- | ---|
| `png` | 默认，无损压缩，适合文档 |
| `jpeg` | 有损压缩，文件更小，适合存储 |

:::

### 第 6 步：处理文件上传

**为什么**

自动化表单中的文件上传操作。

```bash
# 先触发文件选择器（点击上传按钮）
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# 然后上传文件
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # 可选：指定文件选择器的 ref
targetId: tab_abc123
profile: clawd
```

**你应该看到**：

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning 文件路径注意

- 使用绝对路径，不支持相对路径
- 确保文件存在且有读取权限
- 多个文件时按数组顺序上传

:::

### 第 7 步：处理对话框

**为什么**

自动处理网页中的 alert、confirm、prompt 对话框。

```bash
# 接受对话框（alert/confirm）
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# 拒绝对话框（confirm）
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# 回答 prompt 对话框
action: dialog
accept: true
promptText: "用户输入的答案"
targetId: tab_abc123
profile: clawd
```

**你应该看到**：

```
✓ Dialog handled: accepted (prompt: "用户输入的答案")
```

## 踩坑提醒

### ❌ 错误：Chrome 扩展中继未连接

**错误信息**：
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**原因**：使用了 `profile="chrome"` 但没有附加任何标签页

**解决方法**：

1. 安装 Clawdbot Browser Relay 扩展（Chrome Web Store）
2. 在要控制的标签页上点击扩展图标（徽章显示 ON）
3. 重新运行 `action: snapshot profile="chrome"`

### ❌ 错误：元素引用过期（stale targetId）

**错误信息**：
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**原因**：标签页已关闭或 targetId 过期

**解决方法**：

```bash
# 重新获取标签页列表
action: tabs
profile: chrome

# 使用新的 targetId
action: snapshot
targetId: "新的_targetId"
profile: chrome
```

### ❌ 错误：浏览器控制服务器未启动

**错误信息**：
```
Browser control server not available. Run action=start first.
```

**原因**：浏览器控制服务器未启动

**解决方法**：

```bash
# 启动浏览器
action: start
profile: clawd
target: sandbox
```

### ❌ 错误：远程浏览器连接超时

**错误信息**：
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**原因**：远程浏览器连接超时

**解决方法**：

```bash
# 在配置文件中增加超时时间
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ 错误：节点浏览器代理不可用

**错误信息**：
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**原因**：节点浏览器代理被禁用

**解决方法**：

```bash
# 在配置文件中启用节点浏览器
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # 或 "manual"
      }
    }
  }
}
```

## 本课小结

本课学习了：

✅ **浏览器控制**：启动/停止/状态检查
✅ **标签页管理**：打开/聚焦/关闭标签页
✅ **页面快照**：AI/ARIA 格式，获取元素引用
✅ **UI 自动化**：click/type/drag/fill/wait/evaluate
✅ **截图功能**：PNG/JPEG 格式，全页或元素截图
✅ **文件上传**：处理文件选择器，支持多文件
✅ **对话框处理**：accept/reject/alert/confirm/prompt
✅ **Chrome 中继**：使用 `profile="chrome"` 接管现有标签页
✅ **节点代理**：通过 `target="node"` 在设备节点上执行

**关键操作速查**：

| 操作 | Action | 关键参数 |
|--- | --- | ---|
| 启动浏览器 | `start` | `profile`（clawd/chrome） |
| 打开网页 | `open` | `targetUrl` |
| 获取快照 | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI 操作 | `act` | `request.kind`, `request.ref` |
| 截图 | `screenshot` | `targetId`, `fullPage`, `ref` |
| 文件上传 | `upload` | `paths`, `ref` |
| 对话框 | `dialog` | `accept`, `promptText` |

## 下一课预告

> 下一课我们学习 **[命令执行工具与审批](../tools-exec/)**。
>
> 你会学到：
> - 配置和使用 exec 工具
> - 了解安全审批机制
> - 设置 allowlist 控制可执行命令
> - 使用沙箱隔离风险操作

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Browser 工具定义 | [`src/agents/tools/browser-tool.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Action 类型定义 | [`src/browser/client-actions-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| 浏览器配置解析 | [`src/browser/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/config.ts) | 140-231 |
| 浏览器常量 | [`src/browser/constants.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDP 客户端 | [`src/browser/cdp.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome 执行文件检测 | [`src/browser/chrome.executables.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**关键常量**：
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`：默认控制服务器地址（来源：`src/browser/constants.ts:2`）
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`：AI 快照默认最大字符数（来源：`src/browser/constants.ts:6`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`：efficient 模式最大字符数（来源：`src/browser/constants.ts:7`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`：efficient 模式深度（来源：`src/browser/constants.ts:8`）

**关键函数**：
- `createBrowserTool()`：创建浏览器工具，定义所有 actions 和参数处理
- `browserSnapshot()`：获取页面快照，支持 AI/ARIA 格式
- `browserScreenshotAction()`：执行截图操作，支持全页和元素截图
- `browserAct()`：执行 UI 自动化操作（click/type/drag/fill/wait/evaluate 等）
- `browserArmFileChooser()`：处理文件上传，触发文件选择器
- `browserArmDialog()`：处理对话框（alert/confirm/prompt）
- `resolveBrowserConfig()`：解析浏览器配置，返回控制服务器地址和端口
- `resolveProfile()`：解析 profile 配置（clawd/chrome）

**Browser Actions Kind**（来源：`src/agents/tools/browser-tool.schema.ts:5-17`）：
- `click`：点击元素
- `type`：输入文本
- `press`：按键
- `hover`：悬停
- `drag`：拖拽
- `select`：选择下拉选项
- `fill`：填写表单（多个字段）
- `resize`：调整窗口大小
- `wait`：等待
- `evaluate`：执行 JavaScript
- `close`：关闭标签页

**Browser Tool Actions**（来源：`src/agents/tools/browser-tool.schema.ts:19-36`）：
- `status`：获取浏览器状态
- `start`：启动浏览器
- `stop`：停止浏览器
- `profiles`：列出所有 profiles
- `tabs`：列出所有标签页
- `open`：打开新标签页
- `focus`：聚焦标签页
- `close`：关闭标签页
- `snapshot`：获取页面快照
- `screenshot`：截取截图
- `navigate`：导航到指定 URL
- `console`：获取控制台消息
- `pdf`：保存页面为 PDF
- `upload`：上传文件
- `dialog`：处理对话框
- `act`：执行 UI 操作

</details>
