---
title: "Canvas 可视化界面与 A2UI | Clawdbot 教程"
sidebarTitle: "为 AI 创建可视化界面"
subtitle: "Canvas 可视化界面与 A2UI"
description: "学习使用 Clawdbot 的 Canvas 可视化界面，了解 A2UI 推送机制、Canvas Host 配置和节点 Canvas 操作，为 AI 助手创建交互式 UI。本教程涵盖静态 HTML 和动态 A2UI 两种方式，包括 canvas 工具的完整命令参考、安全机制、配置选项和故障排查技巧。"
tags:
  - "Canvas"
  - "A2UI"
  - "可视化界面"
  - "节点"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Canvas 可视化界面与 A2UI

## 学完你能做什么

完成本课后，你将能够：

- 配置 Canvas Host 并部署自定义 HTML/CSS/JS 界面
- 使用 `canvas` 工具控制节点 Canvas（显示、隐藏、导航、执行 JS）
- 掌握 A2UI 协议，让 AI 动态推送 UI 更新
- 捕获 Canvas 截图用于 AI 上下文
- 理解 Canvas 安全机制和权限控制

## 你现在的困境

你有一个 AI 助手，但它只能通过文字与你交互。你想：

- 让 AI 显示可视化界面，比如表格、图表、表单
- 在移动设备上看到 Agent 生成的动态 UI
- 创建类似「App」的交互体验，而不需要独立开发

## 什么时候用这一招

**Canvas + A2UI 适合这些场景**：

| 场景 | 示例 |
| ------ | ------ |
| **数据可视化** | 显示统计图表、进度条、时间线 |
| **交互式表单** | 让用户确认操作、选择选项 |
| **状态面板** | 实时显示任务进度、系统状态 |
| **游戏和娱乐** | 简单小游戏、互动演示 |

::: tip A2UI vs. 静态 HTML
- **A2UI**（Agent-to-UI）：AI 动态生成和更新 UI，适合实时数据
- **静态 HTML**：预先写好的界面，适合固定布局和复杂交互
:::

## 🎒 开始前的准备

在开始之前，确保你已完成：

- [ ] **Gateway 已启动**：Canvas Host 默认随 Gateway 自动启动（端口 18793）
- [ ] **节点已配对**：macOS/iOS/Android 节点已连接到 Gateway
- [ ] **节点支持 Canvas**：确认节点有 `canvas` 能力（`clawdbot nodes list`）

::: warning 前置知识
本教程假设你已了解：
- [节点配对基础](../../platforms/android-node/)
- [AI 工具调用机制](../tools-browser/)
:::

## 核心思路

Canvas 系统包含三个核心组件：

```
┌─────────────────┐
│   Canvas Host  │ ────▶ HTTP 服务器 (端口 18793)
│   (Gateway)   │        └── 服务 ~/clawd/canvas/ 文件
└─────────────────┘
        │
        │ WebSocket 通信
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView 渲染 Canvas
│ (iOS/Android) │        └── 通过 A2UI 接收推送
└─────────────────┘
        │
        │ userAction 事件
        │
┌─────────────────┐
│   AI Agent    │ ────▶ canvas 工具调用
│  (pi-mono)   │        └── 推送 A2UI 更新
└─────────────────┘
```

**关键概念**：

1. **Canvas Host**（Gateway 端）
   - 提供静态文件服务：`http://<gateway-host>:18793/__clawdbot__/canvas/`
   - 托管 A2UI 主机：`http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - 支持热重载：文件修改后自动刷新

2. **Canvas Panel**（节点端）
   - macOS/iOS/Android 节点嵌入 WKWebView
   - 通过 WebSocket 连接 Gateway（实时重载、A2UI 通信）
   - 支持 `eval` 执行 JS、`snapshot` 捕获画面

3. **A2UI 协议**（v0.8）
   - Agent 通过 WebSocket 推送 UI 更新
   - 支持：`beginRendering`、`surfaceUpdate`、`dataModelUpdate`、`deleteSurface`

## 跟我做

### 第 1 步：验证 Canvas Host 状态

**为什么**
确保 Canvas Host 正在运行，节点才能加载 Canvas 内容。

```bash
# 检查端口 18793 是否被监听
lsof -i :18793
```

**你应该看到**：

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info 配置路径
- **Canvas 根目录**：`~/clawd/canvas/`（可通过 `canvasHost.root` 修改）
- **端口**：`18793` = `gateway.port + 4`（可通过 `canvasHost.port` 修改）
- **热重载**：默认开启（可通过 `canvasHost.liveReload: false` 关闭）
:::

### 第 2 步：创建第一个 Canvas 页面

**为什么**
创建自定义 HTML 界面，让节点显示你的内容。

```bash
# 创建 Canvas 根目录（如果不存在）
mkdir -p ~/clawd/canvas

# 创建简单的 HTML 文件
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>这是你的第一个 Canvas 页面。</p>
<button onclick="alert('按钮被点击了！')">点击我</button>
EOF
```

**你应该看到**：

```text
文件已创建：~/clawd/canvas/hello.html
```

### 第 3 步：在节点上显示 Canvas

**为什么**
让节点加载并显示你刚创建的页面。

首先查找你的节点 ID：

```bash
clawdbot nodes list
```

**你应该看到**：

```text
ID                                  Name          Type       Capabilities
────────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

然后显示 Canvas（以 iOS 节点为例）：

```bash
# 方式 1：通过 CLI 命令
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**你应该看到**：

- iOS 设备上弹出一个无边框面板，显示你的 HTML 内容
- 面板靠近菜单栏或鼠标位置
- 内容居中对齐，带有绿色标题和按钮

**AI 调用示例**：

```
AI: 我在 iOS 设备上为你打开了一个 Canvas 面板，显示欢迎页面。
```

::: tip Canvas URL 格式
- **本地文件**：`http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **外部网址**：`https://example.com`（需要节点有网络访问权限）
- **返回默认**：`/` 或空字符串，显示内置脚手架页面
:::

### 第 4 步：使用 A2UI 推送动态 UI

**为什么**
AI 可以不修改文件，直接推送 UI 更新到 Canvas，适合实时数据和交互。

**方式 A：快速文本推送**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**你应该看到**：

- Canvas 显示蓝色 A2UI 界面
- 文本居中显示：`Hello from A2UI`

**方式 B：完整 JSONL 推送**

创建 A2UI 定义文件：

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"A2UI 演示"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"系统状态：运行中"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"测试按钮"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

推送 A2UI：

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**你应该看到**：

```
┌────────────────────────────┐
│     A2UI 演示         │
│                        │
│  系统状态：运行中       │
│                        │
│   [ 测试按钮 ]          │
└────────────────────────────┘
```

::: details A2UI JSONL 格式说明
JSONL（JSON Lines）每行一个 JSON 对象，适合流式更新：

```jsonl
{"surfaceUpdate":{...}}   // 更新表面组件
{"beginRendering":{...}}   // 开始渲染
{"dataModelUpdate":{...}} // 更新数据模型
{"deleteSurface":{...}}   // 删除表面
```
:::

### 第 5 步：执行 Canvas JavaScript

**为什么**
在 Canvas 中执行自定义 JS，比如修改 DOM、读取状态。

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**你应该看到**：

```text
"Hello from Canvas"
```

::: tip JS 执行示例
- 读取元素：`document.querySelector('h1').textContent`
- 修改样式：`document.body.style.background = '#333'`
- 计算值：`innerWidth + 'x' + innerHeight`
- 闭包执行：`(() => { ... })()`
:::

### 第 6 步：捕获 Canvas 截图

**为什么**
让 AI 看到当前的 Canvas 状态，用于上下文理解。

```bash
# 默认格式（JPEG）
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# PNG 格式 + 最大宽度限制
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# 高质量 JPEG
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**你应该看到**：

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

文件路径由系统自动生成，通常在临时目录。

### 第 7 步：隐藏 Canvas

**为什么**
关闭 Canvas 面板，释放屏幕空间。

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**你应该看到**：

- iOS 设备上的 Canvas 面板消失
- 节点状态恢复（如果之前被占用）

## 检查点 ✅

**验证 Canvas 功能是否正常工作**：

| 检查项 | 验证方法 |
| ------- | -------- |
| Canvas Host 运行 | `lsof -i :18793` 有输出 |
| 节点 Canvas 能力 | `clawdbot nodes list` 显示 `canvas` |
| 页面加载成功 | 节点显示 HTML 内容 |
| A2UI 推送成功 | Canvas 显示蓝色 A2UI 界面 |
| JS 执行返回结果 | `eval` 命令返回值 |
| 截图生成文件 | 临时目录有 `.jpg` 或 `.png` 文件 |

## 踩坑提醒

::: warning 前台/后台限制
- **iOS/Android 节点**：`canvas.*` 和 `camera.*` 命令**必须在前台运行**
- 后台调用会返回：`NODE_BACKGROUND_UNAVAILABLE`
- 解决方法：将设备唤醒到前台
:::

::: danger 安全注意事项
- **目录遍历保护**：Canvas URL 禁止 `..` 访问上级目录
- **自定义 Scheme**：`clawdbot-canvas://` 仅限节点内部使用
- **HTTPS 限制**：外部 HTTPS URL 需要节点网络权限
- **文件访问**：Canvas Host 仅允许访问 `canvasHost.root` 下的文件
:::

::: tip 调试技巧
- **查看 Gateway 日志**：`clawdbot gateway logs`
- **查看节点日志**：iOS 设置 → Debug Logs，Android 应用内日志
- **测试 URL**：在浏览器直接访问 `http://<gateway-host>:18793/__clawdbot__/canvas/`
:::

## 本课小结

本课你学会了：

1. **Canvas 架构**：理解 Canvas Host、Node App 和 A2UI 协议的关系
2. **配置 Canvas Host**：调整根目录、端口和热重载设置
3. **创建自定义页面**：编写 HTML/CSS/JS 并部署到节点
4. **使用 A2UI**：通过 JSONL 推送动态 UI 更新
5. **执行 JavaScript**：在 Canvas 中运行代码，读取和修改状态
6. **捕获截图**：让 AI 看到当前 Canvas 状态

**核心要点**：

- Canvas Host 随 Gateway 自动启动，无需额外配置
- A2UI 适合实时数据，静态 HTML 适合复杂交互
- 节点必须在前台才能执行 Canvas 操作
- 使用 `canvas snapshot` 将 UI 状态传递给 AI

## 下一课预告

> 下一课我们学习 **[语音唤醒与文本转语音](../voice-tts/)**。
>
> 你会学到：
> - 配置 Voice Wake 唤醒关键词
> - 使用 Talk Mode 进行持续语音对话
> - 集成多种 TTS 提供商（Edge、Deepgram、ElevenLabs）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| ----- | --------- | ---- |
| Canvas Host 服务器 | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| A2UI 协议处理 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Canvas 工具定义 | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Canvas 路径常量 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**关键常量**：
- `A2UI_PATH = "/__clawdbot__/a2ui"`：A2UI 主机路径
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`：Canvas 文件路径
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`：WebSocket 热重载路径

**关键函数**：
- `createCanvasHost()`：启动 Canvas HTTP 服务器（端口 18793）
- `injectCanvasLiveReload()`：注入 WebSocket 热重载脚本到 HTML
- `handleA2uiHttpRequest()`：处理 A2UI 资源请求
- `createCanvasTool()`：注册 `canvas` 工具（present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset）

**支持的 Canvas Actions**：
- `present`：显示 Canvas（可选 URL、位置、尺寸）
- `hide`：隐藏 Canvas
- `navigate`：导航到 URL（本地路径/HTTP/file://）
- `eval`：执行 JavaScript
- `snapshot`：捕获截图（PNG/JPEG，可选 maxWidth/quality）
- `a2ui_push`：推送 A2UI 更新（JSONL 或文本）
- `a2ui_reset`：重置 A2UI 状态

**配置 Schema**：
- `canvasHost.root`：Canvas 根目录（默认 `~/clawd/canvas`）
- `canvasHost.port`：HTTP 端口（默认 18793）
- `canvasHost.liveReload`：是否启用热重载（默认 true）
- `canvasHost.enabled`：是否启用 Canvas Host（默认 true）

**A2UI v0.8 支持的消息**：
- `beginRendering`：开始渲染指定表面
- `surfaceUpdate`：更新表面组件（Column、Text、Button 等）
- `dataModelUpdate`：更新数据模型
- `deleteSurface`：删除指定表面

</details>
